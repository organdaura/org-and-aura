import React from "react";
import Image from "next/image";
import prisma from "@/lib/prisma";
import BotanicalFrame from "@/components/ui/BotanicalFrame";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const founders = await prisma.teamMember.findMany({
    where: { type: "FOUNDER", published: true },
    orderBy: { displayOrder: "asc" },
  });

  const mentors = await prisma.teamMember.findMany({
    where: { type: "MENTOR", published: true },
    orderBy: { displayOrder: "asc" },
  });

  const team = await prisma.teamMember.findMany({
    where: { type: "TEAM", published: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="w-full relative flex flex-col items-center">
      <BotanicalFrame position="top" className="w-full max-w-5xl" />

      <div className="w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-10 space-y-16">
        {/* Section 1: Our Founders (Top) */}
        <section className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-forest-800">
              Our Founders
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto">
              Visionary leadership pioneering sanitary bio-engineering and environmental responsibility.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {founders.map((founder) => (
              <div
                key={founder.id}
                className="card-organic p-3 sm:p-4 bg-white overflow-hidden text-center group transition-all duration-300 hover:shadow-organic-lg"
              >
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-cream-100 border border-cream-200">
                  <Image
                    src={founder.imageRef || "/assets/team/swetha-suresh.jpeg"}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 space-y-0.5">
                  <h2 className="text-sm sm:text-base font-bold text-forest-900">
                    {founder.name}
                  </h2>
                  <p className="text-xs text-forest-600 font-semibold tracking-wide">
                    {founder.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Mentors and Advisors (Next) */}
        {mentors.length > 0 && (
          <section className="space-y-6 text-center pt-2">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-forest-800">
                Mentors &amp; Advisors
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto">
                Guiding our technological innovation, scientific rigor, and strategic growth.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="card-organic p-3 bg-white overflow-hidden text-center group transition-all duration-300 hover:shadow-organic-lg"
                >
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-cream-100 border border-cream-200">
                    <Image
                      src={mentor.imageRef || "/assets/team/dr-deiva-sundari-p.jpeg"}
                      alt={mentor.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 space-y-0.5">
                    <h3 className="text-sm font-bold text-forest-900">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-forest-600 font-medium">
                      {mentor.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Our Team (Rest of the People) */}
        <section className="space-y-6 text-center pt-2">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-forest-800">
              Our Team
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto">
              Dedicated engineers and innovators driving hardware, software, and R&amp;D.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="card-organic p-2.5 sm:p-3 bg-white overflow-hidden text-center group transition-all duration-300 hover:shadow-organic-lg"
              >
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-cream-100 border border-cream-200">
                  <Image
                    src={member.imageRef || "/assets/team/hritish-narayanan-b.jpeg"}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 250px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2.5 space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-bold text-forest-900">
                    {member.name}
                  </h3>
                  <p className="text-[11px] text-forest-600 font-medium leading-tight">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-5xl" />
    </div>
  );
}
