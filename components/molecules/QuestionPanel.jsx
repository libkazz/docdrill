"use client";
import OptionItem from "./OptionItem.jsx";

export default function QuestionPanel({ q, onAnswer, currentAnswer }) {
  return (
    <div key={q.id}>
      <h2 className="qtitle">
        {q.id}. {q.question}
      </h2>
      <div className="optlist">
        {q.options.map((opt) => (
          <OptionItem
            key={opt.key}
            groupName={`choice-${q.id}`}
            option={opt}
            onSelect={onAnswer}
            defaultChecked={currentAnswer === opt.key}
            currentSelected={currentAnswer}
          />
        ))}
      </div>
      <p className="muted">選択すると次の設問に進みます</p>
    </div>
  );
}
