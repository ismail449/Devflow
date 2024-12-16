"use client";

import {
  ThemeProviderProps,
  ThemeProvider as NextThemeProvider,
} from "next-themes";
import React from "react";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  console.log(props);
  return <NextThemeProvider>{children}</NextThemeProvider>;
};

export default ThemeProvider;
