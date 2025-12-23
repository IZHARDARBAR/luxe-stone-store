import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Safe LocalStorage Loading
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Cart Load Error", error);
      return [];
    }
  });

  // 2. Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- ACTIONS ---

  // ADD TO CART (Improved)
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check ID (String/Number issue fix)
      const existingItem = prevItems.find((item) => String(item.id) === String(product.id));

      if (existingItem) {
        toast.success(`Quantity updated!`);
        return prevItems.map((item) =>
          String(item.id) === String(product.id) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      toast.success(`${product.name} added!`);
      // Naya item add karte waqt ensure karein ke image sahi ho
      return [...prevItems, { 
        ...product, 
        quantity: 1,
        // Agar images array hai toh pehli image lo, warna purani image field lo
        image: product.images && product.images.length > 0 ? product.images[0] : product.image 
      }];
    });
  };

  // REMOVE ITEM (Improved)
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => String(item.id) !== String(id)));
    toast.error("Item removed");
  };

  // UPDATE QUANTITY
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) => (String(item.id) === String(id) ? { ...item, quantity: newQty } : item))
    );
  };

  // CLEAR CART
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart'); // Storage se bhi uda do
  };

  // CALCULATIONS
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);