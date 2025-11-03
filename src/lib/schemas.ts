import { z } from 'zod';

export const fitnessFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().min(12, { message: 'You must be at least 12 years old.' }).max(100),
  gender: z.enum(['male', 'female', 'other']),
  height: z.coerce.number().min(50, { message: 'Please enter a valid height.' }),
  weight: z.coerce.number().min(20, { message: 'Please enter a valid weight.' }),
  fitnessGoal: z.string({ required_error: 'Please select a fitness goal.' }),
  currentFitnessLevel: z.string({ required_error: 'Please select your fitness level.' }),
  workoutLocation: z.string({ required_error: 'Please select a workout location.' }),
  dietaryPreferences: z.string({ required_error: 'Please select your diet.' }),
  medicalHistory: z.string().optional(),
  stressLevel: z.string().optional(),
});
