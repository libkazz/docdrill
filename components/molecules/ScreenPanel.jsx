export default function ScreenPanel({ screen, self }) {
  const title =
    screen.type === "loading"
      ? "データ取得中…"
      : screen.type === "error"
      ? "読み込みエラー"
      : "本日の確認テストはありません";
  return (
    <div>
      <h1>{title}</h1>
      {screen.message ? <p className="muted">{screen.message}</p> : null}
      {self ? (
        <details className="detail">
          <summary>開発用: セルフテスト</summary>
          <pre>{[...self.logs, `Summary: ${self.passed} passed, ${self.failed} failed`].join("\n")}</pre>
        </details>
      ) : null}
    </div>
  );
}

