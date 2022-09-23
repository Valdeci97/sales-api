import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';

export default class RateLimiter {
  private static TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 100;

  private static MAX_REQUESTS = 100;

  private static MESSAGE = {
    message: `You have exceeded ${this.MAX_REQUESTS} requests in 24 hours limit!`,
  };

  public static createLimiter(): RateLimitRequestHandler {
    return rateLimit({
      windowMs: this.TWENTY_FOUR_HOURS_IN_MS,
      max: this.MAX_REQUESTS,
      message: this.MESSAGE,
      standardHeaders: true,
      legacyHeaders: false,
    });
  }
}
