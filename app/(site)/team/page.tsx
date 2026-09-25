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

  const team = await prisma.teamMember.findMany({
    where: { type: "TEAM", published: true },
    orderBy: { displayOrder: "asc" },
  });

  const mentors = await prisma.teamMember.findMany({
    where: { type: "MENTOR", published: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="w-full relative flex flex-col items-center">
      <BotanicalFrame position="top" className="w-full max-w-5xl" />

      <div className="w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-10 space-y-12">
        {/* Section 1: Our Founders */}
        <section className="space-y-6 text-center">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-forest-800">
            Our Founders
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {founders.map((founder) => (
              <div
                key={founder.id}
                className="card-organic p-3 sm:p-4 bg-white overflow-hidden text-center group transition-all duration-300 hover:shadow-organic-lg"
              >
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-cream-100 border border-cream-200">
                  <Image
                    src={founder.imageRef || "/assets/team/founder-1.svg"}
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
                  <p className="text-xs text-forest-600 font-medium">
                    {founder.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Our Team */}
        <section className="space-y-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-forest-800">
            Our Team
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="card-organic p-2.5 sm:p-3 bg-white overflow-hidden text-center group transition-all duration-300 hover:shadow-organic-lg"
              >
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-cream-100 border border-cream-200">
                  <Image
                    src={member.imageRef || "/assets/team/lokesh-rao.svg"}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 250px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2.5 space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-bold text-forest-900 truncate">
                    {member.name}
                  </h3>
                  <p className="text-[11px] text-forest-600 truncate font-medium">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Our Mentors */}
        {mentors.length > 0 && (
          <section className="space-y-6 text-center pt-4">
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-forest-800">
              Our Mentors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="card-organic p-3 sm:p-4 bg-white overflow-hidden text-center group transition-all duration-300 hover:shadow-organic-lg"
                >
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-cream-100 border border-cream-200">
                    <Image
                      src={mentor.imageRef || "/assets/team/mentor-1.svg"}
                      alt={mentor.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
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
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-5xl" />
    </div>
  );
}
