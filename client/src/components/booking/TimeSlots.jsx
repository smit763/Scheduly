import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { generateTimeSlots, formatSlotLabel } from "../../utils/timeUtils";

function SlotButton({ label, selected, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2,
        py: 1.1,
        borderRadius: "10px",
        border: `1.5px solid ${selected ? "#2563EB" : "#E5E7EB"}`,
        bgcolor: selected ? "#2563EB" : "white",
        color: selected ? "#fff" : "#374151",
        fontSize: "0.85rem",
        fontWeight: selected ? 700 : 500,
        cursor: "pointer",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        transition: "all 0.15s ease",
        boxShadow: selected ? "0 3px 12px rgba(37,99,235,0.3)" : "none",
        "&:hover": {
          borderColor: "#2563EB",
          bgcolor: selected ? "#1D4ED8" : "#EFF6FF",
          transform: "translateY(-1px)",
          boxShadow: selected
            ? "0 5px 16px rgba(37,99,235,0.35)"
            : "0 2px 8px rgba(37,99,235,0.12)"
        }
      }}
    >
      {selected && <CheckCircleIcon sx={{ fontSize: 13 }} />}
      {label}
    </Box>
  );
}

export default function TimeSlots({
  startTime,
  endTime,
  bookedSlots,
  slotsLoading,
  selectedSlot,
  onSlotSelect,
  selectedDate,
  hasAvailability
}) {
  const allSlots =
    startTime && endTime ? generateTimeSlots(startTime, endTime, 30) : [];
  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s));

  const cardHeader = (title, subtitle, icon) =>
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
          {title}
        </Typography>
        {subtitle &&
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>}
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
        {React.cloneElement(icon, { sx: { color: "#fff", fontSize: 18 } })}
      </Box>
    </Box>;

  const card = (children, headerTitle, headerSub, headerIcon) =>
    <Box
      sx={{
        bgcolor: "white",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
      }}
    >
      {cardHeader(headerTitle, headerSub, headerIcon)}
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        {children}
      </Box>
    </Box>;

  if (!selectedDate) {
    return card(
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            bgcolor: "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <TouchAppIcon sx={{ fontSize: 22, color: "#D1D5DB" }} />
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.25 }}>
            No date selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a highlighted date on the calendar to see available time
            slots.
          </Typography>
        </Box>
      </Box>,
      "Available Slots",
      "Choose a time",
      <AccessTimeIcon />
    );
  }

  if (!hasAvailability) {
    return card(
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            bgcolor: "#FEF2F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <EventBusyIcon sx={{ fontSize: 22, color: "#FCA5A5" }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          No availability set for this date.
        </Typography>
      </Box>,
      "Available Slots",
      "No availability",
      <AccessTimeIcon />
    );
  }

  if (slotsLoading) {
    return card(
      <Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {Array.from({ length: 8 }).map((_, i) =>
            <Skeleton
              key={i}
              variant="rounded"
              width={88}
              height={38}
              sx={{ borderRadius: "10px" }}
            />
          )}
        </Box>
      </Box>,
      "Available Slots",
      "Loading…",
      <AccessTimeIcon />
    );
  }

  if (availableSlots.length === 0) {
    return card(
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            bgcolor: "#FEF2F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <EventBusyIcon sx={{ fontSize: 22, color: "#FCA5A5" }} />
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.25 }}>
            Fully booked
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All slots for this date have been booked.
          </Typography>
        </Box>
      </Box>,
      "Available Slots",
      "0 slots remaining",
      <AccessTimeIcon />
    );
  }

  return card(
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {availableSlots.map(slot =>
          <SlotButton
            key={slot}
            label={formatSlotLabel(slot)}
            selected={selectedSlot === slot}
            onClick={() => onSlotSelect(slot)}
          />
        )}
      </Box>
      {selectedSlot &&
        <Box
          sx={{
            mt: 3,
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
          <CheckCircleIcon sx={{ fontSize: 15, color: "#2563EB" }} />
          <Typography
            variant="caption"
            sx={{ color: "#1D4ED8", fontWeight: 600 }}
          >
            {formatSlotLabel(selectedSlot)} selected — fill in your details
            below to confirm
          </Typography>
        </Box>}
    </Box>,
    "Available Slots",
    `${availableSlots.length} slot${availableSlots.length !== 1
      ? "s"
      : ""} available`,
    <AccessTimeIcon />
  );
}
