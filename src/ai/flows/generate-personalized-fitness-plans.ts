'use server';

/**
 * @fileOverview Generates personalized workout and diet plans based on user details.
 *
 * - generatePersonalizedFitnessPlans - A function that generates personalized workout and diet plans.
 * - PersonalizedFitnessPlansInput - The input type for the generatePersonalizedFitnessPlans function.
 * - PersonalizedFitnessPlansOutput - The return type for the generatePersonalizedFitnessPlans function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFitnessPlansInputSchema = z.object({
  name: z.string().describe("The user's name."),
  age: z.coerce.number().describe("The user's age."),
  gender: z.string().describe("The user's gender."),
  height: z.coerce.number().describe("The user's height."),
  weight: z.coerce.number().describe("The user's weight."),
  fitnessGoal: z.string().describe('The user\'s fitness goal (e.g., Weight Loss, Muscle Gain, Endurance, etc.).'),
  currentFitnessLevel: z.string().describe('The user\'s current fitness level (Beginner / Intermediate / Advanced).'),
  workoutLocation: z.string().describe('The user\'s preferred workout location (Home / Gym / Outdoor).'),
  dietaryPreferences: z.string().describe('The user\'s dietary preference (Veg / Non-Veg / Vegan / Keto).'),
  medicalHistory: z.string().optional().describe("The user's medical history."),
  stressLevel: z.string().optional().describe("The user's stress level."),
});

export type PersonalizedFitnessPlansInput = z.infer<typeof PersonalizedFitnessPlansInputSchema>;


const ExerciseSchema = z.object({
  name: z.string(),
  sets: z.number(),
  reps: z.number(),
  rest: z.string(),
  image_prompt: z.string(),
});

const WorkoutDaySchema = z.object({
  day: z.string(),
  exercises: z.array(ExerciseSchema),
});

const MealItemsSchema = z.object({
  item: z.string(),
  image_prompt: z.string(),
});

const PersonalizedFitnessPlansOutputSchema = z.object({
  workout_plan: z.object({
    summary: z.string().describe('Brief description of the weekly workout approach and goals.'),
    days: z.array(WorkoutDaySchema),
  }),
  diet_plan: z.object({
    summary: z.string().describe('Brief overview of the daily nutrition and meal balance.'),
    meals: z.object({
      breakfast: z.array(MealItemsSchema),
      lunch: z.array(MealItemsSchema),
      dinner: z.array(MealItemsSchema),
      snacks: z.array(MealItemsSchema),
    }),
  }),
  motivation: z.object({
    quote: z.string(),
    tip: z.string(),
  }),
  voice_script: z.object({
    intro: z.string(),
    workout_section: z.string(),
    diet_section: z.string(),
    closing: z.string(),
  }),
});


export type PersonalizedFitnessPlansOutput = z.infer<typeof PersonalizedFitnessPlansOutputSchema>;

export async function generatePersonalizedFitnessPlans(input: PersonalizedFitnessPlansInput): Promise<PersonalizedFitnessPlansOutput> {
  return generatePersonalizedFitnessPlansFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFitnessPlansPrompt',
  input: {schema: PersonalizedFitnessPlansInputSchema},
  output: {schema: PersonalizedFitnessPlansOutputSchema},
  prompt: `You are a certified AI Fitness Coach and Nutritionist.
Your role is to act as a professional fitness assistant who creates **personalized workout and diet plans** based on user data.
You also generate motivational content, voice narration text, and image prompts for an immersive experience.

## USER DETAILS:
Name: {{name}}
Age: {{age}}
Gender: {{gender}}
Height: {{height}} cm
Weight: {{weight}} kg
Fitness Goal: {{fitnessGoal}}
Current Fitness Level: {{currentFitnessLevel}}
Workout Location: {{workoutLocation}}
Dietary Preference: {{dietaryPreferences}}
Medical History: {{medicalHistory}}
Stress Level: {{stressLevel}}

---

### 🎯 OBJECTIVE:
Generate a **personalized, AI-powered fitness plan** that includes:
1. A 7-day workout plan
2. A daily meal/diet plan
3. Motivational quote and tip
4. AI voice narration text for “Read My Plan” feature
5. AI image prompts for exercises and meals

Make it practical, easy to follow, and scientifically valid.

---

### 🧠 OUTPUT FORMAT (Return JSON only, no markdown):
{
  "workout_plan": {
    "summary": "Brief description of the weekly workout approach and goals.",
    "days": [
      {
        "day": "Day 1 - Chest & Triceps",
        "exercises": [
          {
            "name": "Push-ups",
            "sets": 4,
            "reps": 15,
            "rest": "60 sec",
            "image_prompt": "Realistic image of a person doing push-ups in a gym with good lighting."
          },
          {
            "name": "Bench Press",
            "sets": 3,
            "reps": 10,
            "rest": "90 sec",
            "image_prompt": "Gym scene showing bench press with barbell, realistic style."
          }
        ]
      }
    ]
  },
  "diet_plan": {
    "summary": "Brief overview of the daily nutrition and meal balance.",
    "meals": {
      "breakfast": [
        {"item": "Oatmeal with fruits", "image_prompt": "A bowl of oatmeal with banana slices and berries."},
        {"item": "Boiled eggs", "image_prompt": "Boiled eggs served with herbs on a plate."}
      ],
      "lunch": [
        {"item": "Grilled chicken salad", "image_prompt": "Healthy grilled chicken salad with greens and dressing."},
        {"item": "Brown rice with veggies", "image_prompt": "Plate of brown rice with sautéed vegetables."}
      ],
      "dinner": [
        {"item": "Paneer/tofu curry", "image_prompt": "Indian-style paneer curry in a bowl with garnish."},
        {"item": "Steamed vegetables", "image_prompt": "Fresh steamed vegetables served on a white plate."}
      ],
      "snacks": [
        {"item": "Mixed nuts", "image_prompt": "A handful of mixed nuts in a small bowl."},
        {"item": "Green smoothie", "image_prompt": "A glass of green smoothie with spinach and fruit pieces."}
      ]
    }
  },
  "motivation": {
    "quote": "Push yourself because no one else will do it for you.",
    "tip": "Stay hydrated and stretch before every workout."
  },
  "voice_script": {
    "intro": "Hey {{name}}, welcome to your personalized fitness journey!",
    "workout_section": "Here’s your workout plan for the week. Each day is structured for your goal of {{fitnessGoal}}.",
    "diet_section": "Now let’s go through your diet plan — balanced and customized for your {{dietaryPreferences}} preference.",
    "closing": "Stay consistent and believe in yourself. You’ve got this!"
  }
}

---

### ⚡ INSTRUCTIONS:
- The response must be complete JSON (no markdown, no extra text).
- Tailor exercises and meals to user fitness level, location, and dietary type.
- Ensure nutritional balance and safety for any mentioned medical condition.
- Keep tone motivational, realistic, and encouraging.
- For images, create simple descriptive prompts (not actual image URLs).
- If any info is missing, make a smart assumption and continue.
`,
});

const generatePersonalizedFitnessPlansFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedFitnessPlansFlow',
    inputSchema: PersonalizedFitnessPlansInputSchema,
    outputSchema: PersonalizedFitnessPlansOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
