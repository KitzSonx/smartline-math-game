"use client";
import NumPad from "@/components/game/NumPad";
import { renderTermInput } from "@/lib/polynomial";

export default function GridStep({
  poly1, poly2, deg1, deg2,
  gridValues, focusedCell,
  onCellFocus,
  onInput, onDelete, onNext, onSubmit,
  getCellVarLabel,
}) {
  return (
    <>
      <p className="instruction">
        {/* แก้ไขจุดนี้: เปลี่ยน ^ ให้เป็น sup */}
        คูณแต่ละคู่แล้วกรอกผลลัพธ์เต็ม เช่น <b>6x<sup>2</sup></b> หรือ <b>-3x</b> หรือ <b>5</b>
      </p>

      <div className="grid-scroll">
        <table className="game-table">
          <thead>
            <tr>
              <th className="th-corner">คูณ</th>
              {poly2.map((c, j) => {
                const pw = deg2 - j;
                return (
                  <th key={j} className="th-col">
                    <span>{c >= 0 ? c : `(${c})`}</span>
                    {pw > 0 && (
                      <span className="th-var">
                        {pw === 1 ? "x" : <>x<sup>{pw}</sup></>}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {poly1.map((r, i) => {
              const pw1 = deg1 - i;
              return (
                <tr key={i}>
                  <td className="th-row">
                    <span>{r >= 0 ? r : `(${r})`}</span>
                    {pw1 > 0 && (
                      <span className="th-var">
                        {pw1 === 1 ? "x" : <>x<sup>{pw1}</sup></>}
                      </span>
                    )}
                  </td>
                  {poly2.map((_, j) => {
                    const key = `${i}-${j}`;
                    const ck = `g-${key}`;
                    const isFoc = focusedCell === ck;
                    const raw = gridValues[key] || "";
                    return (
                      <td
                        key={j}
                        className={`td-cell ${isFoc ? "td-focused" : ""}`}
                        onClick={() => onCellFocus(ck)}
                      >
                        <div className="cell-inner cell-term">
                          {raw ? (
                            <span className="cell-value-term">
                              {renderTermInput(raw)}
                            </span>
                          ) : (
                            <span className="cell-placeholder">?</span>
                          )}
                        </div>
                        {isFoc && <div className="cell-cursor" />}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <NumPad
        onInput={onInput}
        onDelete={onDelete}
        onNext={onNext}
        onSubmit={onSubmit}
        showSubmit
      />

      <style>{`
        .cell-term { justify-content: center; min-height: 38px; padding: 4px 6px; }
        .cell-value-term { font-size: 16px; font-weight: 700; color: var(--text, #1e293b); font-family: 'JetBrains Mono', monospace; }
        .cell-value-term i { font-style: italic; }
        .cell-value-term sup { font-size: 0.65em; vertical-align: super; }
        .cell-placeholder { font-size: 16px; color: #cbd5e1; font-weight: 500; }
      `}</style>
    </>
  );
}