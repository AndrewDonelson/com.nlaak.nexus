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
    
        const createNode = async (parentNodeId: Id<"storyNodes"> | null, depth: number): Promise<Id<"storyNodes">> => {
            if (stopGeneration || nodesCreated >= storySize) {
                throw new Error("Node generation stopped or limit reached");
            }
    
            try {
                const nodeContent = await generateStoryNode(
                    outline,
                    [], // Empty array for surroundingNodes
                    { x: depth, y: nodesCreated, totalWidth: storySize, totalHeight: storySize } // For AI generation context
                );
                debug('WorldGeneratorDebug', `Node content: ${JSON.stringify(nodeContent)}`);
    
                const newNodeId = await handleNodeCreate(nodeContent.content, [], parentNodeId);
                nodesCreated++;
    
                if (!rootNodeId) {
                    rootNodeId = newNodeId;
                }
    
                onProgress((nodesCreated / storySize) * 100);
    
                // Create child nodes and update choices
                const updatedChoices = [];
                const choiceCount = Math.floor(Math.random() * 4) + 2; // 2 to 5 choices
                for (let i = 0; i < choiceCount; i++) {
                    const choice = nodeContent.choices[i] || { 
                        id: `choice_${i}`, 
                        text: `Generated choice ${i + 1}`,
                        consequences: []
                    };
                    
                    // Generate consequences
                    const consequenceCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 consequences
                    for (let j = 0; j < consequenceCount; j++) {
                        const consequenceType = ['addItem', 'removeItem', 'setFlag', 'alterStat', 'changePoliticalValue'][Math.floor(Math.random() * 5)];
                        choice.consequences.push({
                            type: consequenceType,
                            target: `generated_target_${j}`,
                            value: Math.random() > 0.5 ? Math.floor(Math.random() * 20) - 10 : Math.random() > 0.5,
                            description: `Generated consequence ${j + 1}`
                        });
                    }

                    if (depth < 5 && nodesCreated < storySize) { // Limit depth and total nodes
                        const childNodeId = await createNode(newNodeId, depth + 1);
                        updatedChoices.push({...choice, nextNodeId: childNodeId});
                    } else {
                        updatedChoices.push(choice);
                    }
                }
    
                // Update the node with the linked choices
                await updateStoryNode({
                    nodeId: newNodeId,
                    updates: { choices: updatedChoices }
                });
    
                return newNodeId;
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