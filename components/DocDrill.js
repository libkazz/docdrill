"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toArray, normalizeQuestion, sortById, buildSelfTestData } from "../lib/quiz";
import QuestionPanel from "./molecules/QuestionPanel";
import ResultPanel from "./organisms/ResultPanel";
import ScreenPanel from "./molecules/ScreenPanel";
import ScoringIndicator from "./molecules/ScoringIndicator";

export default function DocDrill() {
  const params = useSearchParams();
  const [screen, setScreen] = useState({ type: "loading", message: "データ取得中…" });
  const [state, setState] = useState({ idx: 0, answers: [], questions: [] });
  const [scoring, setScoring] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_DATA_BASE_URL || "";

  useEffect(() => {
    const doFetch = async () => {
      try {
        if (!baseUrl) {
          setScreen({ type: "error", message: ".env の NEXT_PUBLIC_DATA_BASE_URL が未設定です" });
          return;
        }
        const q = params.get("q");
        if (!q) {
          setScreen({ type: "empty", message: "問題番号が未指定です (?q=xxx を指定)" });
          return;
        }
        const url = `${baseUrl.replace(/\/$/, "")}/${q}.json`;
        let res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          const alt = `/tests/${q}.json`;
          res = await fetch(alt, { cache: "no-store" });
        }
        if (!res.ok) {
          setScreen({ type: "empty", message: `${q}.json を読み込めませんでした` });
          return;
        }
        const data = await res.json();
        const normalized = toArray(data).map(normalizeQuestion).sort(sortById);
        if (!normalized.length) {
          setScreen({ type: "empty", message: "ファイルは取得できましたが設問データが空でした" });
          return;
        }
        if (normalized.some((q) => !Array.isArray(q.options))) {
          setScreen({ type: "error", message: "options の形式を配列に正規化できませんでした" });
          return;
        }
        setState({ idx: 0, answers: [], questions: normalized });
        setScreen({ type: "ready" });
      } catch (e) {
        console.error(e);
        setScreen({ type: "empty", message: "本日の確認テストはありません" });
      }
    };
    doFetch();
  }, [baseUrl, params]);

  const runSelfTests = () => {
    const groups = buildSelfTestData();
    let passed = 0,
      failed = 0;
    const logs = [];
    groups.forEach((g, i) => {
      try {
        const n = g.map(normalizeQuestion);
        if (!n.length) throw new Error("normalized length 0");
        if (!Array.isArray(n[0].options) || n[0].options.length !== 4)
          throw new Error("options normalize failed");
        const q = n[0];
        const html = q.options.map((o) => `<li>${o.key}:${o.text}</li>`).join("");
        if (!html.includes("li")) throw new Error("render sanity failed");
        passed++;
        logs.push(`Test${i + 1}: PASS`);
      } catch (e) {
        failed++;
        logs.push(`Test${i + 1}: FAIL — ${e.message}`);
      }
    });
    return { passed, failed, logs };
  };

  const onAnswer = (val) => {
    const q = state.questions[state.idx];
    const idxExisting = state.answers.findIndex((a) => a.id === q.id);
    const nextAnswers = [...state.answers];
    if (idxExisting >= 0) nextAnswers[idxExisting] = { id: q.id, answer: val };
    else nextAnswers.push({ id: q.id, answer: val });
    const nextIdx = state.idx + 1;
    const total = state.questions.length;
    setTimeout(() => {
      setState({ ...state, idx: nextIdx, answers: nextAnswers });
      if (nextIdx >= total) {
        setScoring(true);
        setTimeout(() => setScoring(false), 1500);
      }
    }, 25);
  };

  const onBack = () => {
    if (state.idx > 0) {
      setState({ ...state, idx: state.idx - 1 });
    }
  };

  const showSelfTest = params.get("selftest") === "1";
  const self = useMemo(() => (showSelfTest ? runSelfTests() : null), [showSelfTest]);

  // announce canGoBack and progress to outer controller
  useEffect(() => {
    const total = state.questions.length;
    const canGoBack = screen.type === 'ready' && state.idx > 0 && state.idx < total;
    // Show progress only while answering (not scoring, not result)
    const showProgress = screen.type === 'ready' && state.idx < total && !scoring;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('docdrill:state', { detail: { canGoBack, idx: state.idx, total, showProgress } }));
    }
  }, [screen.type, state.idx, state.questions.length, scoring]);

  // listen to back event
  useEffect(() => {
    const handler = () => onBack();
    if (typeof window !== 'undefined') {
      window.addEventListener('docdrill:back', handler);
      return () => window.removeEventListener('docdrill:back', handler);
    }
  }, [state.idx]);

  if (screen.type !== "ready") {
    return <ScreenPanel screen={screen} self={self} />;
  }

  if (state.idx >= state.questions.length) {
    if (scoring) return <ScoringIndicator />;
    return (
      <ResultPanel questions={state.questions} answers={state.answers} self={self} />
    );
  }

  const q = state.questions[state.idx];
  const amap = new Map(state.answers.map((a) => [a.id, a.answer]));
  const currentAnswer = amap.get(q.id);
  return <QuestionPanel q={q} onAnswer={onAnswer} currentAnswer={currentAnswer} />;
}
