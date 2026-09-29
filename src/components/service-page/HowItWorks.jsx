import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Initial Consultation", desc: "Evaluating your facial structure and aesthetic goals." },
    { num: "02", title: "Precision Application", desc: "Targeted micro-injections into specific muscle groups." },
    { num: "03", title: "Immediate Recovery", desc: "No downtime needed; resume normal activities right away." },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 bg-[#6b3846] text-white">
      <div className="p-12 md:p-20 flex flex-col justify-center">
        <h2 className="text-3xl font-serif font-light mb-10">How It Works</h2>
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div key={idx} className="border-b border-white/20 pb-6">
              <span className="text-rose-200 text-sm font-mono mb-1 block">{step.num}</span>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-rose-100/80 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative min-h-[400px] md:min-h-full">
        <Image
          src="/images/how-it-works.jpg"
          alt="Consultation Process"
          fill
          className="object-cover opacity-90"
        />
      </div>
    </section>
  );
}