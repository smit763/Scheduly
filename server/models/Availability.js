const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  { timestamps: true }
);

availabilitySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("Availability", availabilitySchema);
