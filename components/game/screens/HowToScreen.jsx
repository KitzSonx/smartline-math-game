"use client";
import { useState, useEffect, useRef } from "react";
import { ROW_COLOR, COL_COLOR, DIAG_COLORS } from "@/lib/gameConfig";

/* ─── Animated Demo Data ─── */
const DEMO_P1 = [2, 3];       // 2x + 3
const DEMO_P2 = [1, -1];      // x - 1
const DEMO_GRID = [
  [2, -2],   // 2×1=2, 2×(-1)=-2
  [3, -3],   // 3×1=3, 3×(-1)=-3
];
const DEMO_DIAGS = [2, 1, -3]; // 2x², (−2+3)=1x, −3
const DEMO_ANSWER = "2x² + x − 3";

export default function HowToScreen({ onBack }) {
  const [activeStep, setActiveStep] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);
  const timerRef = useRef(null);

  // Auto-advance animation phases within each step
  useEffect(() => {
    setAnimPhase(0);
    if (timerRef.current) clearInterval(timerRef.current);

    const maxPhases = [1, 4, 5, 4, 1][activeStep] || 1;
    if (maxPhases <= 1) return;

    timerRef.current = setInterval(() => {
      setAnimPhase((p) => {
        if (p >= maxPhases - 1) return 0;
        return p + 1;
      });
    }, 1200);

    return () => clearInterval(timerRef.current);
  }, [activeStep]);

  const steps = [
    {
      num: 1,
      title: "อ่านโจทย์",
      desc: "จะได้พหุนาม 2 วงเล็บคูณกัน สังเกตสีที่ใบ้ให้",
    },
    {
      num: 2,
      title: "ใส่สัมประสิทธิ์",
      desc: "นำตัวเลขจากโจทย์ไปกรอกในหัวตาราง ตามสีที่กำหนด",
    },
    {
      num: 3,
      title: "คูณในตาราง",
      desc: "คูณตัวเลขแต่ละคู่ (แถว × คอลัมน์) กรอกผลลัพธ์",
    },
    {
      num: 4,
      title: "รวมแนวทแยง + ตอบ",
      desc: "บวกตัวเลขสีเดียวกัน (แนวทแยง) แล้วกรอกคำตอบ",
    },
  ];

  return (
    <div className="app-container">
      <style>{howtoCSS}</style>
      <div className="ht-wrap">
        <h2 className="ht-title">วิธีเล่น</h2>

        {/* Step tabs */}
        <div className="ht-tabs">
          {steps.map((s, i) => (
            <button
              key={i}
              className={`ht-tab ${activeStep === i ? "ht-tab-active" : ""}`}
              onClick={() => setActiveStep(i)}
            >
              {s.num}
            </button>
          ))}
        </div>

        {/* Step info */}
        <div className="ht-step-info">
          <div className="ht-step-title">{steps[activeStep].title}</div>
          <div className="ht-step-desc">{steps[activeStep].desc}</div>
        </div>

        {/* Visual demo area */}
        <div className="ht-demo">
          {/* ─── STEP 1: Read question ─── */}
          {activeStep === 0 && (
            <div className="demo-question">
              <div className="demo-q-label">โจทย์:</div>
              <div className="demo-q-poly">
                <span className="demo-bracket" style={{ color: ROW_COLOR }}>(</span>
                <span style={{ color: ROW_COLOR, fontWeight: 700 }}>2<i>x</i> + 3</span>
                <span className="demo-bracket" style={{ color: ROW_COLOR }}>)</span>
                <span className="demo-mul">×</span>
                <span className="demo-bracket" style={{ color: COL_COLOR }}>(</span>
                <span style={{ color: COL_COLOR, fontWeight: 700 }}><i>x</i> − 1</span>
                <span className="demo-bracket" style={{ color: COL_COLOR }}>)</span>
              </div>
              <div className="demo-hint-row">
                <div className="demo-hint-item">
                  <span className="demo-dot" style={{ background: ROW_COLOR }} />
                  <span>วงเล็บแรก (แดง) → หัวแถว</span>
                </div>
                <div className="demo-hint-item">
                  <span className="demo-dot" style={{ background: COL_COLOR }} />
                  <span>วงเล็บสอง (น้ำเงิน) → หัวคอลัมน์</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Fill headers ─── */}
          {activeStep === 1 && (
            <div className="demo-table-wrap">
              <table className="demo-table">
                <thead>
                  <tr>
                    <th className="dt-corner">×</th>
                    <th className={`dt-hdr dt-col ${animPhase >= 2 ? "dt-filled" : "dt-empty-col"}`}>
                      {animPhase >= 2 ? (
                        <span style={{ color: COL_COLOR }}>1<i>x</i></span>
                      ) : (
                        <span className="dt-placeholder">?</span>
                      )}
                    </th>
                    <th className={`dt-hdr dt-col ${animPhase >= 3 ? "dt-filled" : "dt-empty-col"}`}>
                      {animPhase >= 3 ? (
                        <span style={{ color: COL_COLOR }}>−1</span>
                      ) : (
                        <span className="dt-placeholder">?</span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={`dt-hdr dt-row ${animPhase >= 0 ? "dt-filled" : "dt-empty-row"}`}>
                      {animPhase >= 0 ? (
                        <span style={{ color: ROW_COLOR }}>2<i>x</i></span>
                      ) : (
                        <span className="dt-placeholder">?</span>
                      )}
                    </td>
                    <td className="dt-cell dt-cell-empty"><span className="dt-var"><i>x</i><sup>2</sup></span></td>
                    <td className="dt-cell dt-cell-empty"><span className="dt-var"><i>x</i></span></td>
                  </tr>
                  <tr>
                    <td className={`dt-hdr dt-row ${animPhase >= 1 ? "dt-filled" : "dt-empty-row"}`}>
                      {animPhase >= 1 ? (
                        <span style={{ color: ROW_COLOR }}>3</span>
                      ) : (
                        <span className="dt-placeholder">?</span>
                      )}
                    </td>
                    <td className="dt-cell dt-cell-empty"><span className="dt-var"><i>x</i></span></td>
                    <td className="dt-cell dt-cell-empty"><span className="dt-var"></span></td>
                  </tr>
                </tbody>
              </table>
              <div className="demo-anim-label">
                {animPhase <= 1 && <span style={{ color: ROW_COLOR }}>กรอกหัวแถว (แดง)...</span>}
                {animPhase >= 2 && <span style={{ color: COL_COLOR }}>กรอกหัวคอลัมน์ (น้ำเงิน)...</span>}
              </div>
            </div>
          )}

          {/* ─── STEP 3: Multiply grid ─── */}
          {activeStep === 2 && (
            <div className="demo-table-wrap">
              <table className="demo-table">
                <thead>
                  <tr>
                    <th className="dt-corner">×</th>
                    <th className="dt-hdr dt-col dt-filled"><span style={{ color: COL_COLOR }}>1<i>x</i></span></th>
                    <th className="dt-hdr dt-col dt-filled"><span style={{ color: COL_COLOR }}>−1</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="dt-hdr dt-row dt-filled"><span style={{ color: ROW_COLOR }}>2<i>x</i></span></td>
                    <td className={`dt-cell ${animPhase >= 1 ? "dt-cell-done" : "dt-cell-empty"}`}>
                      {animPhase >= 1 ? <span><b>2</b><i>x</i><sup>2</sup></span> : <span className="dt-var"><i>x</i><sup>2</sup></span>}
                    </td>
                    <td className={`dt-cell ${animPhase >= 2 ? "dt-cell-done" : "dt-cell-empty"}`}>
                      {animPhase >= 2 ? <span><b>−2</b><i>x</i></span> : <span className="dt-var"><i>x</i></span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="dt-hdr dt-row dt-filled"><span style={{ color: ROW_COLOR }}>3</span></td>
                    <td className={`dt-cell ${animPhase >= 3 ? "dt-cell-done" : "dt-cell-empty"}`}>
                      {animPhase >= 3 ? <span><b>3</b><i>x</i></span> : <span className="dt-var"><i>x</i></span>}
                    </td>
                    <td className={`dt-cell ${animPhase >= 4 ? "dt-cell-done" : "dt-cell-empty"}`}>
                      {animPhase >= 4 ? <span><b>−3</b></span> : <span className="dt-var"></span>}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="demo-anim-label">
                {animPhase === 0 && <span>เตรียมคูณ...</span>}
                {animPhase === 1 && <span>2 × 1 = <b>2</b>x²</span>}
                {animPhase === 2 && <span>2 × (−1) = <b>−2</b>x</span>}
                {animPhase === 3 && <span>3 × 1 = <b>3</b>x</span>}
                {animPhase === 4 && <span>3 × (−1) = <b>−3</b></span>}
              </div>
            </div>
          )}

          {/* ─── STEP 4: Diagonal + Answer ─── */}
          {activeStep === 3 && (
            <div className="demo-table-wrap">
              <table className="demo-table">
                <thead>
                  <tr>
                    <th className="dt-corner">×</th>
                    <th className="dt-hdr dt-col dt-filled"><span style={{ color: COL_COLOR }}>1<i>x</i></span></th>
                    <th className="dt-hdr dt-col dt-filled"><span style={{ color: COL_COLOR }}>−1</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="dt-hdr dt-row dt-filled"><span style={{ color: ROW_COLOR }}>2<i>x</i></span></td>
                    <td className="dt-cell dt-diag-cell" style={{
                      background: animPhase >= 0 ? `${DIAG_COLORS[0]}20` : "white",
                      borderColor: animPhase >= 0 ? DIAG_COLORS[0] : "#e2e8f0",
                      boxShadow: animPhase === 0 ? `0 0 0 2px ${DIAG_COLORS[0]}` : "none",
                    }}>
                      <span><b>2</b><i>x</i><sup>2</sup></span>
                    </td>
                    <td className="dt-cell dt-diag-cell" style={{
                      background: animPhase >= 1 ? `${DIAG_COLORS[1]}20` : "white",
                      borderColor: animPhase >= 1 ? DIAG_COLORS[1] : "#e2e8f0",
                      boxShadow: animPhase === 1 ? `0 0 0 2px ${DIAG_COLORS[1]}` : "none",
                    }}>
                      <span><b>−2</b><i>x</i></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="dt-hdr dt-row dt-filled"><span style={{ color: ROW_COLOR }}>3</span></td>
                    <td className="dt-cell dt-diag-cell" style={{
                      background: animPhase >= 1 ? `${DIAG_COLORS[1]}20` : "white",
                      borderColor: animPhase >= 1 ? DIAG_COLORS[1] : "#e2e8f0",
                      boxShadow: animPhase === 1 ? `0 0 0 2px ${DIAG_COLORS[1]}` : "none",
                    }}>
                      <span><b>3</b><i>x</i></span>
                    </td>
                    <td className="dt-cell dt-diag-cell" style={{
                      background: animPhase >= 2 ? `${DIAG_COLORS[2]}20` : "white",
                      borderColor: animPhase >= 2 ? DIAG_COLORS[2] : "#e2e8f0",
                      boxShadow: animPhase === 2 ? `0 0 0 2px ${DIAG_COLORS[2]}` : "none",
                    }}>
                      <span><b>−3</b></span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Diagonal sum visualization */}
              <div className="demo-diag-sums">
                <div className={`demo-diag-item ${animPhase >= 0 ? "ddi-visible" : ""}`}>
                  <span className="ddi-dot" style={{ background: DIAG_COLORS[0] }} />
                  <span className="ddi-calc">2</span>
                  <span className="ddi-eq">→</span>
                  <span className="ddi-result" style={{ color: DIAG_COLORS[0] }}>2<i>x</i><sup>2</sup></span>
                </div>
                <div className={`demo-diag-item ${animPhase >= 1 ? "ddi-visible" : ""}`}>
                  <span className="ddi-dot" style={{ background: DIAG_COLORS[1] }} />
                  <span className="ddi-calc">(−2) + 3 = 1</span>
                  <span className="ddi-eq">→</span>
                  <span className="ddi-result" style={{ color: DIAG_COLORS[1] }}>1<i>x</i></span>
                </div>
                <div className={`demo-diag-item ${animPhase >= 2 ? "ddi-visible" : ""}`}>
                  <span className="ddi-dot" style={{ background: DIAG_COLORS[2] }} />
                  <span className="ddi-calc">−3</span>
                  <span className="ddi-eq">→</span>
                  <span className="ddi-result" style={{ color: DIAG_COLORS[2] }}>−3</span>
                </div>
              </div>

              {animPhase >= 3 && (
                <div className="demo-final-answer">
                  <span className="dfa-label">คำตอบ:</span>
                  <span className="dfa-poly">2<i>x</i><sup>2</sup> + <i>x</i> − 3</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="ht-nav">
          <button
            className="ht-nav-btn"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((s) => s - 1)}
          >
            ← ก่อนหน้า
          </button>
          <span className="ht-nav-dots">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`ht-dot ${activeStep === i ? "ht-dot-active" : ""}`}
              />
            ))}
          </span>
          <button
            className="ht-nav-btn"
            disabled={activeStep === steps.length - 1}
            onClick={() => setActiveStep((s) => s + 1)}
          >
            ถัดไป →
          </button>
        </div>

        <button className="back-btn" onClick={onBack}>← กลับเมนู</button>
      </div>
    </div>
  );
}

const howtoCSS = `
  .ht-wrap { max-width: 540px; margin: 0 auto; padding: 32px 20px; }
  .ht-title { font-size: 28px; font-weight: 800; margin-bottom: 20px; color: var(--blue); text-align: center; }

  .ht-tabs { display: flex; justify-content: center; gap: 8px; margin-bottom: 20px; }
  .ht-tab {
    width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border);
    background: white; color: var(--text-light); font-size: 18px; font-weight: 800;
    cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
  }
  .ht-tab:hover { border-color: var(--blue); }
  .ht-tab-active { background: var(--blue); color: white; border-color: var(--blue); transform: scale(1.1); }

  .ht-step-info { text-align: center; margin-bottom: 20px; }
  .ht-step-title { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .ht-step-desc { font-size: 14px; color: var(--text-light); line-height: 1.6; }

  /* Demo area */
  .ht-demo {
    background: var(--bg-subtle); border: 1px solid var(--border); border-radius: 16px;
    padding: 24px 16px; min-height: 220px; display: flex; align-items: center; justify-content: center;
  }

  /* Step 1 - Question */
  .demo-question { text-align: center; }
  .demo-q-label { font-size: 12px; color: var(--text-lighter); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
  .demo-q-poly { font-size: 26px; font-weight: 700; font-family: 'JetBrains Mono', monospace; margin-bottom: 20px; line-height: 1.5; }
  .demo-bracket { font-weight: 300; font-size: 30px; }
  .demo-mul { color: var(--text-lighter); margin: 0 8px; font-size: 20px; }
  .demo-hint-row { display: flex; flex-direction: column; gap: 8px; align-items: center; }
  .demo-hint-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-light); }
  .demo-dot { width: 12px; height: 12px; border-radius: 3px; }

  /* Demo table */
  .demo-table-wrap { text-align: center; width: 100%; }
  .demo-table { border-collapse: separate; border-spacing: 4px; margin: 0 auto; font-family: 'JetBrains Mono', monospace; }
  .dt-corner {
    padding: 10px 14px; font-size: 16px; font-weight: 900; color: var(--blue);
    background: var(--blue-light); border-radius: 10px;
  }
  .dt-hdr {
    padding: 8px 14px; font-size: 15px; font-weight: 700; border-radius: 10px;
    text-align: center; transition: all 0.4s;
  }
  .dt-col { border: 2px dashed #93c5fd; background: #eff6ff; }
  .dt-row { border: 2px dashed #fca5a5; background: #fef2f2; }
  .dt-filled { border-style: solid !important; }
  .dt-empty-col { border-color: #bfdbfe; }
  .dt-empty-row { border-color: #fecaca; }
  .dt-placeholder { color: var(--text-lighter); font-weight: 400; }

  .dt-cell {
    padding: 10px 14px; border-radius: 10px; border: 2px solid var(--border);
    text-align: center; min-width: 72px; font-size: 15px; transition: all 0.4s;
  }
  .dt-cell-empty { background: var(--bg-subtle); color: var(--text-lighter); }
  .dt-cell-done { background: white; color: var(--text); animation: cellPop 0.3s ease; }
  .dt-diag-cell { transition: all 0.5s; border: 2px solid; }
  .dt-var { font-size: 12px; color: var(--text-lighter); }

  @keyframes cellPop {
    0% { transform: scale(0.8); opacity: 0.5; }
    60% { transform: scale(1.08); }
    100% { transform: scale(1); opacity: 1; }
  }

  .demo-anim-label {
    margin-top: 14px; font-size: 14px; color: var(--text-light);
    font-family: 'JetBrains Mono', monospace; min-height: 22px;
  }

  /* Diagonal sums */
  .demo-diag-sums { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; align-items: center; }
  .demo-diag-item {
    display: flex; align-items: center; gap: 8px; font-size: 14px;
    font-family: 'JetBrains Mono', monospace;
    opacity: 0; transform: translateY(8px); transition: all 0.4s ease;
  }
  .ddi-visible { opacity: 1; transform: translateY(0); }
  .ddi-dot { width: 10px; height: 10px; border-radius: 50%; }
  .ddi-calc { color: var(--text-light); }
  .ddi-eq { color: var(--text-lighter); }
  .ddi-result { font-weight: 700; }

  /* Final answer */
  .demo-final-answer {
    margin-top: 16px; padding: 12px 20px; background: white; border: 2px solid var(--blue);
    border-radius: 12px; display: inline-flex; align-items: baseline; gap: 8px;
    font-family: 'JetBrains Mono', monospace; animation: cellPop 0.4s ease;
  }
  .dfa-label { font-size: 12px; color: var(--text-lighter); }
  .dfa-poly { font-size: 20px; font-weight: 700; color: var(--blue); }

  /* Navigation */
  .ht-nav { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 20px; }
  .ht-nav-btn {
    background: none; border: 1px solid var(--border); color: var(--text-light);
    padding: 8px 16px; border-radius: 10px; font-size: 13px; cursor: pointer;
    font-family: inherit; transition: all 0.15s;
  }
  .ht-nav-btn:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); }
  .ht-nav-btn:disabled { opacity: 0.3; cursor: default; }
  .ht-nav-dots { display: flex; gap: 6px; }
  .ht-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: all 0.2s; }
  .ht-dot-active { background: var(--blue); transform: scale(1.3); }
`;