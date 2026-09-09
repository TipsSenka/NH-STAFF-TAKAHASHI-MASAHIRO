# NH-STAFF Cloudflare活用サンプル

`doc/09CloudFlareの活用_結果表示日本語版.pptx` に沿って、Cloudflare Workers(API)とPages(表示画面)の最小構成を作成。

## ディレクトリ構成

```
doc/
pages/
	index.html
	app.js
	styles.css
worker/
	src/index.js
	package.json
	wrangler.toml
```

## Workers(API) の起動

1. `worker` に移動
2. 依存関係をインストール
3. ローカル実行

PowerShell例:

```powershell
Set-Location .\worker
npm.cmd install
npm.cmd run dev
```

ローカルURLは通常 `http://127.0.0.1:8787`。

## Pages(表示画面) の確認

`pages/index.html` をブラウザで開く。

- ベースURLにWorkerのURLを入力
- ボタンから `/api/course` `/api/fortune` `/api/events` を実行
- 名前入力後に「あいさつを取得」で `/api/hello?name=...` を実行

## API一覧

- `GET /api/course`: 学科紹介JSON
- `GET /api/hello?name=山田`: 入力検証付きあいさつJSON
- `GET /api/fortune`: おみくじJSON
- `GET /api/events`: イベント配列JSON
- 未定義パス: `404 not_found`

## デプロイ

```powershell
Set-Location .\worker
npm.cmd run deploy
```

Cloudflareへログイン済みであれば、公開URL(`*.workers.dev`)が表示される。