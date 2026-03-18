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
  Divider,
  LinearProgress
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  clearAuthError,
  selectAuth
} from "../../store/slices/authSlice";

const getStrength = pw => {
  if (!pw) return { score: 0, label: "", color: "#E5E7EB" };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { score: 20, label: "Weak", color: "#EF4444" },
    { score: 40, label: "Fair", color: "#F97316" },
    { score: 60, label: "Good", color: "#EAB308" },
    { score: 80, label: "Strong", color: "#22C55E" },
    { score: 100, label: "Excellent", color: "#10B981" }
  ];
  return map[s - 1] || map[0];
};

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(selectAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(
    () => {
      if (user) navigate("/", { replace: true });
    },
    [user, navigate]
  );

  const strength = getStrength(password);

  const validate = (f = { name, email, password, confirmPassword }) => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required";
    else if (f.name.trim().length < 2) e.name = "At least 2 characters";
    if (!f.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      e.email = "Enter a valid email";
    if (!f.password) e.password = "Password is required";
    else if (f.password.length < 6) e.password = "Minimum 6 characters";
    if (!f.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (f.password !== f.confirmPassword)
      e.confirmPassword = "Passwords do not match";
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
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    if (Object.keys(errs).length) return;
    dispatch(register({ name: name.trim(), email, password }));
  };

  const passwordsMatch = confirmPassword && confirmPassword === password;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8F7F4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 5 }
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 440 }}>
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
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Free to use. No credit card required.
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
              label="Full Name"
              value={name}
              fullWidth
              placeholder="Jane Smith"
              autoComplete="name"
              onChange={e => {
                setName(e.target.value);
                if (touched.name)
                  setFieldErrors(
                    validate({
                      name: e.target.value,
                      email,
                      password,
                      confirmPassword
                    })
                  );
              }}
              onBlur={() => handleBlur("name")}
              error={touched.name && !!fieldErrors.name}
              helperText={touched.name && fieldErrors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon
                      sx={{ fontSize: 18, color: "#9CA3AF" }}
                    />
                  </InputAdornment>
                )
              }}
            />

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
                  setFieldErrors(
                    validate({
                      name,
                      email: e.target.value,
                      password,
                      confirmPassword
                    })
                  );
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

            <Box>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                fullWidth
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                onChange={e => {
                  setPassword(e.target.value);
                  if (touched.password)
                    setFieldErrors(
                      validate({
                        name,
                        email,
                        password: e.target.value,
                        confirmPassword
                      })
                    );
                }}
                onBlur={() => handleBlur("password")}
                error={touched.password && !!fieldErrors.password}
                helperText={touched.password && fieldErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ fontSize: 18, color: "#9CA3AF" }}
                      />
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
              {password &&
                <Box sx={{ mt: 1.25, px: 0.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 0.75
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Password strength
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{ color: strength.color }}
                    >
                      {strength.label}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={strength.score}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: "#E5E7EB",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: strength.color,
                        borderRadius: 2,
                        transition:
                          "width 0.4s ease, background-color 0.3s ease"
                      }
                    }}
                  />
                </Box>}
            </Box>

            <TextField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              fullWidth
              placeholder="Repeat your password"
              autoComplete="new-password"
              onChange={e => {
                setConfirmPassword(e.target.value);
                if (touched.confirmPassword)
                  setFieldErrors(
                    validate({
                      name,
                      email,
                      password,
                      confirmPassword: e.target.value
                    })
                  );
              }}
              onBlur={() => handleBlur("confirmPassword")}
              error={touched.confirmPassword && !!fieldErrors.confirmPassword}
              helperText={
                touched.confirmPassword && fieldErrors.confirmPassword
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {passwordsMatch
                      ? <CheckCircleIcon
                          sx={{ fontSize: 18, color: "#16A34A" }}
                        />
                      : <LockOutlinedIcon
                          sx={{ fontSize: 18, color: "#9CA3AF" }}
                        />}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(p => !p)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {showConfirm
                        ? <VisibilityOff
                            sx={{ fontSize: 18, color: "#9CA3AF" }}
                          />
                        : <Visibility
                            sx={{ fontSize: 18, color: "#9CA3AF" }}
                          />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  ...(passwordsMatch && {
                    "& fieldset": { borderColor: "#16A34A !important" }
                  })
                }
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
                : "Create account"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>
              or
            </Typography>
          </Divider>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#2563EB",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
