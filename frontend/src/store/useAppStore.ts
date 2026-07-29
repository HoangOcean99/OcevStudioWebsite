import { create } from 'zustand';
import { OutfitData } from '../components/OutfitCard';

interface AppState {
  likedOutfits: OutfitData[];
  passedOutfits: string[]; // store just IDs
  addLikedOutfit: (outfit: OutfitData) => void;
  addPassedOutfit: (id: string) => void;
  clearState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  likedOutfits: [],
  passedOutfits: [],
  addLikedOutfit: (outfit) => set((state) => ({ 
    likedOutfits: [...state.likedOutfits, outfit] 
  })),
  addPassedOutfit: (id) => set((state) => ({ 
    passedOutfits: [...state.passedOutfits, id] 
  })),
  clearState: () => set({ likedOutfits: [], passedOutfits: [] }),
}));
