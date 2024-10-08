import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  admins: defineTable({
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),

  // profiles: defineTable({
  //   userId: v.id("users"),
  //   username: v.string(),
  //   bio: v.optional(v.string({ maxLength: 384 })),
  //   tags: v.optional(v.array(v.string({ maxLength: 16 }), { maxLength: 10 })),
  //   location: v.optional(v.string({ maxLength: 48 })),
  //   website: v.optional(v.array(v.string(), { maxLength: 3 })),
  //   visible: v.boolean(),
  // })
  //   .index("by_userId", ["userId"])
  //   .index("by_username", ["username"])
  //   .searchIndex("search_username", {
  //     searchField: "username",
  //     filterFields: ["visible"],
  //   }),  
});
