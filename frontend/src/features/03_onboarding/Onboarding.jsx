import { useOnboarding } from './hooks/useOnboarding';
import OnboardingHeader from './components/OnboardingHeader';
import StepOverview from './components/StepOverview';
import StepPersonalDetails from './components/StepPersonalDetails';
import StepPreferences from './components/StepPreferences';
import StepFitnessGoals from './components/StepFitnessGoals';
import StepAIPersonalization from './components/StepAIPersonalization';
import StepFinalProtocol from './components/StepFinalProtocol';

export default function Onboarding() {
  const {
    step,
    setStep,
    gender,
    setGender,
    age,
    setAge,
    weight,
    setWeight,
    heightCm,
    setHeightCm,
    fitnessLevel,
    setFitnessLevel,
    frequency,
    setFrequency,
    location,
    setLocation,
    duration,
    setDuration,
    selectedGoal,
    setSelectedGoal,
    progress,
    statusText,
    tickerIndex,
    isSubmitting,
    submitError,
    handleFinishOnboarding
  } = useOnboarding();

  return (
    <div className="w-full flex-1 flex flex-col relative overflow-hidden bg-[#0A0A0A]">
      {/* Header Progress Bar */}
      <OnboardingHeader step={step} />

      {/* Scrollable Wizard Canvas */}
      <main className={`flex-1 overflow-y-auto no-scrollbar flex flex-col px-6 ${step >= 2 && step <= 4 ? 'pt-16 pb-6' : 'py-6'}`}>
        {step === 1 && <StepOverview onNext={() => setStep(2)} />}
        
        {step === 2 && (
          <StepPersonalDetails
            gender={gender}
            setGender={setGender}
            age={age}
            setAge={setAge}
            weight={weight}
            setWeight={setWeight}
            heightCm={heightCm}
            setHeightCm={setHeightCm}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepPreferences
            fitnessLevel={fitnessLevel}
            setFitnessLevel={setFitnessLevel}
            frequency={frequency}
            setFrequency={setFrequency}
            location={location}
            setLocation={setLocation}
            duration={duration}
            setDuration={setDuration}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepFitnessGoals
            selectedGoal={selectedGoal}
            setSelectedGoal={setSelectedGoal}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <StepAIPersonalization
            statusText={statusText}
            progress={progress}
            tickerIndex={tickerIndex}
          />
        )}

        {step === 6 && (
          <StepFinalProtocol
            selectedGoal={selectedGoal}
            fitnessLevel={fitnessLevel}
            frequency={frequency}
            weight={weight}
            heightCm={heightCm}
            location={location}
            duration={duration}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onFinish={handleFinishOnboarding}
          />
        )}
      </main>

      {/* Footer Identity */}
      <footer className="py-6 px-6 text-center">
        <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.25em]">
          POWERED BY FITAI NEURAL CORE v4.0
        </p>
      </footer>
    </div>
  );
}
