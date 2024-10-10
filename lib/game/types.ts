import { Id } from "@/convex/_generated/dataModel";

export interface PoliticalValues {
    individualLiberty: number;
    fiscalResponsibility: number;
    traditionalValues: number;
    nationalSecurity: number;
    freeMarketEconomy: number;
    constitutionalInterpretation: number;
    localAutonomy: number;
    lawEnforcement: number;
    patriotism: number;
    religiousExpression: number;
    socialEquity: number;
    environmentalProtection: number;
    governmentServices: number;
    progressiveTaxation: number;
    civilRights: number;
    weaponRegulation: number;
    multiculturalism: number;
    internationalCooperation: number;
    healthcareAccess: number;
    laborRights: number;
}

export interface PoliticalAlignment {
    values: PoliticalValues;
    overallAlignment: number;
}

export interface AlignmentHistoryPoint {
    timestamp: number;
    alignment: number;
}

export interface Player {
    _id: Id<"players">;
    name: string;
    description: string;
    inventory: string[];
    stats: Record<string, number>;
    politicalAlignment: PoliticalAlignment;
    alignmentHistory: AlignmentHistoryPoint[];
}

export type Consequence = 
  | { type: 'addItem' | 'removeItem'; target: string; value?: never; description?: string }
  | { type: 'setFlag'; target: string; value: boolean; description?: string }
  | { type: 'alterStat' | 'changePoliticalValue'; target: string; value: number; description?: string };

  export interface StoryNode {
    _id: Id<"storyNodes">;
    content: string;
    choices: Choice[];
    parentNodeId: Id<"storyNodes"> | null;
    visitCount: number;
  }
  
  export interface Choice {
    id: string;
    text: string;
    consequences: Consequence[];
    nextNodeId: Id<"storyNodes"> | null;
  }

export interface NexusGameSession {
    _id: Id<"nexusGameSessions">;
    playerId: Id<"players">;
    currentNodeId: Id<"storyNodes">;
    flags: Record<string, boolean>;
    visitedNodes: Id<"storyNodes">[];
    title: string;
    version: string;
}

export enum StorySize {
    Quick = 10,
    Short = 25,
    Normal = 100,
    Long = 200,
    Extended = 250,
    Huge = 500,
    Epic = 1000
}