import { skills } from "./../tables/tables";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const upsertImage = mutation({
  args: { userId: v.id("users"), storageId: v.id("_storage") },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("images")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get image URL");

    if (existing) {
      await ctx.storage.delete(existing.imageId);

      await ctx.db.patch(existing._id, {
        imageId: args.storageId,
        imageUrl: url,
        updated_at: Date.now(),
      });
      return;
    }

    await ctx.db.insert("images", {
      userId: args.userId,
      imageId: args.storageId,
      imageUrl: url,
      creation_date: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const upsertBasicInfo = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    contactNumber: v.string(),
    location: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("basicInfo")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        contactNumber: args.contactNumber,
        location: args.location,
        updated_at: Date.now(),
      });
      return;
    }

    await ctx.db.insert("basicInfo", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      contactNumber: args.contactNumber,
      location: args.location,
      creation_date: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const upsertObjective = mutation({
  args: {
    userId: v.id("users"),
    description: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("objective")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        description: args.description,
        updated_at: Date.now(),
      });
      return;
    }

    await ctx.db.insert("objective", {
      userId: args.userId,
      description: args.description,
      creation_date: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const upsertEducBackground = mutation({
  args: {
    userId: v.id("users"),
    school: v.string(),
    background: v.string(),
    completed: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("educBackground")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        school: args.school,
        background: args.background,
        completed: args.completed,
        updated_at: Date.now(),
      });
      return;
    }

    await ctx.db.insert("educBackground", {
      userId: args.userId,
      school: args.school,
      background: args.background,
      completed: args.completed,
      creation_date: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const upsertSkills = mutation({
  args: {
    userId: v.id("users"),
    skill: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        skill: args.skill,
        updated_at: Date.now(),
      });
      return;
    }

    await ctx.db.insert("skills", {
      userId: args.userId,
      skill: args.skill,
      creation_date: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const upsertLanguages = mutation({
  args: {
    userId: v.id("users"),
    language: v.string(),
    expertise: v.union(
      v.literal("Beginner"),
      v.literal("Intermediate"),
      v.literal("Advanced"),
      v.literal("Proficient"),
      v.literal("Native"),
    ),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("languages")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        language: args.language,
        expertise: args.expertise,
        updated_at: Date.now(),
      });
      return;
    }

    await ctx.db.insert("languages", {
      userId: args.userId,
      language: args.language,
      expertise: args.expertise,
      creation_date: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const upsertExperience = mutation({
  args: {
    userId: v.id("users"),
    company: v.string(),
    position: v.string(),
    starting_date: v.number(),
    end_date: v.union(v.number(), v.string()),
    // update: v.boolean()
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("experience")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        company: args.company,
        position: args.position,
        starting_date: args.starting_date,
        end_date: args.end_date,
        updated_at: Date.now(),
      });
      return;
    }

    await ctx.db.insert("experience", {
      userId: args.userId,
      company: args.company,
      position: args.position,
      starting_date: args.starting_date,
      end_date: args.end_date,
      creation_date: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const upsertKeyResponsibilities = mutation({
  args: {
    userId: v.id("users"),
    experienceId: v.id("experience"),
    description: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("keyResponsibilities")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        description: args.description,
        updated_at: Date.now(),
      });
      return;
    }

    await ctx.db.insert("keyResponsibilities", {
      userId: args.userId,
      experienceId: args.experienceId,
      description: args.description,
      creation_date: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const upsertAwards = mutation({
  args: {
    userId: v.id("users"),
    starting_date: v.number(),
    end_date: v.number(),
    award: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("awards")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        starting_date: args.starting_date,
        end_date: args.end_date,
        award: args.award,
        updated_at: Date.now(),
      });
      return;
    }

    await ctx.db.insert("awards", {
      userId: args.userId,
      starting_date: args.starting_date,
      end_date: args.end_date,
      award: args.award,
      creation_date: Date.now(),
      updated_at: Date.now(),
    });
  },
});
