# DocDrill

DocDrill は Next.js（App Router）で構築した、ドキュメント駆動の確認テストアプリです。日次の JSON データを読み込み、回答・採点・解説までをブラウザで完結します。

## プロジェクト構成
- `app/`: ルートと画面（App Router）
- `components/`: 再利用可能な React コンポーネント
- `app/globals.css`: グローバルスタイル
- データ: `${NEXT_PUBLIC_DATA_BASE_URL}/YYYY-MM-DD.json`（例: `https://.../tests/2025-01-31.json`）
- ビルド出力: `out/`（静的エクスポート）

## セットアップと開発
- 必要条件: Node.js 18+ / npm
- 依存関係: `npm install`
- 開発サーバー: `npm run dev` → `http://localhost:3000/`
- ビルド（静的出力）: `npm run build` → `out/`

## テストと確認
- 手動フロー: ローディング → 回答 → 結果。スコアと解説を確認し、コンソールエラーがないこと。
- 自己テスト: `/?selftest=1` を付与して PASS サマリを確認（選択肢正規化の一貫性チェック）。
- データ確認: 当日の JSON が存在し、最新を取得できること（開発中は `cache: 'no-store'` 推奨）。

## コーディング規約
- インデント 2 スペース、行長 ≲ 100 文字
- 命名: 変数/関数は camelCase、コンポーネントは PascalCase
- 小さく純粋なヘルパーを優先、比較は厳密等価（`===`）
- 環境変数: クライアントに見える値は `NEXT_PUBLIC_` 接頭辞必須

## デプロイ（Cloudflare Pages）
- Build Command: `npm run build`
- Output Directory: `out`
- 環境変数: `NEXT_PUBLIC_DATA_BASE_URL` をダッシュボードで設定

## セキュリティと運用の注意
- `.env` に機密を置き、リポジトリにコミットしない
- S3 側の CORS を許可（ブラウザからの取得用）
- 開発中はキャッシュを無効化し最新データで確認

## サンプル .env
Next.js のクライアントから参照するため、公開用の接頭辞が必須です。

```
# 末尾スラッシュはどちらでも可（内部で正規化）
NEXT_PUBLIC_DATA_BASE_URL=https://example-bucket.s3.amazonaws.com/tests

# ローカルのサンプルを使う場合（public/tests 配下）
# NEXT_PUBLIC_DATA_BASE_URL=/tests
```

## データスキーマ（JSON）
- 取得先: `${NEXT_PUBLIC_DATA_BASE_URL}/{q}.json`（クエリ `?q=YYYY-MM-DD` などを指定）
- ルートは配列でも単一オブジェクトでも可（単一は配列に正規化されます）。
- `options` は以下のいずれの形式も許可（内部で `[ { key, text } ]` 配列へ正規化）。
  - マップ: `{ "A": "選択肢A", "B": "選択肢B", ... }`
  - 配列（オブジェクト）: `[ { "key": "A", "text": "選択肢A" }, ... ]`
  - 配列（単一キーオブジェクト）: `[ { "A": "選択肢A" }, ... ]`
  - 配列（文字列）: `[ "A: 選択肢A", "B: 選択肢B", ... ]`

必須/推奨フィールド例:

```json
[
  {
    "id": "Q1",
    "question": "テスト用の設問 1",
    "options": { "A": "A-1", "B": "B-1", "C": "C-1", "D": "D-1" },
    "correct_option": "B",
    "rationale_correct": "B が要件を満たします",
    "rationale_distractors": { "A": "条件不足", "C": "論点のズレ", "D": "要件外" },
    "difficulty": "easy",
    "bloom_level": "remember",
    "citations": null,
    "learning_objective": "基本概念の確認"
  }
]
```

注意:
- `correct_option` は選択肢キー（例: `"A"`〜`"D"`）。4択（A-D）を推奨。
- `rationale_*` は任意だが、結果画面の説明に使用されます。
- 正規化に失敗した場合は UI にエラーが表示されます（`options` が配列にできない等）。

## コントリビュート
- コミット: Conventional Commits（例: `feat:`, `fix:`, `chore:`）。主語省略の命令形で簡潔に。挙動変更は本文で補足。
- PR: 目的、検証手順（`selftest` を含む）、スクリーンショット（ローディング／設問／結果）を添付。関連 Issue をリンク。
