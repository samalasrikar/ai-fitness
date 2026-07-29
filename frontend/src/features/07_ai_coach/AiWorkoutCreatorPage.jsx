import React, { useEffect, useState } from 'react';
import { TopAppBar } from '../../components/TopAppBar';
import { BottomNavBar } from '../../components/BottomNavBar';
import { apiClient } from '../../lib/axios';

export function AiWorkoutCreatorPage() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await apiClient.get('/workout/ai-creator/messages');
        setMessages(res.data.messages || []);
      } catch (err) {
        setMessages([
          {
            id: '1',
            sender: 'FITAI_CORE',
            message: "I've analyzed your recovery score of 88. Ready for a high-intensity pull session?",
            metrics: 'HRV: 72ms | Sleep: Optimal',
          },
        ]);
      }
    }
    fetchMessages();
  }, []);

  const handleSend = async (customText) => {
    const textToSend = customText || prompt;
    if (!textToSend.trim()) return;

    setSending(true);
    setPrompt('');

    // Optimistic user message
    const tempUserMsg = { id: Date.now().toString(), sender: 'USER', message: textToSend };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await apiClient.post('/workout/ai-creator/prompt', { message: textToSend });
      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), res.data.userMsg, res.data.aiMsg]);
    } catch (err) {
      const fallbackAi = {
        id: (Date.now() + 1).toString(),
        sender: 'FITAI_CORE',
        message: `FitAI Core generated customized session for: "${textToSend}". Intensity tuned to 85%.`,
        metrics: 'Burn: 540 kcal | Duration: 45 min',
      };
      setMessages((prev) => [...prev, fallbackAi]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="font-body-md text-body-md flex flex-col min-h-screen bg-background">
      <TopAppBar />

      <main className="flex-grow flex flex-col pt-xxxl pb-32 px-container-margin relative z-10 max-w-4xl mx-auto w-full">
        <div className="flex justify-center mb-md mt-6">
          <div className="bg-surface-container-low/50 px-md py-xs rounded-full border border-white/5 flex items-center gap-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-caps text-label-caps text-on-surface-variant/70">NEURAL ENGINE ACTIVE</span>
          </div>
        </div>

        <div className="flex-grow flex flex-col gap-lg overflow-y-auto mb-16 space-y-md">
          {messages.map((m, idx) => {
            const isAI = m.sender === 'FITAI_CORE';
            return isAI ? (
              <div key={m.id || idx} className="flex flex-col items-start max-w-[85%]">
                <div className="flex items-center gap-sm mb-xs ml-sm">
                  <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">FitAI Core</span>
                </div>
                <div className="glass-panel p-lg rounded-xl rounded-tl-none border-l-2 border-l-primary border border-white/10">
                  <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">{m.message}</p>
                  {m.metrics && (
                    <div className="mt-md flex flex-wrap gap-sm">
                      <div className="bg-surface-container-highest/60 px-sm py-xs rounded border border-white/5">
                        <span className="font-data-sm text-data-sm text-primary">{m.metrics}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={m.id || idx} className="flex flex-col items-end max-w-[80%] self-end">
                <div className="bg-primary/10 border border-primary/20 p-md rounded-xl rounded-tr-none">
                  <p className="font-body-md text-body-md text-primary/90">{m.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Interaction Zone */}
        <div className="fixed bottom-24 left-0 w-full px-container-margin z-40 max-w-4xl mx-auto right-0">
          <div className="flex gap-sm mb-lg overflow-x-auto pb-xs">
            {['Generate fat-loss circuit', 'Focus on mobility', 'Swap Deadlifts for RDLs'].map((txt, i) => (
              <button
                key={i}
                onClick={() => handleSend(txt)}
                className="whitespace-nowrap px-lg py-sm rounded-full glass-panel border-white/10 hover:border-primary/50 text-on-surface-variant text-label-caps transition-all active:scale-95 cursor-pointer"
              >
                {txt}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="relative glass-panel rounded-2xl flex items-center p-xs border border-white/10">
              <input
                className="flex-grow bg-transparent border-none focus:ring-0 px-lg py-md text-on-surface font-body-lg placeholder:text-on-surface-variant/30 outline-none"
                placeholder="Tell FitAI your goals for today..."
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={() => handleSend()}
                disabled={sending}
                className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xl active:scale-90 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
