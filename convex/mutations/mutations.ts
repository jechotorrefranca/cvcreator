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
