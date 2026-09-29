import Image from "next/image";

export default function TeamSection() {
  const team = [
    { name: "Dr. Clara Vance", role: "Lead Aesthetic Physician", image: "/images/team-1.jpg" },
    { name: "Dr. Marcus Thorne", role: "Dermatology Specialist", image: "/images/team-2.jpg" },
    { name: "Elena Rostova", role: "Senior Injector Nurse", image: "/images/team-3.jpg" },
  ];

  return (
    <section className="py-20 px-6 md:px-24 bg-white text-center">
      <h2 className="text-3xl font-serif font-light text-stone-800 mb-4">Board-Certified Team</h2>
      <p className="text-stone-500 max-w-xl mx-auto mb-12">
        Entrust your skin to our internationally certified medical professionals with years of specialized clinical experience.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {team.map((member, idx) => (
          <div key={idx} className="bg-rose-50/40 p-4 rounded-xl">
            <div className="relative h-72 w-full mb-4 rounded-lg overflow-hidden">
              <Image src={member.image} alt={member.name} fill className="object-cover" />
            </div>
            <h3 className="font-medium text-lg text-stone-800">{member.name}</h3>
            <p className="text-stone-500 text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}