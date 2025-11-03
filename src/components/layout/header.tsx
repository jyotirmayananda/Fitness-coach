import Link from 'next/link';
import { Dumbbell } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Header() {
  return (
    <header className="w-full bg-transparent">
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
            <span className="font-bold font-headline text-primary-foreground">AI Fitness Coach</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
