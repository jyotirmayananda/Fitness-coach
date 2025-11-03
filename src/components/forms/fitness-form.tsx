
"use client";

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { useFormStatus } from 'react-dom';

import { fitnessFormSchema } from '@/lib/schemas';
import { generatePlanAction } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, User, VenetianMask, Target, Signal, MapPin, Utensils, Scale, Ruler } from 'lucide-react';

type FitnessFormValues = z.infer<typeof fitnessFormSchema>;

const initialState = {
  plan: null,
  userDetails: null,
  error: null,
};

export function FitnessForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useActionState(generatePlanAction, initialState);

  const form = useForm<FitnessFormValues>({
    resolver: zodResolver(fitnessFormSchema),
    defaultValues: {
      name: '',
      age: 25,
      gender: undefined,
      height: 170,
      weight: 70,
      fitnessGoal: undefined,
      currentFitnessLevel: undefined,
      workoutLocation: undefined,
      dietaryPreferences: undefined,
    },
  });

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error generating plan',
        description: state.error,
      });
    }
    if (state.plan && state.userDetails) {
      toast({
        title: 'Plan Generated!',
        description: 'Redirecting to your personalized plan...',
      });
      sessionStorage.setItem('fitnessPlan', JSON.stringify(state.plan));
      sessionStorage.setItem('userDetails', JSON.stringify(state.userDetails));
      router.push('/plan');
    }
  }, [state, router, toast]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                    <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Age *</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Gender *</FormLabel>
                <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <VenetianMask className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Height (cm) *</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Weight (kg) *</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="fitnessGoal"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fitness Goal *</FormLabel>
                <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <Target className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select Goal" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                    <SelectItem value="Improve Endurance">Improve Endurance</SelectItem>
                    <SelectItem value="General Fitness">General Fitness</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="currentFitnessLevel"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fitness Level *</FormLabel>
                <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <Signal className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="workoutLocation"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Workout Location *</FormLabel>
                <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Gym">Gym</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="dietaryPreferences"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Dietary Preference *</FormLabel>
                <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select Preference" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Veg">Vegetarian</SelectItem>
                    <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Keto">Keto</SelectItem>
                    <SelectItem value="Balanced">Balanced</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <SubmitButton />
      </form>
    </Form>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white" disabled={pending} size="lg">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Your Plan...
                </>
            ) : (
                <>
                Generate My Plan
                <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    )
}
