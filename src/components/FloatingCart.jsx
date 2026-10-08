"use client";
import { useCart } from "@/context/CartContext";
import { FiShoppingBag } from "react-icons/fi";

export default function FloatingCart() {
  const { cart, isCartOpen, setIsCartOpen } = useCart();
  const totalItems = cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-[#111] text-white rounded-full shadow-2xl hover:bg-[#8D4D5D] transition-all duration-300 group ${
        isCartOpen 
          ? "opacity-0 pointer-events-none scale-75" 
          : "opacity-100 pointer-events-auto hover:scale-105"
      }`}
      aria-label="Open Cart Sidebar"
    >
      <FiShoppingBag size={22} className="transition-transform group-hover:-rotate-6" />
      
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#8D4D5D] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          {totalItems}
        </span>
      )}
    </button>
  );
}