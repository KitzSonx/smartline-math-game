"use client";
import { LEVELS } from "@/lib/gameConfig";
import { SFX } from "@/lib/sound";

export default function MenuScreen({ bestScores, bestTimes, onStart, onHowTo }) {
  return (
    <div className="app-container menu-bg">
      <div className="menu-wrap">
        
        {/* 1. ส่วน Logo / Cover Image */}
        <div className="logo-area">
          <div className="cover-image-wrapper">
            <img 
              src="/Smart_Line_Game_Logo.png" 
              alt="Smart Line Multiplication Game" 
              className="game-cover-image"
            />
          </div>
          <div className="hero-features">
            <p className="hero-subtitle">✨ ปลดล็อกสกิลคูณพหุนาม ด้วยเทคนิคเส้นญี่ปุ่น!</p>
            <div className="hero-steps">
              <span className="h-step">🔢 ใส่ค่า</span>
              <span className="h-arrow">➔</span>
              <span className="h-step">✖️ คูณในตาราง</span>
              <span className="h-arrow">➔</span>
              <span className="h-step">↗️ รวมแนวทแยง</span>
              <span className="h-arrow">➔</span>
              <span className="h-step h-final">🎯 คำตอบ!</span>
            </div>
          </div>
        </div>

        {/* 2. ปุ่มวิธีเล่น */}
        <div style={{ marginBottom: '32px' }}>
          <button 
            className="howto-btn" 
            onClick={() => { SFX.menuClick(); onHowTo(); }}
            style={{ width: '100%', maxWidth: '220px', fontSize: '16px' }} 
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