"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Lahore",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty.");

    setLoading(true);
    try {
      const orderPayload = {
        customer: formData,
        items: cart,
        totalAmount: subtotal,
        status: "Pending",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        setSuccess(true);
        clearCart();
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
      <Header/>
      <main className="min-h-screen bg-[#FAF7F3] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl border border-[#E6DEC9] text-center max-w-md w-full space-y-4 shadow-sm">
          <FiCheckCircle size={48} className="mx-auto text-emerald-600" />
          <h1 className="font-serif text-2xl text-[#111]">Order Placed Successfully!</h1>
          <p className="text-sm text-[#514C48]/70">
            Thank you for your order. We have received your request and will contact you shortly.
          </p>
          <Link
            href="/"
            className="inline-block w-full py-3.5 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition"
          >
            Return to Catalog
          </Link>
        </div>
      </main>
      <Footer/>
      </>
    );
  }

  return (
    <>
    <Header/>
    <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] p-6 sm:p-10 lg:p-16 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#514C48]/60 hover:text-[#111] transition"
        >
          <FiArrowLeft size={14} /> Back to Catalog
        </Link>

        <h1 className="text-3xl lg:text-4xl font-serif text-[#111]">Checkout</h1>

        {cart.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E6DEC9] text-center space-y-4 shadow-2xs">
            <p className="font-serif text-lg text-[#111]">Your cart is empty.</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Customer Details Form */}
            <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E6DEC9] space-y-6 shadow-2xs">
              <h2 className="font-serif text-xl text-[#111] pb-4 border-b border-[#E6DEC9]">Customer & Shipping Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm focus:outline-none focus:border-[#111]"
                    placeholder="Muhammad Umar"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm focus:outline-none focus:border-[#111]"
                      placeholder="umar@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm focus:outline-none focus:border-[#111]"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-1">Delivery Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm focus:outline-none focus:border-[#111]"
                    placeholder="House 123, Street 4, Area"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm focus:outline-none focus:border-[#111]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-1">Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm focus:outline-none focus:border-[#111]"
                    placeholder="Special instructions for delivery..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
              >
                {loading ? "Placing Order..." : "Place Order (Cash on Delivery)"}
              </button>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#E6DEC9] space-y-6 shadow-2xs h-fit">
              <h2 className="font-serif text-xl text-[#111] pb-4 border-b border-[#E6DEC9]">Order Summary</h2>
              
              <div className="divide-y divide-[#E6DEC9]/60 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-[#E6DEC9]" />
                      )}
                      <div>
                        <h4 className="font-serif font-medium text-sm text-[#111]">{item.name}</h4>
                        <p className="text-xs text-[#514C48]/70">Option: {item.selectedOption} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-semibold text-sm text-[#111]">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-red-600 hover:text-red-800 text-xs mt-1 inline-flex items-center gap-1"
                      >
                        <FiTrash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E6DEC9] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#514C48]/70">Subtotal</span>
                  <span className="font-serif font-semibold text-[#111]">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#514C48]/70">Shipping</span>
                  <span className="font-serif font-semibold text-[#111]">Free</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-[#E6DEC9]">
                  <span className="font-serif font-medium text-[#111]">Total</span>
                  <span className="font-serif font-semibold text-[#111]">PKR {subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
 <Footer/>
    </>
  );
}