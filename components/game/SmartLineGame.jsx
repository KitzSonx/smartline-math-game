"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import "@/styles/game.css";

import { SFX, setMuted } from "@/lib/sound";
import { LEVELS, ROW_COLOR, COL_COLOR, DIAG_COLORS } from "@/lib/gameConfig";
import {
  generatePolyForLevel,
  multiplyPolynomials,
  renderPolyJSX,
  termLabel,
  getExpectedTerm,
  checkTermInput,
  parseTerm,
  renderTermInput,
} from "@/lib/polynomial";

import MenuScreen from "@/components/game/screens/MenuScreen";
import HowToScreen from "@/components/game/screens/HowToScreen";
import GameOverScreen from "@/components/game/screens/GameOverScreen";
import NumPad from "@/components/game/NumPad";
import HeadersStep from "@/components/game/steps/HeadersStep";
import GridStep from "@/components/game/steps/GridStep";
import DiagonalStep from "@/components/game/steps/DiagonalStep";
import ResultBox from "@/components/game/steps/ResultBox";

/* ─── Step config ─── */
const getStepNames = (levelIdx) => {
  const cfg = LEVELS[levelIdx];
  if (cfg.deg1 === 0 && cfg.deg2 === 0 && cfg.monomial) {
    return [{ key: "directAnswer", label: "① ตอบเลย" }];
  }
  return [
    { key: "headers", label: "① ใส่สัมประสิทธิ์" },
    { key: "grid", label: "② คูณตาราง" },
    { key: "diagonal", label: "③ แนวทแยง + คำตอบ" },
  ];
};

const getDiagColor = (idx) => DIAG_COLORS[idx % DIAG_COLORS.length];

