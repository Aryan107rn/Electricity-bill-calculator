import { useState, useEffect } from "react";

export function useDarkMode() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("ebc-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ebc-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggle, isDark: theme === "dark" };
}
