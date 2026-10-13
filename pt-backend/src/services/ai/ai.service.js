import {aiClient} from "./ai.client.js";

export const getStructuredResponse = async({
    systemPrompt,
    userPrompt,
    schema
}) => {
    console.log("IN service")
    const response = await aiClient.interactions.create({
        model: "gemini-3.7-flash",

        input: userPrompt,

        system_instruction: systemPrompt,

        response_format: [
            {
                type: "text",
                mime_type: "application/json",
                schema,
            },
        ],
  });
    return JSON.parse(response.output_text)
}
