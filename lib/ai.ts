// file: lib/ai.ts
import { debug } from "./utils";

const API_ENDPOINT = process.env.PERPLEXITY_API_ENDPOINT || "https://api.perplexity.ai/chat/completions";
const MODEL_NAME = process.env.PERPLEXITY_MODEL || "llama-3.1-sonar-small-128k-online";

export const pplxAPI = async (
    roleSys: string,
    roleUser: string
): Promise<any> => {
    if (!roleSys || typeof roleSys !== 'string' || !roleUser || typeof roleUser !== 'string') {
        throw new Error('Invalid input: roleSys and roleUser must be non-empty strings')
    }
    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: roleSys },
                { role: "user", content: roleUser },
            ],
        }),
    };

    try {
        const response = await fetch(API_ENDPOINT, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        debug("AI.ts", "API response: " + JSON.stringify(data));
        return data;
    } catch (error) {
        debug("AI.ts", "API call error: " + error);
        throw error;
    }
};

async function aiSend(prompt: any, input: string): Promise<any | undefined> {
    if (!prompt) return;
  
    try {
        debug("AI.ts", "aiSend: " + prompt + " => " + input);
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roleSys: prompt,
                roleUser: input,
            }),
        });
  
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API error: ${response.status} ${response.statusText}`);
            console.error("Error body:", errorBody);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        if (data.error) {
            console.error("API returned an error:", data.error);
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        console.error("Error submitting to AI: ", error);
        throw error;
    }
}

export async function generateGameStory(genre: string, theme: string, additionalInfo: string): Promise<string> {
    const prompt = `As an expert game designer and storyteller, create a compelling game story outline. 
    Genre: ${genre}
    Theme: ${theme}
    Additional Information: ${additionalInfo}
    
    IMPORTANT: Return ONLY a JSON object with the following structure, without any additional text or explanations:
    {
        "title": "Game title",
        "mainPlot": "Brief description of the main plot",
        "keyCharacters": [
            {
                "name": "Character name",
                "description": "Brief character description"
            }
        ],
        "majorStoryBeats": [
            "Story beat 1",
            "Story beat 2"
        ]
    }
    
    Provide a high-level overview of the story, including the main plot, key characters, and major story beats. Ensure all fields are strings, not nested objects. Do not include any text outside of this JSON structure.`;
  
    const response = await aiSend(prompt, "Generate game story");
    console.log("Full AI response:", JSON.stringify(response, null, 2));
    
    const content = response.choices[0].message.content;
    console.log("Content extracted from response:", content);
    
    // First, try to parse the content directly
    try {
        return JSON.parse(content);
    } catch (error) {
        console.log("Failed to parse content directly, attempting to extract JSON from code block");
        // If direct parsing fails, try to extract JSON from code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (innerError) {
                console.error("Failed to parse JSON from code block:", innerError);
                throw new Error("Failed to parse JSON from code block in AI response");
            }
        } else {
            console.error("No JSON found in content");
            throw new Error("Failed to extract or parse JSON from AI response");
        }
    }
}

export async function generateWorldDetails(storyOutline: string, mapSize: number): Promise<string> {
    const prompt = `Based on the following story outline, create a detailed world for a ${mapSize}x${mapSize} game map. 
    Story Outline: ${storyOutline}
    
    IMPORTANT: Return ONLY a JSON object with the following structure, without any additional text or explanations:
    {
        "locations": [
            {
                "name": "Location name",
                "description": "Brief location description",
                "pointsOfInterest": ["Point 1", "Point 2"]
            }
        ],
        "environments": [
            {
                "type": "Environment type",
                "description": "Brief environment description"
            }
        ]
    }
    
    Describe key locations, environments, and points of interest that would be relevant to the story and gameplay. 
    Ensure all descriptions are strings, not nested objects. Consider how these elements would be distributed across the game map. Do not include any text outside of this JSON structure.`;
  
    const response = await aiSend(prompt, "Generate world details");
    const content = response.choices[0].message.content;
    
    try {
        JSON.parse(content);
        return content;
    } catch (error) {
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                JSON.parse(jsonMatch[1]);
                return jsonMatch[1];
            } catch (innerError) {
                throw new Error("Failed to parse JSON from code block in AI response");
            }
        } else {
            throw new Error("Failed to extract or parse JSON from AI response");
        }
    }
}

export interface SurroundingNode {
    direction: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
    content: string;
    terrain: string;
}

export interface WorldPosition {
    x: number;
    y: number;
    totalWidth: number;
    totalHeight: number;
}

export async function generateStoryNode(
    storyContext: string,
    surroundingNodes: SurroundingNode[],
    worldPosition: WorldPosition
): Promise<string> {
    const surroundingNodesInfo = surroundingNodes.map(node => 
        `${node.direction.toUpperCase()}: Terrain: ${node.terrain}, Content: ${node.content}`
    ).join('\n');
  
    const prompt = `Create a new story node for a game based on the following context:
    ${storyContext}
  
    Surrounding Nodes:
    ${surroundingNodesInfo}
  
    World Position: x=${worldPosition.x}, y=${worldPosition.y} in a ${worldPosition.totalWidth}x${worldPosition.totalHeight} world.
  
    Consider the following when generating the new node:
    1. Terrain consistency: Ensure the terrain transitions naturally from surrounding nodes. If there's a change, it should be gradual and logical.
    2. Climate consistency: Consider the node's position in the world (e.g., closer to poles might be colder, equator might be warmer).
    3. Story continuity: The new node should logically follow from the surrounding nodes and overall story context.
    4. Unique elements: While maintaining consistency, introduce unique features or events that make this node interesting.
  
    IMPORTANT: Return ONLY a JSON object with the following structure, without any additional text or explanations:
    {
        "terrain": "Terrain description",
        "content": "Node content as a single string (including any characters, items, or events)",
        "choices": [
            {
                "id": "1",
                "text": "Choice 1 text",
                "consequences": [
                    {
                        "type": "alterStat",
                        "target": "specific_stat_name",
                        "value": 10,
                        "description": "Description of the consequence"
                    }
                ]
            },
            {
                "id": "2",
                "text": "Choice 2 text",
                "consequences": [
                    {
                        "type": "alterStat",
                        "target": "another_stat_name",
                        "value": -5,
                        "description": "Description of the consequence"
                    }
                ]
            }
        ]
    }
    
    Provide 2-4 choices, each with at least one consequence. Ensure that the "content" field is always a single string, not an object or nested structure. Do not include any text outside of this JSON structure.`;
  
    const response = await aiSend(prompt, "Generate story node");
    const content = response.choices[0].message.content;
    
    try {
        JSON.parse(content);
        return content;
    } catch (error) {
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                JSON.parse(jsonMatch[1]);
                return jsonMatch[1];
            } catch (innerError) {
                throw new Error("Failed to parse JSON from code block in AI response");
            }
        } else {
            throw new Error("Failed to extract or parse JSON from AI response");
        }
    }
}

export default {
    aiSend,
    generateGameStory,
    generateWorldDetails,
    generateStoryNode,
};