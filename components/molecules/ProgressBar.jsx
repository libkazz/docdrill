"use client";

export default function ProgressBar({ current, total }) {
  if (!total || total <= 0) return null;
  const clamped = Math.min(Math.max(current, 1), total);
  const pct = Math.round((clamped / total) * 100);
  return (
    <div className="progress">
      <div className="progress-line">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-text">{clamped} / {total}</div>
    </div>
  );
}

