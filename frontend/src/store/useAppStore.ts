import { create } from 'zustand';
import { OutfitData } from '../components/OutfitCard';
import { Product } from '../data/productsData';

export interface CartItem extends OutfitData {
  cartItemId: string; // Unique ID for the cart item
  size: string | null;
  quantity: number;
}

interface AppState {
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  passedOutfits: string[];
  isCartOpen: boolean;
  isAiDrawerOpen: boolean;
  
  // Quick View Modal
  quickViewProduct: Product | null;
  
  // Filters & Search State
  selectedCategory: string;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest';
  viewMode: 'grid-4' | 'grid-3' | 'grid-2';

  // Actions
  addToCart: (outfit: OutfitData, size?: string | null) => void;
  addPassedOutfit: (id: string) => void;
  updateCartItemSize: (cartItemId: string, size: string) => void;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  toggleAiDrawer: () => void;
  
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  setQuickViewProduct: (product: Product | null) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'featured' | 'price-low' | 'price-high' | 'newest') => void;
  setViewMode: (mode: 'grid-4' | 'grid-3' | 'grid-2') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  cart: [],
  wishlist: ["prod-1", "prod-3"], // default demo wishlist items
  passedOutfits: [],
  isCartOpen: false,
  isAiDrawerOpen: false,
  
  quickViewProduct: null,
  
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  viewMode: 'grid-4',

  addToCart: (outfit, size = null) => set((state) => ({ 
    cart: [...state.cart, { 
      ...outfit, 
      cartItemId: `${outfit.id}-${size || 'nosize'}-${Date.now()}`, 
      size: size || null, 
      quantity: 1 
    }] 
  })),
  
  addPassedOutfit: (id) => set((state) => ({ 
    passedOutfits: [...state.passedOutfits, id] 
  })),
  
  updateCartItemSize: (cartItemId, size) => set((state) => ({
    cart: state.cart.map(item => item.cartItemId === cartItemId ? { ...item, size } : item)
  })),
  
  updateCartItemQuantity: (cartItemId, quantity) => set((state) => ({
    cart: state.cart.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item)
  })),
  
  removeFromCart: (cartItemId) => set((state) => ({
    cart: state.cart.filter(item => item.cartItemId !== cartItemId)
  })),
  
  clearCart: () => set({ cart: [] }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isAiDrawerOpen: false })),
  toggleAiDrawer: () => set((state) => ({ isAiDrawerOpen: !state.isAiDrawerOpen, isCartOpen: false })),

  toggleWishlist: (productId) => set((state) => {
    const exists = state.wishlist.includes(productId);
    return {
      wishlist: exists 
        ? state.wishlist.filter(id => id !== productId)
        : [...state.wishlist, productId]
    };
  }),

  isInWishlist: (productId) => get().wishlist.includes(productId),

  setQuickViewProduct: (product) => set({ quickViewProduct: product }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
}));
