# Repository Guidelines

このドキュメントはエージェント／自動化向けの補助ガイドです。

人間の開発者に必要な情報（セットアップ、プロジェクト構成、開発・ビルド・テスト手順、コーディング規約、PR/コミット規約、デプロイ、セキュリティ設定）は `README.md` に集約しました。一般的な操作や環境構築は README を参照してください。

## エージェント向けメモ（最小限）
- 実行コマンドは README の手順に厳密に従う（`npm install` / `npm run dev` / `npm run build`）。
- 検証時は `/?selftest=1` を付与し、PASS サマリとコンソールエラーの有無を確認。
- 環境変数は `NEXT_PUBLIC_` 接頭辞のみを公開領域で使用。S3 の CORS と開発時 `cache: 'no-store'` に留意。

詳細は `README.md` を参照してください。
