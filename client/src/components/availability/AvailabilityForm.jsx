import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Collapse,
  Alert
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  saveAvailability,
  clearMessages
} from "../../store/slices/availabilitySlice";

const generateTimeOptions = () => {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const val = `${hh}:${mm}`;
      const period = h >= 12 ? "PM" : "AM";
      const hour = h % 12 === 0 ? 12 : h % 12;
      opts.push({ value: val, label: `${hour}:${mm} ${period}` });
    }
  }
  return opts;
};
const TIME_OPTIONS = generateTimeOptions();

function StepBadge({ num, active, done }) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: done ? "#16A34A" : active ? "#2563EB" : "#E5E7EB",
        color: done || active ? "#fff" : "#9CA3AF",
        fontSize: "0.75rem",
        fontWeight: 700,
        transition: "all 0.2s ease"
      }}
    >
      {done ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : num}
    </Box>
  );
}

export default function AvailabilityForm() {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(s => s.availability);

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [valErr, setValErr] = useState("");

  const step1Done = !!date;
  const step2Done = step1Done;

  const handleSave = () => {
    setValErr("");
    if (!date) return setValErr("Please select a date first.");
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    if (eh * 60 + em <= sh * 60 + sm)
      return setValErr("End time must be after start time.");

    dispatch(
      saveAvailability({
        date: date.format("YYYY-MM-DD"),
        startTime,
        endTime
      })
    )
      .unwrap()
      .then(() => {
        setDate(null);
        setStartTime("09:00");
        setEndTime("17:00");
      })
      .catch(() => {});
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
      }}
    >
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 2.5,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(to right, #FAFAFA, #F5F4F1)"
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"DM Serif Display", serif',
              fontWeight: 400,
              fontSize: "1.2rem"
            }}
          >
            Add Availability Slot
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pick a date and define your available window
          </Typography>
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #2563EB, #4F46E5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 3px 10px rgba(37,99,235,0.3)"
          }}
        >
          <AddCircleOutlineIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
      </Box>

      <Box sx={{ px: { xs: 3, md: 4 }, py: 3.5 }}>
        <Collapse in={!!(valErr || error)}>
          <Alert
            severity="error"
            variant="outlined"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => {
              setValErr("");
              dispatch(clearMessages());
            }}
          >
            {valErr || error}
          </Alert>
        </Collapse>
        <Collapse in={!!successMessage}>
          <Alert
            severity="success"
            variant="outlined"
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<CheckCircleIcon />}
            onClose={() => dispatch(clearMessages())}
          >
            {successMessage}
          </Alert>
        </Collapse>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <StepBadge num={1} active={!step1Done} done={step1Done} />
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <CalendarTodayIcon
                  sx={{ fontSize: 15, color: "text.secondary" }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    letterSpacing: "0.06em"
                  }}
                >
                  Select Date
                </Typography>
              </Box>
              <DatePicker
                value={date}
                onChange={setDate}
                minDate={dayjs().add(1, "day")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    placeholder: "Choose a future date",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        bgcolor: date ? "#EFF6FF" : "#FAFAF9",
                        borderColor: date ? "#2563EB" : undefined,
                        transition: "all 0.2s"
                      }
                    }
                  }
                }}
              />
            </Box>
          </Box>

          <Collapse in={true}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <StepBadge
                num={2}
                active={step1Done && !step2Done}
                done={false}
              />
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5
                  }}
                >
                  <AccessTimeIcon
                    sx={{ fontSize: 15, color: "text.secondary" }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                      letterSpacing: "0.06em"
                    }}
                  >
                    Time Window
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    gap: 1.5,
                    alignItems: "center"
                  }}
                >
                  <TextField
                    select
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    fullWidth
                  >
                    {TIME_OPTIONS.map(o =>
                      <MenuItem key={o.value} value={o.value}>
                        {o.label}
                      </MenuItem>
                    )}
                  </TextField>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <ArrowForwardIcon
                      sx={{ fontSize: 14, color: "text.secondary" }}
                    />
                  </Box>
                  <TextField
                    select
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    fullWidth
                  >
                    {TIME_OPTIONS.map(o =>
                      <MenuItem key={o.value} value={o.value}>
                        {o.label}
                      </MenuItem>
                    )}
                  </TextField>
                </Box>
                {date &&
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      display: "block",
                      color: "#4F46E5",
                      fontWeight: 500
                    }}
                  >
                    {(() => {
                      const [sh, sm] = startTime.split(":").map(Number);
                      const [eh, em] = endTime.split(":").map(Number);
                      const diff = eh * 60 + em - (sh * 60 + sm);
                      if (diff <= 0)
                        return "⚠️ End time must be after start time";
                      const hrs = Math.floor(diff / 60);
                      const mins = diff % 60;
                      const slots = Math.floor(diff / 30);
                      return `✓ ${hrs > 0 ? `${hrs}h ` : ""}${mins > 0
                        ? `${mins}m`
                        : ""} window · ${slots} bookable slot${slots !== 1
                        ? "s"
                        : ""}`;
                    })()}
                  </Typography>}
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Box>

      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 2.5,
          borderTop: "1px solid rgba(0,0,0,0.06)",
          background: "linear-gradient(to right, #FAFAFA, #F5F4F1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Slots are created in 30-minute intervals
        </Typography>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={
            loading
              ? <CircularProgress size={16} color="inherit" />
              : <CheckCircleIcon />
          }
          sx={{ px: 3.5, py: 1.2, borderRadius: 2.5 }}
        >
          {loading ? "Saving..." : "Save Availability"}
        </Button>
      </Box>
    </Box>
  );
}
