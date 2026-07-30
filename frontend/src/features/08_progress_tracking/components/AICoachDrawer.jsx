export default function AICoachDrawer({
  isChatOpen,
  setIsChatOpen,
  chatContainerRef,
  chatMessages,
  inputMessage,
  setInputMessage,
  handleSendMessage
}) {
  return (
    <>
      {/* Floating AI Coach Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[999] pointer-events-none flex justify-end px-6 orb-float">
        <button 
          onClick={() => setIsChatOpen(prev => !prev)}
          className="pointer-events-auto relative w-14 h-14 rounded-full cta-gradient ai-glow shadow-2xl flex items-center justify-center transition-transform active:scale-90 group overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          <span className="material-symbols-outlined text-black text-2xl font-bold group-hover:scale-110 transition-transform">
            {isChatOpen ? 'close' : 'auto_awesome'}
          </span>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full border-2 border-primary flex items-center justify-center">
            <span className="text-[8px] font-black text-primary uppercase">Hi</span>
          </div>
        </button>
      </div>

      {/* Floating AI Coach Assistant Chat Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[999] bg-surface-container border-t border-primary/20 rounded-t-[32px] shadow-2xl flex flex-col h-[400px] animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <div>
                <h4 className="text-sm font-bold text-on-surface">FitXAI Coach</h4>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Active Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-on-surface-variant hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-black font-semibold rounded-br-none' 
                      : 'bg-surface-container-high text-on-surface border border-white/5 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-surface-container-low flex gap-2">
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your coach anything..."
              className="flex-1 bg-surface-container p-3 rounded-full text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary border border-white/5"
            />
            <button 
              type="submit"
              className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-lg font-bold">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
