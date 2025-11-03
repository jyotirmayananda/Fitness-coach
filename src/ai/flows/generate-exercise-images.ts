'use server';

/**
 * @fileOverview A flow to generate images of exercises and meal items.
 *
 * - generateExerciseImage - A function that generates an image for a given exercise or meal item.
 * - GenerateExerciseImageInput - The input type for the generateExerciseImage function.
 * - GenerateExerciseImageOutput - The return type for the generateExerciseImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExerciseImageInputSchema = z.object({
  itemText: z.string().describe('The text describing the exercise or meal item.'),
});
export type GenerateExerciseImageInput = z.infer<typeof GenerateExerciseImageInputSchema>;

const GenerateExerciseImageOutputSchema = z.object({
  imageUrl: z.string().describe('The generated image URL as a data URI.'),
});
export type GenerateExerciseImageOutput = z.infer<typeof GenerateExerciseImageOutputSchema>;

export async function generateExerciseImage(input: GenerateExerciseImageInput): Promise<GenerateExerciseImageOutput> {
  return generateExerciseImageFlow(input);
}

const generateExerciseImageFlow = ai.defineFlow(
  {
    name: 'generateExerciseImageFlow',
    inputSchema: GenerateExerciseImageInputSchema,
    outputSchema: GenerateExerciseImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a realistic, high-quality, photographic image of the following exercise or meal item: ${input.itemText}. The image should be clear, well-lit, and visually appealing, suitable for a fitness application.`,
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed to return a valid image.');
    }

    return {imageUrl: media.url};
  }
);
