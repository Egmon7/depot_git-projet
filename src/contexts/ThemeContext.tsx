import React, { createContext, useContext, useEffect, ReactNode } from "react";

type Theme = "light";

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const theme: Theme = "light";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("light");
    // Clean up any existing theme preference
    localStorage.removeItem("legislativeApp_theme");
    // Ensure body has proper background
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
