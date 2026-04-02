"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import "@/styles/game.css";

import { SFX, setMuted } from "@/lib/sound";
import { LEVELS, ROW_COLOR, COL_COLOR } from "@/lib/gameConfig";
import {
  generateCoefficients,
  multiplyPolynomials,
  renderPolyJSX,
  termLabel,
} from "@/lib/polynomial";

import MenuScreen    from "@/components/game/screens/MenuScreen";
import HowToScreen   from "@/components/game/screens/HowToScreen";
import GameOverScreen from "@/components/game/screens/GameOverScreen";
import HeadersStep   from "@/components/game/steps/HeadersStep";
import GridStep      from "@/components/game/steps/GridStep";
import DiagonalStep  from "@/components/game/steps/DiagonalStep";
import ResultBox     from "@/components/game/steps/ResultBox";

/* ─── Step config ─── */
const STEP_NAMES = [
  { key: "headers",  label: "① ใส่สัมประสิทธิ์" },
  { key: "grid",     label: "② คูณตาราง" },
  { key: "diagonal", label: "③ แนวทแยง + คำตอบ" },
];

export default function SmartLineGame() {
  /* ── screens ── */
  const [screen, setScreen] = useState("menu");
  const [level,  setLevel]  = useState(0);

  /* ── polynomial state ── */
  const [poly1, setPoly1] = useState([]);
  const [poly2, setPoly2] = useState([]);

  /* ── input state ── */
  const [headerRowValues, setHeaderRowValues] = useState({});
  const [headerColValues, setHeaderColValues] = useState({});
  const [gridValues,      setGridValues]      = useState({});
  const [diagValues,      setDiagValues]      = useState({});

  /* ── game progress ── */
  const [correctAnswer,      setCorrectAnswer]      = useState([]);
  const [timer,              setTimer]              = useState(0);
  const [isRunning,          setIsRunning]          = useState(false);
  const [score,              setScore]              = useState(0);
  const [combo,              setCombo]              = useState(0);
  const [bestTimes,          setBestTimes]          = useState({});
  const [bestScores,         setBestScores]         = useState({});
  const [showResult,         setShowResult]         = useState(false);
  const [resultCorrect,      setResultCorrect]      = useState(false);
  const [questionsAnswered,  setQuestionsAnswered]  = useState(0);
  const [totalCorrect,       setTotalCorrect]       = useState(0);
  const [step,               setStep]               = useState("headers");
  const [shake,              setShake]              = useState(false);
  const [particles,          setParticles]          = useState([]);
  const [focusedCell,        setFocusedCell]        = useState(null);
  const [highlightDiag,      setHighlightDiag]      = useState(null);
  const [questionStartTime,  setQuestionStartTime]  = useState(null);
  const [lastSolveTime,      setLastSolveTime]      = useState(null);
  const [soundOn,            setSoundOn]            = useState(true);

  const timerRef = useRef(null);

  /* ── load best scores from localStorage ── */
  useEffect(() => {
    try {
      const bt = JSON.parse(localStorage.getItem("smartline_bestTimes")  || "{}");
      const bs = JSON.parse(localStorage.getItem("smartline_bestScores") || "{}");
      setBestTimes(bt);
      setBestScores(bs);
    } catch (e) {}
  }, []);

  const saveBest = (lvl, time, sc) => {
    const newBT = { ...bestTimes };
    const newBS = { ...bestScores };
    if (!newBT[lvl] || time < newBT[lvl]) newBT[lvl] = time;
    if (!newBS[lvl] || sc  > newBS[lvl]) newBS[lvl] = sc;
    setBestTimes(newBT);
    setBestScores(newBS);
    try {
      localStorage.setItem("smartline_bestTimes",  JSON.stringify(newBT));
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
      setScreen("gameover");
    }
  }, [isRunning, timer]);

  /* ── timer warning beep ── */
  useEffect(() => {
    if (isRunning && timer > 0 && timer <= 10) SFX.timerWarn();
  }, [timer, isRunning]);

  /* ── keyboard input ── */
  useEffect(() => {
    const handler = (e) => {
      if (screen !== "game" || showResult) return;
      if (!focusedCell) return;
      if (e.key >= "0" && e.key <= "9") { SFX.tap(); handleNumpadInput(e.key); }
      else if (e.key === "-")           { SFX.tap(); handleNumpadInput("-"); }
      else if (e.key === "+")           { SFX.tap(); handleNumpadInput("+"); }
      else if (e.key === "Backspace")   { SFX.del(); handleNumpadDelete(); }
      else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        SFX.next();
        handleNumpadNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  /* ════════════════════════════════════════
     DERIVED VALUES
     ════════════════════════════════════════ */
  const rows    = poly1.length;
  const cols    = poly2.length;
  const deg1    = poly1.length - 1;
  const deg2    = poly2.length - 1;

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

  /* ════════════════════════════════════════
     CELL NAVIGATION
     ════════════════════════════════════════ */
  const getAllCellKeys = () => {
    if (step === "headers") {
      const keys = [];
      for (let r = 0; r < rows; r++) keys.push(`r-${r}`);
      for (let c = 0; c < cols; c++) keys.push(`c-${c}`);
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
    if (cellKey.startsWith("r-")) {
      const idx = parseInt(cellKey.slice(2));
      return {
        get: () => headerRowValues[idx] || "",
        set: (v) => setHeaderRowValues((p) => ({ ...p, [idx]: v })),
      };
    }
    if (cellKey.startsWith("c-")) {
      const idx = parseInt(cellKey.slice(2));
      return {
        get: () => headerColValues[idx] || "",
        set: (v) => setHeaderColValues((p) => ({ ...p, [idx]: v })),
      };
    }
    if (cellKey.startsWith("g-")) {
      const key = cellKey.slice(2);
      return {
        get: () => gridValues[key] || "",
        set: (v) => setGridValues((p) => ({ ...p, [key]: v })),
      };
    }
    if (cellKey.startsWith("d-")) {
      const idx = parseInt(cellKey.slice(2));
      return {
        get: () => diagValues[idx] || "",
        set: (v) => setDiagValues((p) => ({ ...p, [idx]: v })),
      };
    }
    return null;
  };

  /* ════════════════════════════════════════
     NUMPAD HANDLERS
     ════════════════════════════════════════ */
  const handleNumpadInput = (val) => {
    if (!focusedCell) return;
    const s = getSetterForCell(focusedCell);
    if (!s) return;
    const cur = s.get();
    if (val === "-")      { s.set(cur.startsWith("-") ? cur.slice(1) : "-" + cur); }
    else if (val === "+") { if (cur.startsWith("-")) s.set(cur.slice(1)); }
    else                  { s.set(cur + val); }
  };

  const handleNumpadDelete = () => {
    if (!focusedCell) return;
    const s = getSetterForCell(focusedCell);
    if (!s) return;
    s.set(s.get().slice(0, -1));
  };

  const handleNumpadNext = () => {
    const keys   = getAllCellKeys();
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

  /* ════════════════════════════════════════
     GAME ACTIONS
     ════════════════════════════════════════ */
  const spawnParticles = (count = 12) => {
    const arr = Array.from({ length: count }, (_, i) => ({
      id:   Date.now() + i,
      x:    30 + Math.random() * 40,
      y:    30 + Math.random() * 40,
      dx:   (Math.random() - 0.5) * 250,
      dy:   (Math.random() - 0.5) * 250,
      size: 6 + Math.random() * 10,
      hue:  Math.random() * 360,
    }));
    setParticles(arr);
    setTimeout(() => setParticles([]), 900);
  };

  const doShake = () => {
    SFX.shake();
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const generateQuestion = useCallback((lvl) => {
    const cfg = LEVELS[lvl];
    const p1  = generateCoefficients(cfg.deg1, lvl);
    const p2  = generateCoefficients(cfg.deg2, lvl);
    setPoly1(p1);
    setPoly2(p2);
    setCorrectAnswer(multiplyPolynomials(p1, p2));
    setHeaderRowValues({});
    setHeaderColValues({});
    setGridValues({});
    setDiagValues({});
    setStep("headers");
    setShowResult(false);
    setHighlightDiag(null);
    setQuestionStartTime(Date.now());
    setLastSolveTime(null);
    setFocusedCell("r-0");
  }, []);

  const startGame = (lvl) => {
    SFX.gameStart();
    setLevel(lvl);
    setScore(0);
    setCombo(0);
    setQuestionsAnswered(0);
    setTotalCorrect(0);
    setTimer(LEVELS[lvl].time);
    setIsRunning(true);
    generateQuestion(lvl);
    setScreen("game");
  };

  /* ── Step checkers ── */
  const checkHeaders = () => {
    let ok = true, filled = true;
    for (let r = 0; r < rows; r++) {
      const v = headerRowValues[r];
      if (!v || v === "-") filled = false;
      else if (parseInt(v) !== poly1[r]) ok = false;
    }
    for (let c = 0; c < cols; c++) {
      const v = headerColValues[c];
      if (!v || v === "-") filled = false;
      else if (parseInt(v) !== poly2[c]) ok = false;
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
        if (!v || v === "-") filled = false;
        else if (parseInt(v) !== correctGrid[`${r}-${c}`]) ok = false;
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
      if (!v || v === "-") filled = false;
      else if (parseInt(v) !== correctDiagSums[d]) ok = false;
    }
    if (!filled) { doShake(); return; }

    setQuestionsAnswered((q) => q + 1);
    const solveTime = Math.round((Date.now() - questionStartTime) / 1000);
    setLastSolveTime(solveTime);

    if (ok) {
      const earned = (level + 1) * 100 + Math.max(0, timer) * 2 + combo * 50;
      setScore((s) => s + earned);
      setCombo((c) => c + 1);
      setTotalCorrect((t) => t + 1);
      setResultCorrect(true);
      saveBest(level, solveTime, score + earned);
      spawnParticles(24);
      SFX.correct();
      if (combo > 0) SFX.combo();
    } else {
      setCombo(0);
      setResultCorrect(false);
      doShake();
      SFX.wrong();
    }
    setShowResult(true);
  };

  const nextQuestion = () => generateQuestion(level);

  /* ════════════════════════════════════════
     SCREEN RENDERS
     ════════════════════════════════════════ */
  if (screen === "menu") {
    return (
      <MenuScreen
        bestScores={bestScores}
        bestTimes={bestTimes}
        onStart={startGame}
        onHowTo={() => setScreen("howto")}
      />
    );
  }

  if (screen === "howto") {
    return <HowToScreen onBack={() => setScreen("menu")} />;
  }

  if (screen === "gameover") {
    return (
      <GameOverScreen
        score={score}
        totalCorrect={totalCorrect}
        questionsAnswered={questionsAnswered}
        level={level}
        bestTimes={bestTimes}
        bestScores={bestScores}
        onRestart={() => startGame(level)}
        onMenu={() => setScreen("menu")}
      />
    );
  }

  /* ════════════════════════════════════════
     GAME SCREEN
     ════════════════════════════════════════ */
  const lv         = LEVELS[level];
  const timerPct   = (timer / lv.time) * 100;
  const timerColor = timer > 30 ? "#16a34a" : timer > 10 ? "#f59e0b" : "#ef4444";
  const currentStepIdx = STEP_NAMES.findIndex((s) => s.key === step);

  const formatTime = (s) => {
    if (s < 0) s = 0;
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="app-container">
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left:       `${p.x}%`,
            top:        `${p.y}%`,
            width:      p.size,
            height:     p.size,
            background: `hsl(${p.hue}, 75%, 55%)`,
            "--dx":     `${p.dx}px`,
            "--dy":     `${p.dy}px`,
          }}
        />
      ))}

      {/* ── Game Header ── */}
      <div className="game-header">
        <button
          className="close-btn"
          onClick={() => { setIsRunning(false); setScreen("menu"); }}
        >✕</button>

        <button
          className="sound-btn"
          onClick={() => {
            const next = !soundOn;
            setSoundOn(next);
            setMuted(!next);
            if (next) SFX.tap();
          }}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        <div className="header-mid">
          <span className="header-level">{lv.emoji} {lv.name}</span>
          <div className="timer-bar">
            <div className="timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
          </div>
          <span className="timer-text" style={{ color: timerColor }}>{formatTime(timer)}</span>
        </div>

        <div className="header-score">
          <div className="score-num">{score}</div>
          {combo > 1 && <div className="combo-badge">×{combo}</div>}
        </div>
      </div>

      {/* ── Question Bar ── */}
      <div className="question-bar">
        <div className="q-label">โจทย์</div>
        <div className="q-poly">
          <span className="q-bracket" style={{ color: ROW_COLOR }}>(</span>
          <span style={{ color: ROW_COLOR }}>{renderPolyJSX(poly1)}</span>
          <span className="q-bracket" style={{ color: ROW_COLOR }}>)</span>
          <span className="q-mul">×</span>
          <span className="q-bracket" style={{ color: COL_COLOR }}>(</span>
          <span style={{ color: COL_COLOR }}>{renderPolyJSX(poly2)}</span>
          <span className="q-bracket" style={{ color: COL_COLOR }}>)</span>
        </div>
        {step === "headers" && (
          <div className="q-hint">
            <span style={{ color: ROW_COLOR }}>■</span> วงเล็บแรก → หัวแถว (ซ้าย)
            &nbsp;&nbsp;
            <span style={{ color: COL_COLOR }}>■</span> วงเล็บสอง → หัวคอลัมน์ (บน)
          </div>
        )}
      </div>

      {/* ── Step Bar ── */}
      <div className="step-bar">
        {STEP_NAMES.map((s, i) => (
          <div key={s.key} className="step-bar-item">
            {i > 0 && <span className="step-arrow">→</span>}
            <div className={`step-tag ${
              i === currentStepIdx ? "step-active"
              : i < currentStepIdx ? "step-done"
              : ""
            }`}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Game Area ── */}
      <div className={`game-area ${shake ? "shake" : ""}`}>

        {step === "headers" && (
          <HeadersStep
            poly1={poly1} poly2={poly2} deg1={deg1} deg2={deg2}
            headerRowValues={headerRowValues}
            headerColValues={headerColValues}
            focusedCell={focusedCell}
            onCellFocus={handleCellFocus}
            onInput={handleNumpadInput}
            onDelete={handleNumpadDelete}
            onNext={handleNumpadNext}
            onSubmit={checkHeaders}
            getCellVarLabel={getCellVarLabel}
          />
        )}

        {step === "grid" && (
          <GridStep
            poly1={poly1} poly2={poly2} deg1={deg1} deg2={deg2}
            gridValues={gridValues}
            focusedCell={focusedCell}
            onCellFocus={handleCellFocus}
            onInput={handleNumpadInput}
            onDelete={handleNumpadDelete}
            onNext={handleNumpadNext}
            onSubmit={checkGrid}
            getCellVarLabel={getCellVarLabel}
          />
        )}

        {step === "diagonal" && !showResult && (
          <DiagonalStep
            poly1={poly1} poly2={poly2} deg1={deg1} deg2={deg2}
            correctGrid={correctGrid}
            diagonalGroups={diagonalGroups}
            diagValues={diagValues}
            focusedCell={focusedCell}
            highlightDiag={highlightDiag}
            onCellFocus={handleCellFocus}
            onDiagHover={setHighlightDiag}
            onInput={handleNumpadInput}
            onDelete={handleNumpadDelete}
            onNext={handleNumpadNext}
            onSubmit={checkDiagonals}
            getCellVarLabel={getCellVarLabel}
          />
        )}

        {showResult && (
          <ResultBox
            resultCorrect={resultCorrect}
            correctAnswer={correctAnswer}
            lastSolveTime={lastSolveTime}
            level={level}
            timer={timer}
            combo={combo}
            onNext={nextQuestion}
          />
        )}
      </div>
    </div>
  );
}
