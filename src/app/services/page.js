import Image from 'next/image';
import Link from 'next/link';
import mongoose from 'mongoose';
import Service from '@/models/Service';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

async function getServices() {
  try {
    await connectDB();
    const services = await Service.find({}).lean();
    return JSON.parse(JSON.stringify(services));
  } catch (err) {
    console.error('Failed to fetch services:', err);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] font-serif">
        
        {/* 1. Luxury Hero Banner */}
        <section className="relative w-full h-[350px] lg:h-[420px] flex items-center justify-center bg-[#2C2623] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="https://res.cloudinary.com/wapixih0/image/upload/v1790677776/services-1.webp"
              alt="Services Hero Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 text-center px-6 max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-normal mb-4">Services</h1>
            <p className="text-stone-200 text-sm lg:text-base font-sans tracking-wide">
              Explore our comprehensive range of aesthetic treatments, expert surgeries, and personalized patient care.
            </p>
          </div>
        </section>

        {/* 2. Services Grid Section */}
        <section className="py-24 px-6 lg:px-24 max-w-7xl mx-auto">
          {services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <div 
                  key={service._id || idx} 
                  className="relative group h-[450px] rounded-3xl overflow-hidden shadow-sm border border-[#EBE4DE] flex flex-col justify-end p-8 transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Card Background Image */}
                  <Image
                    src={service.hero?.image || "https://res.cloudinary.com/dgtk4rthy/image/upload/v1756465642/Blog-Size_bzpiux.jpg"}
                    alt={service.hero?.name || "Service Item"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Dark Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Category / Subtitle Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase font-sans tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                      {service.category || "Treatment"}
                    </span>
                  </div>

                  {/* Content & Action Button */}
                  <div className="relative z-15 text-white flex flex-col items-start">
                    <h3 className="text-2xl font-normal mb-6">
                      {service.hero?.name}
                    </h3>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-block bg-white/10 hover:bg-white text-white hover:text-[#2C2623] border border-white/40 px-6 py-2.5 rounded-xl text-xs uppercase font-sans tracking-widest transition-all duration-300 shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}

              {/* Static Promo Card Matching Reference Design (Bottom Right Box) */}
              <div className="bg-[#F2E5E3] border border-[#EBE4DE] h-[450px] rounded-3xl p-10 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#8D4D5D] font-semibold block mb-2">
                    FREE CONSULTATION
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-normal text-[#2C2623] mb-4 leading-snug">
                    Get Complete Facial Plastic Surgery Save 15%
                  </h3>
                  <p className="text-xs text-[#514C48]/80 font-sans leading-relaxed">
                    Receive expert advice or schedule a consultation today to explore your personalized aesthetic goals.
                  </p>
                </div>
                <div>
                  <Link
                    href="/contact"
                    className="inline-block bg-[#2C2623] hover:bg-[#8D4D5D] text-white px-6 py-3 rounded-xl text-xs uppercase font-sans tracking-widest transition-colors shadow-sm"
                  >
                    Find Out More
                  </Link>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-base text-[#514C48]/70 font-sans">No services found at the moment.</p>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}