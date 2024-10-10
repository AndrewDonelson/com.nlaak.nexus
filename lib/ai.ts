import { debug } from "./utils";
import { StorySize } from "./game/types";

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

export async function generateWorldDetails(storyOutline: string, storySize: StorySize): Promise<string> {
    const prompt = `Based on the following story outline, create a detailed world for a story with ${storySize} nodes. 
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
    Ensure all descriptions are strings, not nested objects. Consider how these elements would be distributed across the story's progression. Do not include any text outside of this JSON structure.`;
  
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

export async function generateStoryNode(
    storyContext: string,
    currentNodeNumber: number,
    totalNodes: number
): Promise<string> {
    const prompt = `Create a new story node for a game based on the following context:
    ${storyContext}
  
    Current Node Number: ${currentNodeNumber}
    Total Nodes: ${totalNodes}
  
    Consider the following when generating the new node:
    1. Story progression: This node should logically follow from the previous nodes and advance the overall story.
    2. Branching choices: Provide 2-5 distinct choices that lead to different story paths.
    3. Consequences: Each choice should have meaningful consequences that affect the story or the player's status.
    4. Pacing: Consider the current node's position in the overall story (beginning, middle, or end) and adjust the content accordingly.
    5. Variety: Introduce unique elements, challenges, or events that make this node interesting and distinct from others.
  
    IMPORTANT: Return ONLY a JSON object with the following structure, without any additional text or explanations:
    {
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
    
    Provide 2-5 choices, each with at least one consequence. Ensure that the "content" field is always a single string, not an object or nested structure. Do not include any text outside of this JSON structure.`;
  
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