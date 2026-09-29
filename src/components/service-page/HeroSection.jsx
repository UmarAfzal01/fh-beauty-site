import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[60vh] bg-stone-50">
      <div className="relative w-full h-[350px] md:h-auto">
        <Image
          src="/images/service-hero.jpg"
          alt="Botulinum Therapy Treatment"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col justify-center px-8 py-12 md:px-16 bg-gradient-to-br from-stone-50 to-rose-50/30">
        <span className="text-xs uppercase tracking-widest text-stone-500 mb-2">
          Treatments
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-stone-800 mb-6">
          Botulinum Therapy
        </h1>
        <p className="text-stone-600 leading-relaxed max-w-md">
          Smooth away dynamic wrinkles and rejuvenate your appearance with our expert, precision-tailored botulinum toxin treatments designed to preserve your natural expressions.
        </p>
      </div>
    </section>
  );
}