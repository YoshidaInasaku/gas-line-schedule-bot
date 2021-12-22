/**
 * カレンダーの登録処理
 * 
 * @param {String} postMsg  ユーザーより投稿されたメッセージ
 * @param {String} replyToken  リプライトークン
 */
function registerCalendarEvent(postMsg, replyToken) {
  // 入力データを整形（全角英数字は半角英数字にする）
  let registerDay = postMsg.split('\n');
  registerDay = fullWidthDigitToHalfWidthDigit_array(registerDay);

  // 入力に関するバリデーション
  const validate = registerInputValidate(registerDay);
  if (!validate) {
    return postToLine(
      '入力された値に誤りがあります\n入力例に従って入力してください\n再度希望の処理を選択し直してください',
      replyToken
    );
  }
  const startTime = new Date(registerDay[0], registerDay[1] - 1, registerDay[2], registerDay[3], registerDay[4]);
  const endTime = new Date(registerDay[0], registerDay[1] - 1, registerDay[2], registerDay[5], registerDay[6]);
  CalendarApp.getCalendarById(user.CALENDAR_ID).createEvent(
    registerDay[7],
    startTime,
    endTime
  );
  return postToLine('登録が完了しました', replyToken);
}

/**
 * 変更したいイベントを取得する処理
 * 
 * @param {String} postMsg  ユーザーが送信したデータ
 * @param {String} replyToken  リプライトークン
 * @param {Object} cache  キャッシュ
 */
function getUpdateCalendarEvent(postMsg, replyToken, cache) {
  let eventIdArray = cache.get('eventId');
  eventIdArray = eventIdArray.split(',');
  cache.remove('eventId');

  const validateMessage = specifyEventNumberInputValidate(postMsg, eventIdArray);

  // 正常な処理
  if (validateMessage !== 'error') {
    const selectedEventId = validateMessage;
    cache.put('eventId', selectedEventId);
    cache.put('type', 'update3');
    return postToLine(
      'どのように変更したいですか\n<入力例>\n2021年1月28日 19時から21時40分\n食事 を\n2021年1月16日 17時から20時半  に変更したい場合\n\n2021\n1\n16\n17\n0\n20\n30',
      replyToken);
  }
  // バリデーションエラーだった場合
  else {
    return postToLine('選択肢の中から数字で回答してください\n再度希望の処理を選択してください', replyToken);
  }
}

/**
 * カレンダーの変更処理
 * 
 * @param {String} postMsg  ユーザーが送信したデータ
 * @param {String} replyToken  リプライトークン
 * @param {Object} cache  キャッシュ
 */
function updateCalendarEvent(postMsg, replyToken, cache) {
  let updateDay = postMsg.split('\n');
  updateDay = fullWidthDigitToHalfWidthDigit_array(updateDay);
  const eventId = cache.get('eventId');
  cache.remove('eventId');

  // 入力に関するバリデーション
  let validate = updateInputValidate(updateDay);
  if (!validate) {
    return postToLine(
      '入力された値に誤りがあります\n入力例に従って入力してください\n再度希望の処理を選択し直してください',
      replyToken
    );
  }

  // 実際の処理
  CalendarApp
    .getCalendarById(user.CALENDAR_ID)
    .getEventById(eventId)
    .setTime(
      new Date(updateDay[0], updateDay[1] - 1, updateDay[2], updateDay[3], updateDay[4]),
      new Date(updateDay[0], updateDay[1] - 1, updateDay[2], updateDay[5], updateDay[6])
    );
  postToLine('変更が完了しました', replyToken);
}

/**
 * カレンダーの削除処理
 * 
 * @param {String} postMsg  ユーザーにより投稿されたメッセージ
 * @param {String} replyToken  リプライトークン
 * @param {Object} cache  キャッシュ
 */
function deleteCalendarEvent(postMsg, replyToken, cache) {
  let eventIdArray = cache.get('eventId');
  eventIdArray = eventIdArray.split(',');
  cache.remove('eventId');

  const validateMessage = specifyEventNumberInputValidate(postMsg, eventIdArray);

  // 正常な処理
  if (validateMessage !== 'error') {
    const selectedEventId = validateMessage;
    CalendarApp.getCalendarById(user.CALENDAR_ID).getEventById(selectedEventId).deleteEvent();
    return postToLine('削除が完了しました', replyToken);
  }
  // バリデーションエラーだった場合
  else {
    return postToLine('選択肢の中から数字で回答してください\n再度希望の処理を選択し直してください', replyToken);
  }
}

