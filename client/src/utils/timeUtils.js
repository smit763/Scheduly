export const generateTimeSlots = (startTime, endTime, intervalMinutes = 30) => {
  if (!startTime || !endTime) return [];
  const slots = [];
  const [ startH, startM ] = startTime.split(":").map(Number);
  const [ endH, endM ] = endTime.split(":").map(Number);

  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current < end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(to24HourSlot(h, m));
    current += intervalMinutes;
  }

  return slots;
};

export const to24HourSlot = (h, m) => {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const formatSlotLabel = (slot) => {
  const [ h, m ] = slot.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  const minute = String(m).padStart(2, "0");
  return `${hour}:${minute} ${period}`;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
