"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Lazy initialization: Load from localStorage immediately on first render
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedOption = "Standard", price = product.price) => {
    setCart((prevCart) => {
      const productId = product._id || product.id || product.slug;
      const cartItemId = `${productId}-${selectedOption}`;

      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        return prevCart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            productId,
            name: product.name,
            price: Number(price),
            image: product.image || product.images?.[0]?.url || "",
            selectedOption,
            quantity: Number(quantity),
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: Number(quantity) } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}