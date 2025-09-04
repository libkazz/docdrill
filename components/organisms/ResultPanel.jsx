export default function ResultPanel({ questions, answers, self }) {
  const amap = new Map(answers.map((a) => [a.id, a.answer]));
  const total = questions.length;
  const correctCount = questions.reduce((acc, q) => acc + (amap.get(q.id) === q.correct_option ? 1 : 0), 0);
  const score = total ? Math.round((correctCount / total) * 100) : 0;

  const incorrect = questions.filter((q) => amap.get(q.id) !== q.correct_option);

  return (
    <div>
      <h1>採点結果</h1>

      <section aria-label="スコア">
        <div className="score-hero" aria-live="polite">
          <span className="score-value">{score}</span>
          <span className="score-unit">点</span>
        </div>
        <div className="score-sub">正答数 {correctCount} / {total}</div>
      </section>

      <section aria-labelledby="answers-detail">
        <h2 id="answers-detail">解説</h2>
        {incorrect.length === 0 ? (
          <p className="muted">不正解の設問はありません</p>
        ) : incorrect.map((q, i) => {
          const a = amap.get(q.id);
          const isCorrect = a === q.correct_option;
          const optMap = new Map(q.options.map((o) => [o.key, o.text]));
          return (
            <div key={q.id}>
              <article className="explain-card">
                <header className="explain-head">
                  <span className="badge badge-wrong">不正解</span>
                  <h3 className="explain-title">{q.id}. {q.question}</h3>
                </header>

                <div className="answer-line">
                  正解: <span className="answer-correct">{q.correct_option || ''}</span>{optMap.get(q.correct_option) ? `. ${optMap.get(q.correct_option)}` : ''}
                </div>
                <p className="answer-user-small">（あなたの解答: {a || '-'}{optMap.get(a) ? `. ${optMap.get(a)}` : ''}）</p>

                {(q.rationale_correct || q.rationale_distractors) ? (
                  <section className="explain-body">
                    <div className="note note-combined">
                      {q.rationale_correct ? <p>{q.rationale_correct}</p> : null}
                      {(() => {
                        const reason = q.rationale_distractors && a ? q.rationale_distractors[a] : undefined;
                        return reason ? (
                          <p>あなたの解答が誤っている理由: {reason}</p>
                        ) : null;
                      })()}
                    </div>
                  </section>
                ) : null}
              </article>
              {i < incorrect.length - 1 ? <hr className="explain-sep" /> : null}
            </div>
          );
        })}
      </section>

      {self ? (
        <details className="detail">
          <summary>開発用: セルフテスト</summary>
          <pre>{[...self.logs, `Summary: ${self.passed} passed, ${self.failed} failed`].join("\n")}</pre>
        </details>
      ) : null}
    </div>
  );
}
