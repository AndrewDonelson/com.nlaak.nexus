// convex/adminCheck.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const checkAdminStatus = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
      const adminRecord = await ctx.db
        .query("admins")
        .withIndex("by_userId")
        .filter(q => q.eq(q.field("userId"), args.userId))
        .first();
  
      return !!adminRecord;
    },
  });