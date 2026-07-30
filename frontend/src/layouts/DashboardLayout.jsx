import { Outlet } from 'react-router-dom';
import { useDashboardState } from '../features/08_progress_tracking/hooks/useDashboardState';
import DashboardHeader from '../features/08_progress_tracking/components/DashboardHeader';
import DashboardBottomNav from '../features/08_progress_tracking/components/DashboardBottomNav';
import AICoachDrawer from '../features/08_progress_tracking/components/AICoachDrawer';

export function DashboardLayout() {
  const dashboardState = useDashboardState();

  return (
    <div className="w-full flex-1 flex flex-col relative overflow-hidden bg-[#0A0A0A] min-h-screen">
      {/* Persistent Header */}
      <DashboardHeader />

      {/* Main Outlet View Canvas */}
      <main className="flex-1 pt-16 pb-24 overflow-y-auto no-scrollbar w-full">
        <Outlet context={dashboardState} />
      </main>

      {/* Floating AI Coach Assistant Drawer */}
      <AICoachDrawer
        isChatOpen={dashboardState.isChatOpen}
        setIsChatOpen={dashboardState.setIsChatOpen}
        chatContainerRef={dashboardState.chatContainerRef}
        chatMessages={dashboardState.chatMessages}
        inputMessage={dashboardState.inputMessage}
        setInputMessage={dashboardState.setInputMessage}
        handleSendMessage={dashboardState.handleSendMessage}
      />

      {/* Persistent Bottom Navigation */}
      <DashboardBottomNav />
    </div>
  );
}

export default DashboardLayout;
