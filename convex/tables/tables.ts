import { defineTable } from "convex/server";
import { v } from "convex/values";

export const basicInfo = defineTable({
  userId: v.id("users"),
  name: v.string(),
  email: v.string(),
  contactNumber: v.string(),
  creation_date: v.number(),
  updated_at: v.number(),
});

export const objective = defineTable({
  userId: v.id("users"),
  description: v.string(),
  creation_date: v.number(),
  updated_at: v.number(),
});

export const educBackground = defineTable({
  userId: v.id("users"),
  school: v.string(),
  background: v.string(),
  completed: v.string(),
  creation_date: v.number(),
  updated_at: v.number(),
});

export const skills = defineTable({
  userId: v.id("users"),
  skill: v.string(),
  creation_date: v.number(),
  updated_at: v.number(),
});

export const languages = defineTable({
  userId: v.id("users"),
  language: v.string(),
  expertise: v.union(
    v.literal("Beginner"),
    v.literal("Intermediate"),
    v.literal("Advanced"),
    v.literal("Proficient"),
    v.literal("Native"),
  ),
  creation_date: v.number(),
  updated_at: v.number(),
});

export const experience = defineTable({
    userId: v.id("users"),
    company: v.string(),
    position: v.string(),
    starting_date: v.number(),
    end_date: v.union(v.number(), v.string()),
    creation_date: v.number(),
    updated_at: v.number(),
})

export const keyResponsibilities = defineTable({
    userId: v.id("users"),
    experienceId: v.id("experience"),
    description: v.string(),
    creation_date: v.number(),
    updated_at: v.number(),
})

export const awards = defineTable({
    userId: v.id("users"),
    starting_date: v.number(),
    end_date: v.number(),
    award: v.string(),
    creation_date: v.number(),
    updated_at: v.number(),
})