import { create } from "zustand";

interface TravelStore {
    travels: ITravel[];
    updateTravels: (travels: ITravel[]) => void;
}

export const useTravelStore = create<TravelStore>((set, get) => ({
    travels: [],
    updateTravels: (travels) => set({ travels }),
}));