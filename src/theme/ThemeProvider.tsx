import React, { createContext, useContext, useState } from "react";
import { Appearance, View } from "react-native";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void };

const ThemeCtx = createContext<Ctx>({ theme: "light", toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    Appearance.getColorScheme() === "dark" ? "dark" : "light"
  );
  const toggle = () => setTheme(t => (t === "light" ? "dark" : "light"));

  // Put the `dark` class on a root <View> so NativeWind applies dark styles beneath it
  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <View className={theme === "dark" ? "dark flex-1" : "flex-1"}>
        {children}
      </View>
    </ThemeCtx.Provider>
  );
}