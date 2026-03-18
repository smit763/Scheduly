const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingLinkId: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    bookerName: { type: String, required: true, trim: true },
    bookerEmail: { type: String, required: true, lowercase: true, trim: true }
  },
  { timestamps: true }
);

bookingSchema.index(
  { bookingLinkId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
