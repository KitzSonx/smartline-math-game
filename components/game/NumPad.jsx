"use client";
import { SFX } from "@/lib/sound";

export default function NumPad({ onInput, onDelete, onNext, onSubmit, showSubmit }) {
  return (
    <div className="np-container">
      <style>{numpadCSS}</style>
      <div className="np-grid">
        {/* Row 1 */}
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("7"); }}>7</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("8"); }}>8</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("9"); }}>9</button>
        <button className="np-btn np-del" onClick={() => { SFX.del(); onDelete(); }}>⌫</button>

        {/* Row 2 */}
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("4"); }}>4</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("5"); }}>5</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("6"); }}>6</button>
        <button className="np-btn np-minus" onClick={() => { SFX.tap(); onInput("-"); }}>
          <span className="np-minus-label">-</span>
        </button>

        {/* Row 3 */}
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("1"); }}>1</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("2"); }}>2</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("3"); }}>3</button>
        <button className="np-btn np-next" onClick={() => { SFX.next(); onNext(); }}>
          <span className="np-next-icon">→</span>
          <span className="np-next-text">ถัดไป</span>
        </button>

        {/* Row 4 */}
        <button className="np-btn np-zero" onClick={() => { SFX.tap(); onInput("0"); }}>0</button>
        {/* zero spans 2 cols */}
        {showSubmit ? (
          <button className="np-btn np-submit" onClick={() => { SFX.submit(); onSubmit(); }}>
            <span className="np-submit-icon">✓</span>
            <span className="np-submit-text">ส่งคำตอบ</span>
          </button>
        ) : (
          <button className="np-btn np-next np-submit-placeholder" onClick={() => { SFX.next(); onNext(); }}>
            <span className="np-next-icon">→</span>
          </button>
        )}
      </div>
    </div>
  );
}

const numpadCSS = `
  .np-container {
    margin-top: 16px;
    padding: 0 4px;
    max-width: 380px;
    margin-left: auto;
    margin-right: auto;
  }

  .np-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 6px;
  }

  .np-btn {
    height: 56px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #1e293b;
    font-size: 22px;
    font-weight: 700;
    border-radius: 14px;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    transition: all 0.1s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03);
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    touch-action: manipulation;
  }

  .np-btn:hover {
    background: #f8fafc;
    border-color: #2563eb;
    box-shadow: 0 2px 8px rgba(37,99,235,0.12);
  }

  .np-btn:active {
    transform: scale(0.93);
    background: #dbeafe;
    box-shadow: none;
  }

  /* Zero - spans 2 columns */
  .np-zero {
    grid-column: span 2;
  }

  /* Delete */
  .np-del {
    background: #fef2f2;
    color: #ef4444;
    border-color: #fecaca;
    font-size: 20px;
  }
  .np-del:hover { background: #fee2e2; border-color: #ef4444; }
  .np-del:active { background: #fecaca; }

  /* Plus/Minus toggle */
  .np-minus {
    background: #f8fafc;
    color: #2563eb;
    border-color: #dbeafe;
    font-size: 20px;
  }
  .np-minus:hover { background: #dbeafe; border-color: #2563eb; }
  .np-minus:active { background: #bfdbfe; }
  .np-minus-label { font-size: 20px; font-weight: 800; }

  /* Next */
  .np-next {
    background: #f8fafc;
    color: #64748b;
    border-color: #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
  }
  .np-next:hover { background: #e2e8f0; color: #2563eb; border-color: #2563eb; }
  .np-next:active { background: #dbeafe; }
  .np-next-icon { font-size: 18px; line-height: 1; }
  .np-next-text { font-size: 9px; font-family: 'Noto Sans Thai', sans-serif; font-weight: 600; line-height: 1; }

  /* Submit */
  .np-submit {
    grid-column: span 2;
    background: #2563eb !important;
    color: white !important;
    border-color: #2563eb !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(37,99,235,0.3);
  }
  .np-submit:hover {
    background: #1d4ed8 !important;
    box-shadow: 0 4px 12px rgba(37,99,235,0.4);
  }
  .np-submit:active {
    background: #1e40af !important;
    transform: scale(0.97);
  }
  .np-submit-icon { font-size: 20px; }
  .np-submit-text { font-size: 14px; font-family: 'Noto Sans Thai', sans-serif; font-weight: 700; }

  .np-submit-placeholder {
    grid-column: span 2;
  }

  /* Responsive - bigger on mobile */
  @media (max-width: 480px) {
    .np-container { max-width: 100%; padding: 0 8px; }
    .np-btn { height: 52px; font-size: 20px; border-radius: 12px; }
    .np-grid { gap: 5px; }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .np-container { max-width: 360px; }
    .np-btn { height: 58px; font-size: 24px; }
  }

  @media (min-width: 769px) {
    .np-container { max-width: 340px; }
    .np-btn { height: 54px; }
  }
`;