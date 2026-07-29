import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Target, Dumbbell, Sparkles } from 'lucide-react';

export function OnboardingOverviewPage() {
  const navigate = useNavigate();

  return (
    <main className="relative z-10 min-h-screen flex flex-col px-container-margin pt-xxl pb-xxxl md:max-w-4xl md:mx-auto bg-background text-on-surface">
      <header className="mb-xxl text-center md:text-left">
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary tracking-tighter mb-sm">
          FitAI X
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          Experience the evolution of high-performance training. Your transformation is governed by precision and intelligence.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-xxl items-start">
        {/* Left Journey Steps */}
        <div className="md:col-span-5 flex justify-center md:justify-start">
          <div className="relative flex flex-col items-center">
            <div className="space-y-xxl w-full">
              <div className="flex items-start gap-lg group cursor-pointer" onClick={() => navigate('/onboarding/personal-details')}>
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                  <User className="w-4 h-4 text-on-primary-container" />
                </div>
                <div className="pt-1">
                  <span className="font-label-caps text-label-caps text-primary block mb-1">Phase 01</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Personal Details</h3>
                  <p className="text-on-surface-variant font-body-md mt-sm">A biometric blueprint of your physical state.</p>
                </div>
              </div>

              <div className="flex items-start gap-lg group cursor-pointer" onClick={() => navigate('/onboarding/experience-level')}>
                <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
                  <Target className="w-4 h-4 text-on-surface-variant" />
                </div>
                <div className="pt-1">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Phase 02</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Experience & Goals</h3>
                  <p className="text-on-surface-variant font-body-md mt-sm">Define the objectives of your performance arc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Feature Card */}
        <div className="md:col-span-7 space-y-lg">
          <div className="glass-panel p-xl rounded-xl border border-white/5">
            <div className="flex items-center gap-md mb-md">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-headline-md text-headline-md">AI Core Engine</h4>
            </div>
            <p className="text-on-surface-variant font-body-md leading-relaxed">
              Our proprietary FitAI neural network analyzes over 5,000 data points from your initial profile to construct a training regime that adapts in real-time.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-xxxl flex flex-col items-center">
        <button
          onClick={() => navigate('/onboarding/personal-details')}
          className="px-xxl py-lg bg-primary-container rounded-full text-on-primary-container font-headline-md hover:scale-105 active:scale-95 transition-all duration-300 gold-glow cursor-pointer"
        >
          Start Your Transformation
        </button>
      </footer>
    </main>
  );
}
