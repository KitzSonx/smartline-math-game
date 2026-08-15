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
  reason, // ✅ รับค่า reason เพื่อเช็คสาเหตุการจบเกม
}) {
  return (
    <div className="app-container">
      <div className="gameover-wrap">
        {/* เปลี่ยน Emoji ตามสาเหตุ: ถ้าผิดเกินโชว์หัวกะโหลก ถ้าหมดเวลาโชว์นาฬิกาหรือพลุตามคะแนน */}
        <div className="go-emoji">
          {reason === "completed_practice" ? "🏆" : reason === "mistakes" ? "💀" : (totalCorrect > 0 ? "🎉" : "⏰")}
        </div>
        
        {/* เปลี่ยนหัวข้อตามสาเหตุ */}
        <h2 className="go-title">
          {reason === "completed_practice" ? "ผ่านโหมดทดลองเล่น!" : reason === "mistakes" ? "ตอบผิดเกินกำหนด!" : "หมดเวลา!"}
        </h2>
        
        {/* ข้อความอธิบายเพิ่มเติม */}
        <p style={{ textAlign: "center", marginBottom: "20px", color: "var(--text-color, #666)", opacity: 0.8 }}>
          {reason === "completed_practice"
            ? "ยินดีด้วย! คุณทำโหมดทดลองเล่นครบทั้ง 10 ข้อเรียบร้อยแล้ว"
            : reason === "mistakes" 
            ? "คุณตอบผิดครบ 3 ครั้งแล้ว พยายามใหม่นะ" 
            : "เวลาของคุณหมดลงแล้ว มาลองทำลายสถิติใหม่กัน"}
        </p>

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
          <button className="btn-primary" onClick={onRestart}>เล่นอีกครั้ง</button>
          <button className="btn-secondary" onClick={onMenu}>เมนูหลัก</button>
        </div>
      </div>
    </div>
  );
}