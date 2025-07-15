import { create } from "zustand";

interface PodcastRefreshState {
  refreshKey: number;
  incrementRefreshKey: () => void;
}

export const usePodcastRefreshStore = create<PodcastRefreshState>((set) => ({
  refreshKey: 0,
  incrementRefreshKey: () =>
    set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
