import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage or use empty array as fallback
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const initialState = {
  cartItems: loadCartFromStorage(),
};

// Save cart to localStorage
const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const validateNumber = (value, fallback = 0) => {
  const num = Number(value);
  return !isNaN(num) ? num : fallback;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, price, quantity = 1, ...rest } = action.payload;
      const validatedPrice = validateNumber(price);
      const validatedQty = validateNumber(quantity, 1);

      const existingItem = state.cartItems.find(
        (item) => item.id === id && !item.isBundle
      );

      if (existingItem) {
        existingItem.quantity += validatedQty;
      } else {
        state.cartItems.push({
          id,
          ...rest,
          price: validatedPrice,
          isBundle: false,
          quantity: validatedQty
        });
      }
      
      // Save to localStorage after state change
      saveCartToStorage(state.cartItems);
    },
    
    addBundleToCart: (state, action) => {
      const { 
        products = [], 
        items = [], 
        bundleQuantity = 1, 
        bundleName,
        ...rest 
      } = action.payload;
      
      const bundleProducts = products.length ? products : items;
      if (!bundleProducts || !bundleProducts.length) {
        console.error("No products/items found in bundle");
        return;
      }

      const validatedQty = validateNumber(bundleQuantity, 1);
      const bundleId = bundleProducts.map(p => p._id || p.id).join('-');
      
      const existingBundle = state.cartItems.find(
        item => item.isBundle && item.id === bundleId
      );
      
      if (existingBundle) {
        existingBundle.quantity += validatedQty;
      } else {
        const validatedProducts = bundleProducts.map(p => ({
          ...p,
          id: p._id || p.id,
          price: validateNumber(p.price),
          quantity: validateNumber(p.quantity, 1)
        }));
        
        const bundlePrice = validatedProducts.reduce(
          (sum, p) => sum + (p.price * p.quantity), 
          0
        );

        state.cartItems.push({
          id: bundleId,
          name: bundleName || `Bundle (${bundleProducts.length} items)`,
          products: validatedProducts,
          price: bundlePrice,
          isBundle: true,
          quantity: validatedQty,
          ...rest
        });
      }
      
      // Save to localStorage after state change
      saveCartToStorage(state.cartItems);
    },
    
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      
      // Save to localStorage after state change
      saveCartToStorage(state.cartItems);
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      
      // Save to localStorage after state change
      saveCartToStorage(state.cartItems);
    },
    
    incrementQty: (state, action) => {
      const item = state.cartItems.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        
        // Save to localStorage after state change
        saveCartToStorage(state.cartItems);
      }
    },
    
    decrementQty: (state, action) => {
      const item = state.cartItems.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        
        // Save to localStorage after state change
        saveCartToStorage(state.cartItems);
      }
    },
    
    removeProductFromBundle: (state, action) => {
      const { bundleId, productId } = action.payload;
      const bundle = state.cartItems.find(item => item.id === bundleId && item.isBundle);
      
      if (bundle) {
        bundle.products = bundle.products.filter(p => p.id !== productId);
        bundle.price = bundle.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        bundle.name = `Bundle (${bundle.products.length} items)`;
        
        if (bundle.products.length === 0) {
          state.cartItems = state.cartItems.filter(item => item.id !== bundleId);
        }
        
        // Save to localStorage after state change
        saveCartToStorage(state.cartItems);
      }
    },
    
    addProductToBundle: (state, action) => {
      const { bundleId, product } = action.payload;
      const bundle = state.cartItems.find(item => item.id === bundleId && item.isBundle);
      
      if (bundle) {
        const existingProduct = bundle.products.find(p => p.id === product.id);
        
        if (!existingProduct) {
          const validatedProduct = {
            ...product,
            id: product._id || product.id,
            price: validateNumber(product.price),
            quantity: validateNumber(product.quantity, 1)
          };
          bundle.products.push(validatedProduct);
          bundle.price += (validatedProduct.price * validatedProduct.quantity);
          bundle.name = `Bundle (${bundle.products.length} items)`;
          
          // Save to localStorage after state change
          saveCartToStorage(state.cartItems);
        }
      }
    }
  },
});

export const {
  addToCart,
  addBundleToCart,
  removeFromCart,
  clearCart,
  incrementQty,
  decrementQty,
  removeProductFromBundle,
  addProductToBundle
} = cartSlice.actions;

export default cartSlice.reducer;