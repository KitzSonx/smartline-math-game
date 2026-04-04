// components/game/steps/ResultBox.jsx
"use client";
import { resultPolyJSX } from "@/lib/polynomial";

export default function ResultBox({
  resultCorrect,
  correctAnswer,
  lastSolveTime,
  level,
  timer,
  combo,
  onNext,
}) {
  const earnedScore = (level + 1) * 100 + Math.max(0, timer) * 2 + (combo > 1 ? (combo - 1) * 50 : 0);

  return (
    <div className="result-box">
      <div className="result-icon">{resultCorrect ? "✅" : "❌"}</div>
      <div className="result-title">{resultCorrect ? "ถูกต้อง!" : "ไม่ถูกต้อง"}</div>

      <div className="result-answer">
        <span style={{ opacity: 0.5 }}>คำตอบ: </span>
        {resultPolyJSX(correctAnswer)}
      </div>

      {lastSolveTime !== null && resultCorrect && (
        <div className="result-time">⏱ ใช้เวลา {lastSolveTime} วินาที</div>
      )}
      {resultCorrect && (
        <div className="result-score">+{earnedScore}</div>
      )}

      <button className="btn-primary" style={{ marginTop: 16 }} onClick={onNext}>
        โจทย์ถัดไป →
      </button>
    </div>
  );
}
