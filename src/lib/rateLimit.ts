import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// rate limiter that allows 5 requests per 1 minute per IP
export const sendMsgRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/send-msg",
});