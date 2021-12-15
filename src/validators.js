/**
 * 登録処理に関するバリデーション
 * ユーザーの入力形式に対するバリデーション
 * 
 * @param {Array} registerDay  ユーザーが登録したい予定
 * @return {boolean}  指定したフォーマットでユーザーが入力したかどうか
 */
function registerInputValidate(registerDay) {
  if(registerDay.length === 8) {
    return true;
  } else {
    return false;
  }
}

/**
 * 
 * @param {String} postMsg  ユーザーが送信した削除したいイベント番号
 * @param {Array} eventIdArray  カレンダーに登録されているイベントIDを詰めた配列
 * @returns {String}  バリデーションエラーがあった場合、どのようなバリデーションエラーがあるかを返す（数字以外の入力がなさました/選択肢以外の数字が選択されました/バリデーションエラーはありません）
 */
function deleteInputValidate(postMsg, eventIdArray) {
  let inputValue = postMsg;
  let validateJudgeCommand = '';

  // 数字以外の入力になっていないかどうか
  if(inputValue.match(/^\D+$/)) {
    validateJudgeCommand = '数字以外の入力がなされました';
    return validateJudgeCommand;
  }

  // 半角数字になっているかどうか
  if(inputValue.match(/^\d+$/)) {
    // 処理なし
  } else {
    inputValue = String.fromCharCode(inputValue.charCodeAt(0) - 0xFEE0);
  }

  // 入力された数が選択肢の中から選ばれているかどうか
  const numberOfChoices = eventIdArray.length;
  if(numberOfChoices < inputValue && parseInt(inputValue) === 0) {
    validateJudgeCommand = '選択肢以外の数字が選択されました';
    return validateJudgeCommand;
  }

  // バリデーションエラーがなければ正常処理である旨を格納
  validateJudgeCommand = 'バリデーションエラーはありません';
  return validateJudgeCommand;
}

/**
 * 一覧表示処理に関するバリデーション
 * ユーザーの入力形式に対するバリデーション
 * 
 * @param {Array} selectedDate  ユーザーが予定一覧を表示したい日
 * @return {boolean}  指定したフォーマットでユーザーが入力したかどうか
 */
function showInputValidate(selectedDate) {
  if(selectedDate.length === 3) {
    return true;
  } else {
    return false;
  }
}

/**
 * 一覧表示処理に関するバリデーション
 * ユーザーが指定した日に予定がない場合、falseを返す
 * 
 * @param {Array} events  ユーザーが選択した日に登録された予定が入った配列
 * @return {boolean}  ユーザーが選択した日に登録された予定があるかどうか
 */
function showEventsListValidate(events) {
  if(events.length !== 0) {
    return true;
  } else {
    return false;
  }
}