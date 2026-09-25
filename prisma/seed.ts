import { PrismaClient, Role, MemberType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Org & Aura database seed...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@organdaura.com";
  const rawPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@OrgAura2026!";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
      name: "Org & Aura Administrator",
    },
    create: {
      email: adminEmail,
      name: "Org & Aura Administrator",
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin seeded: ${admin.email}`);

  // 2. Seed Blog Posts from Video Recording
  const blogPosts = [
    {
      title: "Global Trends in Sustainable Waste Management",
      slug: "global-trends-in-sustainable-waste-management",
      category: "Industry Insights",
      publishedAt: new Date("2026-05-15"),
      excerpt:
        "The landscape of waste management is shifting rapidly. With landfills reaching capacity globally, smart tech solutions are no longer a luxury—they are a necessity. From AI-driven sorting to rapid thermal degradation, discover how the world is tackling biological and plastic waste in 2026.",
      body: `## The Modern Waste Paradigm

The global trajectory of urban sanitation has reached a pivotal juncture. As metropolitan landfills exceed their operational thresholds, municipal infrastructures are forced to reckon with unprecedented volumes of non-biodegradable and biohazardous refuse.

### The Problem with Conventional Landfilling

Traditional disposal mechanisms depend heavily on centralized hauling and decentralized burial. This workflow introduces two severe vulnerabilities:
1. **Prolonged Methane Generation**: Organic compounds sealed in anaerobic landfill conditions produce high-potency greenhouse gases for decades.
2. **Microplastic and Pathogenic Leaching**: Single-use hygiene products contain plastic linings that degrade into persistent environmental microplastics, contaminating regional water tables.

### The Role of Decentralized Elimination

The advent of compact, localized thermal neutralization systems transforms sanitary waste management from an open-loop disposal problem into a closed-cycle micro-utility. By processing waste at the precise point of generation—whether in academic institutions, medical facilities, or enterprise offices—we bypass transit emissions and achieve zero-footprint sanitation.`,
      imageRef: "/assets/blog/waste-management.svg",
    },
    {
      title: "The Hidden Environmental Cost of Traditional Diapers",
      slug: "the-hidden-environmental-cost-of-traditional-diapers",
      category: "Environmental Impact",
      publishedAt: new Date("2026-04-10"),
      excerpt:
        "Did you know that a standard disposable diaper can take up to 500 years to decompose? Millions are thrown away every single day, creating an invisible mountain of biohazardous waste that releases methane gas into our atmosphere. Learn why localized disposal systems like SanDi are the only viable path forward.",
      body: `## The 500-Year Ecological Debt

Every minute across the world, thousands of conventional single-use diapers are discarded. Encased in synthetic polyethylene and superabsorbent sodium polyacrylate polymers, each unit carries an ecological half-life that surpasses multiple human generations.

### Lifecycle Realities
- **Decomposition Horizon**: 450 to 500 years under standard environmental conditions.
- **Landfill Volume**: Sanitary and diaper waste accounts for up to 7% of non-recyclable municipal solid waste in dense metropolitan regions.
- **Microbial Hazards**: Untreated fecal and bodily matter creates localized pathogen reservoirs within collection streams.

### Eradicating the Footprint at the Source
Org & Aura's SanDi machine addresses this systemic failure by neutralizing biological contaminants and reducing bulk waste volume by over 95% through flameless high-efficiency thermal breakdown.`,
      imageRef: "/assets/blog/diaper-cost.svg",
    },
    {
      title: "Why We Choose Gold: The Psychology of Premium Sustainability",
      slug: "why-we-choose-gold-the-psychology-of-premium-sustainability",
      category: "Design & Brand",
      publishedAt: new Date("2026-03-22"),
      excerpt:
        "Sustainability doesn't have to look rugged. We explore why Org and Aura pairs deep earth tones with vibrant metallic gold, elevating eco-conscious technology into luxury appliance design. Discover how aesthetics drive consumer adoption of green technology.",
      body: `## Elevated Industrial Design for Ecological Stewardship

For too long, environmental technology was styled with a rough, utilitarian asceticism. Green products were designed to look austere, signalling sacrifice rather than progress.

### The Luxury Paradigm Shift
At Org & Aura, we believe that sustainability should be synonymous with prestige, elegance, and premium experience. By pairing earthy botanical sages with metallic gold accents, we transform public sanitation hardware into refined architectural fixtures that institutions are proud to showcase.`,
      imageRef: "/assets/blog/why-gold.svg",
    },
    {
      title: "SanDi Field Test: Results from Our Latest Pilot Program",
      slug: "sandi-field-test-results-from-our-latest-pilot-program",
      category: "Tech Updates",
      publishedAt: new Date("2026-02-18"),
      excerpt:
        "We installed SanDi beta units in 50 high-traffic maternity wards and women's restrooms across the city. The results over the last 90 days have been incredible. Read the full case study on odor elimination, automated tracking, and user satisfaction ratings.",
      body: `## 90 Days of Continuous In-Field Validation

Deploying hardware into demanding public and healthcare environments provides real-world telemetry that laboratory tests cannot replicate.

### Key Metrics from the Pilot
- **Total Disposals Logged**: 48,250 cycles across 50 installed units.
- **Odor Elimination Rating**: 99.4% satisfaction reported by facility maintenance teams.
- **Operational Uptime**: 99.8% with automated remote telemetry diagnostics.
- **Maintenance Reduction**: Custodial staff intervention reduced by 80% compared to conventional disposal bins.`,
      imageRef: "/assets/blog/pilot-results.svg",
    },
    {
      title: "Joining the Revolution: What We Look for in Interns",
      slug: "joining-the-revolution-what-we-look-for-in-interns",
      category: "Company Culture",
      publishedAt: new Date("2026-01-14"),
      excerpt:
        "As our hardware and software teams expand, we are opening our doors to the next generation of engineers, designers, and environmental advocates. Here is an inside look at the Org and Aura culture and what makes a successful application stand out.",
      body: `## Building the Future of Clean Engineering

Org & Aura is rooted in young, visionary collegiate innovation. We seek driven students and recent graduates who are not satisfied with theoretical discussions about sustainability, but want to build tangible physical machines and high-reliability embedded software.`,
      imageRef: "/assets/blog/interns.svg",
    },
    {
      title: "The Science Behind Rapid Thermal Degradation",
      slug: "the-science-behind-rapid-thermal-degradation",
      category: "Deep Dive",
      publishedAt: new Date("2025-12-05"),
      excerpt:
        "Curious about how SanDi actually works? Step inside our engineering lab as we break down the high-heat, zero-emission thermal process that reduces biological waste to harmless ash in a matter of minutes.",
      body: `## Controlled Pyrolytic Thermal Neutralization

The SanDi processing chamber operates under precise microprocessor control, utilizing ceramic heating elements and closed-loop catalytic filtration.

### The Step-by-Step Cycle
1. **Infrared Contactless Induction**: Hands-free opening ensures absolute user hygiene.
2. **Airtight Hermetic Sealing**: Prevents any escape of aerosols or volatile organic compounds.
3. **Multi-Stage Catalytic Gas Neutralization**: Heated activated carbon and ceramic honeycomb filter banks neutralize odors and exhaust gases.
4. **Inert Mineral Ash Conversion**: Biological matter is reduced to sterile, inert mineral ash occupying less than 5% of original volume.`,
      imageRef: "/assets/blog/science-thermal.svg",
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`✅ Seeded ${blogPosts.length} blog posts`);

  // 3. Seed Team & Founders
  const teamMembers = [
    {
      name: "Founder & Innovator",
      role: "Co-Founder & Chief Technology Officer",
      type: MemberType.FOUNDER,
      displayOrder: 1,
      imageRef: "/assets/team/founder-1.svg",
    },
    {
      name: "Founder & Operations",
      role: "Co-Founder & Chief Operating Officer",
      type: MemberType.FOUNDER,
      displayOrder: 2,
      imageRef: "/assets/team/founder-2.svg",
    },
    {
      name: "Lokesh Rao",
      role: "Hardware Architecture & Mechanical Design",
      type: MemberType.TEAM,
      displayOrder: 3,
      imageRef: "/assets/team/lokesh-rao.svg",
    },
    {
      name: "Bargav",
      role: "Embedded Systems & Firmware",
      type: MemberType.TEAM,
      displayOrder: 4,
      imageRef: "/assets/team/bargav.svg",
    },
    {
      name: "Executive Leadership",
      role: "Chief Executive Officer",
      type: MemberType.TEAM,
      displayOrder: 5,
      imageRef: "/assets/team/ceo.svg",
    },
    {
      name: "Operations Lead",
      role: "Production & Supply Chain",
      type: MemberType.TEAM,
      displayOrder: 6,
      imageRef: "/assets/team/team-4.svg",
    },
    {
      name: "Research Associate",
      role: "Thermal Materials & Testing",
      type: MemberType.TEAM,
      displayOrder: 7,
      imageRef: "/assets/team/team-5.svg",
    },
    {
      name: "Software Engineer",
      role: "IoT Platform & Cloud Telemetry",
      type: MemberType.TEAM,
      displayOrder: 8,
      imageRef: "/assets/team/team-6.svg",
    },
    {
      name: "Sustainability Analyst",
      role: "Life Cycle Assessment & Compliance",
      type: MemberType.TEAM,
      displayOrder: 9,
      imageRef: "/assets/team/team-7.svg",
    },
    {
      name: "Quality Assurance",
      role: "Safety Testing & Standards",
      type: MemberType.TEAM,
      displayOrder: 10,
      imageRef: "/assets/team/team-8.svg",
    },
    {
      name: "New Team Member",
      role: "Innovation Fellow",
      type: MemberType.TEAM,
      displayOrder: 11,
      imageRef: "/assets/team/new-member.svg",
    },
    {
      name: "Dr. Incubation Mentor",
      role: "Director of Innovation & Incubation, SRM",
      type: MemberType.MENTOR,
      displayOrder: 12,
      imageRef: "/assets/team/mentor-1.svg",
    },
    {
      name: "Senior Research Advisor",
      role: "Professor of Thermal & Chemical Engineering",
      type: MemberType.MENTOR,
      displayOrder: 13,
      imageRef: "/assets/team/mentor-2.svg",
    },
  ];

  await prisma.teamMember.deleteMany({});
  for (const member of teamMembers) {
    await prisma.teamMember.create({
      data: member,
    });
  }
  console.log(`✅ Seeded ${teamMembers.length} founders, team members, and mentors`);

  // 4. Seed Gallery Items
  const galleryItems = [
    {
      title: "SRM Easwari Engineering College",
      caption: "Chennai, India - Institutional incubation and development partnership.",
      imageRef: "/assets/gallery/easwari-college.svg",
      displayOrder: 1,
    },
    {
      title: "SanDi Startup Showcase & Deployment",
      caption: "Easwari Startup Hub & Incubation presentation highlighting patent-pending thermal degradation mechanism.",
      imageRef: "/assets/gallery/sandi-showcase.svg",
      displayOrder: 2,
    },
    {
      title: "Pilot Testing in Healthcare Facilities",
      caption: "Sanitary innovation in high-traffic commercial and hospital settings.",
      imageRef: "/assets/gallery/pilot-testing.svg",
      displayOrder: 3,
    },
  ];

  await prisma.galleryItem.deleteMany({});
  for (const item of galleryItems) {
    await prisma.galleryItem.create({
      data: item,
    });
  }
  console.log(`✅ Seeded ${galleryItems.length} gallery items`);

  // 5. Seed an initial Support Request & Career Application for dashboard preview
  await prisma.supportRequest.create({
    data: {
      name: "Healthcare Facility Manager",
      email: "facility@apollohospitals.org",
      subject: "Pilot Installation Inquiry for Wing B",
      message:
        "We are interested in installing 4 SanDi units in our outpatient clinic to evaluate odor control and custodial efficiency.",
      status: "NEW",
    },
  });

  await prisma.careerApplication.create({
    data: {
      fullName: "Aditi Sharma",
      mobileNumber: "+91 9876543210",
      email: "aditi.sharma@example.com",
      physicalAddress: "Anna Nagar, Chennai, India",
      topSkills: "Embedded C, Microcontrollers, SolidWorks CAD",
      department: "Hardware Engineering",
      roleType: "Full-time",
      status: "PENDING",
    },
  });

  console.log("🚀 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
