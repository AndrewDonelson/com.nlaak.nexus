import React, { useState, useCallback } from 'react';
import { useMutation, useQuery, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { generateGameStory, generateWorldDetails, generateStoryNode, SurroundingNode, WorldPosition } from '@/lib/ai';
import { StoryNode, Choice, Consequence } from '@/lib/game/types';
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
    //const getStoryNode = useQuery(api.nexusEngine.getStoryNode);
    const createStoryNode = useMutation(api.nexusEngine.createStoryNode);
    const createGameStory = useMutation(api.nexusEngine.createGameStory);
    const createWorldDetails = useMutation(api.nexusEngine.createWorldDetails);
    const updateStoryNode = useMutation(api.nexusEngine.updateStoryNode);
    const allNodes = useQuery(api.nexusEngine.getAllStoryNodes) ?? [];

    const handleNodeCreate = async (x: number, y: number, terrain: string, content: string | object, choices: Choice[]) => {
        try {
            debug('WorldGeneratorDebug', `Creating node at position (${x}, ${y})`);
            debug('WorldGeneratorDebug', `Node terrain: ${terrain}`);
            debug('WorldGeneratorDebug', `Node content: ${JSON.stringify(content)}`);

            const updatedChoices = choices.map(choice => ({
                ...choice,
                nextNodeId: null as Id<"storyNodes"> | null
            }));

            debug('WorldGeneratorDebug', `Node choices: ${JSON.stringify(updatedChoices)}`);

            const contentString = typeof content === 'object' ? JSON.stringify(content) : content;

            const newNodeId = await createStoryNode({
                content: contentString,
                choices: updatedChoices,
                x,
                y,
                terrain
            });
            debug('WorldGeneratorDebug', `Node created with ID: ${newNodeId}`);
            return newNodeId;
        } catch (error) {
            console.error("Error creating node:", error);
            debug('WorldGeneratorDebug', `Error creating node: ${error}`);
            throw new Error(`Failed to create node at position (${x}, ${y})`);
        }
    };

    const getSurroundingNodes = useCallback((x: number, y: number): SurroundingNode[] => {
        const directions: [number, number, SurroundingNode['direction']][] = [
            [-1, -1, 'northwest'], [0, -1, 'north'], [1, -1, 'northeast'],
            [-1, 0, 'west'], [1, 0, 'east'],
            [-1, 1, 'southwest'], [0, 1, 'south'], [1, 1, 'southeast']
        ];

        const surroundingNodes = directions
            .map(([dx, dy, direction]) => {
                const node = allNodes.find(n => n.x === x + dx && n.y === y + dy);
                if (node) {
                    return {
                        direction,
                        content: node.content,
                        terrain: node.terrain
                    };
                }
                return null;
            })
            .filter((node): node is SurroundingNode => node !== null);

        debug('WorldGeneratorDebug', `Surrounding nodes for (${x}, ${y}): ${JSON.stringify(surroundingNodes)}`);
        return surroundingNodes;
    }, [allNodes]);

    const MAP_SIZE = 3;
    const TOTAL_NODES = MAP_SIZE * MAP_SIZE;

    const calculateProgress = (x: number, y: number): number => {
        return ((y * MAP_SIZE + x + 1) / TOTAL_NODES) * 100;
    };

    const generateWorld = async () => {
        setIsGenerating(true);
        setError(null);
        setStopGeneration(false);
        onProgress(0);

        try {
            debug('WorldGeneratorDebug', 'Starting world generation');
            debug('WorldGeneratorDebug', `Game info: ${JSON.stringify(gameInfo)}`);

            const { gameStoryId, outline } = await generateGameStoryAndOutline();
            await generateWorldDetailsAndSave(gameStoryId, outline);
            const nodeIds = await generateNodes(outline);

            await updateNodeConnections(nodeIds);

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
            const outlineResponse = await generateGameStory(gameInfo.genre, gameInfo.theme, gameInfo.additionalInfo);
            if (!outlineResponse) throw new Error("Failed to generate game story");

            const outline = JSON.parse(outlineResponse);
            debug('WorldGeneratorDebug', `Game story outline: ${JSON.stringify(outline)}`);

            const gameStoryId = await createGameStory(outline);
            return { gameStoryId, outline };
        } catch (error) {
            throw new Error(`Failed to generate game story: ${error}`);
        }
    };

    const generateWorldDetailsAndSave = async (gameStoryId: Id<"gameStories">, outline: any) => {
        try {
            const detailsResponse = await generateWorldDetails(JSON.stringify(outline), MAP_SIZE);
            if (!detailsResponse) throw new Error("Failed to generate world details");

            const details = JSON.parse(detailsResponse);
            debug('WorldGeneratorDebug', `World details: ${JSON.stringify(details)}`);

            await createWorldDetails({
                gameStoryId,
                ...details
            });
        } catch (error) {
            throw new Error(`Failed to generate world details: ${error}`);
        }
    };

    const generateNodes = async (outline: any): Promise<(Id<"storyNodes"> | null)[][]> => {
        const nodeIds: (Id<"storyNodes"> | null)[][] = Array(MAP_SIZE).fill(null).map(() => Array(MAP_SIZE).fill(null));

        for (let y = 0; y < MAP_SIZE; y++) {
            for (let x = 0; x < MAP_SIZE; x++) {
                if (stopGeneration) {
                    throw new Error("Generation stopped by user");
                }
                try {
                    const surroundingNodes: SurroundingNode[] = getSurroundingNodes(x, y);
                    const worldPosition: WorldPosition = { x, y, totalWidth: MAP_SIZE, totalHeight: MAP_SIZE };

                    debug('WorldGeneratorDebug', `Generating node at position (${x}, ${y})`);
                    const nodeContentResponse = await generateStoryNode(JSON.stringify(outline), surroundingNodes, worldPosition);
                    debug('WorldGeneratorDebug', `Raw node content: ${nodeContentResponse}`);

                    const nodeContent = JSON.parse(nodeContentResponse);
                    debug('WorldGeneratorDebug', `Parsed node content: ${JSON.stringify(nodeContent)}`);

                    const newNodeId = await handleNodeCreate(x, y, nodeContent.terrain, nodeContent.content, nodeContent.choices);
                    nodeIds[y][x] = newNodeId;

                    onProgress(calculateProgress(x, y));
                } catch (error) {
                    throw new Error(`Failed to generate node at (${x}, ${y}): ${error}`);
                }
            }
        }

        return nodeIds;
    };

    const updateNodeConnections = async (nodeIds: (Id<"storyNodes"> | null)[][]) => {
        for (let y = 0; y < MAP_SIZE; y++) {
            for (let x = 0; x < MAP_SIZE; x++) {
                const currentNodeId = nodeIds[y][x];
                if (currentNodeId) {
                    try {
                        const currentNode = await convex.query(api.nexusEngine.getStoryNode, { nodeId: currentNodeId });
                        if (currentNode) {
                            const updatedChoices = currentNode.choices.map((choice: any) => {
                                let nextNodeId: Id<"storyNodes"> | null = null;
                                switch (choice.id) {
                                    case "1": // North
                                        nextNodeId = y > 0 ? nodeIds[y - 1][x] : null;
                                        break;
                                    case "2": // East
                                        nextNodeId = x < MAP_SIZE - 1 ? nodeIds[y][x + 1] : null;
                                        break;
                                    case "3": // South
                                        nextNodeId = y < MAP_SIZE - 1 ? nodeIds[y + 1][x] : null;
                                        break;
                                    case "4": // West
                                        nextNodeId = x > 0 ? nodeIds[y][x - 1] : null;
                                        break;
                                }
                                return {
                                    id: choice.id,
                                    text: choice.text,
                                    consequences: choice.consequences.map((cons: any) => ({
                                        type: cons.type as "addItem" | "removeItem" | "setFlag" | "alterStat" | "changePoliticalValue",
                                        target: cons.target,
                                        value: cons.value,
                                        description: cons.description
                                    })),
                                    nextNodeId
                                } as Choice;
                            });
                            await convex.mutation(api.nexusEngine.updateStoryNode, {
                                nodeId: currentNodeId,
                                updates: {
                                    choices: updatedChoices,
                                    content: currentNode.content // Include the existing content
                                }
                            });
                        }
                    } catch (error) {
                        throw new Error(`Failed to update node connections at (${x}, ${y}): ${error}`);
                    }
                }
            }
        }
    };

    return (
        <div className="space-y-4">
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