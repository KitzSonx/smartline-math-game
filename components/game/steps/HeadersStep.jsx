"use client";
import NumPad from "@/components/game/NumPad";
import { ROW_COLOR, COL_COLOR } from "@/lib/gameConfig";
import { renderVarLabel } from "@/lib/polynomial";

export default function HeadersStep({
  poly1, poly2, deg1, deg2,
  headerRowValues, headerColValues,
  focusedCell,
  onCellFocus,
  onInput, onDelete, onNext, onSubmit,
  getCellVarLabel,
}) {
  const rows = poly1.length;
  const cols = poly2.length;

  return (
    <>
      <p className="instruction">
        นำสัมประสิทธิ์จากโจทย์ไปใส่ในหัวตาราง —
        <span style={{ color: ROW_COLOR, fontWeight: 700 }}> แดง</span> = แนวแถว (ซ้าย),
        <span style={{ color: COL_COLOR, fontWeight: 700 }}> น้ำเงิน</span> = แนวคอลัมน์ (บน)
      </p>

      <div className="grid-scroll">
        <table className="game-table">
          <thead>
            <tr>
              <th className="th-corner">×</th>
              {Array.from({ length: cols }, (_, j) => {
                const pw  = deg2 - j;
                const ck  = `c-${j}`;
                const isFoc = focusedCell === ck;
                return (
                  <th
                    key={j}
                    className={`th-header-input ${isFoc ? "th-focused-col" : ""}`}
                    onClick={() => onCellFocus(ck)}
                  >
                    <div className="header-cell">
                      <span className="header-val" style={{ color: COL_COLOR }}>
                        {headerColValues[j] || ""}
                      </span>
                      {pw > 0 && (
                        <span className="header-var" style={{ color: COL_COLOR }}>
                          {pw === 1 ? <i>x</i> : <><i>x</i><sup>{pw}</sup></>}
                        </span>
                      )}
                      {isFoc && <div className="cell-cursor" style={{ background: COL_COLOR }} />}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, i) => {
              const pw1  = deg1 - i;
              const rk   = `r-${i}`;
              const isFoc = focusedCell === rk;
              return (
                <tr key={i}>
                  <td
                    className={`th-header-input ${isFoc ? "th-focused-row" : ""}`}
                    onClick={() => onCellFocus(rk)}
                  >
                    <div className="header-cell">
                      <span className="header-val" style={{ color: ROW_COLOR }}>
                        {headerRowValues[i] || ""}
                      </span>
                      {pw1 > 0 && (
                        <span className="header-var" style={{ color: ROW_COLOR }}>
                          {pw1 === 1 ? <i>x</i> : <><i>x</i><sup>{pw1}</sup></>}
                        </span>
                      )}
                      {isFoc && <div className="cell-cursor" style={{ background: ROW_COLOR }} />}
                    </div>
                  </td>
                  {Array.from({ length: cols }, (_, j) => (
                    <td key={j} className="td-cell td-empty">
                      <div className="cell-inner">
                        <span className="cell-var">{renderVarLabel(getCellVarLabel(i, j))}</span>
                      </div>
                    </td>
                  ))}
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
