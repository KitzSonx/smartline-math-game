// ═══════════════════════════════════════════
//   POLYNOMIAL UTILITIES
// ═══════════════════════════════════════════

export const generateMonomial = (difficulty) => {
  const maxVal = difficulty <= 1 ? 5 : difficulty <= 3 ? 9 : 12;
  const maxDeg = difficulty <= 1 ? 2 : 3;
  const deg = Math.floor(Math.random() * (maxDeg + 1));
  let coeff = Math.floor(Math.random() * maxVal) + 1;
  if (Math.random() < 0.4) coeff = -coeff;
  const coeffs = [coeff];
  for (let i = 0; i < deg; i++) coeffs.push(0);
  return coeffs;
};

export const generateCoefficients = (degree, difficulty) => {
  const maxVal = difficulty <= 1 ? 5 : difficulty <= 3 ? 9 : 12;
  const coeffs = [];
  for (let i = degree; i >= 0; i--) {
    let c = Math.floor(Math.random() * maxVal) + 1;
    if (Math.random() < 0.4) c = -c;
    if (i === degree && c === 0) c = 1;
    coeffs.push(c);
  }
  if (coeffs[0] === 0) coeffs[0] = 1;
  return coeffs;
};

export const generatePolyForLevel = (deg, levelIndex, isMonomial) => {
  if (isMonomial && deg === 0) return generateMonomial(levelIndex);
  return generateCoefficients(deg, levelIndex);
};

export const multiplyPolynomials = (a, b) => {
  const result = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < b.length; j++)
      result[i + j] += a[i] * b[j];
  return result;
};

/* ═══════════════════════════════════════════
   TERM PARSING
   ═══════════════════════════════════════════
   "5"     → { coeff: 5,  power: 0 }
   "-3"    → { coeff: -3, power: 0 }
   "x"     → { coeff: 1,  power: 1 }
   "-x"    → { coeff: -1, power: 1 }
   "2x"    → { coeff: 2,  power: 1 }
   "x^2"   → { coeff: 1,  power: 2 }
   "3x^2"  → { coeff: 3,  power: 2 }
   "-5x^3" → { coeff: -5, power: 3 }
   "0"     → { coeff: 0,  power: 0 }
*/
export const parseTerm = (input) => {
  if (!input || input === "" || input === "-") return null;
  const s = input.trim();

  // "0" special case
  if (s === "0") return { coeff: 0, power: 0 };

  if (!s.includes("x")) {
    const n = parseInt(s);
    if (isNaN(n)) return null;
    return { coeff: n, power: 0 };
  }

  const parts = s.split("x");
  const beforeX = parts[0];
  const afterX = parts[1] || "";

  let coeff;
  if (beforeX === "" || beforeX === "+") coeff = 1;
  else if (beforeX === "-") coeff = -1;
  else {
    coeff = parseInt(beforeX);
    if (isNaN(coeff)) return null;
  }

  let power;
  if (afterX === "") {
    power = 1;
  } else if (afterX.startsWith("^")) {
    power = parseInt(afterX.slice(1));
    if (isNaN(power)) return null;
  } else {
    return null;
  }

  return { coeff, power };
};

export const checkTermInput = (input, expectedCoeff, expectedPower) => {
  const parsed = parseTerm(input);
  if (!parsed) return false;
  return parsed.coeff === expectedCoeff && parsed.power === expectedPower;
};

export const getExpectedTerm = (poly1, poly2, deg1, deg2, r, c) => {
  const coeff = poly1[r] * poly2[c];
  const power = (deg1 - r) + (deg2 - c);
  return { coeff, power };
};

/** Render user input string as styled JSX */
export const renderTermInput = (input) => {
  if (!input) return null;
  const parsed = parseTerm(input);
  if (!parsed) return <span>{input}</span>;
  const { coeff, power } = parsed;
  if (coeff === 0) return <span>0</span>;
  const absC = Math.abs(coeff);
  const sign = coeff < 0 ? "−" : "";
  if (power === 0) return <span>{sign}{absC}</span>;
  if (power === 1) return <span>{sign}{absC === 1 ? "" : absC}<i>x</i></span>;
  return <span>{sign}{absC === 1 ? "" : absC}<i>x</i><sup>{power}</sup></span>;
};

/* ═══════════════════════════════════════════
   RENDER JSX
   ═══════════════════════════════════════════ */

export const renderPolyJSX = (coeffs) => {
  const deg = coeffs.length - 1;
  const parts = [];
  coeffs.forEach((c, i) => {
    const power = deg - i;
    if (c === 0) return;
    const absC = Math.abs(c);
    
    // ✅ เช็คก่อนว่าเป็นพจน์แรกสุดหรือไม่ ถ้าใช่ไม่ต้องเว้นวรรคหน้าเครื่องหมายลบ
    const sign = parts.length === 0 
      ? (c < 0 ? "−" : "") 
      : (c < 0 ? " − " : " + ");

    if (power === 0) {
      parts.push(<span key={`f${i}`}>{sign}{absC}</span>);
    } else if (power === 1) {
      parts.push(
        <span key={`f${i}`}>
          {sign}{absC === 1 ? "" : absC}<span style={{ fontStyle: "italic" }}>x</span>
        </span>
      );
    } else {
      parts.push(
        <span key={`f${i}`}>
          {sign}{absC === 1 ? "" : absC}
          <span style={{ fontStyle: "italic" }}>x</span>
          <sup style={{ fontSize: "0.6em" }}>{power}</sup>
        </span>
      );
    }
  });
  if (parts.length === 0) parts.push(<span key="z">0</span>);
  return parts;
};

export const resultPolyJSX = (coeffs) => {
  const deg = coeffs.length - 1;
  const parts = [];
  coeffs.forEach((c, i) => {
    const power = deg - i;
    if (c === 0) return;
    const absC = Math.abs(c);
    
    // ✅ เช็คตรรกะเดียวกันสำหรับเฉลยตอนตอบคำถาม
    const sign = parts.length === 0 
      ? (c < 0 ? "−" : "") 
      : (c < 0 ? " − " : " + ");

    if (power === 0) {
      parts.push(<span key={i}>{sign}{absC}</span>);
    } else if (power === 1) {
      parts.push(<span key={i}>{sign}{absC === 1 ? "" : absC}<i>x</i></span>);
    } else {
      parts.push(<span key={i}>{sign}{absC === 1 ? "" : absC}<i>x</i><sup>{power}</sup></span>);
    }
  });
  if (parts.length === 0) parts.push(<span key="z">0</span>);
  return parts;
};

export const termLabel = (power) => {
  if (power === 0) return "";
  if (power === 1) return "x";
  return `x^${power}`;
};

export const renderVarLabel = (varLabel) => {
  if (!varLabel) return null;
  return varLabel
    .replace("^", "")
    .split("x")
    .map((part, pi) =>
      pi === 0
        ? part
        : <span key={pi}><i>x</i>{part && <sup>{part}</sup>}</span>
    );
};