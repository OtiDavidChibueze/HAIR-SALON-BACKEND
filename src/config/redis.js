import { createClient } from "redis"; // Correct import
import { REDIS_HOST, REDIS_PORT } from "./keys.js";
import { Logger } from "./logger.js";

// Create Redis client
const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`, // Modern connection string format
});

// Redis event listeners
redisClient.on("connect", () => {
  Logger.info("Redis Connected");
});

redisClient.on("error", (err) => {
  Logger.error("Redis Error:", err.message);
});

redisClient.on("end", () => {
  Logger.info("Redis disconnected");
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect(); // Required for v4+
    Logger.info("Redis client successfully connected.");
  } catch (err) {
    Logger.error("Redis connection failed:", err);
  }
})();

export default redisClient;
