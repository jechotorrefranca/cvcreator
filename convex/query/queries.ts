import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
import { v } from "convex/values";

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});

export const getPfp = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const pfp = await ctx.db
      .query("images")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    return pfp;
  },
});

export const getBasicInfo = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const info = await ctx.db
      .query("basicInfo")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return info;
  },
});
