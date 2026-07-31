import { motion } from 'framer-motion';

/**
 * FloatingAIButton – Circular FAB that opens the AI plan creation flow.
 *
 * ✅ Positioned above BottomNav (bottom-24) and away from right edge
 * ✅ Fully hidden (opacity + visibility + pointer-events) when any modal is open
 *    so it never overlaps modal footer buttons or exercise cards
 * ✅ Respects safe-area-inset-bottom for notched devices
 * ✅ z-40 – stays below modal backdrop at z-60
 */
export default function FloatingAIButton({ onPress, isModalOpen = false }) {
  return (
    <motion.button
      type="button"
      onClick={onPress}
      aria-label="Generate AI workout"
      aria-hidden={isModalOpen}
      tabIndex={isModalOpen ? -1 : 0}
      whileTap={{ scale: 0.92 }}
      animate={{
        opacity: isModalOpen ? 0 : 1,
        scale: isModalOpen ? 0.8 : 1,
        visibility: isModalOpen ? 'hidden' : 'visible',
      }}
      transition={{ duration: 0.18 }}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        pointerEvents: isModalOpen ? 'none' : 'auto',
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
