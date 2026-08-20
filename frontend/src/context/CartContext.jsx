import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart state from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // Sync cart items to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Add product to cart with specified quantity and stock limit validation
   */
  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    const existingIndex = cartItems.findIndex(
      (item) => item.product === product._id
    );

    if (existingIndex !== -1) {
      const currentQty = cartItems[existingIndex].quantity;
      const newQty = currentQty + quantity;

      if (newQty > product.stock) {
        return {
          success: false,
          message: `Cannot add more than available stock (${product.stock} units).`,
        };
      }

      const updated = [...cartItems];
      updated[existingIndex].quantity = newQty;
      setCartItems(updated);
      return { success: true, message: 'Cart quantity updated.' };
    } else {
      if (quantity > product.stock) {
        return {
          success: false,
          message: `Only ${product.stock} units available in stock.`,
        };
      }

      const newItem = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: product.stock,
        category: product.category,
        quantity,
      };

      setCartItems([...cartItems, newItem]);
      return { success: true, message: 'Item added to your cart!' };
    }
  };

  /**
   * Increase quantity of an existing item in cart
   */
  const increaseQuantity = (productId) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.product === productId) {
          if (item.quantity < item.stock) {
            return { ...item, quantity: item.quantity + 1 };
          }
        }
        return item;
      })
    );
  };

  /**
   * Decrease quantity of an existing item in cart
   */
  const decreaseQuantity = (productId) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.product === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      })
    );
  };

  /**
   * Remove item from cart completely
   */
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.product !== productId));
  };

  /**
   * Clear all items from cart (e.g. after successful checkout)
   */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  /**
   * Calculate subtotal / total price
   */
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  /**
   * Get total number of individual items in cart
   */
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
