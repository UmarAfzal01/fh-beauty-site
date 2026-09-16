"use client"
import React, { useEffect, useState } from "react";
import AboutView from "@/components/AboutView";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        if (data.success) {
          setAbout(data.about);
        }
      } catch (err) {
        console.error("Failed to fetch about data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        Loading...
      </div>
    );
  }

  return(

    <>
  <Header/>
  <AboutView about={about} />
  <Footer/>
  </>
  )
}