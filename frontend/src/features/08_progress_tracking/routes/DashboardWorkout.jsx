import { useOutletContext } from 'react-router-dom';
import WorkoutTab from '../components/WorkoutTab';

export default function DashboardWorkout() {
  const state = useOutletContext();

  return (
    <WorkoutTab
      generatedPlan={state.generatedPlan}
      isGeneratingPlan={state.isGeneratingPlan}
      handleGeneratePlan={state.handleGeneratePlan}
    />
  );
}
