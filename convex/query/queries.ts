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

export const getObjective = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const info = await ctx.db
      .query("objective")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return info;
  },
});

export const getEducBg = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const info = await ctx.db
      .query("educBackground")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return info;
  },
});

export const getSkills = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const info = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return info;
  },
});

export const getLanguages = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const info = await ctx.db
      .query("languages")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return info;
  },
});

export const getExperienceWithResponsibilities = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const experiences = await ctx.db
      .query("experience")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const responsibilities = await Promise.all(
      experiences.map((exp) =>
        ctx.db
          .query("keyResponsibilities")
          .withIndex("by_experienceId", (q) => q.eq("experienceId", exp._id))
          .collect(),
      ),
    );

    return experiences.map((exp, i) => ({
      ...exp,
      responsibilities: responsibilities[i],
    }));
  },
});

export const getAwards = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const info = await ctx.db
      .query("awards")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return info;
  },
});
