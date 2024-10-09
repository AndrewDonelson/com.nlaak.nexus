import React, { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { generateGameStory, generateWorldDetails, generateStoryNode } from '@/lib/ai';
import { StoryNode, Choice, Consequence } from '@/lib/game/types';
import { Id } from '@/convex/_generated/dataModel';

/* Example request and response to be used for test cases

Sending request to Perplexity API: 
{
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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"
  },
  "body": "{\"model\":\"llama-3.1-sonar-small-128k-online\",\"messages\":[{\"role\":\"system\",\"content\":\"Create a new story node for a game based on the following context:\\n    ### Game Story Outline: \\\"Elan's Quest to Colonize Mars\\\"\\n\\n**Genre:** Sci-Fi\\n**Theme:** Elan Mosk's journey to build a space company and colonize Mars\\n\\n#### High-Level Overview\\n\\n1. **Setting:**\\n   - The story begins in 1999 with Elan Mosk, a brilliant and ambitious individual, sitting in front of a PC programming.\\n   - The setting shifts to the future where space travel and colonization have become a reality.\\n\\n2. **Main Plot:**\\n   - Elan's dream is to establish a space company that will lead humanity to colonize Mars.\\n   - The journey involves overcoming numerous challenges, including financial struggles, technological hurdles, and personal sacrifices.\\n\\n3. **Key Characters:**\\n   - **Elan Mosk:** The protagonist, driven by his vision for humanity's future in space.\\n   - **Supporting Characters:**\\n     - **Dr. Rachel Kim:** A brilliant scientist who helps Elan develop the necessary technology for space travel.\\n     - **Captain James Reed:** A seasoned astronaut who becomes Elan's trusted ally in the mission to Mars.\\n     - **Samantha Taylor:** A young engineer who joins Elan's company and becomes integral to its success.\\n\\n4. **Major Story Beats:**\\n   1. **The Vision:**\\n      - Elan's initial idea and the early stages of planning his space company.\\n      - The first steps towards making his vision a reality, including securing funding and assembling a team.\\n\\n   2. **The Struggle:**\\n      - Overcoming financial setbacks and technological challenges.\\n      - Personal sacrifices made by Elan and his team, such as leaving behind loved ones to pursue their dream.\\n\\n   3. **The Breakthrough:**\\n      - A major breakthrough in technology that makes space travel feasible.\\n      - The first successful mission to Mars, marking a significant milestone in human history.\\n\\n   4. **The Colonization:**\\n      - Establishing the first human settlement on Mars.\\n      - The challenges faced by the settlers as they adapt to a new environment and build a new society.\\n\\n   5. **The Legacy:**\\n      - Elan's legacy as a pioneer in space exploration and colonization.\\n      - The impact of his work on future generations and humanity's place in the universe.\\n\\n#### Conflict and Resolution\\n\\n1. **Internal Conflict:**\\n   - Elan's struggle to balance his ambition with the personal costs of his journey.\\n   - Moments of self-doubt and uncertainty that test his resolve.\\n\\n2. **Interpersonal Conflict:**\\n   - Conflicts within the team as they face challenges and disagreements.\\n   - Romantic relationships and personal dynamics that add depth to the story.\\n\\n3. **External Conflict:**\\n   - External obstacles such as financial crises, technological failures, and natural hazards on Mars.\\n   - The psychological strain of living in a hostile environment for extended periods.\\n\\n4. **Resolution:**\\n   - The ultimate success of Elan's mission to colonize Mars.\\n   - A sense of pride and fulfillment for Elan and his team as they achieve their dream.\\n\\n#### Story Mechanics\\n\\n1. **Puzzle-Solving:**\\n    - Overcoming technological hurdles through problem-solving and innovation.\\n    - Decoding messages from Mars to understand its environment better.\\n\\n2. **Resource Management:**\\n    - Managing resources on Mars, including food, water, and energy.\\n    - Balancing the needs of the settlers with the limitations of their environment.\\n\\n3. **Exploration:**\\n    - Exploring Mars and discovering its secrets.\\n    - Uncovering hidden dangers and unexpected opportunities.\\n\\nThis outline provides a compelling narrative arc that combines elements of science fiction with personal drama, making it engaging for players who love both adventure and character-driven stories.\\n  \\n    Surrounding Nodes:\\n    \\n  \\n    World Position: x=2, y=0 in a 10x10 world.\\n  \\n    Consider the following when generating the new node:\\n    1. Terrain consistency: Ensure the terrain transitions naturally from surrounding nodes. If there's a change, it should be gradual and logical.\\n    2. Climate consistency: Consider the node's position in the world (e.g., closer to poles might be colder, equator might be warmer).\\n    3. Story continuity: The new node should logically follow from the surrounding nodes and overall story context.\\n    4. Unique elements: While maintaining consistency, introduce unique features or events that make this node interesting.\\n  \\n    Provide the following for the new node:\\n    1. Terrain description\\n    2. Node content (including any characters, items, or events)\\n    3. 2-4 choices for the player\\n    4. Potential consequences for each choice that align with the game's themes and story progression\\n  \\n    Format the response as follows:\\n    Terrain: [Terrain description]\\n    Content: [Node content]\\n    Choices:\\n    1. [Choice 1]\\n       Consequences: [Potential consequences]\\n    2. [Choice 2]\\n       Consequences: [Potential consequences]\\n    ...\\n    \"},{\"role\":\"user\",\"content\":\"Generate story node\"}]}"
}

Received response from Perplexity API: 
{
  "id": "a4408e44-c17e-4122-8cc9-2c70b407579d",
  "model": "llama-3.1-sonar-small-128k-online",
  "created": 1728466948,
  "usage": {
    "prompt_tokens": 1057,
    "completion_tokens": 837,
    "total_tokens": 1894
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "To generate a story node for \"Elan's Quest to Colonize Mars,\" we need to create a node that logically fits into the game's narrative and provides engaging choices for the player. Here’s how you can structure this node:\n\n### Node: \"Establishing the First Settlement on Mars\"\n\n#### Terrain Description:\nThe terrain around the node is barren and rocky, with vast expanses of red sand stretching out to the horizon. The sky is a deep crimson, and the air is thin and cold.\n\n#### Node Content:\nElan and his team have finally reached Mars after years of planning and preparation. They have successfully landed their spacecraft and are now preparing to establish the first human settlement on the planet.\n\n**Characters:**\n- **Elan Mosk:** The protagonist, determined to make this mission a success.\n- **Dr. Rachel Kim:** A scientist who has been instrumental in developing the necessary technology for this mission.\n- **Captain James Reed:** An experienced astronaut who is leading the initial landing party.\n- **Samantha Taylor:** A young engineer who has been crucial in designing the habitat modules.\n\n**Items:**\n- **Habitat Modules:** The prefabricated living quarters that will serve as the foundation of the settlement.\n- **Life Support Systems:** Essential equipment to maintain a breathable atmosphere and provide food and water.\n- **Communication Devices:** Tools to stay in touch with Earth and coordinate further missions.\n\n**Events:**\n- The team discovers a hidden underground cave system that could provide natural protection from Martian storms.\n- A critical malfunction in one of the life support systems threatens to jeopardize the entire mission.\n\n#### Choices:\n1. **Investigate the Cave System:**\n   - **Consequences:** \n     - If successful, the cave system could provide a safe and stable environment for the initial settlers, allowing them to focus on establishing basic infrastructure.\n     - However, exploring the cave system could divert resources away from other critical tasks, potentially delaying the overall mission timeline.\n\n2. **Repair the Life Support System:**\n   - **Consequences:** \n     - If successful, the life support system will be operational, ensuring the health and safety of the settlers.\n     - However, repairing the system might require significant resources and time, potentially delaying other essential tasks like setting up communication devices or deploying habitat modules.\n\n3. **Prioritize Communication Setup:**\n   - **Consequences:** \n     - If successful, establishing reliable communication with Earth will ensure that any future challenges or discoveries can be promptly addressed.\n     - However, focusing on communication might delay other critical tasks like setting up life support systems or deploying habitat modules.\n\n4. **Deploy Habitat Modules Immediately:**\n   - **Consequences:** \n     - If successful, deploying habitat modules quickly will provide immediate shelter for the settlers and allow them to start establishing basic infrastructure.\n     - However, rushing into deploying habitat modules without ensuring proper life support systems or communication might put the settlers at risk.\n\n### Potential Consequences:\nEach choice will lead to different outcomes based on the player's decisions:\n- **Investigate Cave System:** \n  - Success: The cave system provides a safe environment; however, resource allocation is critical.\n  - Failure: The cave system proves hazardous; resources are wasted on an unproductive endeavor.\n\n- **Repair Life Support System:** \n  - Success: The life support system is operational; health and safety are ensured.\n  - Failure: The repair fails; settlers are at risk due to inadequate life support.\n\n- **Prioritize Communication Setup:** \n  - Success: Reliable communication is established; future challenges are easier to manage.\n  - Failure: Communication setup fails; coordination with Earth is compromised.\n\n- **Deploy Habitat Modules Immediately:** \n  - Success: Immediate shelter is provided; basic infrastructure starts to take shape.\n  - Failure: Habitat modules are deployed improperly; settlers face risks due to inadequate shelter.\n\nThis node provides a critical juncture in the game where players must balance competing priorities to ensure the success of Elan's mission to colonize Mars. The choices reflect real-world challenges faced by space exploration teams and allow players to experience the complexity and urgency of such missions."
      },
      "delta": {
        "role": "assistant",
        "content": ""
      }
    }
  ]
}

POST /api/ai 200 in 6750ms
*/
interface WorldGeneratorProps {
    gameInfo: { genre: string; theme: string; additionalInfo: string };
    mapSize: number;
    onProgress: (progress: number) => void;
}

interface SurroundingNode {
    direction: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
    content: string;
    terrain: string;
}

interface WorldPosition {
    x: number;
    y: number;
    totalWidth: number;
    totalHeight: number;
}

const WorldGenerator: React.FC<WorldGeneratorProps> = ({ gameInfo, mapSize, onProgress }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stopGeneration, setStopGeneration] = useState(false);
    const createStoryNode = useMutation(api.nexusEngine.createStoryNode);
    const allNodes = useQuery(api.nexusEngine.getAllStoryNodes) as StoryNode[] | undefined;

    const handleNodeCreate = async (x: number, y: number, terrain: string, content: string, choices: Choice[]) => {
        try {
            const newNodeId = await createStoryNode({
                content,
                choices,
                x,
                y,
                terrain
            });
            return newNodeId;
        } catch (error) {
            console.error("Error creating node:", error);
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

        return directions
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
    }, [allNodes]);

    const generateWorld = async () => {
        setIsGenerating(true);
        setError(null);
        setStopGeneration(false);
        onProgress(0);

        try {
            const outline = await generateGameStory(gameInfo.genre, gameInfo.theme, gameInfo.additionalInfo);
            if (!outline) throw new Error("Failed to generate game story");

            const details = await generateWorldDetails(outline, mapSize);
            if (!details) throw new Error("Failed to generate world details");

            const totalNodes = mapSize * mapSize;
            for (let y = 0; y < mapSize; y++) {
                for (let x = 0; x < mapSize; x++) {
                    if (stopGeneration) {
                        throw new Error("Generation stopped by user");
                    }
                    const surroundingNodes: SurroundingNode[] = getSurroundingNodes(x, y);
                    const worldPosition: WorldPosition = { x, y, totalWidth: mapSize, totalHeight: mapSize };

                    const nodeContent = await generateStoryNode(outline, surroundingNodes, worldPosition);
                    const { terrain, content, choices } = parseNodeContent(nodeContent);

                    await handleNodeCreate(x, y, terrain, content, choices);

                    onProgress((y * mapSize + x + 1) / totalNodes * 100);
                }
            }
        } catch (error) {
            console.error("Error generating world:", error);
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsGenerating(false);
            setStopGeneration(false);
        }
    };

    const parseNodeContent = (content: string): { terrain: string; content: string; choices: Choice[] } => {
        const lines = content.split('\n');
        let terrain = '';
        let nodeContent = '';
        let choices: Choice[] = [];
      
        let currentSection = '';
        for (const line of lines) {
          if (line.startsWith('Terrain Description:')) {
            currentSection = 'terrain';
          } else if (line.startsWith('Node Content:')) {
            currentSection = 'content';
          } else if (line.startsWith('Choices:')) {
            currentSection = 'choices';
          } else if (currentSection === 'terrain') {
            terrain += line.trim() + ' ';
          } else if (currentSection === 'content') {
            nodeContent += line.trim() + ' ';
          } else if (currentSection === 'choices' && line.trim().match(/^\d+\./)) {
            const [, id, text] = line.match(/(\d+)\.\s*(.+)/) || [];
            if (id && text) {
              choices.push({
                id,
                text,
                consequences: [],
                nextNodeId: null,
              });
            }
          } else if (currentSection === 'choices' && line.trim().startsWith('Consequences:')) {
            if (choices.length > 0) {
              const consequenceText = line.replace('Consequences:', '').trim();
              const consequence: Consequence = {
                type: 'alterStat',
                target: 'generic',
                value: 0,
                description: consequenceText
              };
              choices[choices.length - 1].consequences.push(consequence);
            }
          }
        }
      
        return { 
          terrain: terrain.trim(), 
          content: nodeContent.trim(), 
          choices: choices.map(choice => ({
            ...choice,
            consequences: choice.consequences.length > 0 ? choice.consequences : [{
              type: 'alterStat' as const,
              target: 'generic',
              value: 0,
              description: 'No specific consequences'
            }]
          }))
        };
    };

    return (
        <div className="space-y-4">
            {!isGenerating ? (
                <Button onClick={generateWorld} className="w-full">
                    Generate World
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

export default WorldGenerator;