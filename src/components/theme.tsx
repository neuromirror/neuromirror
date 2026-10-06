"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ThemePref = "light" | "dark" | "system";
const KEY = "nm-theme";

const ThemeCtx = createContext<{ pref: ThemePref; setPref: (p: ThemePref) => void }>({
  pref: "system",
  setPref: () => {},
});

function apply(pref: ThemePref) {
  const dark =
    pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/** Runs before paint so the page never flashes the wrong theme. */
export const themeScript = `(function(){try{var p=localStorage.getItem('${KEY}')||'system';var d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>("system");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as ThemePref | null) ?? "system";
    setPrefState(stored);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem(KEY) ?? "system") === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setPref = useCallback((p: ThemePref) => {
    localStorage.setItem(KEY, p);
    setPrefState(p);
    apply(p);
  }, []);

  return <ThemeCtx.Provider value={{ pref, setPref }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
