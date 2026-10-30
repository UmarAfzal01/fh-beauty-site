"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load once after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
    }
    setHydrated(true);
  }, []);

  // Persist only after the initial load, otherwise the first run
  // overwrites the saved cart with []
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart, hydrated]);

  const addToCart = (product, quantity = 1, selectedOption = "Standard", price = product.price) => {
    setCart((prevCart) => {
      const productId = product._id || product.id || product.slug;
      const cartItemId = `${productId}-${selectedOption}`;
      const existing = prevCart.find((item) => item.cartItemId === cartItemId);

      if (existing) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        );
      }
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
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) =>
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(cartItemId);
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );
  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + (item.quantity || 1), 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart, hydrated, addToCart, removeFromCart, updateQuantity, clearCart,
        subtotal, totalItems, isCartOpen, setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
} 