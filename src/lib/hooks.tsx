'use client';

// Custom React hooks
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './auth';

// Cart types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface CartState {
  id?: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

// Cart actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: CartState }
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_CART':
      return { ...action.payload, isLoading: false, error: null };

    case 'ADD_ITEM': {
      // This will be handled by API call, just set loading state
      return { ...state, isLoading: true, error: null };
    }

    case 'REMOVE_ITEM': {
      // This will be handled by API call, just set loading state
      return { ...state, isLoading: true, error: null };
    }

    case 'UPDATE_QUANTITY': {
      // This will be handled by API call, just set loading state
      return { ...state, isLoading: true, error: null };
    }

    case 'CLEAR_CART': {
      // This will be handled by API call, just set loading state
      return { ...state, isLoading: true, error: null };
    }

    default:
      return state;
  }
};

// Cart context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
    error: null,
  });

  // API functions
  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch('/api/cart', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      const cartData = await response.json();
      dispatch({ type: 'SET_CART', payload: cartData });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch cart',
      });
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to add item to cart');
      const cartData = await response.json();
      dispatch({ type: 'SET_CART', payload: cartData });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to add item to cart',
      });
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    // Optimistic update
    const prev = state;
    const optimistic: CartState = {
      ...state,
      isLoading: true,
      items: state.items.map((it) => (it.id === productId ? { ...it, quantity } : it)),
    };
    optimistic.itemCount = optimistic.items.reduce((s, it) => s + it.quantity, 0);
    optimistic.total = optimistic.items.reduce((s, it) => s + it.quantity * it.price, 0);
    dispatch({ type: 'SET_CART', payload: optimistic });
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to update cart item');
      const cartData = await response.json();
      dispatch({ type: 'SET_CART', payload: cartData });
    } catch (error) {
      // Revert
      dispatch({ type: 'SET_CART', payload: { ...prev, isLoading: false } });
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update cart item',
      });
    }
  };

  const removeFromCart = async (productId?: string) => {
    // Optimistic
    const prev = state;
    let optimistic: CartState = { ...state, isLoading: true };
    if (productId) {
      optimistic = {
        ...optimistic,
        items: optimistic.items.filter((it) => it.id !== productId),
      };
      optimistic.itemCount = optimistic.items.reduce((s, it) => s + it.quantity, 0);
      optimistic.total = optimistic.items.reduce((s, it) => s + it.quantity * it.price, 0);
    } else {
      optimistic = { ...optimistic, items: [], total: 0, itemCount: 0 };
    }
    dispatch({ type: 'SET_CART', payload: optimistic });
    try {
      const url = productId ? `/api/cart?productId=${productId}` : '/api/cart';
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to remove item from cart');
      const cartData = await response.json();
      dispatch({ type: 'SET_CART', payload: cartData });
    } catch (error) {
      // Revert
      dispatch({ type: 'SET_CART', payload: { ...prev, isLoading: false } });
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to remove item from cart',
      });
    }
  };

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      dispatch({
        type: 'SET_CART',
        payload: { items: [], total: 0, itemCount: 0, isLoading: false, error: null },
      });
    }
  }, [user]);

  // Enhanced dispatch function that handles API calls
  const enhancedDispatch = (action: CartAction) => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'Please log in to manage your cart' });
      return;
    }

    switch (action.type) {
      case 'ADD_ITEM':
        addToCart(action.payload.id.toString());
        break;
      case 'REMOVE_ITEM':
        removeFromCart(action.payload.id);
        break;
      case 'UPDATE_QUANTITY':
        updateCartItem(action.payload.id, action.payload.quantity);
        break;
      case 'CLEAR_CART':
        removeFromCart();
        break;
      default:
        dispatch(action);
    }
  };

  return (
    <CartContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </CartContext.Provider>
  );
};
