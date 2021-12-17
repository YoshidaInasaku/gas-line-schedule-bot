/**
 * ユーザーからのアクションに返信する
 * 
 * @param {httpRequest} e  linePlatformから送られてくるPostリクエスト
 */
function doPost(e) {
  const json = JSON.parse(e.postData.contents).events[0];
  const postMsg = json.message.text;
  const replyToken = json.replyToken;

  // キャッシュにてユーザーの状態を管理
  let cache = CacheService.getScriptCache();
  let cacheType = cache.get('type');

  // ユーザーがしたい処理がキャッシュにない場合は実行
  if(cacheType === null) {
    return getProcessingName(postMsg, replyToken, cache);
  }

  // ユーザーが選択した処理を実行
  execSelectedProcess(postMsg, replyToken, cache, cacheType);
}

/**
 * ラインに返信する
 * 
 * @param {string} msg  ユーザーへ返す文字
 * @param {string} replyToken  リプライトークン
 */
function postToLine(msg, replyToken) {
  UrlFetchApp.fetch(user.REPLY_URL, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "AUthorization": "Bearer " + user.ACCESS_TOKEN
    },
    "method": "post",
    "payload": JSON.stringify({
      "replyToken": replyToken,
      "messages": [{
        "type": "text",
        "text": msg
      }]
    })
  })
}

/**
 * どんな処理がしたいかをユーザーに聞く
 * 
 * @param {string} postMsg  ユーザーが希望した処理（ex.登録/削除）
 * @param {string} replyToken  ラインへのリプライトークン
 * @param {object} cache  cacheオブジェクト
 */
function getProcessingName(postMsg, replyToken, cache) {
  switch (postMsg) {
    case '登録':
      postToLine(
        '予定を登録したい日時を教えてください\n<入力例>\n2021年1月28日 19時から21時40分\n食事  の場合\n\n2021\n1\n28\n19\n0\n21\n40\n食事',
        replyToken
      );
      cache.put('type', 'register');
      break;
    case '変更':
      postToLine(
        '変更したい予定が登録されている日を教えてください\n<入力例>\n2021年1月28日 19時から21時40分\n食事  の場合\n\n2021\n1\n28',
        replyToken
      );
      cache.put('type', 'update1');
      break;
    case '削除':
      postToLine(
        '削除したい予定が登録されている日を教えてください\n<入力例>\n2021年9月3日 18時30分から21時\n食事  を削除したい場合\n\n2021\n9\n3',
        replyToken
      );
      cache.put('type', 'delete1');
      break;
    case '確認':
      postToLine(
        '予定を確認したい日を教えてください\n<入力例>\n2021年11月28日  の場合\n\n2021\n11\n28',
        replyToken
      );
      cache.put('type', 'show');
      break;
    default:
      postToLine(
        "カレンダーで行いたい処理を選択してください",
        replyToken
      );
      break;
  }
}

/**
 * ユーザーが選択した処理を実行する
 * 
 * @param {string} postMsg  ユーザーが送信たメッセージ
 * @param {string} replyToken  リプライトークン
 * @param {object} cache  cacheオブジェクト
 * @param {object} cacheType  {key: type value:USER_CHOICE_PROCESS}
 */
function execSelectedProcess(postMsg, replyToken, cache, cacheType) {
  switch (cacheType) {
    case 'register':
      cache.remove('type');
      registerCalendarEvent(postMsg, replyToken);
      break;
    case 'update1':
      showCalendarEvent(postMsg, replyToken, cache, cacheType);
      break;
    case 'update2':
      cache.remove('type');
      postToLine(
        'どのように変更したいですか\n<入力例>\n2021年1月28日 19時から21時40分\n食事 を\n2021年1月16日 17時から20時半  に変更したい場合\n\n2021\n1\n16\n17\n0\n20\n30',
         replyToken);
      cache.put('type', 'update3');
      break;
    case 'update3':
      cache.remove('type');
      updateCalendarEvent(postMsg, replyToken, cache);
      // ToDo
      //   1.メッセージを受け取り、配列にばらす（バリデーションも加える）
      //   2.カレンダーIDから指定の予定を変更処理
      //   3.変更処理完了のメッセージを送信
    case 'delete1':
      showCalendarEvent(postMsg, replyToken, cache, cacheType);
      break;
    case 'delete2':
      cache.remove('type');
      deleteCalendarEvent(postMsg, replyToken, cache);
      break;
    case 'show':
      showCalendarEvent(postMsg, replyToken, cache, cacheType);
      break;
    default:
      postToLine('開発中', replyToken);
      break;
  }
}