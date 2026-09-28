'use client'

import React, { createContext, use } from 'react'

import type { ThemeContextType } from './types'

// The Happy Farmers brand is a fixed cream + green palette, not a user-facing
// light/dark toggle, so this provider no longer reads system preference or
// localStorage — `data-theme` is always 'light' (set by <InitTheme />).
const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: 'light',
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeContext value={initialContext}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
