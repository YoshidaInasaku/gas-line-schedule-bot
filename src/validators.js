/**
 * 登録処理に関するバリデーション
 * ユーザーの入力形式に対するバリデーション
 * 
 * @param {Array} registerDay  ユーザーが登録したい予定
 * @return {boolean}  指定したフォーマットでユーザーが入力したかどうか
 */
function registerInputValidate(registerDay) {
  // 入力されたデータはフォーマット通りか / カレンダーに登録できるデータか
  let checkFlagArray = [];
  for(let i = 0; i < registerDay.length - 1; i++) {
    if(registerDay[i].match(/^\D+$/)) {
      checkFlagArray.push('error');
    }
  }
  if(checkFlagArray.includes('error')) {
    return false;
  }
  // 入力されたデータはフォーマット通り8個入力されているかどうか
  if(registerDay.length !== 8) {
    return false;
  }

  return true;
}

/**
 * 変更処理に関するバリデーション
 * ユーザーの入力形式に対するバリデーション
 * 
 * @param {Array} updateDay  ユーザーが回答した変更後の日時情報
 * @returns {boolean}  指定したフォーマットでユーザーが入力したかどうか
 */
function updateInputValidate(updateDay) {
  if(updateDay.length === 7) {
    return true;
  } else {
    return false;
  }
}

/**
 * 処理したいイベントの番号を指定する際に、フォーマットに沿った回答がなされたか（半角数字かどうか）をチェックする
 * 
 * @param {String} postMsg  ユーザーが送信した削除したいイベント番号
 * @param {Array} eventIdArray  カレンダーに登録されているイベントIDを詰めた配列
 * @returns {String}  バリデーションエラーがあった場合、どのようなバリデーションエラーがあるかを返す（数字以外の入力がなさました/選択肢以外の数字が選択されました/バリデーションエラーはありません）
 */
function specifyEventNumberInputValidate(postMsg, eventIdArray) {
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
  // 入力されたデータはフォマット通りか
  let checkFlagArray = [];
  for(let i = 0; i < selectedDate.length; i++) {
    if(selectedDate[i].match(/^\D+$/)) {
      checkFlagArray.push('error');
    }
  }
  if(checkFlagArray.includes('error')) {
    return false;
  }
  // 入力されたデータはフォーマット通り3個入力されているかどうか
  if(selectedDate.length !== 3) {
    return false;
  }

  return true;
}

/**
 * 一覧表示処理に関するバリデーション
 * ユーザーが指定した日に予定がない場合、falseを返す
 * 
 * @param {Array} events  ユーザーが選択した日に登録された予定が入った配列
 * @return {boolean}  ユーザーが選択した日に登録された予定があるかどうか
 */
function eventsListValidate(events) {
  if(events.length !== 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * ユーザーが入力したデータを持つ配列を、全角英数字のみ半角英数字にする処理
 * 
 * @param {Array} array  ユーザーが入力したデータを詰めた配列
 * @returns {Array}  ユーザーが入力したもののうち、全角英数字は半角英数字に直した配列
 */
function fullWidthDigitToHalfWidthDigit_array(array) {
  const resultArray = array.map(e => {
    return e.replace(/[\！-\～]/g, str => {
      return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    })
  })
  return resultArray;
}

/**
 * ユーザーが入力したデータで、全角英数字を半角英数字にする処理
 * 
 * @param {string} str  ユーザーが入力した番号（全角英数 or 半角英数）
 * @returns {string}  ユーザーが入力した番号（半角英数）
 */
function fullWidthDigitToHalfWidthDigit_string(str) {
  const resultStr = str.replace(/[\！-\～]/g, char => {
    return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
  })
  return resultStr;
}