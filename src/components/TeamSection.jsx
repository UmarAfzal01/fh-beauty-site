import Image from 'next/image';

export default function TeamSection() {
  const teamMembers = [
    {
      name: 'Miranda Kellers',
      role: 'Cosmetologist',
      image: '/images/instagram-4.webp',
    },
    {
      name: 'Anna Middleton',
      role: 'Plastic Surgery',
      image: '/images/home-1-4.webp',
    },
    {
      name: 'Amanda Johnson',
      role: 'Body Aesthetic',
      image: '/images/home-1-1.webp',
    },
  ];

  return (
    <section className="w-full bg-[#FAF7F3] text-[#514C48] py-24 px-6 md:px-12 xl:px-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Subheading & Title */}
        <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#8D4D5D] mb-3">
          MEET OUR TEAM
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal text-[#111] text-center mb-16">
          Friendly Faces, Personalized Care
        </h2>

        {/* Team Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-[#F5EFEA] rounded-[30px] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Card Top: Name & Role */}
              <div>
                <h3 className="text-2xl font-serif text-[#111] mb-1">
                  {member.name}
                </h3>
                <p className="text-xs font-sans tracking-wide text-[#514C48]/70 uppercase">
                  {member.role}
                </p>
              </div>

              {/* Card Middle: Circular Image */}
              <div className="my-8 flex justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-inner bg-[#EBE4DE]">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* Card Bottom: Open Profile Link & Social Icons */}
              <div className="pt-4 border-t border-[#E5DDD5] flex items-center justify-between">
                <a 
                  href="#profile" 
                  className="text-xs font-sans uppercase tracking-[0.15em] text-[#111] font-medium hover:text-[#8D4D5D] transition-colors flex items-center gap-1"
                >
                  OPEN PROFILE <span>↗</span>
                </a>

                <div className="flex items-center gap-2">
                  {/* Twitter / X Icon Button */}
                  <a 
                    href="#twitter" 
                    aria-label="Twitter profile"
                    className="w-8 h-8 rounded-full bg-[#EBE4DE] hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center text-xs text-[#514C48] transition-colors"
                  >
                    ✕
                  </a>
                  {/* LinkedIn Icon Button */}
                  <a 
                    href="#linkedin" 
                    aria-label="LinkedIn profile"
                    className="w-8 h-8 rounded-full bg-[#EBE4DE] hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center text-xs text-[#514C48] transition-colors font-serif italic"
                  >
                    in
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* View All Doctors Button */}
        <button className="bg-[#8D4D5D] hover:bg-[#654945] text-white text-xs font-sans tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg">
          VIEW ALL DOCTORS
        </button>

      </div>
    </section>
  );
}