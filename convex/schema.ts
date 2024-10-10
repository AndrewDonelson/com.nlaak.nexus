import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  admins: defineTable({
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),

  players: defineTable({
    name: v.string(),
    description: v.string(),
    inventory: v.array(v.string()),
    stats: v.record(v.string(), v.number()),
    politicalAlignment: v.object({
      values: v.object({
        individualLiberty: v.number(),
        fiscalResponsibility: v.number(),
        traditionalValues: v.number(),
        nationalSecurity: v.number(),
        freeMarketEconomy: v.number(),
        constitutionalInterpretation: v.number(),
        localAutonomy: v.number(),
        lawEnforcement: v.number(),
        patriotism: v.number(),
        religiousExpression: v.number(),
        socialEquity: v.number(),
        environmentalProtection: v.number(),
        governmentServices: v.number(),
        progressiveTaxation: v.number(),
        civilRights: v.number(),
        weaponRegulation: v.number(),
        multiculturalism: v.number(),
        internationalCooperation: v.number(),
        healthcareAccess: v.number(),
        laborRights: v.number(),
      }),
      overallAlignment: v.number(),
    }),
    alignmentHistory: v.array(v.object({
      timestamp: v.number(),
      alignment: v.number(),
    })),
  }),

  storyNodes: defineTable({
    content: v.string(),
    choices: v.array(
      v.object({
        id: v.string(),
        text: v.string(),
        consequences: v.array(
          v.object({
            type: v.union(v.literal("addItem"), v.literal("removeItem"), v.literal("setFlag"), v.literal("alterStat"), v.literal("changePoliticalValue")),
            target: v.string(),
            value: v.optional(v.union(v.number(), v.boolean())),
            description: v.optional(v.string())
          })
        ),
        nextNodeId: v.optional(v.union(v.id("storyNodes"), v.null()))
      })
    ),
    parentNodeId: v.optional(v.union(v.id("storyNodes"), v.null())),
    visitCount: v.number(),
  }),

  nexusGameSessions: defineTable({
    playerId: v.id('players'),
    currentNodeId: v.id('storyNodes'),
    flags: v.record(v.string(), v.boolean()),
    visitedNodes: v.array(v.id('storyNodes')),
    title: v.string(),
    version: v.string(),
  }),

  gameStories: defineTable({
    title: v.string(),
    mainPlot: v.string(),
    keyCharacters: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
      })
    ),
    majorStoryBeats: v.array(v.string()),
    storySize: v.union(
      v.literal("Quick"),
      v.literal("Short"),
      v.literal("Normal"),
      v.literal("Long"),
      v.literal("Extended"),
      v.literal("Huge"),
      v.literal("Epic")
    ),
    rootNodeId: v.id("storyNodes"),
  }),

  worldDetails: defineTable({
    gameStoryId: v.id('gameStories'),
    locations: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        pointsOfInterest: v.array(v.string()),
      })
    ),
    environments: v.array(
      v.object({
        type: v.string(),
        description: v.string(),
      })
    ),
  })
});