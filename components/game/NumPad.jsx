"use client";
import { SFX } from "@/lib/sound";

export default function NumPad({ onInput, onDelete, onNext, onSubmit, showSubmit }) {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="numpad">
      <div className="numpad-row">
        {keys.slice(0, 5).map((n) => (
          <button key={n} className="numpad-btn" onClick={() => { SFX.tap(); onInput(String(n)); }}>
            {n}
          </button>
        ))}
      </div>
      <div className="numpad-row">
        {keys.slice(5, 10).map((n) => (
          <button key={n} className="numpad-btn" onClick={() => { SFX.tap(); onInput(String(n)); }}>
            {n}
          </button>
        ))}
      </div>
      <div className="numpad-row">
        <button className="numpad-btn numpad-op"     onClick={() => { SFX.tap(); onInput("+"); }}>+</button>
        <button className="numpad-btn numpad-op"     onClick={() => { SFX.tap(); onInput("-"); }}>−</button>
        <button className="numpad-btn numpad-del"    onClick={() => { SFX.del(); onDelete(); }}>⌫</button>
        <button className="numpad-btn numpad-next"   onClick={() => { SFX.next(); onNext(); }}>ถัดไป</button>
        {showSubmit && (
          <button className="numpad-btn numpad-submit" onClick={() => { SFX.submit(); onSubmit(); }}>ส่ง</button>
        )}
      </div>
    </div>
  );
}
