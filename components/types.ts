import { Id } from "@/convex/_generated/dataModel";
import { basicInfo } from "./../convex/tables/tables";

export interface BasicInfo {
  userId: Id<"users">;
  name: string;
  email: string;
  contactNumber: string;
  location: string;
}
