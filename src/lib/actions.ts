'use server';

import { z } from 'zod';
import { generatePersonalizedFitnessPlans } from '@/ai/flows/generate-personalized-fitness-plans';
import { generateExerciseImage } from '@/ai/flows/generate-exercise-images';
import { fitnessFormSchema } from './schemas';

// Action for the main form
export async function generatePlanAction(prevState: any, formData: FormData) {
  const parsedData = fitnessFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsedData.success) {
    return { error: 'Invalid form data provided.' };
  }

  const userDetails = parsedData.data;

  try {
    const plan = await generatePersonalizedFitnessPlans(userDetails);
    return { plan, userDetails };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate a plan. Please try again later.' };
  }
}

// Action for regenerating the plan
export async function regeneratePlanAction(userDetails: z.infer<typeof fitnessFormSchema>) {
    try {
        const plan = await generatePersonalizedFitnessPlans(userDetails);
        return { plan };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to regenerate a plan. Please try again later.' };
    }
}

// Action for generating images
export async function generateImageAction(itemText: string) {
    if (!itemText) {
        return { error: 'No item text provided.' };
    }

    try {
        const result = await generateExerciseImage({ itemText });
        return { imageUrl: result.imageUrl };
    } catch(e) {
        console.error(e);
        return { error: 'Failed to generate image. The AI is resting.' };
    }
}
