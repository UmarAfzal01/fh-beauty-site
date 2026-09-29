import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-[#FAF7F3] flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full text-center bg-white/60 backdrop-blur-md p-12 rounded-3xl border border-[#EBE4DE] shadow-sm">
          
          {/* Subtle Accent Subtitle */}
          <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#8D4D5D] font-semibold block mb-3">
            Page Not Found
          </span>

          {/* Large Stylized 404 Header */}
          <h1 className="text-6xl lg:text-7xl font-serif text-[#2C2623] mb-6 font-normal">
            404
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#514C48]/80 font-sans leading-relaxed mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto bg-[#2C2623] hover:bg-[#8D4D5D] text-white px-8 py-3.5 rounded-xl text-xs uppercase font-sans tracking-widest transition-colors shadow-sm"
            >
              Back to Home
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto bg-white hover:bg-[#FAF7F3] text-[#2C2623] border border-[#EBE4DE] px-8 py-3.5 rounded-xl text-xs uppercase font-sans tracking-widest transition-colors shadow-sm"
            >
              Explore Services
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}