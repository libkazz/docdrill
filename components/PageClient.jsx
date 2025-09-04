"use client";

import { useEffect, useState } from "react";
import DocDrill from "./DocDrill";
import ProgressBar from "./molecules/ProgressBar.jsx";

export default function PageClient() {
  const [canGoBack, setCanGoBack] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [showProgress, setShowProgress] = useState(true);

  useEffect(() => {
    const onState = (e) => {
      if (e?.detail) {
        if (typeof e.detail.canGoBack === 'boolean') setCanGoBack(e.detail.canGoBack);
        if (typeof e.detail.idx === 'number' && typeof e.detail.total === 'number') {
          setProgress({ current: e.detail.idx + 1, total: e.detail.total });
        }
        if (typeof e.detail.showProgress === 'boolean') setShowProgress(e.detail.showProgress);
      }
    };
    window.addEventListener('docdrill:state', onState);
    return () => window.removeEventListener('docdrill:state', onState);
  }, []);

  const handleBack = () => {
    window.dispatchEvent(new Event('docdrill:back'));
  };

  return (
    <main className="container">
      <div className="card">
        {showProgress ? (
          <ProgressBar current={progress.current} total={progress.total} />
        ) : null}
        <DocDrill />
      </div>
      {canGoBack ? (
        <div className="back-row">
          <button type="button" className="btn" onClick={handleBack}>← 戻る</button>
        </div>
      ) : null}
    </main>
  );
}
