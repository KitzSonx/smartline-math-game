// ═══════════════════════════════════════════
//   POLYNOMIAL UTILITIES
// ═══════════════════════════════════════════

/** สร้างสัมประสิทธิ์แบบสุ่มตาม degree และ difficulty */
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

/** คูณ polynomial สองตัว → array coefficients */
export const multiplyPolynomials = (a, b) => {
  const result = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < b.length; j++)
      result[i + j] += a[i] * b[j];
  return result;
};

/** Render polynomial เป็น JSX (ใช้ใน question bar) */
export const renderPolyJSX = (coeffs) => {
  const deg   = coeffs.length - 1;
  const parts = [];
  coeffs.forEach((c, i) => {
    const power = deg - i;
    if (c === 0) return;
    const absC = Math.abs(c);
    const sign = c < 0 ? " − " : parts.length === 0 ? "" : " + ";
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

/** Render polynomial เป็น JSX (ใช้ใน result box) */
export const resultPolyJSX = (coeffs) => {
  const deg   = coeffs.length - 1;
  const parts = [];
  coeffs.forEach((c, i) => {
    const power = deg - i;
    if (c === 0) return;
    const absC = Math.abs(c);
    const sign = c < 0 ? " − " : parts.length === 0 ? "" : " + ";
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

/** คำนวณ label ของ x term ตาม power */
export const termLabel = (power) => {
  if (power === 0) return "";
  if (power === 1) return "x";
  return `x^${power}`;
};

/** Render variable label เช่น "x^2" → <i>x</i><sup>2</sup> */
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
