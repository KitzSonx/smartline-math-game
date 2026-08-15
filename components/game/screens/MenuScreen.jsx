"use client";
import { LEVELS } from "@/lib/gameConfig";
import { SFX } from "@/lib/sound";

export default function MenuScreen({ bestScores, bestTimes, onStart, onStartPractice, onHowTo }) {
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

        {/* 2. ปุ่มโหมดทดลองเล่น & วิธีเล่น */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button 
            className="practice-btn" 
            onClick={() => { SFX.menuClick(); onStartPractice(); }}
          >
            🧪 โหมดทดลองเล่น (10 ข้อ)
          </button>
          <button 
            className="howto-btn" 
            onClick={() => { SFX.menuClick(); onHowTo(); }}
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

        {/* 4. ส่วนเอกสารประกอบการเรียน */}
        <div className="pdf-section">
          <h3 className="pdf-section-title">📄 เอกสารประกอบการเรียน</h3>
          <div className="pdf-grid">
            {/* ใบงาน */}
            <div className="pdf-card">
              <div className="pdf-card-header">
                <span className="pdf-icon">📝</span>
                <span className="pdf-name">ใบงาน</span>
              </div>
              <div className="pdf-card-actions">
                <a 
                  href={encodeURI("/ใบงาน.pdf")} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="pdf-btn pdf-btn-view"
                  onClick={() => SFX.menuClick()}
                >
                  👁️ เปิดดูในแท็บใหม่
                </a>
                <a 
                  href={encodeURI("/ใบงาน.pdf")} 
                  download="ใบงาน.pdf" 
                  className="pdf-btn pdf-btn-download"
                  onClick={() => SFX.menuClick()}
                >
                  📥 ดาวน์โหลด
                </a>
              </div>
            </div>

            {/* เฉลยใบงาน */}
            <div className="pdf-card">
              <div className="pdf-card-header">
                <span className="pdf-icon">✅</span>
                <span className="pdf-name">เฉลยใบงาน</span>
              </div>
              <div className="pdf-card-actions">
                <a 
                  href={encodeURI("/เฉลยใบงาน.pdf")} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="pdf-btn pdf-btn-view"
                  onClick={() => SFX.menuClick()}
                >
                  👁️ เปิดดูในแท็บใหม่
                </a>
                <a 
                  href={encodeURI("/เฉลยใบงาน.pdf")} 
                  download="เฉลยใบงาน.pdf" 
                  className="pdf-btn pdf-btn-download"
                  onClick={() => SFX.menuClick()}
                >
                  📥 ดาวน์โหลด
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}