import { tokens, darkTokens } from "./css-utils"

export const styles = {
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    fontWeight: 500,
    transition: `all ${tokens.transitions.fast}`,
    cursor: "pointer",
    padding: tokens.spacing.md,

    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  buttonPrimary: {
    backgroundColor: tokens.colors.primary.main,
    color: tokens.colors.primary.contrastText,

    "&:hover:not(:disabled)": {
      backgroundColor: tokens.colors.primary.dark,
    },
  },
  buttonSecondary: {
    backgroundColor: tokens.colors.secondary.main,
    color: tokens.colors.secondary.contrastText,

    "&:hover:not(:disabled)": {
      backgroundColor: tokens.colors.secondary.dark,
    },
  },
  buttonOutline: {
    backgroundColor: "transparent",
    border: `1px solid ${tokens.colors.border}`,
    color: tokens.colors.text.primary,

    "&:hover:not(:disabled)": {
      backgroundColor: tokens.colors.secondary.main,
    },
  },
  buttonIcon: {
    padding: tokens.spacing.sm,
    borderRadius: tokens.radius.full,
  },
  card: {
    backgroundColor: tokens.colors.background.paper,
    borderRadius: tokens.radius.md,
    border: `1px solid ${tokens.colors.border}`,
    overflow: "hidden",
    boxShadow: tokens.shadows.sm,
    transition: `box-shadow ${tokens.transitions.fast}`,

    "&:hover": {
      boxShadow: tokens.shadows.md,
    },
  },
  input: {
    width: "100%",
    padding: tokens.spacing.md,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.background.default,
    color: tokens.colors.text.primary,
    transition: `all ${tokens.transitions.fast}`,

    "&:focus": {
      outline: "none",
      borderColor: tokens.colors.primary.main,
      boxShadow: `0 0 0 2px ${tokens.colors.primary.light}`,
    },

    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  kanbanColumn: {
    flex: 1,
    minWidth: "250px",
    maxWidth: "350px",
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    border: `1px solid ${tokens.colors.border}`,
    transition: `all ${tokens.transitions.fast}`,
    backgroundColor: tokens.colors.background.default,
  },
  kanbanItem: {
    backgroundColor: tokens.colors.background.paper,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    border: `1px solid ${tokens.colors.border}`,
    boxShadow: tokens.shadows.sm,
    transition: `all ${tokens.transitions.fast}`,

    "&:hover": {
      boxShadow: tokens.shadows.md,
    },
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.background.paper,
    borderRadius: tokens.radius.md,
    border: `1px solid ${tokens.colors.border}`,
    transition: `all ${tokens.transitions.fast}`,

    "&:hover": {
      boxShadow: tokens.shadows.md,
    },
  },
}

export const darkStyles = {
  ...styles,
  button: {
    ...styles.button,
    color: darkTokens.colors.text.primary,
  },
  buttonPrimary: {
    backgroundColor: darkTokens.colors.primary.main,
    color: darkTokens.colors.primary.contrastText,

    "&:hover:not(:disabled)": {
      backgroundColor: darkTokens.colors.primary.dark,
    },
  },
  buttonSecondary: {
    backgroundColor: darkTokens.colors.secondary.main,
    color: darkTokens.colors.secondary.contrastText,

    "&:hover:not(:disabled)": {
      backgroundColor: darkTokens.colors.secondary.dark,
    },
  },
  buttonOutline: {
    backgroundColor: "transparent",
    border: `1px solid ${darkTokens.colors.border}`,
    color: darkTokens.colors.text.primary,

    "&:hover:not(:disabled)": {
      backgroundColor: darkTokens.colors.secondary.main,
    },
  },
  card: {
    backgroundColor: darkTokens.colors.background.paper,
    borderRadius: tokens.radius.md,
    border: `1px solid ${darkTokens.colors.border}`,
    overflow: "hidden",
    boxShadow: tokens.shadows.sm,
    transition: `box-shadow ${tokens.transitions.fast}`,

    "&:hover": {
      boxShadow: tokens.shadows.md,
    },
  },
  input: {
    width: "100%",
    padding: tokens.spacing.md,
    border: `1px solid ${darkTokens.colors.border}`,
    borderRadius: tokens.radius.md,
    backgroundColor: darkTokens.colors.background.default,
    color: darkTokens.colors.text.primary,
    transition: `all ${tokens.transitions.fast}`,

    "&:focus": {
      outline: "none",
      borderColor: darkTokens.colors.primary.main,
      boxShadow: `0 0 0 2px ${darkTokens.colors.primary.light}`,
    },

    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  kanbanColumn: {
    flex: 1,
    minWidth: "250px",
    maxWidth: "350px",
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    border: `1px solid ${darkTokens.colors.border}`,
    transition: `all ${tokens.transitions.fast}`,
    backgroundColor: darkTokens.colors.background.default,
  },
  kanbanItem: {
    backgroundColor: darkTokens.colors.background.paper,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    border: `1px solid ${darkTokens.colors.border}`,
    boxShadow: tokens.shadows.sm,
    transition: `all ${tokens.transitions.fast}`,

    "&:hover": {
      boxShadow: tokens.shadows.md,
    },
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: tokens.spacing.md,
    backgroundColor: darkTokens.colors.background.paper,
    borderRadius: tokens.radius.md,
    border: `1px solid ${darkTokens.colors.border}`,
    transition: `all ${tokens.transitions.fast}`,

    "&:hover": {
      boxShadow: tokens.shadows.md,
    },
  },
}

