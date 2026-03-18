const express = require("express");
const { body } = require("express-validator");
const {
  generateBookingLink,
  validateBookingLink
} = require("../controllers/bookingLinkController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate.js");

const router = express.Router();

router.post(
  "/generate",
  protect,
  [
    body("availabilityId").notEmpty().withMessage("availabilityId is required")
  ],
  validate,
  generateBookingLink
);

router.get("/:uniqueId", validateBookingLink);

module.exports = router;
