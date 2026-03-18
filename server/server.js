require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db.js");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const availabilityRoutes = require("./routes/availability");
const bookingLinkRoutes = require("./routes/bookingLink");
const bookingRoutes = require("./routes/booking");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: [ "GET", "POST", "PUT", "DELETE", "OPTIONS" ],
    allowedHeaders: [ "Content-Type", "Authorization" ]
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    env: process.env.NODE_ENV
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/booking-links", bookingLinkRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV ||
      "development"} mode on port ${PORT}`
  )
);
