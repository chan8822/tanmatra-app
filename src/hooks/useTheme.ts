import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = localStorage.getItem("tanmatra_theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);
  const update = (t: "dark" | "light") => {
    setTheme(t);
    localStorage.setItem("tanmatra_theme", t);
  };
  return { theme, setTheme: update };
}
