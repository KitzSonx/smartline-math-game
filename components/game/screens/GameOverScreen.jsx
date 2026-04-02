"use client";

export default function GameOverScreen({
  score,
  totalCorrect,
  questionsAnswered,
  level,
  bestTimes,
  bestScores,
  onRestart,
  onMenu,
}) {
  return (
    <div className="app-container">
      <div className="gameover-wrap">
        <div className="go-emoji">{totalCorrect > 0 ? "🎉" : "😅"}</div>
        <h2 className="go-title">หมดเวลา!</h2>

        <div className="go-stats">
          <div className="go-stat">
            <span className="go-val">{score}</span>
            <span className="go-label">คะแนน</span>
          </div>
          <div className="go-stat">
            <span className="go-val">{totalCorrect}/{questionsAnswered}</span>
            <span className="go-label">ถูก/ทั้งหมด</span>
          </div>
        </div>

        {bestTimes[level] !== undefined && (
          <div className="go-best">⏱ เวลาดีที่สุด: {bestTimes[level]}s</div>
        )}
        {bestScores[level] !== undefined && (
          <div className="go-best">🏆 คะแนนสูงสุด: {bestScores[level]}</div>
        )}

        <div className="go-btns">
          <button className="btn-primary"   onClick={onRestart}>เล่นอีกครั้ง</button>
          <button className="btn-secondary" onClick={onMenu}>เมนูหลัก</button>
        </div>
      </div>
    </div>
  );
}