export default function SmartLineGame() {
  const [screen, setScreen] = useState("menu");
  const [level, setLevel] = useState(0);
  const [poly1, setPoly1] = useState([]);
  const [poly2, setPoly2] = useState([]);

  const [headerRowValues, setHeaderRowValues] = useState({});
  const [headerColValues, setHeaderColValues] = useState({});
  const [gridValues, setGridValues] = useState({});
  const [diagValues, setDiagValues] = useState({});
  const [directAnswerValue, setDirectAnswerValue] = useState("");

  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestTimes, setBestTimes] = useState({});
  const [bestScores, setBestScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultCorrect, setResultCorrect] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [step, setStep] = useState("headers");
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState([]);
  const [focusedCell, setFocusedCell] = useState(null);
  const [highlightDiag, setHighlightDiag] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [lastSolveTime, setLastSolveTime] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [userRows, setUserRows] = useState(2);
  const [userCols, setUserCols] = useState(2);
  const timerRef = useRef(null);
  const [mistakes, setMistakes] = useState(0); 
  const MAX_MISTAKES = 3; // ตั้งค่าสูงสุดไว้ที่ 3 ครั้ง
  const [gameOverReason, setGameOverReason] = useState(""); // เก็บค่า "time" หรือ "mistakes"

  /* ── localStorage ── */
  useEffect(() => {
    try {
      setBestTimes(JSON.parse(localStorage.getItem("smartline_bestTimes") || "{}"));
      setBestScores(JSON.parse(localStorage.getItem("smartline_bestScores") || "{}"));
    } catch (e) {}
  }, []);

  const saveBest = (lvl, time, sc) => {
    const newBT = { ...bestTimes };
    const newBS = { ...bestScores };
    if (!newBT[lvl] || time < newBT[lvl]) newBT[lvl] = time;
    if (!newBS[lvl] || sc > newBS[lvl]) newBS[lvl] = sc;
    setBestTimes(newBT);
    setBestScores(newBS);
    try {
      localStorage.setItem("smartline_bestTimes", JSON.stringify(newBT));
      localStorage.setItem("smartline_bestScores", JSON.stringify(newBS));
    } catch (e) {}
  };

  /* ── timer ── */
  useEffect(() => {
    if (isRunning && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(timerRef.current);
    }
    if (timer <= 0 && isRunning) {
      setIsRunning(false);
      SFX.timeUp();
      setGameOverReason("time");
      setScreen("gameover");
    }
  }, [isRunning, timer]);

  useEffect(() => {
    if (isRunning && timer > 0 && timer <= 10) SFX.timerWarn();
  }, [timer, isRunning]);

  /* ── keyboard ── */
  useEffect(() => {
    const handler = (e) => {
      if (screen !== "game" || showResult) return;
      if (!focusedCell) return;
      if (e.key >= "0" && e.key <= "9") { SFX.tap(); handleNumpadInput(e.key); }
      else if (e.key === "-") { SFX.tap(); handleNumpadInput("-"); }
      else if (e.key === "x") { SFX.tap(); handleNumpadInput("x"); }
      else if (e.key === "^") { SFX.tap(); handleNumpadInput("^"); }
      else if (e.key === "Backspace") { SFX.del(); handleNumpadDelete(); }
      else if (e.key === "Tab" || e.key === "Enter") { e.preventDefault(); SFX.next(); handleNumpadNext(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  /* ═══ DERIVED ═══ */
  const deg1 = poly1.length > 0 ? poly1.length - 1 : 0;
  const deg2 = poly2.length > 0 ? poly2.length - 1 : 0;

  const getGridLength = (poly) => {
    if (!poly || poly.length === 0) return 0;
    let len = poly.length;
    while (len > 1 && poly[len - 1] === 0) {
      len--;
    }
    return len;
  };

  const rows = getGridLength(poly1);
  const cols = getGridLength(poly2);

  const correctGrid = {};
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      correctGrid[`${r}-${c}`] = poly1[r] * poly2[c];

  const numDiags = rows + cols - 1;
  const diagonalGroups = [];
  for (let d = 0; d < numDiags; d++) {
    const cells = [];
    for (let r = 0; r < rows; r++) {
      const c2 = d - r;
      if (c2 >= 0 && c2 < cols) cells.push(`${r}-${c2}`);
    }
    diagonalGroups.push(cells);
  }

  const correctDiagSums = diagonalGroups.map((cells) =>
    cells.reduce((sum, key) => sum + correctGrid[key], 0)
  );

  const getCellVarLabel = (r, c) => termLabel((deg1 - r) + (deg2 - c));

  /* ═══ NAVIGATION ═══ */
  const getAllCellKeys = () => {
    if (step === "directAnswer") return ["ans-0"];
    if (step === "headers") {
      const keys = [];
      for (let r = 0; r < userRows; r++) keys.push(`r-${r}`);
      for (let c = 0; c < userCols; c++) keys.push(`c-${c}`);
      return keys;
    }
    if (step === "grid") {
      const keys = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) keys.push(`g-${r}-${c}`);
      return keys;
    }
    return diagonalGroups.map((_, d) => `d-${d}`);
  };

  const getSetterForCell = (cellKey) => {
    if (cellKey === "ans-0") {
      return { get: () => directAnswerValue, set: (v) => setDirectAnswerValue(v) };
    }
    if (cellKey.startsWith("r-")) {
      const idx = parseInt(cellKey.slice(2));
      return { get: () => headerRowValues[idx] || "", set: (v) => setHeaderRowValues((p) => ({ ...p, [idx]: v })) };
    }
    if (cellKey.startsWith("c-")) {
      const idx = parseInt(cellKey.slice(2));
      return { get: () => headerColValues[idx] || "", set: (v) => setHeaderColValues((p) => ({ ...p, [idx]: v })) };
    }
    if (cellKey.startsWith("g-")) {
      const key = cellKey.slice(2);
      return { get: () => gridValues[key] || "", set: (v) => setGridValues((p) => ({ ...p, [key]: v })) };
    }
    if (cellKey.startsWith("d-")) {
      const idx = parseInt(cellKey.slice(2));
      return { get: () => diagValues[idx] || "", set: (v) => setDiagValues((p) => ({ ...p, [idx]: v })) };
    }
    return null;
  };

  /* ═══ NUMPAD HANDLERS ═══ */
  const handleNumpadInput = (val) => {
    if (!focusedCell) return;
    const s = getSetterForCell(focusedCell);
    if (!s) return;
    const cur = s.get();
    if (val === "-") {
      s.set(cur.startsWith("-") ? cur.slice(1) : "-" + cur);
    } else if (val === "x") {
      if (!cur.includes("x")) s.set(cur + "x");
    } else if (val === "^") {
      if (cur.includes("x") && !cur.includes("^")) s.set(cur + "^");
    } else {
      s.set(cur + val);
    }
  };

  const handleNumpadDelete = () => {
    if (!focusedCell) return;
    const s = getSetterForCell(focusedCell);
    if (!s) return;
    s.set(s.get().slice(0, -1));
  };

  const handleNumpadNext = () => {
    const keys = getAllCellKeys();
    const curIdx = keys.indexOf(focusedCell);
    if (curIdx < keys.length - 1) {
      const next = keys[curIdx + 1];
      setFocusedCell(next);
      if (next.startsWith("d-")) setHighlightDiag(parseInt(next.slice(2)));
      else setHighlightDiag(null);
    }
  };

  const handleCellFocus = (key) => {
    setFocusedCell(key);
    if (key.startsWith("d-")) setHighlightDiag(parseInt(key.slice(2)));
    else setHighlightDiag(null);
  };

  /* ═══ GAME ACTIONS ═══ */
  const spawnParticles = (count = 12) => {
    const arr = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i, x: 30 + Math.random() * 40, y: 30 + Math.random() * 40,
      dx: (Math.random() - 0.5) * 250, dy: (Math.random() - 0.5) * 250,
      size: 6 + Math.random() * 10, hue: Math.random() * 360,
    }));
    setParticles(arr);
    setTimeout(() => setParticles([]), 900);
  };

  const doShake = () => { SFX.shake(); setShake(true); setTimeout(() => setShake(false), 500); };

  const generateQuestion = useCallback((lvl) => {
    const cfg = LEVELS[lvl];
    const p1 = generatePolyForLevel(cfg.deg1, lvl, cfg.monomial);
    const p2 = generatePolyForLevel(cfg.deg2, lvl, cfg.monomial);
    setPoly1(p1);
    setPoly2(p2);
    setCorrectAnswer(multiplyPolynomials(p1, p2));
    setHeaderRowValues({});
    setHeaderColValues({});
    setGridValues({});
    setDiagValues({});
    setDirectAnswerValue("");
    setUserRows(2);
    setUserCols(2);
    setShowResult(false);
    setHighlightDiag(null);
    setQuestionStartTime(Date.now());
    setLastSolveTime(null);

    const isDirectAnswer = cfg.deg1 === 0 && cfg.deg2 === 0 && cfg.monomial;
    if (isDirectAnswer) {
      setStep("directAnswer");
      setFocusedCell("ans-0");
    } else {
      setStep("headers");
      setFocusedCell("r-0");
    }
  }, []);

  const startGame = (lvl) => {
    SFX.gameStart();
    setLevel(lvl);
    setScore(0);
    setCombo(0);
    setMistakes(0);
    setQuestionsAnswered(0);
    setTotalCorrect(0);
    setTimer(LEVELS[lvl].time);
    setIsRunning(true);
    generateQuestion(lvl);
    setScreen("game");
  };

  /* ── Award helper ── */
  const awardResult = (isCorrect, solveTime) => {
    if (isCorrect) {
      // --- กรณีตอบถูก (เหมือนเดิม) ---
      setQuestionsAnswered((q) => q + 1);
      setLastSolveTime(solveTime);
      const earned = (level + 1) * 100 + Math.max(0, timer) * 2 + combo * 50;
      setScore((s) => s + earned);
      setCombo((c) => c + 1);
      setTotalCorrect((t) => t + 1);
      setResultCorrect(true);
      saveBest(level, solveTime, score + earned);
      spawnParticles(24);
      SFX.correct();
      if (combo > 0) SFX.combo();
      setShowResult(true); // แสดงหน้า ResultBox เพื่อไปข้อต่อไป
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setCombo(0);
      doShake();
      SFX.wrong();

      if (newMistakes >= MAX_MISTAKES) {
      setIsRunning(false);
      SFX.timeUp(); // ถ้ามีเสียง game over แยกก็ใส่ตรงนี้ได้เลยครับ
      setGameOverReason("mistakes"); // ✅ บอกว่าจบเพราะผิดเกินกำหนด
      setScreen("gameover");
    } else {
        // 💪 BUFF: ยังไม่ตาย ให้แก้ตัวใหม่ในข้อเดิม
        // ไม่ต้องสั่ง setShowResult(true) ระบบจะยังค้างอยู่ที่หน้าเดิมให้ผู้เล่นลบเลขแก้ใหม่
        // คุณอาจจะเพิ่ม UI เล็กๆ บอกว่า "ลองใหม่อีกครั้ง!" ได้ที่นี่
      }
    }
  };

  /* ── Checkers ── */
  const checkHeaders = () => {
    // 1. ตรวจสอบว่าผู้เล่นตั้งขนาดตารางถูกหรือไม่
    if (userRows !== rows || userCols !== cols) {
      doShake();
      return;
    }

    // 2. ถ้าขนาดถูกต้อง ให้ตรวจค่าที่กรอกตามปกติ (โค้ดที่เพิ่งแก้ไปก่อนหน้านี้)
    let ok = true, filled = true;
    for (let r = 0; r < rows; r++) {
      const v = headerRowValues[r];
      if (!v || v === "-") filled = false;
      else if (!checkTermInput(v, poly1[r], deg1 - r)) ok = false;
    }
    for (let c = 0; c < cols; c++) {
      const v = headerColValues[c];
      if (!v || v === "-") filled = false;
      else if (!checkTermInput(v, poly2[c], deg2 - c)) ok = false;
    }
    if (!filled) { doShake(); return; }
    if (ok) { SFX.stepComplete(); setStep("grid"); setFocusedCell("g-0-0"); spawnParticles(8); }
    else doShake();
  };

  const checkGrid = () => {
    let ok = true, filled = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = gridValues[`${r}-${c}`];
        if (!v || v === "-") {
          filled = false;
        } else {
          const expected = getExpectedTerm(poly1, poly2, deg1, deg2, r, c);
          if (!checkTermInput(v, expected.coeff, expected.power)) ok = false;
        }
      }
    }
    if (!filled) { doShake(); return; }
    if (ok) { SFX.stepComplete(); setStep("diagonal"); setFocusedCell("d-0"); setHighlightDiag(0); spawnParticles(10); }
    else doShake();
  };

  const checkDiagonals = () => {
    let ok = true, filled = true;
    for (let d = 0; d < numDiags; d++) {
      const v = diagValues[d];
      if (!v || v === "-") {
        filled = false;
      } else {
        const power = (deg1 + deg2) - d;
        const expectedCoeff = correctDiagSums[d];
        if (expectedCoeff === 0) {
          const parsed = parseTerm(v);
          if (!parsed || parsed.coeff !== 0) ok = false;
        } else {
          if (!checkTermInput(v, expectedCoeff, power)) ok = false;
        }
      }
    }
    if (!filled) { doShake(); return; }
    const solveTime = Math.round((Date.now() - questionStartTime) / 1000);
    awardResult(ok, solveTime);
  };

  const checkDirectAnswer = () => {
    if (!directAnswerValue || directAnswerValue === "-") { doShake(); return; }
    const deg = correctAnswer.length - 1;
    let expectedCoeff = 0, expectedPower = 0;
    for (let i = 0; i < correctAnswer.length; i++) {
      if (correctAnswer[i] !== 0) {
        expectedCoeff = correctAnswer[i];
        expectedPower = deg - i;
        break;
      }
    }
    const solveTime = Math.round((Date.now() - questionStartTime) / 1000);
    const isOk = checkTermInput(directAnswerValue, expectedCoeff, expectedPower);
    awardResult(isOk, solveTime);
  };

  const nextQuestion = () => generateQuestion(level);

  const formatTime = (s) => {
    if (s < 0) s = 0;
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  /* ═══ SCREENS ═══ */
  if (screen === "menu") {
    return <MenuScreen bestScores={bestScores} bestTimes={bestTimes} onStart={startGame} onHowTo={() => setScreen("howto")} />;
  }
  if (screen === "howto") {
    return <HowToScreen onBack={() => setScreen("menu")} />;
  }
  if (screen === "gameover") {
    return <GameOverScreen 
      score={score} totalCorrect={totalCorrect} 
      questionsAnswered={questionsAnswered} level={level} 
      bestTimes={bestTimes} bestScores={bestScores} 
      onRestart={() => startGame(level)} onMenu={() => setScreen("menu")} 
      reason={gameOverReason}
    />;
  }

  /* ═══ GAME RENDER ═══ */
  const lv = LEVELS[level];
  const timerPct = (timer / lv.time) * 100;
  const timerColor = timer > 30 ? "#16a34a" : timer > 10 ? "#f59e0b" : "#ef4444";
  const stepNames = getStepNames(level);
  const currentStepIdx = stepNames.findIndex((s) => s.key === step);

  return (
    <div className="app-container">
      {particles.map((p) => (
        <div key={p.id} className="particle" style={{
          left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
          background: `hsl(${p.hue}, 75%, 55%)`, "--dx": `${p.dx}px`, "--dy": `${p.dy}px`,
        }} />
      ))}

      {/* Header */}
      <div className="game-header">
        <button className="close-btn" onClick={() => { setIsRunning(false); setScreen("menu"); }}>✕</button>
        <div className="header-mistakes">
          Mistakes: <span className={mistakes > 0 ? "text-red" : ""}>{mistakes}</span>/{MAX_MISTAKES}
        </div>
        <button className="sound-btn" onClick={() => { const next = !soundOn; setSoundOn(next); setMuted(!next); if (next) SFX.tap(); }}>
          {soundOn ? "🔊" : "🔇"}
        </button>
        <div className="header-mid">
          <span className="header-level">{lv.emoji} {lv.name}</span>
          <div className="timer-bar"><div className="timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} /></div>
          <span className="timer-text" style={{ color: timerColor }}>{formatTime(timer)}</span>
        </div>
        <div className="header-score">
          <div className="score-num">{score}</div>
          {combo > 1 && <div className="combo-badge">×{combo}</div>}
        </div>
      </div>

      {/* Question */}
      <div className="question-bar">
        <div className="q-label">โจทย์</div>

        {/* ใช้ flex หุ้มกรอบนอกสุด และใส่ gap: '8px' เพื่อให้มีระยะห่างระหว่าง 2 วงเล็บ */}
        <div className="q-poly" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          
          {/* เอา display: 'inline-flex' ออกไป เพื่อให้การเว้นวรรคของ Text กลับมาทำงานปกติ */}
          <span style={{ color: ROW_COLOR, lineHeight: '1.5' }}>
            <span className="q-bracket">(</span>
            {renderPolyJSX(poly1)}
            <span className="q-bracket">)</span>
          </span>

          <span style={{ color: COL_COLOR, lineHeight: '1.5' }}>
            <span className="q-bracket">(</span>
            {renderPolyJSX(poly2)}
            <span className="q-bracket">)</span>
          </span>
          
        </div>

        {step === "headers" && (
          <div className="q-hint">
            <span style={{ color: ROW_COLOR }}>■</span> วงเล็บแรก → หัวแถว
            &nbsp;&nbsp;
            <span style={{ color: COL_COLOR }}>■</span> วงเล็บสอง → หัวคอลัมน์
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="step-bar">
        {stepNames.map((s, i) => (
          <div key={s.key} className="step-bar-item">
            {i > 0 && <span className="step-arrow">→</span>}
            <div className={`step-tag ${i === currentStepIdx ? "step-active" : i < currentStepIdx ? "step-done" : ""}`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Game Area */}
      <div className={`game-area ${shake ? "shake" : ""}`}>

        {step === "headers" && (
          <HeadersStep
            // ✅ เติม .slice(0, rows) และ .slice(0, cols)
            poly1={poly1.slice(0, rows)} poly2={poly2.slice(0, cols)} deg1={deg1} deg2={deg2}
            headerRowValues={headerRowValues} headerColValues={headerColValues}
            focusedCell={focusedCell} onCellFocus={handleCellFocus}
            onInput={handleNumpadInput} onDelete={handleNumpadDelete}
            onNext={handleNumpadNext} onSubmit={checkHeaders}
            getCellVarLabel={getCellVarLabel}
            userRows={userRows} userCols={userCols}
            setUserRows={setUserRows} setUserCols={setUserCols}
          />
        )}

        {step === "grid" && (
          <GridStep
            // ✅ เติม .slice(0, rows) และ .slice(0, cols)
            poly1={poly1.slice(0, rows)} poly2={poly2.slice(0, cols)} deg1={deg1} deg2={deg2}
            gridValues={gridValues} focusedCell={focusedCell}
            onCellFocus={handleCellFocus}
            onInput={handleNumpadInput} onDelete={handleNumpadDelete}
            onNext={handleNumpadNext} onSubmit={checkGrid}
            getCellVarLabel={getCellVarLabel}
          />
        )}

        {step === "diagonal" && !showResult && (
          <DiagonalStep
            // ✅ เติม .slice(0, rows) และ .slice(0, cols)
            poly1={poly1.slice(0, rows)} poly2={poly2.slice(0, cols)} deg1={deg1} deg2={deg2}
            correctGrid={correctGrid} diagonalGroups={diagonalGroups}
            diagValues={diagValues} focusedCell={focusedCell}
            highlightDiag={highlightDiag} onCellFocus={handleCellFocus}
            onDiagHover={setHighlightDiag}
            onInput={handleNumpadInput} onDelete={handleNumpadDelete}
            onNext={handleNumpadNext} onSubmit={checkDiagonals}
            getCellVarLabel={getCellVarLabel}
          />
        )}

        {step === "directAnswer" && !showResult && (
          <div className="direct-answer-wrap">
            <p className="instruction">คูณเอกนาม 2 ตัว แล้วกรอกคำตอบเลย เช่น <b>6x^2</b> หรือ <b>-15x</b> หรือ <b>12</b></p>
            <div className="direct-answer-box">
              <div className="direct-answer-label">คำตอบ</div>
              <div
                className={`direct-answer-input ${focusedCell === "ans-0" ? "da-focused" : ""}`}
                onClick={() => handleCellFocus("ans-0")}
              >
                <span className="da-value">
                  {directAnswerValue ? renderTermInput(directAnswerValue) : <span className="da-placeholder">?</span>}
                </span>
                {focusedCell === "ans-0" && <div className="cell-cursor" />}
              </div>
            </div>
            <NumPad
              onInput={handleNumpadInput} onDelete={handleNumpadDelete}
              onNext={handleNumpadNext} onSubmit={checkDirectAnswer} showSubmit
            />
          </div>
        )}

        {showResult && (
          <ResultBox
            resultCorrect={resultCorrect} correctAnswer={correctAnswer}
            lastSolveTime={lastSolveTime} level={level}
            timer={timer} combo={combo} onNext={nextQuestion}
          />
        )}
      </div>
    </div>
  );
}