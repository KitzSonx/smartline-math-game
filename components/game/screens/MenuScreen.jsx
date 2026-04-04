"use client";
import { LEVELS } from "@/lib/gameConfig";
import { SFX } from "@/lib/sound";

export default function MenuScreen({ bestScores, bestTimes, onStart, onHowTo }) {
  return (
    <div className="app-container menu-bg">
      <div className="menu-wrap">
        {/* 1. ส่วน Logo และชื่อเกม */}
        <div className="logo-area">
          <div className="logo-x">✕</div>
          <h1 className="logo-title">Smart Line</h1>
          <h2 className="logo-sub">Multiplication Game</h2>
          <p className="logo-thai">เกมพหุนามประยุกต์เส้นญี่ปุ่น</p>
          <p className="logo-desc">
            ฝึกคูณพหุนามด้วยเทคนิคเส้นญี่ปุ่น<br />
            ใส่สัมประสิทธิ์ → คูณในตาราง → รวมแนวทแยง → คำตอบ!
          </p>
        </div>

        {/* 2. ย้ายปุ่มวิธีเล่นมาไว้ตรงนี้ (ก่อนเลือกด่าน) */}
        <div style={{ marginBottom: '24px' }}>
          <button 
            className="howto-btn" 
            onClick={() => { SFX.menuClick(); onHowTo(); }}
            style={{ width: '100%', maxWidth: '200px' }} // ปรับให้ดูเด่นและพอดี
          >
            📖 วิธีเล่น
          </button>
        </div>

        {/* 3. ส่วนเลือกด่าน */}
        <div className="level-grid">
          {LEVELS.map((lv, i) => (
            <button
              key={i}
              className={`level-card`}
              onClick={() => { SFX.menuClick(); onStart(i); }}
            >
              <span className="lv-emoji">{lv.emoji}</span>
              <span className="lv-name">{lv.name}</span>
              <span className="lv-desc">{lv.desc} • {lv.time}s</span>
              {bestScores[i] !== undefined && <span className="lv-best">🏆 {bestScores[i]} pts</span>}
              {bestTimes[i]  !== undefined && <span className="lv-best-time">⏱ {bestTimes[i]}s</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}