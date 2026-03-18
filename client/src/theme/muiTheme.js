import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#2563EB",
      light: "#3B82F6",
      dark: "#1D4ED8",
      contrastText: "#fff"
    },
    secondary: { main: "#4F46E5", contrastText: "#fff" },
    background: { default: "#F8F7F4", paper: "#FFFFFF" },
    text: { primary: "#111827", secondary: "#6B7280", disabled: "#9CA3AF" },
    error: { main: "#DC2626" },
    success: { main: "#16A34A", light: "#DCFCE7" },
    warning: { main: "#D97706" },
    grey: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF"
    }
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    h2: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    h3: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    h4: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    h5: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    button: { fontWeight: 500, letterSpacing: "0.01em" }
  },
  shape: { borderRadius: 12 },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
    "0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04)",
    "0 20px 25px rgba(0,0,0,0.08), 0 10px 10px rgba(0,0,0,0.03)",
    ...Array(20).fill("none")
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 10,
          padding: "10px 22px",
          fontSize: "0.9rem"
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
          boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)",
            boxShadow: "0 6px 20px rgba(37,99,235,0.45)"
          }
        },
        outlinedPrimary: {
          borderWidth: "1.5px",
          "&:hover": { borderWidth: "1.5px", backgroundColor: "#EFF6FF" }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#FAFAF9",
            "&:hover fieldset": { borderColor: "#2563EB" },
            "&.Mui-focused fieldset": {
              borderColor: "#2563EB",
              borderWidth: "1.5px"
            }
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#2563EB" }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 }
      }
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 10 } }
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 10 }
      }
    }
  }
});
