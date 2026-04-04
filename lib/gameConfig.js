//gameConfig.js

// ═══════════════════════════════════════════
//   LEVEL CONFIG
// ═══════════════════════════════════════════

export const LEVELS = [
  { name: "Beginner", deg1: 0, deg2: 0, emoji: "🌱", time: 90,  desc: "เอกนาม × เอกนาม", monomial: true },
  { name: "Easy",     deg1: 1, deg2: 0, emoji: "🧩", time: 120, desc: "ดีกรี 1 × เอกนาม", monomial: true },
  { name: "Medium",   deg1: 1, deg2: 1, emoji: "⚡", time: 150, desc: "ดีกรี 1 × 1" },
  { name: "Hard",     deg1: 2, deg2: 1, emoji: "🔥", time: 180, desc: "ดีกรี 2 × 1" },
  { name: "Expert",   deg1: 3, deg2: 3, emoji: "🧠", time: 240, desc: "ดีกรี 3 × 3" },
  { name: "Master",   deg1: 4, deg2: 3, emoji: "👑", time: 300, desc: "ดีกรี 4 × 3" },
];

export const DIAG_COLORS = [
  "#3b82f6", "#ef4444", "#16a34a", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
  "#6366f1", "#14b8a6", "#e11d48", "#84cc16",
];

export const ROW_COLOR = "#dc2626";
export const COL_COLOR = "#2563eb";