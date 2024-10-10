import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { PoliticalValues, StorySize } from "@/lib/game/types";

export const getPlayer = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.playerId);
  },
});

export const getStoryNode = query({
  args: { nodeId: v.id("storyNodes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.nodeId);
  },
});

export const getNexusGameSession = query({
  args: { sessionId: v.id("nexusGameSessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const createPlayer = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const defaultPoliticalValues = {
      individualLiberty: 50,
      fiscalResponsibility: 50,
      traditionalValues: 50,
      nationalSecurity: 50,
      freeMarketEconomy: 50,
      constitutionalInterpretation: 50,
      localAutonomy: 50,
      lawEnforcement: 50,
      patriotism: 50,
      religiousExpression: 50,
      socialEquity: 50,
      environmentalProtection: 50,
      governmentServices: 50,
      progressiveTaxation: 50,
      civilRights: 50,
      weaponRegulation: 50,
      multiculturalism: 50,
      internationalCooperation: 50,
      healthcareAccess: 50,
      laborRights: 50,
    };

    const playerId = await ctx.db.insert("players", {
      name: args.name,
      description: args.description,
      inventory: [],
      stats: {},
      politicalAlignment: {
        values: defaultPoliticalValues,
        overallAlignment: 0,
      },
      alignmentHistory: [{ timestamp: Date.now(), alignment: 0 }],
    });
    return playerId;
  },
});

export const createNexusGameSession = mutation({
  args: {
    playerId: v.id("players"),
    startingNodeId: v.id("storyNodes"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("nexusGameSessions", {
      playerId: args.playerId,
      currentNodeId: args.startingNodeId,
      flags: {},
      visitedNodes: [args.startingNodeId],
      title: args.title,
      version: "1.0.0",
    });
    return sessionId;
  },
});

export const updatePoliticalAlignment = mutation({
  args: {
    playerId: v.id("players"),
    changes: v.record(v.string(), v.number()),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) throw new Error("Player not found");

    const newValues = { ...player.politicalAlignment.values };
    let changeSum = 0;
    let changeCount = 0;

    Object.entries(args.changes).forEach(([key, change]) => {
      if (key in newValues && typeof change === 'number') {
        const typedKey = key as keyof PoliticalValues;
        newValues[typedKey] = Math.max(0, Math.min(100, newValues[typedKey] + change));
        changeSum += change;
        changeCount++;
      }
    });

    const averageChange = changeCount > 0 ? changeSum / changeCount : 0;
    const newOverallAlignment = Math.max(-100, Math.min(100, player.politicalAlignment.overallAlignment + averageChange));

    await ctx.db.patch(args.playerId, {
      politicalAlignment: {
        values: newValues,
        overallAlignment: newOverallAlignment,
      },
      alignmentHistory: [
        ...player.alignmentHistory,
        { timestamp: Date.now(), alignment: newOverallAlignment }
      ],
    });
  },
});

export const makeChoice = mutation({
  args: {
    sessionId: v.id("nexusGameSessions"),
    choiceId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Game session not found");

    const currentNode = await ctx.db.get(session.currentNodeId);
    if (!currentNode) throw new Error("Current story node not found");

    const choice = currentNode.choices.find(c => c.id === args.choiceId);
    if (!choice) throw new Error("Invalid choice");

    // Apply consequences
    for (const consequence of choice.consequences) {
      switch (consequence.type) {
        case 'addItem':
        case 'removeItem':
          const player = await ctx.db.get(session.playerId);
          if (player) {
            const newInventory = consequence.type === 'addItem'
              ? [...player.inventory, consequence.target]
              : player.inventory.filter(item => item !== consequence.target);
            await ctx.db.patch(session.playerId, { inventory: newInventory });
          }
          break;
        case 'setFlag':
          if (typeof consequence.value === 'boolean') {
            await ctx.db.patch(args.sessionId, {
              flags: { ...session.flags, [consequence.target]: consequence.value },
            });
          }
          break;
        case 'alterStat':
          const playerForStat = await ctx.db.get(session.playerId);
          if (playerForStat && typeof consequence.value === 'number') {
            const currentValue = playerForStat.stats[consequence.target] || 0;
            await ctx.db.patch(session.playerId, {
              stats: {
                ...playerForStat.stats,
                [consequence.target]: currentValue + consequence.value,
              },
            });
          }
          break;
        case 'changePoliticalValue':
          if (typeof consequence.value === 'number') {
            await updatePoliticalAlignment(ctx, {
              playerId: session.playerId,
              changes: { [consequence.target]: consequence.value },
            });
          }
          break;
      }
    }

    // Move to the next node
    if (choice.nextNodeId) {
      await ctx.db.patch(args.sessionId, {
        currentNodeId: choice.nextNodeId,
        visitedNodes: [...session.visitedNodes, choice.nextNodeId],
      });
      await ctx.db.patch(choice.nextNodeId, {
        visitCount: (await ctx.db.get(choice.nextNodeId))!.visitCount + 1,
      });
    }
  },
});

export const goBack = mutation({
  args: {
    sessionId: v.id("nexusGameSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Game session not found");

    const currentNode = await ctx.db.get(session.currentNodeId);
    if (!currentNode) throw new Error("Current story node not found");

    if (currentNode.parentNodeId) {
      await ctx.db.patch(args.sessionId, {
        currentNodeId: currentNode.parentNodeId,
        visitedNodes: [...session.visitedNodes, currentNode.parentNodeId],
      });
      await ctx.db.patch(currentNode.parentNodeId, {
        visitCount: (await ctx.db.get(currentNode.parentNodeId))!.visitCount + 1,
      });
    } else {
      throw new Error("Cannot go back from the root node");
    }
  },
});

export const createStoryNode = mutation({
  args: {
    content: v.string(),
    choices: v.array(v.object({
      id: v.string(),
      text: v.string(),
      consequences: v.array(v.object({
        type: v.union(v.literal('addItem'), v.literal('removeItem'), v.literal('setFlag'), v.literal('alterStat'), v.literal('changePoliticalValue')),
        target: v.string(),
        value: v.optional(v.union(v.number(), v.boolean())),
        description: v.optional(v.string())
      })),
      nextNodeId: v.optional(v.union(v.id("storyNodes"), v.null()))
    })),
    parentNodeId: v.optional(v.union(v.id("storyNodes"), v.null())),
  },
  handler: async (ctx, args) => {
    const nodeId = await ctx.db.insert("storyNodes", {
      content: args.content,
      choices: args.choices,
      parentNodeId: args.parentNodeId,
      visitCount: 0,
    });
    return nodeId;
  },
});

export const getAllStoryNodes = query({
  handler: async (ctx) => {
    return await ctx.db.query("storyNodes").collect();
  },
});

export const createGameStory = mutation({
  args: {
    title: v.string(),
    mainPlot: v.string(),
    keyCharacters: v.array(v.object({
      name: v.string(),
      description: v.string(),
    })),
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
  },
  handler: async (ctx, args) => {
    const storyId = await ctx.db.insert("gameStories", args);
    return storyId;
  },
});

export const getGameStory = query({
  args: { storyId: v.id("gameStories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.storyId);
  },
});


export const updateStoryNode = mutation({
  args: {
    nodeId: v.id("storyNodes"),
    updates: v.object({
      content: v.optional(v.string()),
      choices: v.optional(v.array(v.object({
        id: v.string(),
        text: v.string(),
        consequences: v.array(v.object({
          type: v.union(v.literal('addItem'), v.literal('removeItem'), v.literal('setFlag'), v.literal('alterStat'), v.literal('changePoliticalValue')),
          target: v.string(),
          value: v.optional(v.union(v.number(), v.boolean())),
          description: v.optional(v.string())
        })),
        nextNodeId: v.optional(v.union(v.id("storyNodes"), v.null()))
      }))),
      parentNodeId: v.optional(v.union(v.id("storyNodes"), v.null())),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.nodeId, args.updates);
  },
});

export const deleteStoryNode = mutation({
  args: { nodeId: v.id("storyNodes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.nodeId);
  },
});

export const createWorldDetails = mutation({
  args: {
    gameStoryId: v.id("gameStories"),
    locations: v.array(v.object({
      name: v.string(),
      description: v.string(),
      pointsOfInterest: v.array(v.string()),
    })),
    environments: v.array(v.object({
      type: v.string(),
      description: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const worldDetailsId = await ctx.db.insert("worldDetails", args);
    return worldDetailsId;
  },
});

export const updateGameStory = mutation({
  args: {
    storyId: v.id("gameStories"),
    updates: v.object({
      rootNodeId: v.optional(v.id("storyNodes")),
      title: v.optional(v.string()),
      mainPlot: v.optional(v.string()),
      keyCharacters: v.optional(v.array(v.object({
        name: v.string(),
        description: v.string(),
      }))),
      majorStoryBeats: v.optional(v.array(v.string())),
      storySize: v.optional(v.union(
        v.literal("Quick"),
        v.literal("Short"),
        v.literal("Normal"),
        v.literal("Long"),
        v.literal("Extended"),
        v.literal("Huge"),
        v.literal("Epic")
      )),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.storyId, args.updates);
  },
});