import { LandingNavbar } from '@/components/Landing-navbar';
import { LandingHero } from '@/components/Landing-hero';
import LandingLayout from './LandingLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#111827] overflow-auto">
      <div className="mx-auto max-w-screen-xl h-full w-full">
        <LandingNavbar />
        <LandingHero />
      </div>
    </main>
  );
};

export default LandingPage;
