import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import { Dumbbell, Calendar, Scale, Ruler, ArrowRight } from 'lucide-react';

export function PersonalDetailsPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(185);
  const [heightFeet, setHeightFeet] = useState(6);
  const [heightInches, setHeightInches] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      await apiClient.put('/user/onboarding', {
        gender,
        age,
        weight,
        heightFeet,
        heightInches,
      });
      navigate('/onboarding/experience-level');
    } catch (err) {
      navigate('/onboarding/experience-level');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-container-margin pt-xxxl pb-xxl bg-background text-on-surface">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-container-margin py-md bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-md">
          <Dumbbell className="w-6 h-6 text-primary" />
          <span className="font-display-lg-mobile text-headline-md text-primary tracking-tighter">FitAI X</span>
        </div>
        <div className="flex flex-col items-end gap-xs">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Step 1 of 4</span>
          <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary-container w-1/4 rounded-full"></div>
          </div>
        </div>
      </header>

      <section className="w-full max-w-2xl space-y-xl mt-12">
        <div className="text-center space-y-sm">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface tracking-tight">Personal Details</h1>
          <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
            Help us calibrate your AI model by providing your basic metrics for precision tracking.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-md w-full">
          {/* Gender */}
          <div className="col-span-2 glass-card rounded-xl p-lg flex flex-col gap-md">
            <label className="font-label-caps text-label-caps text-on-surface-variant">Biological Gender</label>
            <div className="grid grid-cols-2 gap-md">
              <button
                type="button"
                className={`flex items-center justify-center gap-sm py-md rounded-lg border transition-all cursor-pointer ${
                  gender === 'Male'
                    ? 'bg-primary-container text-on-primary-container border-primary shadow-lg'
                    : 'bg-surface-container-low text-on-surface-variant border-white/5'
                }`}
                onClick={() => setGender('Male')}
              >
                <span className="font-body-lg">Male</span>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-sm py-md rounded-lg border transition-all cursor-pointer ${
                  gender === 'Female'
                    ? 'bg-primary-container text-on-primary-container border-primary shadow-lg'
                    : 'bg-surface-container-low text-on-surface-variant border-white/5'
                }`}
                onClick={() => setGender('Female')}
              >
                <span className="font-body-lg">Female</span>
              </button>
            </div>
          </div>

          {/* Age */}
          <div className="glass-card rounded-xl p-lg flex flex-col gap-sm">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs">
              <Calendar className="w-4 h-4 text-primary" />
              Age
            </label>
            <div className="flex items-baseline gap-xs">
              <input
                className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-display-lg-mobile text-primary"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <span className="font-data-sm text-on-surface-variant/40">yrs</span>
            </div>
          </div>

          {/* Weight */}
          <div className="glass-card rounded-xl p-lg flex flex-col gap-sm">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs">
              <Scale className="w-4 h-4 text-primary" />
              Weight
            </label>
            <div className="flex items-baseline gap-xs">
              <input
                className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-display-lg-mobile text-primary"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="font-data-sm text-on-surface-variant/40">lbs</span>
            </div>
          </div>

          {/* Height */}
          <div className="col-span-2 glass-card rounded-xl p-lg flex flex-col gap-sm">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs">
              <Ruler className="w-4 h-4 text-primary" />
              Height
            </label>
            <div className="flex items-baseline gap-md">
              <div className="flex items-baseline gap-xs flex-1 border-b border-white/10 pb-xs">
                <input
                  className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-display-lg-mobile text-primary"
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                />
                <span className="font-data-sm text-on-surface-variant/40">ft</span>
              </div>
              <div className="flex items-baseline gap-xs flex-1 border-b border-white/10 pb-xs">
                <input
                  className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-display-lg-mobile text-primary"
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                />
                <span className="font-data-sm text-on-surface-variant/40">in</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full py-lg bg-primary-container text-on-primary-container font-headline-md rounded-full gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-md cursor-pointer"
        >
          <span>{loading ? 'Saving...' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </main>
  );
}
