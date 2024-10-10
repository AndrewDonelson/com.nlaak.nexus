import React, { useState, useCallback } from 'react';
import { useMutation, useQuery, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateGameStory, generateWorldDetails, generateStoryNode } from '@/lib/ai';
import { Choice, Consequence, StorySize } from '@/lib/game/types';
import { Id } from '@/convex/_generated/dataModel';
import { debug } from '@/lib/utils';

interface WorldGeneratorDebugProps {
    gameInfo: { genre: string; theme: string; additionalInfo: string };
    onProgress: (progress: number) => void;
}

const WorldGeneratorDebug: React.FC<WorldGeneratorDebugProps> = ({ gameInfo, onProgress }) => {
    const convex = useConvex();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stopGeneration, setStopGeneration] = useState(false);
    const [storySize, setStorySize] = useState<StorySize>(StorySize.Normal);
    const createStoryNode = useMutation(api.nexusEngine.createStoryNode);
    const createGameStory = useMutation(api.nexusEngine.createGameStory);
    const createWorldDetails = useMutation(api.nexusEngine.createWorldDetails);
    const updateStoryNode = useMutation(api.nexusEngine.updateStoryNode);

    const handleNodeCreate = async (content: string, choices: Choice[], parentNodeId: Id<"storyNodes"> | null) => {
        try {
            debug('WorldGeneratorDebug', `Creating node with content: ${content.substring(0, 50)}...`);
            debug('WorldGeneratorDebug', `Node choices: ${JSON.stringify(choices)}`);

            const newNodeId = await createStoryNode({
                content,
                choices,
                parentNodeId
            });
            debug('WorldGeneratorDebug', `Node created with ID: ${newNodeId}`);
            return newNodeId;
        } catch (error) {
            console.error("Error creating node:", error);
            debug('WorldGeneratorDebug', `Error creating node: ${error}`);
            throw new Error(`Failed to create node`);
        }
    };

    const generateWorld = async () => {
        setIsGenerating(true);
        setError(null);
        setStopGeneration(false);
        onProgress(0);

        try {
            debug('WorldGeneratorDebug', 'Starting world generation');
            debug('WorldGeneratorDebug', `Game info: ${JSON.stringify(gameInfo)}`);
            debug('WorldGeneratorDebug', `Story size: ${storySize}`);

            const { gameStoryId, outline } = await generateGameStoryAndOutline();
            await generateWorldDetailsAndSave(gameStoryId, outline);
            const rootNodeId = await generateNodes(outline);

            await updateGameStoryWithRootNode(gameStoryId, rootNodeId);

            debug('WorldGeneratorDebug', 'World generation completed');
        } catch (error) {
            console.error("Error generating world:", error);
            debug('WorldGeneratorDebug', `Error generating world: ${error}`);
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsGenerating(false);
            setStopGeneration(false);
        }
    };

    const generateGameStoryAndOutline = async (): Promise<{ gameStoryId: Id<"gameStories">; outline: any }> => {
        try {
            const outline = await generateGameStory(gameInfo.genre, gameInfo.theme, gameInfo.additionalInfo);
            if (!outline) throw new Error("Failed to generate game story");
    
            debug('WorldGeneratorDebug', `Game story outline: ${JSON.stringify(outline)}`);
    
            const gameStoryId = await createGameStory({
                ...outline,
                storySize: storySize,
                // We're not setting rootNodeId here, it will be updated later
            });
            return { gameStoryId, outline };
        } catch (error) {
            throw new Error(`Failed to generate game story: ${error}`);
        }
    };

    const generateWorldDetailsAndSave = async (gameStoryId: Id<"gameStories">, outline: any) => {
        try {
            const details = await generateWorldDetails(JSON.stringify(outline), storySize);
            if (!details) throw new Error("Failed to generate world details");

            //const details = JSON.parse(detailsResponse);
            debug('WorldGeneratorDebug', `World details: ${JSON.stringify(details)}`);

            await createWorldDetails({
                gameStoryId,
                ...details
            });
        } catch (error) {
            throw new Error(`Failed to generate world details: ${error}`);
        }
    };

    const generateNodes = async (outline: any): Promise<Id<"storyNodes">> => {
        let rootNodeId: Id<"storyNodes"> | null = null;
        let nodesCreated = 0;
    
        const createNode = async (parentNodeId: Id<"storyNodes"> | null, depth: number): Promise<void> => {
            if (stopGeneration || nodesCreated >= storySize) {
                return;
            }
    
            try {
                const nodeContent = await generateStoryNode(
                    outline,
                    [], // Empty array for surroundingNodes
                    { x: nodesCreated, y: 0, totalWidth: storySize, totalHeight: 1 } // Linear world position
                );
                debug('WorldGeneratorDebug', `Node content: ${JSON.stringify(nodeContent)}`);
    
                const newNodeId = await handleNodeCreate(nodeContent.content, nodeContent.choices, parentNodeId);
                nodesCreated++;
    
                if (!rootNodeId) {
                    rootNodeId = newNodeId;
                }
    
                onProgress((nodesCreated / storySize) * 100);
    
                // Recursively create child nodes
                for (const choice of nodeContent.choices) {
                    if (depth < 5 && Math.random() > 0.3) { // Limit depth and add some randomness
                        await createNode(newNodeId, depth + 1);
                    }
                }
            } catch (error) {
                throw new Error(`Failed to generate node: ${error}`);
            }
        };
    
        await createNode(null, 0);
    
        if (!rootNodeId) {
            throw new Error("Failed to create root node");
        }
    
        return rootNodeId;
    };

    const updateGameStoryWithRootNode = async (gameStoryId: Id<"gameStories">, rootNodeId: Id<"storyNodes">) => {
        try {
            await convex.mutation(api.nexusEngine.updateGameStory, {
                storyId: gameStoryId,
                updates: { rootNodeId }
            });
            debug('WorldGeneratorDebug', `Updated game story with root node ID: ${rootNodeId}`);
        } catch (error) {
            throw new Error(`Failed to update game story with root node: ${error}`);
        }
    };

    return (
        <div className="space-y-4">
            <Select onValueChange={(value) => setStorySize(StorySize[value as keyof typeof StorySize])}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select story size" />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(StorySize).filter(key => isNaN(Number(key))).map((size) => (
                        <SelectItem key={size} value={size}>{size} ({StorySize[size as keyof typeof StorySize]} nodes)</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {!isGenerating ? (
                <Button onClick={generateWorld} className="w-full">
                    Generate World (Debug)
                </Button>
            ) : (
                <Button onClick={() => setStopGeneration(true)} className="w-full bg-red-500 hover:bg-red-600">
                    Stop Generating
                </Button>
            )}
            {isGenerating && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${onProgress}%` }}></div>
                </div>
            )}
            {error && (
                <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default WorldGeneratorDebug;