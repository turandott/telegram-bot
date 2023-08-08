import rateLimit from "telegraf-ratelimit";

// Set limit to 1 message per 5 seconds
export const limitConfig = {
  window: 5000,
  limit: 1,
  onLimitExceeded: (ctx, next) => ctx.reply("Rate limit exceeded"),
};
