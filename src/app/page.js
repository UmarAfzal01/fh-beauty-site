import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import TransformSection from '@/components/TransformSection';
import FeaturedTreatment from '@/components/FeaturedTreatment';
import TopTreatments from '@/components/TopTreatments';
import PopularTreatmentsSlider from '@/components/PopularTreatmentsSlider';
import ExperienceMissionSection from '@/components/ExperienceMissionSection';
import TeamSection from '@/components/TeamSection';
import PracticeQuoteStatsSection from '@/components/PracticeQuoteStatsSection';
import BlogSection from '@/components/BlogSection';
import InstagramFeedSection from '@/components/InstagramFeedSection';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    default: 'Dr Warda Sikander | Gold Medalist & Pioneer in Lifestyle Medicine',
    template: '%s | Dr Warda Sikander',
  },
  description: 'Transform your health and aesthetics with science-backed, non-surgical solutions led by Dr. Warda Sikandar. Experience personalized care designed for lasting wellness, radiant skin, and effortless confidence',
  keywords: ['Aesthetic Medicine', 'Dermatology', 'Dr Warda Sikander', 'Skin Care', 'Pakistan'],
  authors: [{ name: 'Dr Warda Sikander' }],
  creator: 'Dr Warda Sikander',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://drwardasikander.com', // Replace with your actual live Vercel domain or custom domain
    title: 'Dr Warda Sikander | Gold Medalist & Pioneer in Lifestyle Medicine',
    description: 'Transform your health and aesthetics with science-backed, non-surgical solutions led by Dr. Warda Sikandar. Experience personalized care designed for lasting wellness, radiant skin, and effortless confidence',
    siteName: 'Dr Warda Sikander',
    images: [
      {
        url: '/images/og-image.webp', // Place your preview image inside the public/images folder
        width: 1200,
        height: 630,
        alt: 'Dr Warda Sikander | Gold Medalist & Pioneer in Lifestyle Medicine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr Warda Sikander | Gold Medalist & Pioneer in Lifestyle Medicine',
    description: 'Transform your health and aesthetics with science-backed, non-surgical solutions led by Dr. Warda Sikandar. Experience personalized care designed for lasting wellness, radiant skin, and effortless confidence',
    images: ['/images/og-image.webp'],
  },
  icons: {
    icon: '/images/favicon.ico', // Matches your logo/favicon file reference
    shortcut: '/images/favicon.ico',
    apple: '/images/favicon.ico',
  },
};

export default function Home() {
  return (
    <main className="w-full bg-[#FAF7F3]">
      <Hero />
      <AboutSection />
      {/* <TransformSection /> */}
      {/* <FeaturedTreatment /> */}
      {/* <TopTreatments /> */}
      {/* <PopularTreatmentsSlider /> */}
      {/* <ExperienceMissionSection /> */}
      {/* <TeamSection /> */}
      {/* <PracticeQuoteStatsSection /> */}
      {/* <BlogSection /> */}
      {/* <InstagramFeedSection /> */}
      {/* <Footer/> */}
    </main>
  );
}