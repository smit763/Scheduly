const Availability = require("../models/Availability");
const BookingLink = require("../models/BookingLink");

const createAvailability = async (req, res, next) => {
  try {
    const { date, startTime, endTime } = req.body;
    const userId = req.user._id;

    const [ startH, startM ] = startTime.split(":").map(Number);
    const [ endH, endM ] = endTime.split(":").map(Number);

    if (endH * 60 + endM <= startH * 60 + startM) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time."
      });
    }

    const today = new Date().toISOString().split("T")[0];
    if (date <= today) {
      return res
        .status(400)
        .json({ success: false, message: "Date must be in the future." });
    }

    const availability = await Availability.create({
      userId,
      date,
      startTime,
      endTime
    });
    res.status(201).json({ success: true, data: availability });
  } catch (err) {
    next(err);
  }
};

const getMyAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const availabilities = await Availability.find({ userId })
      .sort({ date: 1 })
      .lean();

    const availabilityIds = availabilities.map((a) => a._id);
    const links = await BookingLink.find({
      availabilityId: { $in: availabilityIds },
      active: true
    })
      .select("availabilityId uniqueId")
      .lean();

    const linkMap = {};
    links.forEach((l) => {
      linkMap[l.availabilityId.toString()] = `/book/${l.uniqueId}`;
    });

    const result = availabilities.map((a) => ({
      ...a,
      generatedLink: linkMap[a._id.toString()] || null
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const deleteAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const availability = await Availability.findOne({ _id: id, userId });
    if (!availability) {
      return res
        .status(404)
        .json({ success: false, message: "Availability not found." });
    }

    await BookingLink.updateMany({ availabilityId: id }, { active: false });
    await availability.deleteOne();

    res.json({ success: true, message: "Availability deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = { createAvailability, getMyAvailability, deleteAvailability };
