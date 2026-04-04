"use client";
import { SFX } from "@/lib/sound";

export default function NumPad({ onInput, onDelete, onNext, onSubmit, showSubmit }) {
  return (
    <div className="np-container">
      <style>{numpadCSS}</style>
      <div className="np-grid">
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("7"); }}>7</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("8"); }}>8</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("9"); }}>9</button>
        <button className="np-btn np-del" onClick={() => { SFX.del(); onDelete(); }}>⌫</button>

        <button className="np-btn" onClick={() => { SFX.tap(); onInput("4"); }}>4</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("5"); }}>5</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("6"); }}>6</button>
        <button className="np-btn np-minus" onClick={() => { SFX.tap(); onInput("-"); }}>
          <span className="np-minus-label">−</span>
        </button>

        <button className="np-btn" onClick={() => { SFX.tap(); onInput("1"); }}>1</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("2"); }}>2</button>
        <button className="np-btn" onClick={() => { SFX.tap(); onInput("3"); }}>3</button>
        <button className="np-btn np-next" onClick={() => { SFX.next(); onNext(); }}>
          <span className="np-next-icon">→</span>
          <span className="np-next-text">ถัดไป</span>
        </button>

        <button className="np-btn" onClick={() => { SFX.tap(); onInput("0"); }}>0</button>
        <button className="np-btn np-var" onClick={() => { SFX.tap(); onInput("x"); }}>
          x
        </button>
        <button className="np-btn np-pow" onClick={() => { SFX.tap(); onInput("^"); }}>
          x<sup>n</sup>
        </button>
        <button className="np-btn np-empty" disabled></button>

        {showSubmit && (
          <button className="np-btn np-submit-full" onClick={() => { SFX.submit(); onSubmit(); }}>
            <span className="np-submit-icon">✓</span>
            <span className="np-submit-text">ส่งคำตอบ</span>
          </button>
        )}
      </div>
    </div>
  );
}

const numpadCSS = `
  .np-container { margin-top: 16px; padding: 0 4px; max-width: 380px; margin-left: auto; margin-right: auto; }
  .np-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px; }
  .np-btn {
    height: 56px; border: 1px solid #e2e8f0; background: white; color: #1e293b;
    font-size: 22px; font-weight: 700; border-radius: 14px; cursor: pointer;
    font-family: 'JetBrains Mono', monospace; transition: all 0.1s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03);
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent; user-select: none; touch-action: manipulation;
  }
  .np-btn:hover { background: #f8fafc; border-color: #2563eb; box-shadow: 0 2px 8px rgba(37,99,235,0.12); }
  .np-btn:active { transform: scale(0.93); background: #dbeafe; box-shadow: none; }
  .np-btn:disabled { opacity: 0; cursor: default; box-shadow: none; border-color: transparent; background: transparent; }

  .np-del { background: #fef2f2; color: #ef4444; border-color: #fecaca; font-size: 26px; }
  .np-del:hover { background: #fee2e2; border-color: #ef4444; }
  .np-del:active { background: #fecaca; }

  .np-minus { background: #f8fafc; color: #334155; border-color: #e2e8f0; }
  .np-minus:hover { background: #e2e8f0; border-color: #2563eb; color: #2563eb; }
  .np-minus:active { background: #dbeafe; }
  .np-minus-label { font-size: 32px; font-weight: 800; line-height: 0.8; }

  /* ─── อัปเดตสไตล์ปุ่ม x และ x^n ให้คุมโทน ─── */
  .np-var { 
    background: #f8fafc; color: #334155; border-color: #e2e8f0; 
    font-size: 24px; font-style: italic; font-family: 'Times New Roman', Times, serif; 
  }
  .np-var:hover { background: #e2e8f0; border-color: #2563eb; color: #2563eb; }
  .np-var:active { background: #dbeafe; }

  .np-pow { 
    background: #f8fafc; color: #334155; border-color: #e2e8f0; 
    font-size: 22px; font-style: italic; font-family: 'Times New Roman', Times, serif; 
  }
  .np-pow:hover { background: #e2e8f0; border-color: #2563eb; color: #2563eb; }
  .np-pow:active { background: #dbeafe; }
  .np-pow sup { 
    font-size: 13px; font-style: normal; font-family: 'JetBrains Mono', monospace; 
    margin-left: 2px; margin-top: -8px; font-weight: 800;
  }

  .np-next {
    background: #f8fafc; color: #64748b; border-color: #e2e8f0;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0;
  }
  .np-next:hover { background: #e2e8f0; color: #2563eb; border-color: #2563eb; }
  .np-next:active { background: #dbeafe; }
  .np-next-icon { font-size: 26px; font-weight: bold; line-height: 1; }
  .np-next-text { font-size: 11px; font-family: 'Noto Sans Thai', sans-serif; font-weight: 700; line-height: 1; margin-top: 2px; }

  .np-empty { border: none !important; background: transparent !important; box-shadow: none !important; }

  .np-submit-full {
    grid-column: span 4; height: 50px;
    background: #2563eb !important; color: white !important; border-color: #2563eb !important;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 2px 8px rgba(37,99,235,0.3);
  }
  .np-submit-full:hover { background: #1d4ed8 !important; box-shadow: 0 4px 12px rgba(37,99,235,0.4); }
  .np-submit-full:active { background: #1e40af !important; transform: scale(0.97); }
  .np-submit-icon { font-size: 20px; }
  .np-submit-text { font-size: 14px; font-family: 'Noto Sans Thai', sans-serif; font-weight: 700; }

  @media (max-width: 480px) { .np-container { max-width: 100%; padding: 0 8px; } .np-btn { height: 52px; font-size: 20px; border-radius: 12px; } .np-grid { gap: 5px; } }
  @media (min-width: 481px) and (max-width: 768px) { .np-container { max-width: 360px; } .np-btn { height: 58px; font-size: 24px; } }
  @media (min-width: 769px) { .np-container { max-width: 340px; } .np-btn { height: 54px; } }
`;