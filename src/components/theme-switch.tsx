"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePref } from "./theme";

const OPTIONS: { value: ThemePref; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function ThemeSwitch({ compact = false }: { compact?: boolean }) {
  const { pref, setPref } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className="inline-flex rounded-full border border-line bg-card p-0.5">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={pref === value}
          aria-label={label}
          title={label}
          onClick={() => setPref(value)}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs transition-colors ${
            pref === value ? "bg-paper-2 text-ink" : "text-ink-3 hover:text-ink"
          }`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {!compact && <span>{label}</span>}
        </button>
      ))}
    </div>
  );
}
