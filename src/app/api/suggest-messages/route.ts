import { groq, type GroqLanguageModelOptions } from "@ai-sdk/groq";
import { generateText, Output } from "ai";
import { z } from "zod";

export async function POST() {
  try {
    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),

      providerOptions: {
        groq: {
          structuredOutputs: false,
        } satisfies GroqLanguageModelOptions,
      },

      output: Output.object({
        schema: z.object({
          suggestions: z.array(z.string()).min(3).max(4),
        }),
      }),

      prompt: `
            Generate 3 engaging anonymous questions.

            Requirements:
            - friendly and conversational
            - avoid personal or sensitive topics
            - suitable for all audiences
            - encourage meaningful interaction
            - curiosity-driven

            Respond ONLY with a valid JSON object containing:
            {
              "suggestions": ["...", "...", "..."]
            }
            `,
    });

    return Response.json(
      {
        success: true,
        suggestions: result.output.suggestions,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error generating suggestions:", error);

    return Response.json(
      {
        success: false,
        message:
          error.message || "An error occurred while generating suggestions.",
        // suggestions: [
        //   "What's something you're excited about lately?",
        //   "What's a hobby you've recently started?",
        //   "What's a small thing that improved your week?",
        // ],
      },
      { status: 500 },
    );
  }
}
