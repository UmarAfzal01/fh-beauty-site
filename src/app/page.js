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

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#FAF7F3]">
      <Hero />
      <AboutSection />
      <TransformSection />
      <FeaturedTreatment />
      <TopTreatments />
      <PopularTreatmentsSlider />
      <ExperienceMissionSection />
      <TeamSection />
      <PracticeQuoteStatsSection />
      <BlogSection />
      <InstagramFeedSection />
      {/* <Footer/> */}
    </main>
  );
}