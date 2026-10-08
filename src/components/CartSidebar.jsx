"use client";
import { useCart } from "@/context/CartContext";
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";

export default function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, subtotal, totalItems } = useCart();

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 w-[92vw] max-w-md bg-[#FAF7F3] rounded-3xl shadow-2xl border border-[#EBE4DE] flex flex-col max-h-[85vh] overflow-hidden transition-all duration-300 transform origin-bottom-right ${
        isCartOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
      }`}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE4DE] bg-white shrink-0">
        <div className="flex items-center gap-2">
          <FiShoppingBag className="text-[#2C2623]" size={18} />
          <h2 className="text-base font-serif font-medium text-[#2C2623]">Your Cart</h2>
        </div>
        <button 
          onClick={() => setIsCartOpen(false)}
          className="p-1.5 text-[#514C48] hover:text-[#111] transition rounded-full hover:bg-[#FAF7F3]"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {cart && cart.length > 0 ? (
          cart.map((item, idx) => {
            const itemImage = 
              item.image || 
              (Array.isArray(item.images) && (typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url)) || 
              item.hero?.image || 
              "";

            return (
              <div 
                key={item.cartItemId || idx} 
                className="flex gap-3 p-3 bg-white rounded-2xl border border-[#E6DEC9]/60 shadow-2xs items-center transition hover:border-[#111]/30"
              >
                {/* Item Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#E6DEC9]/25 shrink-0 border border-[#E6DEC9]/40 relative">
                  {itemImage ? (
                    <img src={itemImage} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[9px] text-[#514C48]/40 text-center p-1">No img</div>
                  )}
                </div>

                {/* Details & Controls */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-medium text-xs text-[#2C2623] truncate">{item.name}</h3>
                  {item.selectedOption && item.selectedOption !== "Standard" && (
                    <p className="text-[11px] text-[#514C48]/60 truncate">Variant: {item.selectedOption}</p>
                  )}
                  <p className="text-xs font-serif font-semibold text-[#111] mt-0.5">
                    Rs. {Number(item.price)?.toLocaleString()}
                  </p>

                  {/* Quantity & Remove Button */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="inline-flex items-center border border-[#E6DEC9] rounded-lg px-1.5 py-0.5 bg-[#FAF7F3]">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, (item.quantity || 1) - 1)}
                        className="text-[#514C48] hover:text-[#111] p-1 transition"
                      >
                        <FiMinus size={10} />
                      </button>
                      <span className="w-5 text-center text-xs font-semibold text-[#111]">{item.quantity || 1}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, (item.quantity || 1) + 1)}
                        className="text-[#514C48] hover:text-[#111] p-1 transition"
                      >
                        <FiPlus size={10} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-red-400 hover:text-red-600 p-1 transition rounded-md hover:bg-red-50"
                      title="Remove item"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-[#514C48]/60">
            <div className="w-12 h-12 rounded-full bg-[#E6DEC9]/30 flex items-center justify-center mb-3 text-[#514C48]/50">
              <FiShoppingBag size={22} />
            </div>
            <p className="text-sm font-serif text-[#2C2623]">Your cart is empty</p>
            <p className="text-[11px] mt-0.5 text-[#514C48]/70">Explore our catalog and add items!</p>
          </div>
        )}
      </div>
      {/* Footer / Checkout Section */}
      {cart && cart.length > 0 && (
        <div className="p-4 border-t border-[#EBE4DE] bg-white space-y-3 shrink-0 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#514C48]/80 font-sans">Subtotal</span>
            <span className="font-serif font-bold text-base text-[#2C2623]">Rs. {subtotal.toLocaleString()}</span>
          </div>
          <Link
            href="/checkout"
            onClick={() => setIsCartOpen(false)}
            className="w-full flex items-center justify-center py-3 bg-[#111] text-white rounded-xl text-[11px] uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}