import Header from '@/components/layout/header';
import { StructuredPlanView } from '@/components/plan/structured-plan-view';
import { Suspense } from 'react';

export default function PlanPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<p>Loading plan...</p>}>
            <StructuredPlanView />
        </Suspense>
      </main>
      <footer className="py-6 text-center text-primary-foreground/60 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Fitness Coach. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
