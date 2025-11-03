import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, FileText } from 'lucide-react';
import { provideAIGeneratedTips } from '@/ai/flows/provide-ai-generated-tips';
import { FitnessForm } from '@/components/forms/fitness-form';
import Header from '@/components/layout/header';

async function DailyMotivation() {
  try {
    const tips = await provideAIGeneratedTips({
      fitnessGoal: 'general wellness',
      currentFitnessLevel: 'intermediate',
      workoutLocation: 'any',
      dietaryPreferences: 'balanced',
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Star className="text-primary" /> Daily AI Motivation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <blockquote className="border-l-4 border-accent pl-4 italic text-foreground/80">
            "{tips.motivationQuote.replace(/"/g, '')}"
          </blockquote>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Failed to load today's tip:", error);
    return (
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Star className="text-primary" /> Daily AI Motivation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <blockquote className="border-l-4 border-accent pl-4 italic text-foreground/80">
            "Champions keep playing until they get it right." <br/> - Billie Jean King
          </blockquote>
        </CardContent>
      </Card>
    );
  }
}

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground">
            AI Fitness Coach
          </h1>
          <p className="mt-2 text-lg md:text-xl text-primary-foreground/80">
            Get Your Personalized Fitness Plan
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <DailyMotivation />

          <Card className="overflow-hidden">
            <CardHeader className="bg-card">
              <CardTitle className="text-2xl font-headline text-center">Tell Us About Yourself</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FitnessForm />
            </CardContent>
          </Card>

          <div className="space-y-4">
             <h2 className="text-3xl font-bold font-headline text-center text-primary-foreground">Your Saved Fitness Plans</h2>
            <Card>
                <CardContent className="flex flex-col items-center justify-center text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No saved fitness plans yet. Generate and save your first personalized plan!</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-primary-foreground/60 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Fitness Coach. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
