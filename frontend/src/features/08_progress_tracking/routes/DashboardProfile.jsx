import { useOutletContext } from 'react-router-dom';
import ProfileTab from '../components/ProfileTab';

export default function DashboardProfile() {
  const state = useOutletContext();

  return (
    <ProfileTab
      userProfile={state.userProfile}
      setUserProfile={state.setUserProfile}
      profileWeight={state.profileWeight}
      profileFitnessScore={state.profileFitnessScore}
      fitnessOffset={state.fitnessOffset}
      selectedGoals={state.selectedGoals}
      handleToggleGoal={state.handleToggleGoal}
      aiPreferences={state.aiPreferences}
      handleToggleAiPreference={state.handleToggleAiPreference}
      selectedTheme={state.selectedTheme}
      setSelectedTheme={state.setSelectedTheme}
      logoutState={state.logoutState}
      handleSecureLogout={state.handleSecureLogout}
    />
  );
}
