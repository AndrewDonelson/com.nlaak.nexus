import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
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
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stopGeneration, setStopGeneration] = useState(false);
    const createStoryNode = useMutation(api.nexusEngine.createStoryNode);
    const createGameStory = useMutation(api.nexusEngine.createGameStory);
    const createWorldDetails = useMutation(api.nexusEngine.createWorldDetails);
    const allNodes = useQuery(api.nexusEngine.getAllStoryNodes) as StoryNode[] | undefined;

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

            const newNodeId = await createStoryNode({
                content: typeof content === 'string' ? content : JSON.stringify(content),
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
        if (!allNodes) return [];

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

    const generateWorld = async () => {
        setIsGenerating(true);
        setError(null);
        setStopGeneration(false);
        onProgress(0);

        try {
            debug('WorldGeneratorDebug', 'Starting world generation');
            debug('WorldGeneratorDebug', `Game info: ${JSON.stringify(gameInfo)}`);

            const outlineResponse = await generateGameStory(gameInfo.genre, gameInfo.theme, gameInfo.additionalInfo);
            if (!outlineResponse) throw new Error("Failed to generate game story");
            
            const outline = JSON.parse(outlineResponse);
            debug('WorldGeneratorDebug', `Game story outline: ${JSON.stringify(outline)}`);

            // Create game story in the database
            const gameStoryId = await createGameStory(outline);

            const detailsResponse = await generateWorldDetails(JSON.stringify(outline), 1); // Set map size to 1x1
            if (!detailsResponse) throw new Error("Failed to generate world details");
            
            const details = JSON.parse(detailsResponse);
            debug('WorldGeneratorDebug', `World details: ${JSON.stringify(details)}`);

            // Create world details in the database
            await createWorldDetails({
                gameStoryId,
                ...details
            });

            const totalNodes = 1; // 1x1 map
            for (let y = 0; y < 1; y++) {
                for (let x = 0; x < 1; x++) {
                    if (stopGeneration) {
                        throw new Error("Generation stopped by user");
                    }
                    const surroundingNodes: SurroundingNode[] = getSurroundingNodes(x, y);
                    const worldPosition: WorldPosition = { x, y, totalWidth: 1, totalHeight: 1 };

                    debug('WorldGeneratorDebug', `Generating node at position (${x}, ${y})`);
                    const nodeContentResponse = await generateStoryNode(JSON.stringify(outline), surroundingNodes, worldPosition);
                    debug('WorldGeneratorDebug', `Raw node content: ${nodeContentResponse}`);

                    const nodeContent = JSON.parse(nodeContentResponse);
                    debug('WorldGeneratorDebug', `Parsed node content: ${JSON.stringify(nodeContent)}`);

                    await handleNodeCreate(x, y, nodeContent.terrain, nodeContent.content, nodeContent.choices);

                    onProgress(100); // 100% progress for 1x1 map
                }
            }
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