/**
 * 登録処理に関するバリデーション
 * ユーザーの入力形式に対するバリデーション
 * 
 * @param {Array} registerDay  ユーザーが登録したい予定
 * @returns {Boolean}  指定したフォーマットでユーザーが入力したかどうか
 */
function registerInputValidate(registerDay) {
  // 入力されたデータはフォーマット通りか / カレンダーに登録できるデータか
  let checkFlagArray = [];
  for (let i = 0; i < registerDay.length - 1; i++) {
    if (registerDay[i].match(/^\D+$/)) {
      checkFlagArray.push('error');
    }
  }
  if (checkFlagArray.includes('error')) {
    return false;
  }
  // 入力されたデータはフォーマット通り8個入力されているかどうか
  if (registerDay.length !== 8) {
    return false;
  }

  return true;
}

/**
 * 変更処理に関するバリデーション
 * ユーザーの入力形式に対するバリデーション
 * 
 * @param {Array} updateDay  ユーザーが回答した変更後の日時情報
 * @returns {Boolean}  指定したフォーマットでユーザーが入力したかどうか
 */
function updateInputValidate(updateDay) {
  // 入力されたデータはフォーマット通りか / カレンダーに登録できるデータか
  let checkFlagArray = [];
  for (let i = 0; i < updateDay.length; i++) {
    if (updateDay[i].match(/^\D+$/)) {
      checkFlagArray.push('error');
    }
  }
  if (checkFlagArray.includes('error')) {
    return false;
  }

  // 入力されたデータはフォーマット通り7個入力されているかどうか
  if (updateDay.length !== 7) {
    return false;
  }

  return true;
}

/**
 * 処理したいイベントの番号を指定する際に、フォーマットに沿った回答がなされたか（半角数字かどうか）をチェックする
 * 
 * @param {String} postMsg  ユーザーが送信した削除したいイベント番号
 * @param {Array} eventIdArray  カレンダーに登録されているイベントIDを詰めた配列
 * @returns {String}  バリデーションエラーがあった場合、エラーを返す/なかったら該当するイベントIDを返す
 */
function specifyEventNumberInputValidate(postMsg, eventIdArray) {
  let inputValue = postMsg;
  let resultMsg = '';

  // 半角英数字だった場合の処理
  if (inputValue.match(/^\d+$/)) {
    inputValue = parseInt(inputValue);
    if (inputValue !== 0 && inputValue <= eventIdArray.length) {
      return resultMsg = eventIdArray[inputValue - 1];
    } else {
      return resultMsg = 'error';
    }
  }
  // 全角英数字だった場合の処理
  if (inputValue.match(/[\！-\～]/g)) {
    const indexNum = String.fromCharCode(inputValue.charCodeAt(0) - 0xFEE0);
    if (parseInt(indexNum) !== 0 && parseInt(indexNum) <= eventIdArray.length) {
      return resultMsg = eventIdArray[indexNum - 1];
    } else {
      return resultMsg = 'error';
    }
  }
  // 日本語入力だった場合
  return resultMsg = 'error';
}

/**
 * 一覧表示処理に関するバリデーション
 * ユーザーの入力形式に対するバリデーション
 * 
 * @param {Array} selectedDay  ユーザーが予定一覧を表示したい日
 * @returns {Boolean}  指定したフォーマットでユーザーが入力したかどうか
 */
function showInputValidate(selectedDay) {
  // 入力されたデータはフォマット通りか
  let checkFlagArray = [];
  for (let i = 0; i < selectedDay.length; i++) {
    if (selectedDay[i].match(/^\D+$/)) {
      checkFlagArray.push('error');
    }
  }
  if (checkFlagArray.includes('error')) {
    return false;
  }
  // 入力されたデータはフォーマット通り3個入力されているかどうか
  if (selectedDay.length !== 3) {
    return false;
  }

  return true;
}

/**
 * 一覧表示処理に関するバリデーション
 * ユーザーが指定した日に予定がない場合、falseを返す
 * 
 * @param {Array} events  ユーザーが選択した日に登録された予定が入った配列
 * @returns {Boolean}  ユーザーが選択した日に登録された予定があるかどうか
 */
function eventsListValidate(events) {
  if (events.length !== 0) {
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