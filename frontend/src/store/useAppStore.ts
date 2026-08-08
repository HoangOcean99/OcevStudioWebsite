import { create } from 'zustand';
import { OutfitData } from '../components/OutfitCard';
import { Product, PRODUCTS_DATA, ItemColor } from '../data/productsData';
import api from '../lib/api';

export interface CartItem extends OutfitData {
  cartItemId: string; // Unique ID for the cart item
  size: string | null;
  quantity: number;
  color?: ItemColor;
  availableColors?: ItemColor[];
  availableSizes?: string[];
  isBundle?: boolean;
  bundleName?: string;
  cartBundleId?: string;
  isCustom?: boolean;
  basePrice?: number;
  originalItemId?: string;
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
  viewMode: 'grid-4' | 'grid-3' | 'grid-2' | 'lookbook';

  // API State
  products: Product[];
  isLoadingProducts: boolean;
  errorProducts: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  addToCart: (outfit: any, size?: string | null) => void;
  addPassedOutfit: (id: string) => void;
  updateCartItemSize: (cartItemId: string, size: string) => void;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItemColor: (cartItemId: string, color: ItemColor) => void;
  removeFromCart: (cartItemId: string) => void;
  removeOrDowngradeBundleItem: (cartItemId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  toggleAiDrawer: () => void;
  
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  setQuickViewProduct: (product: Product | null) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'featured' | 'price-low' | 'price-high' | 'newest') => void;
  setViewMode: (mode: 'grid-4' | 'grid-3' | 'grid-2' | 'lookbook') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  cart: [],
  wishlist: ["6a6efefaaf47fac2785da2aa", "6a6efefaaf47fac2785da2ae"], // default demo wishlist items
  passedOutfits: [],
  isCartOpen: false,
  isAiDrawerOpen: false,
  
  quickViewProduct: null,
  
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  viewMode: 'grid-4',

  products: [],
  isLoadingProducts: false,
  errorProducts: null,

  fetchProducts: async () => {
    set({ isLoadingProducts: true, errorProducts: null });
    try {
      const { data } = await api.get('/products');
      const mappedProducts = (data.items || []).map((p: any) => ({
        ...p,
        id: p.id || p._id
      }));
      // Fallback to local data if API returns empty
      const products = mappedProducts.length > 0 ? mappedProducts : PRODUCTS_DATA;
      set({ products, isLoadingProducts: false });
    } catch (error: any) {
      console.warn('API unavailable, falling back to local product data.');
      set({
        products: PRODUCTS_DATA,
        errorProducts: null,
        isLoadingProducts: false
      });
    }
  },

  addToCart: (outfit: any, size = null) => set((state) => ({ 
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
  
  updateCartItemColor: (cartItemId, color) => set((state) => ({
    cart: state.cart.map(item => {
      if (item.cartItemId === cartItemId) {
        // Cập nhật lại tên hiển thị cho đúng màu
        let newName = item.name;
        if (newName.includes('(')) {
          newName = newName.replace(/\(.*?\)/, `(${color.name})`);
        } else {
          newName = `${newName} (${color.name})`;
        }
        return {
          ...item,
          color,
          imageUrl: color.imageUrl || item.imageUrl,
          name: newName
        };
      }
      return item;
    })
  })),

  removeFromCart: (cartItemId) => set((state) => ({
    cart: state.cart.filter(item => item.cartItemId !== cartItemId)
  })),

  removeOrDowngradeBundleItem: (cartItemId) => set((state) => {
    const itemToRemove = state.cart.find(i => i.cartItemId === cartItemId);
    if (!itemToRemove) return state;

    let newCart = state.cart.filter(i => i.cartItemId !== cartItemId);

    if (itemToRemove.cartBundleId) {
      const bundleItems = newCart.filter(i => i.cartBundleId === itemToRemove.cartBundleId);
      
      // Nếu là predefined bundle -> xoá món sẽ thành custom bundle (hoặc ngược lại)
      const remainingCount = bundleItems.length;
      const discountPercent =
        remainingCount >= 4 ? 0.2 : remainingCount === 3 ? 0.15 : remainingCount === 2 ? 0.1 : 0;

      newCart = newCart.map(item => {
        if (item.cartBundleId === itemToRemove.cartBundleId) {
          return {
            ...item,
            isBundle: false,
            isCustom: true,
            price: (item.basePrice || item.price) * (1 - discountPercent)
          };
        }
        return item;
      });
    }
    return { cart: newCart };
  }),
  
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
