"use client";
import NumPad from "@/components/game/NumPad";
import { renderVarLabel, renderTermInput } from "@/lib/polynomial";
import { DIAG_COLORS } from "@/lib/gameConfig";

const getDiagColor = (idx) => DIAG_COLORS[idx % DIAG_COLORS.length];

export default function DiagonalStep({
  poly1, poly2, deg1, deg2,
  correctGrid, diagonalGroups,
  diagValues, focusedCell, highlightDiag,
  onCellFocus, onDiagHover,
  onInput, onDelete, onNext, onSubmit,
  getCellVarLabel,
}) {
  return (
    <>
      <p className="instruction">
        {/* แก้ไขจุดที่ 1: เปลี่ยนตัวอย่างในคำแนะนำ */}
        มาร์คสีแนวทแยง — บวกพจน์สีเดียวกัน แล้วกรอกคำตอบเต็ม เช่น <b>3x<sup>2</sup></b>
      </p>

      {/* Grid with diagonal colors */}
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
                    const diagIdx = i + j;
                    const isHL = highlightDiag === diagIdx;
                    const dc = getDiagColor(diagIdx);
                    const power = (deg1 - i) + (deg2 - j);
                    const coeff = correctGrid[`${i}-${j}`];

                    // Render the filled cell value with variable
                    const cellDisplay = (() => {
                      const absC = Math.abs(coeff);
                      const sign = coeff < 0 ? "−" : "";
                      if (power === 0) return <span>{sign}{absC}</span>;
                      if (power === 1) return <span>{sign}{absC === 1 ? "" : absC}<i>x</i></span>;
                      return <span>{sign}{absC === 1 ? "" : absC}<i>x</i><sup>{power}</sup></span>;
                    })();

                    return (
                      <td
                        key={j}
                        className="td-cell td-diag"
                        style={{
                          background: isHL ? `${dc}25` : `${dc}0D`,
                          borderColor: dc,
                          boxShadow: isHL ? `0 0 0 2px ${dc}` : "none",
                        }}
                        onMouseEnter={() => onDiagHover(diagIdx)}
                        onClick={() => { onCellFocus(`d-${diagIdx}`); onDiagHover(diagIdx); }}
                      >
                        <div className="cell-filled">
                          <span style={{ color: "#1e293b", fontWeight: 700, fontSize: 15 }}>
                            {cellDisplay}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Answer inputs — full term */}
      <div className="diag-answer-section">
        {/* แก้ไขจุดที่ 2: เปลี่ยนตัวอย่างใน Label ส่วนกรอกคำตอบ */}
        <div className="diag-answer-label">
          กรอกคำตอบเต็ม เช่น 3x<sup>2</sup> (ดีกรีสูง → ต่ำ)
        </div>
        <div className="diag-answer-row">
          {diagonalGroups.map((_, d) => {
            const dc = getDiagColor(d);
            const isFoc = focusedCell === `d-${d}`;
            const raw = diagValues[d] ?? "";
            return (
              <div
                key={d}
                className={`diag-input-wrap ${isFoc ? "diag-focused" : ""}`}
                onClick={() => onCellFocus(`d-${d}`)}
              >
                <div className="diag-color-dot" style={{ background: dc }} />
                <div
                  className="diag-input-term"
                  style={{ borderColor: isFoc ? dc : "#d1d5db" }}
                >
                  {raw ? (
                    <span className="diag-term-value">{renderTermInput(raw)}</span>
                  ) : (
                    <span className="diag-term-placeholder">?</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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