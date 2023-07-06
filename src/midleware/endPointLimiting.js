const Redis = require("ioredis");
const redis = new Redis();
const clientData = require("../database/models/userDocument");
const User = clientData.userDocument;

const userVisitRateLimit = (req, res, next) => {
  const user = User.findOne({
    username: req.body.username,
  });
  const maxAttempts = 5;
  const userid = user._id;
  const timeWindow = 60 * 1000;
  const key = `profile_limit:${userid}`;

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
        const expireTime = 180000; //2minutes
        // Set expiration time to reset the request count
        redis.set(key, requestCount, "PX", expireTime);
      }
    }

    // Check if the request count exceeds the maximum allowed requests
    if (requestCount > maxAttempts) {
      return res
        .status(429)

        .json({
          status: false,
          message:
            "Too many profile visits. Please wait for 3 minutes before visiting again.",
        });
    }

    // Proceed to the next middleware if rate limit is not exceeded
    next();
  });
};

const profileVisitRateLimit = userVisitRateLimit;
module.exports = { profileVisitRateLimit };
