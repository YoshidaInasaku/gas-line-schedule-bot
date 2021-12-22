# ■gas-line-schedule-bot  
Line上でスケジュール管理ができるツールです<br />
カレンダーアプリの代わりになれるものを目指しました<br />
<br />

## ■機能
主な機能は以下の5つです
- <b>スケジュール登録</b>
- <b>スケジュール削除</b>
- <b>スケジュール変更</b>
- <b>スケジュール確認</b>
- <b>リマインド機能</b>
<br />

## ■デモ動画
※ToDo：動画載せる<br />
<br />

## ■本ツールを使うメリット
- スマホの容量がいっぱいでも、Lineさえあれば別途カレンダーアプリをインストールしなくて済む<br />
- 次の日の予定を前日にラインで通知してくれるので、予定を忘れなくても済む
<br />

## ■必要な環境
- <b>Googleアカウント を持っていること</b>
- <b>Line Developers に登録済みであること</b>
- <b>Docker Desktop がインストール済みであること</b>
<br />

## ■セットアップ
必要な準備は大きく分けて以下の4つになります<br />
<br />
&emsp; <b>1. 環境構築</b><br />
&emsp; <b>2. Google Apps Script の設定</b><br />
&emsp; <b>3. Messaging API の設定</b><br />
&emsp; <b>4. .config.js の作成</b><br />
&emsp; <b>5. 設定の反映</b>
<br />
### 1. 環境構築<br />
&emsp; 1-1. 本リポジトリをフォーク<br />
&emsp; 1-2. ローカルににクローン<br />
&emsp; 1-3. ルートディレクトリ配下に以下2つのファイルを作成するため、ターミナルにて以下コードを記述<br />
  &emsp; &emsp; Ⅰ) .clasprc.json <br />
  &emsp; &emsp; Ⅱ) .clasp.json <br />
  ```sh
    $touch .clasprc.json
    $touch .clasp.json
  ```
&emsp; 1-4. ターミナルにて、Docker をデーモンとして起動して、bash に入る≤br />
  ```sh
   $docker compose up -d
   $docker compose exec app bash
  ```
&emsp; 1-5. ターミナル上で clasp によるログインを行う<br />
  ```sh
   $clasp login --no-localhost
  ```
&emsp; 1-6. ターミナル上に URL が出力されるので、それをコピーして、ブラウザ（クローム）に貼り付け<br />
　　&emsp; &nbsp; → ブラウザ上で 承認 が求められるので、「許可」を押す<br />
&emsp; 1-7. ブラウザ（クローム）にてコードが出力されるので、それをコピーしてターミナルにペースト<br />
&emsp; 1-8. .clasprc.jsonに、下記のように認証情報が記載されていることを確認する
  ```json
   {"token":{"access_token":"以下略....."}}
  ```
<br />

### 2. Google Apps Scriptの設定<br />
&emsp; 2-1. [Google Apps Script API の設定画面](https://script.google.com/home/usersettings)に行き、 Google Script API を オン にする<br />
&emsp; 2-2. 任意のGoogleドライプのディレクトリで、Google Apps Script を作成<br />
&emsp; 2-3. .clasp.json を記述する
  ```json
    {
       "scriptId": "{Google Apps Script の プロジェクトID}",
       "rootDir": "./src"
    }
  ```
&emsp; 2-4. ターミナルに以下のコマンドを入力<br />
   ```sh
    $clasp push {Google Apps Script の URL(https://script.google.com/home/projects/{プロジェクトID}/edit 全文)}
   ```
&emsp; 2-5. Google Apps Script の Webエディタ の画面に行き、コードが反映されているか確認する<br />
&emsp; 2-6. Google Apps Script の Webエディタ にて、トリガーを設定<br />
  &emsp; &emsp; → 関数「remindSchedule」 を 「午後11時〜午後12時」 に設定<br />
  ToDO:画像を貼る
<br/>

### 3. Messaging APIの設定<br />
&emsp; 3-1. Messaging API を使用するため、[Line公式Doc](https://developers.line.biz/ja/docs/messaging-api/getting-started/#using-console)の説明を参考に、チャンネルを作成してください<br />
&emsp; 3-2. チャンネルアクセストークンを発行してください（参考：[Line公式Doc](https://developers.line.biz/ja/docs/messaging-api/channel-access-tokens/#long-lived-channel-access-tokens)）<br />
&emsp; 3-3. 作成したGoogle Apps Script を「公開アプリケーション」で公開し、「デプロイしたURL」をコピーする<br />
&emsp; 3-4. Webhook URL を設定する（参考：[Line公式Doc](https://developers.line.biz/ja/docs/messaging-api/building-bot/#setting-webhook-url)）<br />
&emsp; 3-5. 自分で作成した Bot と友達になる（参考:[Line公式Doc](https://developers.line.biz/ja/docs/messaging-api/building-bot/#add-your-line-official-account-as-friend)）<br />
<br />

### 4..confi.jsの作成<br />
&emsp; 4-1. srcディレクトリに、.config.js を作成するため、ターミナルに以下のコードを記述<br />
   ```sh
    $touch src/.config.js
   ```
&emsp; 4-2. .config.jsに以下のコードを記述<br />
   ```js
    const user = {
      "ACCESS_TOKEN": "Line のアクセストークン",
      "USER_ID": "ラインのユーザーID",
      "REPLY_URL": "https://api.line.me/v2/bot/message/reply",  // 応答message用のURL
      "PUSH_URL": "https://api.line.me/v2/bot/message/push",  // push通知用のURL
      "CALENDAR_ID": "Gメールアドレス"
    }
   ```
<br />

### 5. 設定の反映<br />
&emsp; 5-1. ローカルで作成したものをGoogle Apps Script に反映させるため、ターミナルに以下の記述をする<br />
   ```sh
    $clasp push
   ```
&emsp; 5-2. Google Apps Script の Webエディタ に行き、デプロイのバージョンを更新する<br />
<br/><br/>
以上でセットアップは完了です<br />
<br />

## ■ライセンス<br />
MIT License

Copyright (c) 2021 YoshidaInasaku

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.






