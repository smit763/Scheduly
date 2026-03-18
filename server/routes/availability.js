const express = require("express");
const { body } = require("express-validator");
const {
  createAvailability,
  getMyAvailability,
  deleteAvailability
} = require("../controllers/availabilityController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", protect, getMyAvailability);

router.post(
  "/",
  protect,
  [
    body("date")
      .notEmpty()
      .isDate()
      .withMessage("Valid date is required (YYYY-MM-DD)"),
    body("startTime")
      .notEmpty()
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("Valid startTime (HH:MM) required"),
    body("endTime")
      .notEmpty()
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("Valid endTime (HH:MM) required")
  ],
  validate,
  createAvailability
);

router.delete("/:id", protect, deleteAvailability);

module.exports = router;
