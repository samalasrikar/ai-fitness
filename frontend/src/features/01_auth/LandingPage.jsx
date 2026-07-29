import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/TopAppBar';
import { BottomNavBar } from '../../components/BottomNavBar';
import { ArrowRight, Brain, Moon, HeartPulse, BrainCircuit, Zap } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen">
      <TopAppBar />

      <main className="pt-24 pb-32">
        {/* Hero Section */}
        <section className="px-container-margin mb-xxl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10 space-y-md mb-xl">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">
              The Future of Human Performance
            </span>
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface leading-tight">
              Elevate Your <br />
              <span className="text-primary italic">Human Potential.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xs">
              AI-powered adaptive fitness intelligence that learns from your body in real-time.
            </p>
            <div className="flex flex-col gap-md pt-md">
              <button
                onClick={() => navigate('/signup')}
                className="w-full h-14 bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded-full gold-glow active:scale-95 transition-all flex items-center justify-center gap-sm cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/onboarding')}
                className="w-full h-14 glass-card border border-white/10 text-on-surface font-headline-md text-headline-md rounded-full active:scale-95 transition-all cursor-pointer"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative w-full aspect-[4/3] rounded-xxl overflow-hidden glass-card mt-xl border border-white/5">
            <img
              className="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKox70xDOraGef3lmwi7NOrMBUFEO2SsFc99F6IyBk1pBywi_RHAIR0dUddud7kjFo_DepU0noP7BJPZSxOnmyZe2NW9rNqLLEy1l9JwWhvTb1N8_9XmLbLCxeVq_VvdtCUv4VnTyRgeV9o_bauPp8A3ZHM5rYvR2p8LGIpkwqMIKkHPid1KLKwFYP5lIDK3vC14ItDK_ZzDnr-R_bPFQkx_dcAWCPQe_iVAnV7Xftzp20PSwxvw-nIw"
              alt="Neural AI visualization"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            <div className="absolute bottom-md left-md right-md flex justify-between items-end">
              <div className="glass-card px-md py-sm rounded-xl border border-white/10">
                <span className="font-data-sm text-data-sm text-primary block">BIOMETRIC SYNC</span>
                <span className="font-headline-md text-headline-md text-on-surface">Active</span>
              </div>
              <div className="flex flex-col items-end gap-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">ENGINE STATUS</span>
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-1 h-5 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-1 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-1 h-4 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Neural Engine Section */}
        <section className="px-container-margin mb-xxl">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Neural Engine</h2>
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div className="glass-card p-xl rounded-xxl mesh-bg relative overflow-hidden group">
            <div className="space-y-md relative z-10">
              <div className="inline-flex items-center px-sm py-xs bg-primary/10 rounded-full border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></span>
                <span className="font-label-caps text-label-caps text-primary">REAL-TIME ADAPTATION</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Our core engine processes 4,000+ data points per second, adjusting your workout intensity the moment your form or heart rate deviates.
              </p>
              <div className="flex gap-md pt-sm">
                <div className="flex flex-col">
                  <span className="font-data-lg text-data-lg text-primary">98.4%</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">ACCURACY</span>
                </div>
                <div className="w-[1px] h-10 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="font-data-lg text-data-lg text-primary">&lt;10ms</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">LATENCY</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recovery Section */}
        <section className="px-container-margin mb-xxl">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">Data-Driven Recovery</h2>
          <div className="grid grid-cols-2 gap-md">
            <div className="col-span-2 glass-card p-lg rounded-xxl flex flex-col justify-between min-h-[180px]">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5">
                  <Moon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">SLEEP HYGIENE</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Neural Rest</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Deep integration with your circadian rhythm and REM cycles.
                </p>
              </div>
            </div>
            <div className="glass-card p-lg rounded-xxl aspect-square flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="font-data-lg text-data-lg text-on-surface">HRV</span>
                <p className="font-label-caps text-label-caps text-on-surface-variant">Strain Index</p>
              </div>
            </div>
            <div className="glass-card p-lg rounded-xxl aspect-square flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div>
                <span className="font-data-lg text-data-lg text-on-surface">Insight</span>
                <p className="font-label-caps text-label-caps text-on-surface-variant">Daily Score</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-container-margin py-xxl mb-xl text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-xl border border-primary/20">
            <Zap className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-md">Ready to Transcend?</h2>
          <button
            onClick={() => navigate('/signup')}
            className="w-full h-14 bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded-full gold-glow active:scale-95 transition-all cursor-pointer"
          >
            Claim My Invite
          </button>
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
