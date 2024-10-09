import { NextRequest, NextResponse } from 'next/server';

const API_ENDPOINT = process.env.PERPLEXITY_API_ENDPOINT || "https://api.perplexity.ai/chat/completions";
const MODEL_NAME = process.env.PERPLEXITY_MODEL || "llama-3-sonar-large-32k-chat";

export async function POST(req: NextRequest) {
  try {
    const { roleSys, roleUser } = await req.json();

    if (!process.env.PERPLEXITY_API_KEY) {
      console.error("PERPLEXITY_API_KEY is not set");
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 });
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: roleSys },
          { role: "user", content: roleUser },
        ],
      }),
    };

    console.log("Sending request to Perplexity API:", JSON.stringify(options, null, 2));

    const response = await fetch(API_ENDPOINT, options);
    
    if (!response.ok) {
      console.error(`Perplexity API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error body:", errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Received response from Perplexity API:", JSON.stringify(data, null, 2));
    
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("API call error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: "Error calling AI API", details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Error calling AI API", details: "An unknown error occurred" }, { status: 500 });
    }
  }
}