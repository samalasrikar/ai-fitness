import { useOutletContext } from 'react-router-dom';
import HomeTab from '../components/HomeTab';

export default function DashboardHome() {
  const state = useOutletContext();
  return (
    <HomeTab
      firstName={state.firstName}
      generatedPlan={state.generatedPlan}
      setGeneratedPlan={state.setGeneratedPlan}
      isGeneratingPlan={state.isGeneratingPlan}
      handleGeneratePlan={state.handleGeneratePlan}
      heartRate={state.heartRate}
      steps={state.steps}
      energy={state.energy}
      hydration={state.hydration}
      muscleOffset={state.muscleOffset}
      fatOffset={state.fatOffset}
      hasJoinedChallenge={state.hasJoinedChallenge}
      setHasJoinedChallenge={state.setHasJoinedChallenge}
      streakDays={state.streakDays}
    />
  );
}
