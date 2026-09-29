import Image from "next/image";

export default function CandidatesSection() {
  const criteria = [
    "Individuals looking to smooth dynamic forehead lines and crow's feet.",
    "Those seeking preventative anti-aging care with minimal intervention.",
    "Patients in overall good health with realistic aesthetic expectations.",
    "Clients wanting a refreshed look without surgical downtime."
  ];

  return (
    <section className="py-20 px-6 md:px-24 bg-stone-50 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="relative h-[450px] w-full rounded-lg overflow-hidden shadow-sm">
        <Image
          src="/images/candidate.jpg"
          alt="Candidate Evaluation"
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h2 className="text-3xl font-serif font-light text-stone-800 mb-6">
          Candidates for Botulinum Therapy
        </h2>
        <p className="text-stone-600 mb-8 leading-relaxed">
          While safe and effective for most adults, an ideal candidate is looking to address specific expression lines and maintain a youthful skin texture.
        </p>
        <ul className="space-y-4">
          {criteria.map((item, idx) => (
            <li key={idx} className="flex items-start text-stone-700">
              <span className="h-2 w-2 rounded-full bg-rose-400 mt-2 mr-3 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}