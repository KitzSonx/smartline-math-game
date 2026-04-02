"use client";
import NumPad from "@/components/game/NumPad";
import { DIAG_COLORS } from "@/lib/gameConfig";
import { renderVarLabel } from "@/lib/polynomial";

export default function DiagonalStep({
  poly1, poly2, deg1, deg2,
  correctGrid, diagonalGroups,
  diagValues, focusedCell, highlightDiag,
  onCellFocus, onDiagHover,
  onInput, onDelete, onNext, onSubmit,
  getCellVarLabel,
}) {
  const getDiagColor = (idx) => DIAG_COLORS[idx % DIAG_COLORS.length];
  const numDiags = diagonalGroups.length;

  return (
    <>
      <p className="instruction">
        มาร์คสีแนวทแยง — บวกพจน์สีเดียวกัน แล้วกรอกสัมประสิทธิ์คำตอบ
      </p>

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
                    const diagIdx = i + j;
                    const isHL    = highlightDiag === diagIdx;
                    const dc      = getDiagColor(diagIdx);
                    return (
                      <td
                        key={j}
                        className="td-cell td-diag"
                        style={{
                          background:  isHL ? `${dc}25` : `${dc}0D`,
                          borderColor: dc,
                          boxShadow:   isHL ? `0 0 0 2px ${dc}` : "none",
                        }}
                        onMouseEnter={() => onDiagHover(diagIdx)}
                        onClick={() => onCellFocus(`d-${diagIdx}`)}
                      >
                        <div className="cell-filled">
                          <span style={{ color: "#1e293b", fontWeight: 700, fontSize: 16 }}>
                            {correctGrid[`${i}-${j}`]}
                          </span>
                          <span className="cell-var-small">
                            {renderVarLabel(getCellVarLabel(i, j))}
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

      {/* Diagonal answer inputs */}
      <div className="diag-answer-section">
        <div className="diag-answer-label">กรอกสัมประสิทธิ์คำตอบ (ดีกรีสูง → ต่ำ)</div>
        <div className="diag-answer-row">
          {diagonalGroups.map((_, d) => {
            const dc    = getDiagColor(d);
            const power = (deg1 + deg2) - d;
            const isFoc = focusedCell === `d-${d}`;
            return (
              <div
                key={d}
                className={`diag-input-wrap ${isFoc ? "diag-focused" : ""}`}
                onClick={() => onCellFocus(`d-${d}`)}
              >
                <div className="diag-color-dot" style={{ background: dc }} />
                <input
                  className="diag-input"
                  style={{ borderColor: isFoc ? dc : "#d1d5db" }}
                  value={diagValues[d] ?? ""}
                  readOnly
                  placeholder="?"
                />
                <span className="diag-power">
                  {power === 0
                    ? "ค่าคงที่"
                    : power === 1
                    ? <i>x</i>
                    : <><i>x</i><sup>{power}</sup></>}
                </span>
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
