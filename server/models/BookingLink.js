const mongoose = require("mongoose");

const bookingLinkSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    availabilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
      required: true
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

bookingLinkSchema.index({ uniqueId: 1 });
bookingLinkSchema.index({ userId: 1 });

module.exports = mongoose.model("BookingLink", bookingLinkSchema);
