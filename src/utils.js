/**
 * カレンダーの登録処理
 * 
 * @param {string} postMsg  ユーザーより投稿されたメッセージ
 * @param {string} replyToken  リプライトークン
 */
function registerCalendarEvent(postMsg, replyToken) {
  const registerDay = postMsg.split('\n');
  const validate = registerInputValidate(registerDay);

  // 入力に関するバリデーション
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
 * カレンダーの変更処理
 */
function updateCalendarEvent() {
  // 変更処理を記述
}

/**
 * カレンダーの削除処理
 * 
 * @param {string} postMsg  ユーザーにより投稿されたメッセージ
 * @param {string} replyToken  リプライトークン
 * @param {Object} cache  キャッシュ
 */
function deleteCalendarEvent(postMsg, replyToken, cache) {
  let eventIdArray = cache.get('eventId');
  eventIdArray = eventIdArray.split(',');
  cache.remove('eventId');

  const validateMessage = deleteInputValidate(postMsg, eventIdArray);

  // 数字以外が入力された際の処理
  if(validateMessage === '数字以外の入力がなされました') {
    return postToLine('選択肢の数字の中から回答してください\n再度希望の処理を選択してください', replyToken);
  }
  // 選択肢以外の数字が入力された際の処理
  if(validateMessage === '選択肢以外の数字が選択されました') {
    return postToLine('選択肢にない数字が入力されました\n削除したいイベントは選択肢にある数字から選択してください\n再度希望の処理を選択してください', replyToken);
  }
  // 正常な処理
  if(validateMessage === 'バリデーションエラーはありません') {
    const selectedEventId = eventIdArray[postMsg - 1];
    CalendarApp.getCalendarById(user.CALENDAR_ID).getEventById(selectedEventId).deleteEvent();
    return postToLine('削除が完了しました', replyToken);
  }
}

/**
 * 一日の予定を取得する処理
 * 
 * @param {string} postMsg  ユーザーにより投稿されたメッセージ
 * @param {string} replyToken  リプライトークン
 * @param {Object} cache  キャッシュ
 */
function showCalendarEvent(postMsg, replyToken, cache) {
  const selectedDate = postMsg.split('\n');
  
  // 入力に関するバリデーション
  let validate = showInputValidate(selectedDate);
  if(!validate) {
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
  validate = showEventsListValidate(events);
  if(!validate) {
    return postToLine('指定された日に予定がありませんでした\n再度操作をやり直してください', replyToken);
  }

  // カレンダーの情報を取得し、キャッシュにカレンダーIDを保存
  for(let i = 0; i < events.length; i++) {
    const index = i + 1;
    const eventTile = events[i].getTitle();
    const startTime = hhmm_timeDisplay(events[i].getStartTime());
    const endTime = hhmm_timeDisplay(events[i].getEndTime());
    responseString += index + ': ' + eventTile + ' （' + startTime + '〜' + endTime + '）\n';

    const eventId = events[i].getId();
    eventIdArray.push(eventId);
  }
  cache.put('eventId', eventIdArray);
  cache.put('type', 'delete2');

  return postToLine(`どのイベントを削除しますか\n番号で回答してください\n\n${responseString}`, replyToken);
}

// カレンダーのリマインド処理
function remindSchedule() {
  // 当日7時になったら、その日の予定をリストでラインに通知
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

// ログとしてSSに書き込む処理
function log() {
  // カレンダーを変更した際にログを書き出す処理
  // 保存期間も決めて、時期が来たら自動で削除できるようにしておく
}