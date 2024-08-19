import { LandingNavbar } from '@/components/Landing-navbar';
import { LandingHero } from '@/components/Landing-hero';
import { LandingContent } from '@/components/Landing-content';
import LandingLayout from './LandingLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#111827] overflow-auto">
      <div className="mx-auto max-w-screen-xl h-full w-full">
        <LandingNavbar />
        <LandingHero />
        <LandingContent />
      </div>
    </main>
  );
};

export default LandingPage;
