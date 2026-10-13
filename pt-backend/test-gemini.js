import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

try {
    const response = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: "Write a short poem about the beauty of nature.",
        system_instruction: "You are a helpful assistant that generates creative content.",
        response_format: [
            {
                type: "text",
                mime_type: "application/json",
                schema: {
                    type: "object",
                    properties: {
                        poem: { type: "string" },
                        author: { type: "string" },
                    },
                    required: ["poem"],
                }
            },
        ],
    });

    console.log(response.output_text);
} catch (error) {
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Cause:", error.cause);
    console.error("Full error:", error);
}