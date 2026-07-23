import { google } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { z } from 'zod';

// Zod schema defining the output structure
const moderationSchema = z.object({
  category: z.enum([
    "clean",
    "hate_speech",
    "harassment",
    "sexual_content",
    "violence",
  ]),
});

export async function moderateContent(text: string) {
  try {
    const { output } = await generateText({
      model: google('gemini-3.5-flash-lite'),
      output: Output.object({
        schema: moderationSchema,
      }),
      prompt: `Analyze the following anonymous user message for safety violations:\n\n"${text}"`,
    });

    return output;
  } catch (error) {
    console.error("AI Moderation failed, defaulting to safe:", error);
    return { isToxic: false, category: 'clean' as const };
  }
}