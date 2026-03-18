import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
  Collapse,
  Divider
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  clearAuthError,
  selectAuth
} from "../../store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(selectAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(
    () => {
      if (user) navigate("/", { replace: true });
    },
    [user, navigate]
  );

  const validate = (f = { email, password }) => {
    const e = {};
    if (!f.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      e.email = "Enter a valid email";
    if (!f.password) e.password = "Password is required";
    return e;
  };

  const handleBlur = field => {
    setTouched(t => ({ ...t, [field]: true }));
    setFieldErrors(validate());
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    setTouched({ email: true, password: true });
    if (Object.keys(errs).length) return;
    dispatch(login({ email, password }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8F7F4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 }
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563EB, #4F46E5)",
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              mb: 2
            }}
          >
            <CalendarMonthIcon sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: '"DM Serif Display", serif',
              fontSize: "1.9rem",
              fontWeight: 400,
              lineHeight: 1.2,
              mb: 0.75
            }}
          >
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your Scheduly account
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            p: { xs: 3, sm: 4 }
          }}
        >
          <Collapse in={!!error}>
            <Alert
              severity="error"
              onClose={() => dispatch(clearAuthError())}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {error}
            </Alert>
          </Collapse>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label="Email address"
              type="email"
              value={email}
              fullWidth
              placeholder="you@example.com"
              autoComplete="email"
              onChange={e => {
                setEmail(e.target.value);
                if (touched.email)
                  setFieldErrors(validate({ email: e.target.value, password }));
              }}
              onBlur={() => handleBlur("email")}
              error={touched.email && !!fieldErrors.email}
              helperText={touched.email && fieldErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon
                      sx={{ fontSize: 18, color: "#9CA3AF" }}
                    />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              fullWidth
              placeholder="Your password"
              autoComplete="current-password"
              onChange={e => {
                setPassword(e.target.value);
                if (touched.password)
                  setFieldErrors(validate({ email, password: e.target.value }));
              }}
              onBlur={() => handleBlur("password")}
              error={touched.password && !!fieldErrors.password}
              helperText={touched.password && fieldErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(p => !p)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {showPassword
                        ? <VisibilityOff
                            sx={{ fontSize: 18, color: "#9CA3AF" }}
                          />
                        : <Visibility
                            sx={{ fontSize: 18, color: "#9CA3AF" }}
                          />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, borderRadius: 2.5, fontSize: "0.95rem", mt: 0.5 }}
            >
              {loading
                ? <CircularProgress size={18} color="inherit" />
                : "Sign in"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>
              or
            </Typography>
          </Divider>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#2563EB",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
