const Redis = require("ioredis");
const redis = new Redis();

const wrongPasswordRateLimiting = (req, res, next) => {
  const maxAttempts = 5;
  const ip = req.ip;
  const key = `attempts_ip:${ip}`;
  const timeWindow = 60 * 1000;

  redis.get(key, (err, requestCount) => {
    if (err) {
      console.error("Redis error:", err);
      return res.status(500).send("Internal Server Error");
    }

    // If the request count doesn't exist or has expired, initialize it
    if (!requestCount) {
      requestCount = 1;
      redis.set(key, requestCount, "PX", timeWindow);
    } else {
      // If the request count exists, increment it
      requestCount = parseInt(requestCount) + 1;
      if (requestCount <= maxAttempts) {
        redis.set(key, requestCount);
      } else {
        const expireTime = 30000; //5minutes

        redis.set(key, requestCount, "PX", expireTime);
      }
    }

    if (requestCount > maxAttempts) {
      return res.status(429).json({
        status: false,
        message:
          "Too many failed attempts. Please wait for 5 minutes before trying again.",
      });
    }

    next();
  });
};

const wrongPasswordRateLimit = wrongPasswordRateLimiting;
module.exports = { wrongPasswordRateLimit };
