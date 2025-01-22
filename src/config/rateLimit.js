import rateLimiter from "express-rate-limit";

export const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "You have exceeded the 100 requests in 15 minutes limit!",
  headers: true,
});

export const loginLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "too many login attempt! Please try again later",
});
