import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Fetches the authenticated user's information.
 * 
 * This function first checks if the user is authenticated, and if so, retrieves the user's data from the database.
 * It handles the case where the user is an anonymous user, and logs appropriate messages.
 * 
 * @returns The authenticated user's data, or null if the user is not authenticated.
 */
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    
    if (authUserId === null) {
      console.log("User: null (not authenticated)");
      return null;
    }

    try {
      const userId = authUserId as Id<"users">;
      const user = await ctx.db.get(userId);
      if (user != null && user.isAnonymous) {
        console.log("User is Anonymous");
      } else {
        console.log("User:", user);
      }      
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('email'), identity.email))
      .first();

    return user;
  },
});