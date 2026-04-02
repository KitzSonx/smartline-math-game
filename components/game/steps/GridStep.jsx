"use client";
import NumPad from "@/components/game/NumPad";
import { renderVarLabel } from "@/lib/polynomial";

export default function GridStep({
  poly1, poly2, deg1, deg2,
  gridValues, focusedCell,
  onCellFocus,
  onInput, onDelete, onNext, onSubmit,
  getCellVarLabel,
}) {
  return (
    <>
      <p className="instruction">คูณสัมประสิทธิ์แต่ละคู่ แล้วกรอกตัวเลข</p>

      <div className="grid-scroll">
        <table className="game-table">
          <thead>
            <tr>
              <th className="th-corner">×</th>
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
                    const key   = `${i}-${j}`;
                    const ck    = `g-${key}`;
                    const isFoc = focusedCell === ck;
                    const vl    = getCellVarLabel(i, j);
                    return (
                      <td
                        key={j}
                        className={`td-cell ${isFoc ? "td-focused" : ""}`}
                        onClick={() => onCellFocus(ck)}
                      >
                        <div className="cell-inner">
                          <span className="cell-value">{gridValues[key] || ""}</span>
                          {vl && <span className="cell-var">{renderVarLabel(vl)}</span>}
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
    </>
  );
}
