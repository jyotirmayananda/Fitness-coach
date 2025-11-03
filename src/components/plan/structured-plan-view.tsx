'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import type { fitnessFormSchema } from '@/lib/schemas';
import { regeneratePlanAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useTTS } from '@/hooks/use-tts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ImageModal } from './image-modal';
import {
  Dumbbell,
  Utensils,
  RefreshCw,
  Download,
  Volume2,
  StopCircle,
  BrainCircuit,
  AlertTriangle,
  Loader2,
  Sparkles,
  Flame,
  Soup,
  Beef,
  GlassWater,
  Apple,
} from 'lucide-react';
import type { PersonalizedFitnessPlansOutput } from '@/ai/flows/generate-personalized-fitness-plans';

type UserDetails = z.infer<typeof fitnessFormSchema>;

export function StructuredPlanView() {
  const router = useRouter();
  const { toast } = useToast();
  const { speak, cancel, speaking } = useTTS();
  const [plan, setPlan] = useState<PersonalizedFitnessPlansOutput | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemText, setSelectedItemText] = useState('');
  const [activeTab, setActiveTab] = useState('workout');

  useEffect(() => {
    try {
      const storedPlan = sessionStorage.getItem('fitnessPlan');
      const storedDetails = sessionStorage.getItem('userDetails');

      if (storedPlan && storedDetails) {
        const parsedPlan = JSON.parse(storedPlan);
        setPlan(parsedPlan);
        setUserDetails(JSON.parse(storedDetails));
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Failed to parse data from session storage', error);
      router.replace('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleRegenerate = async () => {
    if (!userDetails) return;
    setIsRegenerating(true);
    const result = await regeneratePlanAction(userDetails);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error regenerating plan',
        description: result.error,
      });
    } else if (result.plan) {
      setPlan(result.plan);
      sessionStorage.setItem('fitnessPlan', JSON.stringify(result.plan));
      toast({
        title: 'Plan Regenerated!',
        description: 'Your new plan is ready.',
      });
    }
    setIsRegenerating(false);
  };

  const handleExport = () => {
    window.print();
  };

  const handleSpeak = () => {
    if (!plan?.voice_script) return;
    const { intro, workout_section, diet_section, closing } = plan.voice_script;
    const textToSpeak =
      activeTab === 'workout'
        ? `${intro} ${workout_section} ${closing}`
        : `${intro} ${diet_section} ${closing}`;
    speak(textToSpeak);
  };

  const handleItemClick = (item: string, image_prompt: string) => {
    setSelectedItemText(`${item}|${image_prompt}`);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!plan || !userDetails) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load plan data. Please try generating a new plan.
          <Button variant="link" onClick={() => router.push('/')}>
            Go back
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl text-primary-foreground">
            Your Personalized Plan
          </h1>
          <p className="text-muted-foreground">
            Generated for {userDetails.name}, ready to crush your goals!
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleRegenerate} disabled={isRegenerating}>
            {isRegenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Regenerate
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {speaking ? (
            <Button variant="destructive" onClick={cancel}>
              <StopCircle className="mr-2 h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button variant="outline" onClick={handleSpeak}>
              <Volume2 className="mr-2 h-4 w-4" />
              Read Plan
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout">
            <Dumbbell className="mr-2 h-4 w-4" />
            Workout Plan
          </TabsTrigger>
          <TabsTrigger value="diet">
            <Utensils className="mr-2 h-4 w-4" />
            Diet Plan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="workout">
          <Card>
            <CardHeader>
              <CardTitle>Workout Plan</CardTitle>
              <CardDescription>{plan.workout_plan.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {plan.workout_plan.days.map((day, index) => (
                  <AccordionItem value={`day-${index}`} key={index}>
                    <AccordionTrigger>{day.day}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3">
                        {day.exercises.map((exercise, exIndex) => (
                          <li
                            key={exIndex}
                            className="flex flex-col items-start justify-between gap-2 rounded-md bg-secondary/50 p-3 sm:flex-row sm:items-center"
                          >
                            <div className="flex-grow">
                              <p className="font-semibold">{exercise.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {exercise.sets} sets x {exercise.reps} reps, {exercise.rest} rest
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleItemClick(exercise.name, exercise.image_prompt)}
                              className="mt-2 self-start sm:mt-0 sm:self-center"
                            >
                              <Sparkles className="mr-2 h-4 w-4 text-accent" />
                              Visualize
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diet">
          <Card>
             <CardHeader>
              <CardTitle>Diet Plan</CardTitle>
              <CardDescription>{plan.diet_plan.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {Object.entries(plan.diet_plan.meals).map(([mealType, items]) => (
                    <div key={mealType}>
                        <h3 className="flex items-center text-xl font-semibold capitalize mb-3">
                          {mealType === 'breakfast' && <Flame className="mr-2 h-5 w-5 text-primary" />}
                          {mealType === 'lunch' && <Soup className="mr-2 h-5 w-5 text-primary" />}
                          {mealType === 'dinner' && <Beef className="mr-2 h-5 w-5 text-primary" />}
                          {mealType === 'snacks' && <Apple className="mr-2 h-5 w-5 text-primary" />}
                          {mealType}
                        </h3>
                        <ul className="space-y-3">
                        {items.map((meal, mealIndex) => (
                             <li
                                key={mealIndex}
                                className="flex flex-col items-start justify-between gap-2 rounded-md bg-secondary/50 p-3 sm:flex-row sm:items-center"
                            >
                                <p className="text-muted-foreground flex-grow">{meal.item}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleItemClick(meal.item, meal.image_prompt)}
                                    className="mt-2 self-start sm:mt-0 sm:self-center"
                                >
                                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                                    Visualize
                                </Button>
                             </li>
                        ))}
                        </ul>
                    </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            AI Tips & Motivation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <blockquote className="border-l-4 border-accent pl-4 italic text-foreground/80">
                "{plan.motivation.quote}"
            </blockquote>
            <div className="flex items-center gap-2">
                <GlassWater className="h-5 w-5 text-primary" />
                <p className="text-muted-foreground">{plan.motivation.tip}</p>
            </div>
        </CardContent>
      </Card>

      <ImageModal isOpen={modalOpen} setIsOpen={setModalOpen} itemText={selectedItemText} />
    </div>
  );
}
