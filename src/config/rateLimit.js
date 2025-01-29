import rateLimiter from "express-rate-limit";

export const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "You have exceeded the 100 requests in 15 minutes limit!",
  headers: true,
});

export const loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many login attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const appointmentLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message:
      "Too many appointment from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
