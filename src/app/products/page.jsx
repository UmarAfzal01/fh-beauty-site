"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiBox, FiArrowRight, FiShoppingCart } from "react-icons/fi";
import { PiSparkle } from "react-icons/pi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function PublicProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          const allItems = Array.isArray(data) ? data : data.items || [];
          
          // Filter strictly for products
          const fetchedProducts = allItems.filter(
            (item) => item.type?.toLowerCase() === "product"
          );
          setProducts(fetchedProducts);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48] tracking-widest text-sm uppercase">
        Loading Luxury Products...
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-16 px-6 md:px-12 xl:px-24">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Luxury Hero Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#F3EDE2] border border-[#E6DEC9] px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] text-[#514C48]">
              <PiSparkle size={14} /> Luxury Collection
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-normal text-[#111] leading-tight">
              Our Exclusive Products
            </h1>
            <p className="text-sm md:text-base font-serif text-[#514C48]/75 leading-relaxed">
              Explore our premium line of skincare, wellness essentials, and professional home-care products formulated to nourish and enhance your beauty.
            </p>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-24 bg-white border border-[#E6DEC9] rounded-3xl space-y-4 max-w-xl mx-auto shadow-2xs">
              <div className="w-16 h-16 bg-[#FAF7F3] rounded-2xl border border-[#E6DEC9] flex items-center justify-center mx-auto text-[#514C48]/40">
                <FiBox size={28} />
              </div>
              <h3 className="text-xl font-serif text-[#111]">No Products Available</h3>
              <p className="font-serif text-sm text-[#514C48]/60">Check back soon for our latest product arrivals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {products.map((product) => {
                const productId = product._id || product.id;
                const productImage = product.images?.[0]?.url || product.image;
                const productName = product.name;
                const productDesc = product.description;
                const productPrice = product.price || 0;
                const cutPrice = product.cutPrice;

                return (
                  <div
                    key={productId}
                    className="bg-white border border-[#E6DEC9] rounded-3xl p-5 flex flex-col justify-between space-y-5 shadow-2xs transition-all duration-300 hover:shadow-xl hover:border-[#514C48]/30 group"
                  >
                    <div className="space-y-4">
                      
                      {/* Image Showcase */}
                      <div className="relative w-full h-60 rounded-2xl overflow-hidden border border-[#E6DEC9] bg-[#FAF7F3]">
                        {productImage ? (
                          <img 
                            src={productImage} 
                            alt={productName} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#514C48]/40">
                            <FiBox size={36} />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-[#E6DEC9] px-3 py-1 rounded-full text-xs font-sans font-medium text-[#111] shadow-xs flex items-center gap-1.5">
                          {cutPrice && (
                            <span className="line-through text-gray-400 text-[11px]">
                              PKR {Number(cutPrice).toLocaleString()}
                            </span>
                          )}
                          <span className="font-semibold">
                            PKR {Number(productPrice).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h2 className="text-xl font-serif font-normal text-[#111] group-hover:text-black transition leading-snug truncate" title={productName}>
                          {productName}
                        </h2>
                        {productDesc && (
                          <p className="text-xs md:text-sm font-serif text-[#514C48]/75 line-clamp-2 leading-relaxed">
                            {productDesc}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Action Buttons Footer */}
                    <div className="pt-3 border-t border-[#E6DEC9]/60 flex items-center gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex-1 bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#111] py-3 rounded-xl text-xs font-sans uppercase tracking-widest flex items-center justify-center gap-1.5 transition font-semibold"
                      >
                        View Details <FiArrowRight size={14} />
                      </Link>
                      <button
                        onClick={() => addToCart(product, 1, product.options?.[0]?.name || "Standard", product.price)}
                        className="bg-[#111] hover:bg-[#333] text-white p-3.5 rounded-xl transition shadow-sm flex items-center justify-center cursor-pointer"
                        title="Add to Cart"
                      >
                        <FiShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}