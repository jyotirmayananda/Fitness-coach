'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-generated fitness and lifestyle tips.
 *
 * It exports:
 *   - `provideAIGeneratedTips`: An async function that generates fitness and lifestyle tips based on user input.
 *   - `AIGeneratedTipsInput`: The TypeScript type definition for the input to the `provideAIGeneratedTips` function.
 *   - `AIGeneratedTipsOutput`: The TypeScript type definition for the output of the `provideAIGeneratedTips` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIGeneratedTipsInputSchema = z.object({
  fitnessGoal: z
    .string()
    .describe("The user's fitness goal (e.g., weight loss, muscle gain)."),
  currentFitnessLevel: z
    .string()
    .describe('The user\'s current fitness level (e.g., beginner, intermediate, advanced).'),
  workoutLocation: z
    .string()
    .describe('The user\'s preferred workout location (e.g., home, gym, outdoor).'),
  dietaryPreferences: z
    .string()
    .describe('The user\'s dietary preferences (e.g., veg, non-veg, vegan, keto).'),
});
export type AIGeneratedTipsInput = z.infer<typeof AIGeneratedTipsInputSchema>;

const AIGeneratedTipsOutputSchema = z.object({
  fitnessTip: z.string().describe('An AI-generated fitness tip.'),
  lifestyleTip: z.string().describe('An AI-generated lifestyle tip.'),
  motivationQuote: z.string().describe('An AI-generated motivational quote.'),
});
export type AIGeneratedTipsOutput = z.infer<typeof AIGeneratedTipsOutputSchema>;

export async function provideAIGeneratedTips(
  input: AIGeneratedTipsInput
): Promise<AIGeneratedTipsOutput> {
  return provideAIGeneratedTipsFlow(input);
}

const provideAIGeneratedTipsPrompt = ai.definePrompt({
  name: 'provideAIGeneratedTipsPrompt',
  input: {schema: AIGeneratedTipsInputSchema},
  output: {schema: AIGeneratedTipsOutputSchema},
  prompt: `You are a personal AI fitness and lifestyle coach.
  Generate fitness tips, lifestyle tips and motivational quotes, tailored to the user's fitness goal, fitness level, workout location and dietary preferences.

  Fitness Goal: {{{fitnessGoal}}}
  Current Fitness Level: {{{currentFitnessLevel}}}
  Workout Location: {{{workoutLocation}}}
  Dietary Preferences: {{{dietaryPreferences}}}

  Respond with:
  - fitnessTip: A practical fitness tip.
  - lifestyleTip: A relevant lifestyle tip.
  - motivationQuote: A motivational quote to encourage the user.
  `,
});

const provideAIGeneratedTipsFlow = ai.defineFlow(
  {
    name: 'provideAIGeneratedTipsFlow',
    inputSchema: AIGeneratedTipsInputSchema,
    outputSchema: AIGeneratedTipsOutputSchema,
  },
  async input => {
    const {output} = await provideAIGeneratedTipsPrompt(input);
    return output!;
  }
);
