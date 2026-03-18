const { validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const BookingLink = require("../models/BookingLink");

const createBooking = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { bookingLinkId, date, timeSlot, bookerName, bookerEmail } = req.body;

    const bookingLink = await BookingLink.findOne({
      uniqueId: bookingLinkId,
      active: true
    });
    if (!bookingLink) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or inactive booking link" });
    }

    const existing = await Booking.findOne({ bookingLinkId, date, timeSlot });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "This time slot is already booked" });
    }

    const booking = new Booking({
      bookingLinkId,
      date,
      timeSlot,
      bookerName,
      bookerEmail
    });
    await booking.save();

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "This time slot is already booked" });
    }
    next(err);
  }
};

const getBookedSlots = async (req, res, next) => {
  try {
    const { bookingLinkId, date } = req.query;

    if (!bookingLinkId || !date) {
      return res
        .status(400)
        .json({
          success: false,
          message: "bookingLinkId and date are required"
        });
    }

    const bookings = await Booking.find({ bookingLinkId, date }).select(
      "timeSlot"
    );
    const bookedSlots = bookings.map((b) => b.timeSlot);

    res.json({ success: true, data: bookedSlots });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, getBookedSlots };
