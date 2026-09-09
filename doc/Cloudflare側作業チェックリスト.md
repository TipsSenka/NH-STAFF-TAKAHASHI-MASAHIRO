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

## 8. デプロイするブランチの切り替え手順

### Pages（本番ブランチを切り替える場合）

1. Cloudflareダッシュボードで Pages プロジェクトを開く
2. Settings → Builds & deployments を開く
3. Production branch を現在のブランチから切り替え先ブランチへ変更
4. Save後に再デプロイを実行（必要なら Retry deployment）

確認項目:
1. 最新デプロイが切り替え先ブランチのコミットになっている
2. 本番URL（`*.pages.dev` または独自ドメイン）で表示が更新される

### Pages（プレビューだけ別ブランチで確認する場合）

1. 切り替え先ブランチへ push
2. Deployments で該当ブランチの Preview を確認
3. 問題なければ Production branch を切り替える、または main へマージする

### Workers（CLI運用時）

1. デプロイ対象ブランチへチェックアウト
2. 対象ブランチの最新を pull
3. `wrangler deploy` を実行

確認項目:
1. `*.workers.dev` の応答が切り替え先ブランチのコードになっている
2. APIエンドポイントのステータス（200/400/404）が想定通り

### Workers（GitHub連携で自動デプロイしている場合）

1. Workerの連携設定で対象リポジトリとブランチ条件を確認
2. 本番反映ブランチ条件を切り替え先に変更
3. 対象ブランチへ push して自動デプロイを実行

確認項目:
1. デプロイ履歴で対象ブランチ名とコミットIDが一致
2. ロールバック手順（直前コミット再デプロイ）を事前に確認