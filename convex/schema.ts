import { basicInfo, objective, educBackground, skills, languages, experience, keyResponsibilities, awards } from './tables/tables';
import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables, 
  basicInfo,
  objective,
  educBackground,
  skills,
  languages,
  experience,
  keyResponsibilities,
  awards,
});
