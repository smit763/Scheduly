const { nanoid } = require("nanoid");
const BookingLink = require("../models/BookingLink");
const Availability = require("../models/Availability");

const generateBookingLink = async (req, res, next) => {
  try {
    const { availabilityId } = req.body;
    const userId = req.user._id;

    if (!availabilityId) {
      return res
        .status(400)
        .json({ success: false, message: "availabilityId is required." });
    }

    const availability = await Availability.findOne({
      _id: availabilityId,
      userId
    });
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found or does not belong to you."
      });
    }

    const existing = await BookingLink.findOne({
      availabilityId,
      active: true
    });
    if (existing) {
      return res.json({
        success: true,
        data: { uniqueId: existing.uniqueId, url: `/book/${existing.uniqueId}` }
      });
    }

    const uniqueId = nanoid(10);
    await BookingLink.create({ uniqueId, userId, availabilityId });

    res
      .status(201)
      .json({ success: true, data: { uniqueId, url: `/book/${uniqueId}` } });
  } catch (err) {
    next(err);
  }
};

const validateBookingLink = async (req, res, next) => {
  try {
    const { uniqueId } = req.params;
    const bookingLink = await BookingLink.findOne({
      uniqueId,
      active: true
    }).populate("availabilityId");

    if (!bookingLink) {
      return res.status(404).json({
        success: false,
        message: "Booking link not found or inactive."
      });
    }

    res.json({ success: true, data: bookingLink });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateBookingLink, validateBookingLink };
