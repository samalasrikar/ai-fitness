import { motion } from 'framer-motion';

/**
 * FloatingAIButton – Circular FAB that opens the AI plan creation flow.
 *
 * ✅ Positioned above BottomNav (bottom-24) and away from right edge
 * ✅ Hidden (pointer-events-none + opacity-0) when a modal is open
 * ✅ Respects safe-area-inset-bottom for notched devices
 * ✅ Never blocks cards or critical UI
 */
export default function FloatingAIButton({ onPress, isModalOpen = false }) {
  return (
    <motion.button
      type="button"
      onClick={onPress}
      aria-label="Generate AI workout"
      aria-hidden={isModalOpen}
      whileTap={{ scale: 0.92 }}
      animate={{
        opacity: isModalOpen ? 0 : 1,
        scale: isModalOpen ? 0.8 : 1,
        pointerEvents: isModalOpen ? 'none' : 'auto',
      }}
      transition={{ duration: 0.18 }}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      className="fixed bottom-24 right-4 z-40
                 w-14 h-14 rounded-full
                 bg-[#f5c400] text-black
                 flex items-center justify-center
                 shadow-[0_4px_20px_rgba(245,196,0,0.4)]
                 hover:brightness-110 cursor-pointer"
    >
      <span
        className="material-symbols-outlined text-2xl"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden="true"
      >
        auto_awesome
      </span>
    </motion.button>
  );
}
