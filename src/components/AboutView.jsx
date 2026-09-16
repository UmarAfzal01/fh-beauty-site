import React from "react";

export default function AboutView({ about }) {
  if (!about) return null;

  return (
    <>
      <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] overflow-hidden">
      {/* 1. Hero Header Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
        {/* Left Pink Side Banner */}
        <div className="lg:col-span-4 bg-[#F5E1E3] px-12 lg:px-30 py-16 flex flex-col justify-center space-y-4">
          <span className="text-[15px] uppercase tracking-[0.3em] font-sans text-[#514C48]/60 font-medium">
            {about.subtitle || "ABOUT US"}
          </span>
          <h1 className="text-4xl lg:text-7xl font-serif font-normal text-[#1a1a1a] leading-[1.15]">
            {about.title}
          </h1>
          {about.description && (
            <p className="text-[20px] font-serif text-[#514C48]/75 leading-relaxed pt-2">
              {about.description}
            </p>
          )}
        </div>

        {/* Right Hero Image */}
        <div className="lg:col-span-8 bg-neutral-100 flex items-center justify-center overflow-hidden min-h-[350px]">
          {about.img ? (
            <img
              src={about.img}
              alt={about.imgalt || "About Us Banner"}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-sm font-serif text-neutral-400">No Image Provided</div>
          )}
        </div>
      </section>

      {/* 2. Dynamic Content Sections */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 space-y-5">
        {about.about_detail?.map((field, index) => {
          switch (field.type) {
            case "Sub":
              return (
                <div key={index} className="w-full">
                  <h2 className="text-3xl lg:text-4xl font-serif text-[#111]">
                    {field.value}
                  </h2>
                </div>
              );

            case "description":
              return (
                <div key={index} className="w-full">
                  <p className="text-base lg:text-lg font-serif text-[#514C48]/90 leading-relaxed">
                    {field.value}
                  </p>
                </div>
              );

            case "bullet":
              return (
                <div key={index} className="flex items-center gap-3 w-full">
                  <span className="w-2 h-2 rounded-full bg-[#111] shrink-0" />
                  <p className="text-base font-serif text-[#514C48]">
                    {field.value}
                  </p>
                </div>
              );

            case "side-image":
              const isImageLeft = field.alignment === "left";
              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center py-8 ${
                    !isImageLeft ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  <div className={`lg:col-span-7 flex justify-center bg-neutral-100 rounded-3xl overflow-hidden ${!isImageLeft ? "lg:col-start-6" : ""}`}>
                    {field.imageUrl && (
                      <img
                        src={field.imageUrl}
                        alt={field.imgAlt || field.heading}
                        className="w-full h-auto max-h-[100%] object-contain"
                      />
                    )}
                  </div>
                  <div className={`lg:col-span-5 space-y-4 w-full ${!isImageLeft ? "lg:col-start-1" : ""}`}>
                    <h3 className="text-3xl lg:text-6xl font-serif text-[#111] leading-tight">
                      {field.heading}
                    </h3>
                    <p className="text-base font-serif text-[#514C48]/80 leading-relaxed w-full">
                      {field.description}
                    </p>
                  </div>
                </div>
              );

            case "triplet-batch":
              const mainIdx = field.mainImageIndex ?? 2; 
              const subImageIndices = [0, 1, 2].filter((i) => i !== mainIdx);
              const mainImageUrl = field.imageUrls?.[mainIdx] || "";
              const mainImageAlt = field.altTags?.[mainIdx] || field.heading;

              return (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-2 items-end py-8">
                  {/* Left Column: Heading, Full-Width Paragraph, and Two Sub-Images Below */}
                  <div className="lg:col-span-6 space-y-6 w-full">
                    <div className="space-y-3 w-full">
                      <h3 className="text-3xl lg:text-6xl font-serif text-[#111] leading-tight">
                        {field.heading}
                      </h3>
                      <p className="text-base lg:text-lg font-serif text-[#514C48]/90 leading-relaxed w-full">
                        {field.description}
                      </p>
                    </div>

                    {/* Two Smaller Sub-Images Side-by-Side */}
                    <div className="grid grid-cols-2">
                      {subImageIndices.map((subIdx) => (
                        <div key={subIdx} className="rounded-2xl overflow-hidden flex items-center justify-center p-2">
                          <img
                            src={field.imageUrls?.[subIdx]}
                            alt={field.altTags?.[subIdx] || `Sub image ${subIdx + 1}`}
                            className="w-full h-auto max-h-[100%] object-contain rounded-xl"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Large Main Image */}
                  <div className="lg:col-span-6 rounded-3xl overflow-hidden flex items-center justify-center">
                    {mainImageUrl && (
                      <img
                        src={mainImageUrl}
                        alt={mainImageAlt}
                        className="w-full h-auto max-h-[100%] object-contain"
                      />
                    )}
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </main>
    </>
  );
}