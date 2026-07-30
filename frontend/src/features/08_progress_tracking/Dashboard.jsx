import { useDashboardState } from './hooks/useDashboardState';
import DashboardHeader from './components/DashboardHeader';
import DashboardBottomNav from './components/DashboardBottomNav';
import AICoachDrawer from './components/AICoachDrawer';
import HomeTab from './components/HomeTab';
import CaloriesTab from './components/CaloriesTab';
import WorkoutTab from './components/WorkoutTab';
import RecordsTab from './components/RecordsTab';
import ProfileTab from './components/ProfileTab';

export default function Dashboard() {
  const {
    activeTab,
    setActiveTab,
    hasJoinedChallenge,
    setHasJoinedChallenge,
    userProfile,
    firstName,
    chatContainerRef,
    isGeneratingPlan,
    generatedPlan,
    setGeneratedPlan,
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    inputMessage,
    setInputMessage,
    nutritionSubView,
    setNutritionSubView,
    currentCalories,
    currentProtein,
    currentCarbs,
    currentFat,
    mealInput,
    setMealInput,
    mealType,
    setMealType,
    isAnalyzingMeal,
    analysisResult,
    loggedMeals,
    selectedGoals,
    aiPreferences,
    selectedTheme,
    setSelectedTheme,
    logoutState,
    muscleOffset,
    fatOffset,
    fitnessOffset,
    heartRate,
    steps,
    energy,
    hydration,
    profileWeight,
    profileFitnessScore,
    handleGeneratePlan,
    handleSendMessage,
    handleAnalyzeMeal,
    handleAddMealToLog,
    handleToggleGoal,
    handleToggleAiPreference,
    handleSecureLogout,
    limitCalories,
    nutritionRingOffset,
    proteinPct,
    carbsPct,
    fatPct
  } = useDashboardState();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-on-surface font-body-md flex items-center justify-center selection:bg-primary/30 relative overflow-hidden">
      {/* Mobile Simulator Viewport */}
      <div className="w-full max-w-md h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden border-x border-white/5 shadow-2xl">
        
        {/* Fixed Header */}
        <DashboardHeader activeTab={activeTab} nutritionSubView={nutritionSubView} />

        {/* Scrollable Main Content */}
        <main className="flex-1 pt-14 pb-20 overflow-y-auto no-scrollbar">
          {activeTab === 'home' && (
            <HomeTab
              firstName={firstName}
              generatedPlan={generatedPlan}
              setGeneratedPlan={setGeneratedPlan}
              isGeneratingPlan={isGeneratingPlan}
              handleGeneratePlan={handleGeneratePlan}
              heartRate={heartRate}
              steps={steps}
              energy={energy}
              hydration={hydration}
              muscleOffset={muscleOffset}
              fatOffset={fatOffset}
              hasJoinedChallenge={hasJoinedChallenge}
              setHasJoinedChallenge={setHasJoinedChallenge}
            />
          )}

          {activeTab === 'calories' && (
            <CaloriesTab
              nutritionSubView={nutritionSubView}
              setNutritionSubView={setNutritionSubView}
              currentCalories={currentCalories}
              currentProtein={currentProtein}
              currentCarbs={currentCarbs}
              currentFat={currentFat}
              mealInput={mealInput}
              setMealInput={setMealInput}
              mealType={mealType}
              setMealType={setMealType}
              isAnalyzingMeal={isAnalyzingMeal}
              analysisResult={analysisResult}
              loggedMeals={loggedMeals}
              handleAnalyzeMeal={handleAnalyzeMeal}
              handleAddMealToLog={handleAddMealToLog}
              limitCalories={limitCalories}
              nutritionRingOffset={nutritionRingOffset}
              proteinPct={proteinPct}
              carbsPct={carbsPct}
              fatPct={fatPct}
            />
          )}

          {activeTab === 'workout' && <WorkoutTab />}

          {activeTab === 'records' && <RecordsTab />}

          {activeTab === 'profile' && (
            <ProfileTab
              userProfile={userProfile}
              profileWeight={profileWeight}
              profileFitnessScore={profileFitnessScore}
              fitnessOffset={fitnessOffset}
              selectedGoals={selectedGoals}
              handleToggleGoal={handleToggleGoal}
              aiPreferences={aiPreferences}
              handleToggleAiPreference={handleToggleAiPreference}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              logoutState={logoutState}
              handleSecureLogout={handleSecureLogout}
            />
          )}
        </main>

        {/* Floating AI Coach Assistant & Drawer */}
        <AICoachDrawer
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          chatContainerRef={chatContainerRef}
          chatMessages={chatMessages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />

        {/* Fixed Bottom Navigation */}
        <DashboardBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      </div>
    </div>
  );
}
