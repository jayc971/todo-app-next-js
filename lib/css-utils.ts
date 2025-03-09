export type CSSProperties = {
  [key: string]: string | number | CSSProperties
}

export function css(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || "")
  }, "")
}

export const tokens = {
  colors: {
    primary: {
      main: "hsl(222.2, 47.4%, 11.2%)",
      light: "hsl(210, 40%, 96.1%)",
      dark: "hsl(217.2, 32.6%, 17.5%)",
      contrastText: "hsl(210, 40%, 98%)",
    },
    secondary: {
      main: "hsl(210, 40%, 96.1%)",
      light: "hsl(214.3, 31.8%, 91.4%)",
      dark: "hsl(215.4, 16.3%, 46.9%)",
      contrastText: "hsl(222.2, 47.4%, 11.2%)",
    },
    error: {
      main: "hsl(0, 84.2%, 60.2%)",
      light: "hsl(0, 84.2%, 70.2%)",
      dark: "hsl(0, 62.8%, 30.6%)",
      contrastText: "hsl(210, 40%, 98%)",
    },
    success: {
      main: "hsl(142.1, 76.2%, 36.3%)",
      light: "hsl(142.1, 76.2%, 46.3%)",
      dark: "hsl(142.1, 76.2%, 26.3%)",
      contrastText: "hsl(210, 40%, 98%)",
    },
    warning: {
      main: "hsl(35, 92%, 65%)",
      light: "hsl(35, 92%, 75%)",
      dark: "hsl(35, 92%, 55%)",
      contrastText: "hsl(0, 0%, 10%)",
    },
    info: {
      main: "hsl(217.2, 91.2%, 59.8%)",
      light: "hsl(217.2, 91.2%, 69.8%)",
      dark: "hsl(217.2, 91.2%, 49.8%)",
      contrastText: "hsl(210, 40%, 98%)",
    },
    background: {
      default: "hsl(0, 0%, 100%)",
      paper: "hsl(0, 0%, 100%)",
      dark: "hsl(222.2, 84%, 4.9%)",
    },
    text: {
      primary: "hsl(222.2, 84%, 4.9%)",
      secondary: "hsl(215.4, 16.3%, 46.9%)",
      disabled: "hsl(215.4, 16.3%, 56.9%)",
    },
    divider: "hsl(214.3, 31.8%, 91.4%)",
    border: "hsl(214.3, 31.8%, 91.4%)",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
}

export const darkTokens = {
  colors: {
    ...tokens.colors,
    primary: {
      main: "hsl(210, 40%, 98%)",
      light: "hsl(217.2, 32.6%, 27.5%)",
      dark: "hsl(210, 40%, 88%)",
      contrastText: "hsl(222.2, 47.4%, 11.2%)",
    },
    secondary: {
      main: "hsl(217.2, 32.6%, 17.5%)",
      light: "hsl(217.2, 32.6%, 27.5%)",
      dark: "hsl(217.2, 32.6%, 7.5%)",
      contrastText: "hsl(210, 40%, 98%)",
    },
    background: {
      default: "hsl(222.2, 84%, 4.9%)",
      paper: "hsl(222.2, 84%, 4.9%)",
      dark: "hsl(222.2, 84%, 2.9%)",
    },
    text: {
      primary: "hsl(210, 40%, 98%)",
      secondary: "hsl(215, 20.2%, 65.1%)",
      disabled: "hsl(215, 20.2%, 45.1%)",
    },
    divider: "hsl(217.2, 32.6%, 17.5%)",
    border: "hsl(217.2, 32.6%, 17.5%)",
  },
}

