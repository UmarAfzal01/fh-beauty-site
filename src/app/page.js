import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import TransformSection from "@/components/TransformSection";
import FeaturedTreatment from "@/components/FeaturedTreatment";
import TopTreatments from "@/components/TopTreatments";
import PopularTreatmentsSlider from "@/components/PopularTreatmentsSlider";
import ProductsSlider from "@/components/ProductsSlider";
import ExperienceMissionSection from "@/components/ExperienceMissionSection";
import TeamSection from "@/components/TeamSection";
import PracticeQuoteStatsSection from "@/components/PracticeQuoteStatsSection";
import BlogSection from "@/components/BlogSection";
import InstagramFeedSection from "@/components/InstagramFeedSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: 'Dr. Warda Sikandar | Obesity Expert | Aesthetician | Wellness Expert',
    template: '%s | Dr Warda Sikandar',
  },
  description: 'Transform your health and aesthetics with science-backed, non-surgical solutions led by Dr. Warda Sikandar. Experience personalized care designed for lasting wellness, radiant skin, and effortless confidence',
  keywords: ['Aesthetic Medicine', 'Dermatology', 'Dr Warda Sikandar', 'Skin Care', 'Pakistan', 'Obesity Expert'],
  authors: [{ name: 'Dr Warda Sikandar' }],
  creator: 'Dr Warda Sikandar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://drwardaSikandar.com',
    title: 'Dr. Warda Sikandar | Obesity Expert | Aesthetician | Wellness Expert',
    description: 'Transform your health and aesthetics with science-backed, non-surgical solutions led by Dr. Warda Sikandar. Experience personalized care designed for lasting wellness, radiant skin, and effortless confidence',
    siteName: 'Dr Warda Sikandar',
    images: [
      {
        url: '/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Dr. Warda Sikandar | Obesity Expert | Aesthetician | Wellness Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Warda Sikandar | Obesity Expert | Aesthetician | Wellness Expert',
    description: 'Transform your health and aesthetics with science-backed, non-surgical solutions led by Dr. Warda Sikandar. Experience personalized care designed for lasting wellness, radiant skin, and effortless confidence',
    images: ['/images/og-image.webp'],
  },
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon.ico',
    apple: '/images/favicon.ico',
  },
};

export default function Home() {
  // 1. JSON-LD Schema for Organization / Clinic
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Pakistan Wellness Center",
    "alternateName": "Dr. Warda Sikandar Clinic",
    "url": "https://drwardasikandar.com",
    "logo": "https://drwardasikandar.com/images/og-image.webp",
    "description": "Leading aesthetic medicine, obesity management, and holistic skin wellness center led by Dr. Warda Sikandar.",
    "medicalSpecialty": [
      "Dermatology",
      "Aesthetic Medicine",
      "Bariatric Medicine"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lahore",
      "addressCountry": "PK"
    }
  };

  // 2. JSON-LD Schema for Person (Dr. Warda Sikandar)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dr. Warda Sikandar",
    "jobTitle": "Aesthetician & Obesity Expert",
    "worksFor": {
      "@type": "MedicalClinic",
      "name": "Pakistan Wellness Center"
    },
    "url": "https://drwardasikandar.com",
    "description": "Obesity Expert, Aesthetician, and Wellness Specialist offering science-backed non-surgical solutions."
  };

  return (
    <main className="w-full bg-[#FAF7F3]">
      {/* Structural JSON-LD Schemas for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <Header />
      <Hero />
      <AboutSection />
      <TransformSection />
      <FeaturedTreatment />
      <ProductsSlider />
      <TopTreatments />
      <PopularTreatmentsSlider />
      <ExperienceMissionSection />
      <TeamSection />
      <PracticeQuoteStatsSection />
      <BlogSection />
      <InstagramFeedSection />
      <Footer />
    </main>
  );
}