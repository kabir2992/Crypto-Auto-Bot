import { createContext, useContext, useState, useEffect } from "react";

const THEMES = {
  light: {
    "--bg":           "#FFF8EE",
    "--bg-2":         "#FFF1DC",
    "--bg-card":      "#FFFFFF",
    "--bg-sidebar":   "#1A0E04",
    "--bg-topbar":    "#FFFFFF",
    "--bg-input":     "#FFF3E0",
    "--text":         "#1C0F04",
    "--text-muted":   "#8B6040",
    "--text-sidebar": "#F5DEB3",
    "--accent":       "#E8610A",
    "--accent-2":     "#C44D00",
    "--gold":         "#D4A017",
    "--gold-2":       "#B8860B",
    "--green":        "#2E7D32",
    "--green-bg":     "rgba(46,125,50,0.10)",
    "--red":          "#C62828",
    "--red-bg":       "rgba(198,40,40,0.10)",
    "--border":       "#E8C99A",
    "--border-2":     "#F0D9B5",
    "--shadow":       "0 8px 32px rgba(232,97,10,0.12)",
    "--shadow-sm":    "0 2px 12px rgba(28,16,8,0.08)",
    "--chart-bg":     "#FFFCF5",
  },
  dark: {
    "--bg":           "#0C0804",
    "--bg-2":         "#140C05",
    "--bg-card":      "#1A1008",
    "--bg-sidebar":   "#080502",
    "--bg-topbar":    "#110900",
    "--bg-input":     "#1E1208",
    "--text":         "#F0D9B5",
    "--text-muted":   "#9A7050",
    "--text-sidebar": "#F0D9B5",
    "--accent":       "#FF7A1A",
    "--accent-2":     "#FF9A4A",
    "--gold":         "#FFD700",
    "--gold-2":       "#FFC200",
    "--green":        "#4CAF50",
    "--green-bg":     "rgba(76,175,80,0.12)",
    "--red":          "#EF5350",
    "--red-bg":       "rgba(239,83,80,0.12)",
    "--border":       "#2E1C08",
    "--border-2":     "#3D2810",
    "--shadow":       "0 8px 32px rgba(255,122,26,0.18)",
    "--shadow-sm":    "0 2px 12px rgba(0,0,0,0.5)",
    "--chart-bg":     "#0F0804",
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("mcx-theme") || "dark"
  );

  useEffect(() => {
    const vars = THEMES[theme];
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.setAttribute("data-theme", theme);
    document.body.style.background = "var(--bg)";
    document.body.style.color = "var(--text)";
    localStorage.setItem("mcx-theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);