/**
 * 一日の予定を取得する処理
 * 
 * @param {String} postMsg  ユーザーにより投稿されたメッセージ
 * @param {String} replyToken  リプライトークン
 * @param {Object} cache  キャッシュ
 * @param {String} cacheType  キャッシュに保存されている key:type の値
 */
function showCalendarEvent(postMsg, replyToken, cache, cacheType) {
  let selectedDate = postMsg.split('\n');
  selectedDate = fullWidthDigitToHalfWidthDigit_array(selectedDate);

  // 入力に関するバリデーション
  let validate = showInputValidate(selectedDate);
  if (!validate) {
    cache.remove('type');
    return postToLine(
      '入力された値に誤りがあります\n入力例に従って入力してください\n再度希望の処理を選択し直してください',
      replyToken
    );
  }

  const calendar = CalendarApp.getCalendarById(user.CALENDAR_ID);
  const events = calendar.getEventsForDay(new Date(selectedDate[0], selectedDate[1] - 1, selectedDate[2]));
  let responseString = '';
  let eventIdArray = [];

  // イベントが登録されていない日を指定された場合
  validate = eventsListValidate(events);
  if (!validate) {
    cache.remove('type');
    return postToLine('◎その日に予定はありません', replyToken);
  }

  // カレンダーの情報を取得し、キャッシュにカレンダーIDを保存
  for (let i = 0; i < events.length; i++) {
    const index = i + 1;
    const eventTitle = events[i].getTitle();
    const startTime = hhmm_timeDisplay(events[i].getStartTime());
    const endTime = hhmm_timeDisplay(events[i].getEndTime());
    responseString += index + ': ' + eventTitle + ' （' + startTime + '〜' + endTime + '）\n';

    // キャッシュの type が delete1 または update1 なら、後続処理のために カレンダーID　をキャッシュに保存
    if (cacheType === 'delete1' || cacheType === 'update1') {
      const eventId = events[i].getId();
      eventIdArray.push(eventId);
    }
  }

  // キャッシュタイプを見てラインに返信する内容を精査する
  if (cacheType === 'update1') {
    cache.remove('type');
    cache.put('type', 'update2');
    cache.put('eventId', eventIdArray);

    return postToLine(`どの予定を変更しますか\n番号で回答してください\n\n${responseString}`, replyToken);
  }
  if (cacheType === 'delete1') {
    cache.remove('type');
    cache.put('type', 'delete2');
    cache.put('eventId', eventIdArray);

    return postToLine(`どの予定を削除しますか\n番号で回答してください\n\n${responseString}`, replyToken);
  }
  if (cacheType === 'show') {
    cache.remove('type');

    return postToLine(`その日の予定は以下の通りです\n\n${responseString}`, replyToken);
  }
}

/**
 * 明日の予定を23時ごろにLineでリマインド送信
 */
function remindSchedule() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 1);
  const schedules = CalendarApp.getCalendarById(user.CALENDAR_ID).getEventsForDay(targetDate);
  let pushMsg = '明日の予定は以下の通りです！\nのんびりいきましょう！\n\n';

  // 予定がない日の場合
  if (schedules.length === 0) {
    pushMsg += '◎予定なし';
    return pushNotification(pushMsg);
  }
  // 予定がある日の場合
  for (let i = 0; i < schedules.length; i++) {
    const index = i + 1;
    const eventTitle = schedules[i].getTitle();
    const startTime = hhmm_timeDisplay(schedules[i].getStartTime());
    const endTime = hhmm_timeDisplay(schedules[i].getEndTime());
    pushMsg += index + ': ' + eventTitle + ' （' + startTime + '〜' + endTime + '）\n';
  }
  return pushNotification(pushMsg);
}

/**
 * 時間を見やすくする処理（形式：HH時mm分）
 * 
 * @param {Date} date  時刻情報
 * @return {string}  HH時mm分
 */
function hhmm_timeDisplay(date) {
  return Utilities.formatDate(new Date(date), 'JST', 'HH時mm分');
}

