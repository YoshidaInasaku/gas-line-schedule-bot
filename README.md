# ■gas-line-schedule-bot  
Line上でスケジュール管理ができるツールです<br />
カレンダーアプリの代わりになれるものを目指しました<br />
<br />

仕組みは下記スライドの通りです<br />
<br />
<img src=https://user-images.githubusercontent.com/65550020/147436322-256e5b4a-9200-4f05-91d0-45223e803b49.jpg width=450 />
<br />

本ツールは Google Apps Script を用いて開発を行っているので、利用するためにはセットアップが必要です<br />
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
操作したい内容をメッセージとして送信すると（登録なら「登録」と送信されると）、処理に進みます<br />
その際、[リッチメニュー](https://qiita.com/bow_arrow/items/32ac5d2b4c67bd0c1dc2)を作成しておくと便利です

### 1. 登録
メニューより「登録」をクリックすると、Googleカレンダーへの登録処理に進みます<br />
登録したい日時とカレンダータイトルを入力すると、予定を登録することができます<br />
<br />
![register](https://user-images.githubusercontent.com/65550020/147192879-4d4af2fc-6e49-42d1-be01-664eb7598864.gif)
### 2. 変更
メニューより「変更」をクリックすると、Googleカレンダーの予定変更処理に進みます<br />
変更したい日時を指定後、変更したいイベントを選択し、変更内容を入力すると、予定を変更することができます<br />
<br />
![update](https://user-images.githubusercontent.com/65550020/147195101-ef4488b2-93d5-4330-b412-233ff263e2d1.gif)
### 3 .削除
メニューより「削除」をクリックすると、予定の削除処理に進みます<br />
削除したい日時を指定後、削除したいイベントを選択すると、グーグルカレンダーの予定を削除することができます<br />
<br />
![delete](https://user-images.githubusercontent.com/65550020/147195288-7102f3ff-58cf-4227-b8d5-40ba3df18632.gif)
### 4. 確認
メニューより「確認」をクリックすると、Googleカレンダーの予定確認処理に進みます<br />
確認したい日付を入力すると、予定を確認することができます<br />
<br />
![show](https://user-images.githubusercontent.com/65550020/147195332-2f4f7b15-abd3-4712-adf9-b9417f09338a.gif)
 <br />
 <br />
また、Google Apps Script 上でトリガーを設定すると（設定方法は後述）、前日の11時ごろに次の日の日程を通知してくれます<br /><br />
<img src=https://user-images.githubusercontent.com/65550020/147432097-e62f2417-c006-43b5-a394-2ee244183748.jpg width=320) />
<br /><br />
  
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
&emsp; ![trigger](https://user-images.githubusercontent.com/65550020/147196252-e3256fe7-5841-41ed-8443-29be898c4429.gif)
<br /><br/>

### 3. Messaging APIの設定<br />
&emsp; 3-1. Messaging API を使用するため、[Line公式Doc](https://developers.line.biz/ja/docs/messaging-api/getting-started/#using-console)の説明を参考に、チャンネルを作成してください<br />
&emsp; 3-2. チャンネルアクセストークンを発行してください（参考：[Line公式Doc](https://developers.line.biz/ja/docs/messaging-api/channel-access-tokens/#long-lived-channel-access-tokens)）<br />
&emsp; 3-3. 作成したGoogle Apps Script を「公開アプリケーション」で公開し、「デプロイしたURL」をコピーする<br />
&emsp; 3-4. Webhook URL を設定する（参考：[Line公式Doc](https://developers.line.biz/ja/docs/messaging-api/building-bot/#setting-webhook-url)）<br />
&emsp; 3-5. 自分で作成した Bot と友達になる（参考:[Line公式Doc](https://developers.line.biz/ja/docs/messaging-api/building-bot/#add-your-line-official-account-as-friend)）<br />
&emsp; 3-6. お好みでリッチURLを作成して、メニューバーを作成してください（参考：[Line公式Doc](https://developers.line.biz/ja/docs/messaging-api/using-rich-menus/)）<br />
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






