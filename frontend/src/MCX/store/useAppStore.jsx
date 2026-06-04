import { create } from "zustand";

export const useAppStore = create((set) => ({
  theme: "dark",
  selectedCommodity: "GOLD",
  botStatus: "WAITING",
  strategyName: "Observation",
  nextAnalysis: 300,

  setTheme: (theme) => set({ theme }),
  setCommodity: (selectedCommodity) => set({ selectedCommodity }),
  setBotStatus: (botStatus) => set({ botStatus }),
  setStrategy: (strategyName) => set({ strategyName }),
  setNextAnalysis: (nextAnalysis) => set({ nextAnalysis })
}));