const express = require("express");
const { body } = require("express-validator");
const {
  createBooking,
  getBookedSlots
} = require("../controllers/bookingController");

const router = express.Router();

router.post(
  "/",
  [
    body("bookingLinkId").notEmpty().withMessage("bookingLinkId is required"),
    body("date").notEmpty().isDate().withMessage("Valid date is required"),
    body("timeSlot").notEmpty().withMessage("timeSlot is required"),
    body("bookerName").notEmpty().trim().withMessage("Name is required"),
    body("bookerEmail").isEmail().withMessage("Valid email is required")
  ],
  createBooking
);

router.get("/slots", getBookedSlots);

module.exports = router;
