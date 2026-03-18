import React from "react";
import { Box, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";

function StyledDay(props) {
  const { availableDates = [], day, outsideCurrentMonth, ...other } = props;
  const dateStr = day.format("YYYY-MM-DD");
  const isAvailable = !outsideCurrentMonth && availableDates.includes(dateStr);

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        borderRadius: "10px",
        fontSize: "0.85rem",
        ...(isAvailable && {
          bgcolor: "#EFF6FF",
          border: "1.5px solid #93C5FD",
          fontWeight: 700,
          color: "#1D4ED8",
          "&:hover": { bgcolor: "#DBEAFE", borderColor: "#2563EB" },
          "&.Mui-selected": {
            bgcolor: "#2563EB !important",
            color: "#fff !important",
            border: "none",
            fontWeight: 700,
            boxShadow: "0 3px 10px rgba(37,99,235,0.35)"
          }
        }),
        ...(!isAvailable &&
        !outsideCurrentMonth && {
          color: "#D1D5DB",
          "&.Mui-disabled": { color: "#E5E7EB" }
        })
      }}
    />
  );
}

export default function BookingCalendar({
  availableDates = [],
  onDateSelect,
  selectedDate
}) {
  const today = dayjs();

  const shouldDisableDate = date => {
    if (date.isBefore(today, "day")) return true;
    return !availableDates.includes(date.format("YYYY-MM-DD"));
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
          background: "linear-gradient(to right, #FAFAFA, #F5F4F1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
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
            Select a Date
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Highlighted dates have availability
          </Typography>
        </Box>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "11px",
            background: "linear-gradient(135deg, #2563EB, #4F46E5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 3px 10px rgba(37,99,235,0.25)"
          }}
        >
          <CalendarTodayIcon sx={{ color: "#fff", fontSize: 18 }} />
        </Box>
      </Box>

      <Box sx={{ px: 1, pb: 1 }}>
        <DateCalendar
          value={selectedDate}
          onChange={onDateSelect}
          shouldDisableDate={shouldDisableDate}
          minDate={today}
          slots={{ day: StyledDay }}
          slotProps={{ day: { availableDates } }}
          sx={{
            width: "100%",
            "& .MuiPickersCalendarHeader-root": { px: 2, pt: 1 },
            "& .MuiPickersCalendarHeader-label": {
              fontWeight: 600,
              fontSize: "0.95rem"
            },
            "& .MuiDayCalendar-weekDayLabel": {
              fontWeight: 600,
              fontSize: "0.78rem",
              color: "#9CA3AF"
            },
            "& .MuiPickersDay-root": { borderRadius: "10px" },
            "& .MuiPickersDay-today": {
              border: "1.5px solid #E5E7EB !important",
              bgcolor: "transparent",
              fontWeight: 700
            }
          }}
        />
      </Box>

      {availableDates.length > 0 &&
        <Box
          sx={{
            mx: 3,
            mb: 3,
            px: 2,
            py: 1.5,
            bgcolor: "#EFF6FF",
            borderRadius: 2,
            border: "1px solid #BFDBFE",
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#2563EB",
              flexShrink: 0
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: "#1D4ED8", fontWeight: 500 }}
          >
            {availableDates.length} date{availableDates.length !== 1 ? "s" : ""}{" "}
            available — click a highlighted date to continue
          </Typography>
        </Box>}
    </Box>
  );
}
