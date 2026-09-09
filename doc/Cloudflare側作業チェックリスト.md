# Cloudflare側作業チェックリスト

このファイルは、Cloudflare上で実施する作業のみをまとめたチェックリスト。

## 1. アカウントと認証

1. Cloudflareアカウントにログイン
2. CLIを使う場合は `wrangler login` を実行
3. 対象アカウント・対象ゾーンが正しいことを確認

## 2. Workersの作成とデプロイ

1. Worker名を確定（例: `senka-api`）
2. `wrangler.toml` の `name` と `main` を確認
3. `wrangler deploy` を実行
4. 発行された `*.workers.dev` のURLを記録

確認項目:
1. `GET /api/course` が200で応答
2. 未定義パスが404で応答

## 3. Workersの設定（セキュリティ・運用）

1. 必要に応じてCORS許可オリジンを `*` からPagesドメインに限定
2. 機密値はコードに直書きせず、CloudflareのSecretsを使用
3. ログやレスポンスに個人情報を出さないことを確認

必要時の作業:
1. Secret追加: `wrangler secret put <KEY>`
2. 環境別（dev/prod）で値を分離

## 4. Pagesプロジェクト連携

1. Cloudflare PagesでGitHubリポジトリを接続
2. ビルド不要の静的サイトなら、出力ディレクトリを `pages` に設定
3. 本番デプロイ後に `*.pages.dev` のURLを確認

確認項目:
1. 画面からWorker APIにアクセスできる
2. CORSエラーが出ない

## 5. カスタムドメイン（必要な場合）

1. WorkersまたはPagesにカスタムドメインを追加
2. DNS設定がCloudflare上で有効化されていることを確認
3. HTTPS証明書発行完了を確認

## 6. 最終動作確認

1. Pages本番URLから `course / hello / fortune / events` が取得できる
2. 異常系（name未入力、未定義パス）が想定ステータスで返る
3. スマホ表示でレイアウト崩れがない

## 7. リリース後の運用

1. 失敗率・レイテンシをCloudflareダッシュボードで監視
2. 不要なデバッグログを削減
3. 変更時は GitHub更新 → Pages再デプロイ → Worker再デプロイ の順で反映確認