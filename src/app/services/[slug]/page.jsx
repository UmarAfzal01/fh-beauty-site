import Image from 'next/image';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import Service from '@/models/Service';
import FAQAccordion from '@/components/service-page/FAQAccordion';
import HowItWorksAccordion from '@/components/service-page/HowItWorksAccordion';
import ReviewSection from '@/components/service-page/ReviewSection'; // Client component handling Google auth & review submission
import Header from '@/components/Header';
import Footer from '@/components/Footer';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

async function getService(slug) {
  try {
    await connectDB();
    const service = await Service.findOne({ slug }).lean();
    if (!service) return null;
    return JSON.parse(JSON.stringify(service));
  } catch (err) {
    console.error('Failed to fetch service:', err);
    return null;
  }
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] overflow-hidden font-serif">
        
        {/* 1. Hero Section (60% Image / 40% Content Split) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
          <div className="relative w-full h-[600px] lg:h-auto min-h-[700px] lg:col-span-7">
            <Image
              src={service.hero?.image || "https://res.cloudinary.com/dgtk4rthy/image/upload/v1756465642/Blog-Size_bzpiux.jpg"}
              alt={service.hero?.name || "Service Hero"}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:col-span-5 bg-[#FAF7F3]">
            <span className="text-xs uppercase tracking-widest text-[#8D4D5D] font-sans font-semibold mb-3">
              Treatment & Care
            </span>
            <h1 className="text-4xl lg:text-5xl font-normal text-[#2C2623] mb-6">
              {service.hero?.name}
            </h1>
            <p className="text-[#514C48]/80 leading-relaxed text-base font-sans">
              {service.hero?.shortDesc}
            </p>
          </div>
        </section>

        {/* 2. About Service Section */}
        <section className="py-24 px-6 lg:px-32 bg-white text-center border-t border-[#EBE4DE]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-normal text-[#2C2623] mb-8">
              About {service.hero?.name}
            </h2>
            <p className="text-[#514C48]/80 leading-relaxed text-base lg:text-lg whitespace-pre-line font-sans">
              {service.about?.desc}
            </p>
          </div>
        </section>

        {/* 3. How It Works (Accordion) */}
        <section className="min-h-[800px] grid grid-cols-1 lg:grid-cols-2 bg-[#6b3846] text-white">
          <div className="p-12 lg:p-24 flex flex-col justify-center">
            <h2 className="text-4xl lg:text-5xl font-normal mb-10 font-serif">How It Works</h2>
            <HowItWorksAccordion steps={service.howItWorks?.steps} />
          </div>
          <div className="relative min-h-[400px] lg:min-h-full">
            <Image
              src={service.howItWorks?.image || "https://res.cloudinary.com/dgtk4rthy/image/upload/v1756465642/Blog-Size_bzpiux.jpg"}
              alt="How it works"
              fill
              className="object-cover opacity-90"
            />
          </div>
        </section>

        {/* 4. Candidate Requirements */}
        <section className="py-24 px-6 lg:px-32 bg-[#FAF7F3] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-[#EBE4DE]">
          <div className="relative h-[800px] w-full rounded-2xl overflow-hidden shadow-sm border border-[#EBE4DE]">
            <Image
              src={service.candidateRequirements?.image || "https://res.cloudinary.com/dgtk4rthy/image/upload/v1756465642/Blog-Size_bzpiux.jpg"}
              alt="Candidates"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-normal text-[#2C2623] mb-6">
              Candidates for {service.hero?.name}
            </h2>
            <p className="text-[#514C48]/80 mb-8 leading-relaxed font-sans">
              {service.candidateRequirements?.smallDesc}
            </p>
            <ul className="space-y-4 font-sans">
              {service.candidateRequirements?.requirements?.map((req, idx) => (
                <li key={idx} className="flex items-start text-[#514C48]">
                  <span className="h-2 w-2 rounded-full bg-[#8D4D5D] mt-2 mr-3 shrink-0" />
                  <span className="text-sm font-serif">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Success Stories, Reviews Display & Submission Form */}
        <ReviewSection serviceSlug={service.slug} initialReviews={service.reviews || []} />

        {/* 6. Quick Questions (FAQs) */}
        <section className="py-24 px-6 lg:px-32 bg-[#FAF7F3] max-w-5xl mx-auto">
          <h2 className="text-3xl font-normal text-[#2C2623] text-center mb-12">
            Quick answers to questions you may have
          </h2>
          
          <FAQAccordion faqs={service.faqs} />

          <div className="text-center mt-12">
            <a
              href="/contact"
              className="inline-block bg-[#2C2623] text-white px-8 py-4 rounded-2xl text-xs uppercase font-sans tracking-widest hover:bg-[#8D4D5D] transition-colors shadow-sm"
            >
              Book a Treatment
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}