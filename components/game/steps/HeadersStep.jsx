"use client";
import NumPad from "@/components/game/NumPad";
import { ROW_COLOR, COL_COLOR } from "@/lib/gameConfig";
import { renderTermInput } from "@/lib/polynomial";

export default function HeadersStep({
  headerRowValues, headerColValues,
  focusedCell, onCellFocus,
  onInput, onDelete, onNext, onSubmit,
  userRows, userCols, setUserRows, setUserCols
}) {
  return (
    <>
      <p className="instruction">
        {/* แก้ไขจุดนี้: เปลี่ยน ^ ให้เป็น sup */}
        ปรับขนาดตารางให้ตรงกับโจทย์ แล้วนำพจน์มาใส่ให้ครบ (เช่น 3x<sup>2</sup>)
      </p>

      <div className="grid-scroll">
        <table className="game-table">
          <thead>
            <tr>
              <th className="th-corner">คูณ</th>
              {Array.from({ length: userCols }, (_, j) => {
                const ck = `c-${j}`;
                const isFoc = focusedCell === ck;
                const rawVal = headerColValues[j] || "";
                return (
                  <th key={j} className={`th-header-input ${isFoc ? "th-focused-col" : ""}`} onClick={() => onCellFocus(ck)}>
                    <div className="header-cell">
                      {rawVal ? <span className="header-val" style={{ color: COL_COLOR }}>{renderTermInput(rawVal)}</span> : <span className="cell-placeholder">?</span>}
                      {isFoc && <div className="cell-cursor" style={{ background: COL_COLOR }} />}
                    </div>
                  </th>
                );
              })}
              
              <th className="table-control-cell">
                <div className="table-btn-group">
                  <button className="table-add-btn" onClick={() => setUserCols(Math.max(1, userCols - 1))}>-</button>
                  <button className="table-add-btn" onClick={() => setUserCols(userCols + 1)}>+</button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: userRows }, (_, i) => {
              const rk = `r-${i}`;
              const isFoc = focusedCell === rk;
              const rawVal = headerRowValues[i] || "";
              return (
                <tr key={i}>
                  <td className={`th-header-input ${isFoc ? "th-focused-row" : ""}`} onClick={() => onCellFocus(rk)}>
                    <div className="header-cell">
                      {rawVal ? <span className="header-val" style={{ color: ROW_COLOR }}>{renderTermInput(rawVal)}</span> : <span className="cell-placeholder">?</span>}
                      {isFoc && <div className="cell-cursor" style={{ background: ROW_COLOR }} />}
                    </div>
                  </td>
                  {Array.from({ length: userCols }, (_, j) => (
                    <td key={j} className="td-cell td-empty">
                      <div className="cell-inner">
                        <span className="cell-placeholder-dim">&middot;</span>
                      </div>
                    </td>
                  ))}
                  <td className="table-control-empty"></td>
                </tr>
              );
            })}
            
            <tr>
              <td className="table-control-cell">
                <div className="table-btn-group">
                  <button className="table-add-btn" onClick={() => setUserRows(Math.max(1, userRows - 1))}>-</button>
                  <button className="table-add-btn" onClick={() => setUserRows(userRows + 1)}>+</button>
                </div>
              </td>
              <td colSpan={userCols + 1} className="table-control-empty"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <NumPad onInput={onInput} onDelete={onDelete} onNext={onNext} onSubmit={onSubmit} showSubmit />
    </>
  );
}