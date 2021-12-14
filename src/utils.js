/**
 * カレンダーの登録処理
 * 
 * @param {string} postMsg  ユーザーより投稿されたメッセージ
 */
function registerCalendarEvent(postMsg) {
  const registerDay = postMsg.split('\n');
  const startTime = new Date(registerDay[0], registerDay[1] - 1, registerDay[2], registerDay[3], registerDay[4]);
  const endTime = new Date(registerDay[0], registerDay[1] - 1, registerDay[2], registerDay[5], registerDay[6]);
  CalendarApp.getCalendarById(user.CALENDAR_ID).createEvent(
    registerDay[7],
    startTime,
    endTime
  );
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
 * @param {Object} cache  キャッシュ
 */
function deleteCalendarEvent(postMsg, cache) {
  let eventIdArray = cache.get('eventId');
  eventIdArray = eventIdArray.split(',');

  const selectedNumber = inputValidator(postMsg, eventIdArray);
  // 入力エラーがあった場合はバリデーションエラーを返す
  if(selectedNumber === 'error') {
    cache.put('error', 'deleteNumberInputError');
    return;
  }
  const selectedEventId = eventIdArray[selectedNumber];
  CalendarApp.getCalendarById(user.CALENDAR_ID).getEventById(selectedEventId).deleteEvent();
  cache.remove('eventId');
}

/**
 * 一日の予定を取得する処理
 * 
 * @param {string} postMsg  ユーザーにより投稿されたメッセージ
 * @param {Object} cache  キャッシュ
 * @return {string}  一日の予定を時間順に並べた文字列
 */
function showCalendarEvent(postMsg, cache) {
  const selectedDate = postMsg.split('\n');
  
  const calendar = CalendarApp.getCalendarById(user.CALENDAR_ID);
  const events = calendar.getEventsForDay(new Date(selectedDate[0], selectedDate[1] - 1, selectedDate[2]));
  let responseString = '';
  let eventIdArray = [];

  // イベントが登録されていない日を指定された場合
  if(events.length === 0) {
    cache.put('error', 'noEventDay');
    responseString += '指定された日に予定がありませんでした\n再度操作をやり直してください';
    return responseString;
  }

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
  return responseString;
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

/**
 * 入力された文字をバリデーションする
 * 
 * @param {string} inputMsg  入力された文字列
 * @param {Array} eventIdArray  ユーザーが削除を希望している日に登録されている予定IDを値とする配列
 * @return {string}  正しい文字列（半角英数）を返す or キャッシュにエラーを登録
 */
function inputValidator(inputMsg, eventIdArray) {
  return inputMsg - 1;
  // ToDo:数値以外の入力を受け付けないようにする
  // case1: 数字以外を入力していたらバリデーションエラーを返す
  // case2: 存在しない数字を入力している場合はバリデーションエラーを返す
  // case3: 半角英数字以外を入力していたら半角英数字にして返す
  // case4: 正しく入力されていればそのまま返す
}


// ログとしてSSに書き込む処理
function log() {
  // カレンダーを変更した際にログを書き出す処理
  // 保存期間も決めて、時期が来たら自動で削除できるようにしておく
}