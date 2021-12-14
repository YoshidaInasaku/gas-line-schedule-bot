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
        '変更したい予定が登録されている日時を教えてください\n「年月日/開始時間/終了時間」の順番でそれぞれ改行して入力\n<以下入力例:2021年11月28日 19時から21時 京都で食事>\n\n20211128\n19\n21',
        replyToken
      );
      cache.put('type', 'update');
      /** ToDo
       * cacheに update を登録して以下の処理をラップ
       *   1.何時に変更したいかを送信
       *   2.カレンダー処理
       *   3.完了の返信
       */
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
        '予定を確認したい日時を教えてください\n入力例：2021年11月28日\n\n20211128',
        replyToken
      );
      cache.put('type', 'show');
      /** ToDo
       * cacheに 4 を登録して以下の処理をラップ
       *   1.カレンダー処理
       *   2.予定を送信
       */
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
      registerCalendarEvent(postMsg);
      postToLine('登録が完了しました', replyToken);  // ToDo:バリデーションをつける
      break;
    case 'delete1':
      cache.remove('type');
      const eventList = showCalendarEvent(postMsg, cache);
      // switch文中にif使用不可（バリデーション専用の関数をこのファイル内で作成する<postToLineもそこで起動させる>）
      /*
      if(cache.get('error') !== null) {
        postToLine(eventList, replyToken);
        cache.remove('error');
      }
      */
      postToLine(`どのイベントを削除しますか\n番号で回答してください\n\n${eventList}`, replyToken);
      cache.put('type', 'delete2');
      break;
    case 'delete2':
      deleteCalendarEvent(postMsg, cache);
      // switch文中にif使用不可
      /*
      if(cache.get('error') !== null) {
        postToLine('数字以外の入力はできません\n記載されている番号で入力してください', replyToken);
        cache.remove('error');
        return;
      }
      */
      postToLine('削除が完了しました', replyToken);
      cache.remove('type');
      break;
    default:
      postToLine('開発中', replyToken);
      break;
  }
}