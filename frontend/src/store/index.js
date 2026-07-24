import { create } from 'zustand';

/**
 * Global App Store Placeholder
 * Feature-specific slices will be attached in future phases
 */
export const useAppStore = create((set) => ({
  initialized: true,
  theme: 'dark',
  setInitialized: (status) => set({ initialized: status }),
}));
