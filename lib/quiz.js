// Quiz data normalization and helpers

export function toArray(x) {
  return Array.isArray(x) ? x : x ? [x] : [];
}

export function normalizeOptions(raw) {
  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        if (entry && typeof entry === "object" && !Array.isArray(entry)) {
          if ("key" in entry && "text" in entry)
            return { key: String(entry.key), text: String(entry.text) };
          const k = Object.keys(entry)[0];
          return { key: String(k), text: String(entry[k]) };
        }
        if (typeof entry === "string") {
          const m = entry.match(/^([A-Z])[:：]\s*(.*)$/);
          return m ? { key: m[1], text: m[2] } : { key: "", text: entry };
        }
        return { key: "", text: String(entry) };
      })
      .filter((o) => o.key !== "" || o.text !== "");
  }
  if (raw && typeof raw === "object") {
    return Object.keys(raw).map((k) => ({ key: String(k), text: String(raw[k]) }));
  }
  return [];
}

export function normalizeDistractors(raw) {
  const out = {};
  if (Array.isArray(raw)) {
    raw.forEach((entry) => {
      if (entry && typeof entry === "object") {
        const k = Object.keys(entry)[0];
        out[k] = String(entry[k]);
      }
    });
    return out;
  }
  if (raw && typeof raw === "object") return { ...raw };
  return out;
}

export function normalizeQuestion(q, idx) {
  const opts = normalizeOptions(q.options);
  return {
    id: q.id ?? `Q${idx + 1}`,
    question: q.question ?? "",
    options: opts,
    correct_option: q.correct_option ?? q.correct ?? q.answer ?? null,
    difficulty: q.difficulty || "",
    bloom: q.bloom_level || q.bloom || "",
    rationale_correct: q.rationale_correct || q.rationale || "",
    rationale_distractors: normalizeDistractors(q.rationale_distractors),
    citations: q.citations || null,
    learning_objective: q.learning_objective || "",
  };
}

export function sortById(a, b) {
  const na = parseInt(String(a.id).replace(/\D+/g, ""), 10);
  const nb = parseInt(String(b.id).replace(/\D+/g, ""), 10);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return String(a.id).localeCompare(String(b.id), "ja");
}

export function buildSelfTestData() {
  return [
    [{ id: "Q1", question: "配列(単一キー)の解釈", options: [{ A: "a1" }, { B: "b1" }, { C: "c1" }, { D: "d1" }], correct_option: "B" }],
    [{ id: "Q2", question: "マップの解釈", options: { A: "a2", B: "b2", C: "c2", D: "d2" }, correct_option: "C" }],
    [{ id: "Q3", question: "{key,text}の解釈", options: [{ key: "A", text: "a3" }, { key: "B", text: "b3" }, { key: "C", text: "c3" }, { key: "D", text: "d3" }], correct_option: "A" }],
    [{ id: "Q4", question: "文字列配列の解釈", options: ["A: a4", "B: b4", "C: c4", "D: d4"], correct_option: "D" }],
  ];
}

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

