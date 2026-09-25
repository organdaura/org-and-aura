/**
 * Centralized Asset Registry
 *
 * Maps all branding, decor, product, gallery, team, and blog imagery.
 * Update image paths here to replace placeholder assets with real ones
 * without needing to modify component code.
 */

export interface AssetEntry {
  id: string;
  title: string;
  src: string;
  alt: string;
  aspectRatio?: string;
  description?: string;
}

export const ASSETS = {
  branding: {
    logo: {
      id: "logo",
      title: "Org & Aura Official Logo",
      src: "/assets/branding/logo.png",
      alt: "Org & Aura - A Path to Sustainable Solutions",
    },
  },
  decorations: {
    heroLeavesTop: {
      id: "decor-hero-top",
      title: "Realistic Botanical Foliage Framing",
      src: "/assets/decorations/leaves-branch.png",
      alt: "Realistic lush botanical leaves with dew drops framing",
    },
    heroLeavesBottom: {
      id: "decor-hero-bottom",
      title: "Botanical Framing Bottom",
      src: "/assets/decorations/leaves-branch.png",
      alt: "Realistic botanical foliage framing footer",
    },
    carbonSphere: {
      id: "decor-carbon-sphere",
      title: "Dotted Geometric Global Grid",
      src: "/assets/decorations/carbon-sphere.svg",
      alt: "Subtle wireframe sphere representing global carbon monitoring",
    },
    anatomyGraphic: {
      id: "decor-anatomy-graphic",
      title: "Clean Future Geometric Anatomy",
      src: "/assets/decorations/anatomy-graphic.svg",
      alt: "Geodesic circular mesh with dotted spiral orbits",
    },
  },
  product: {
    sandiMachineDiagram: {
      id: "product-sandi-diagram",
      title: "The SanDi Machine Specifications",
      src: "/assets/product/sandi-diagram.svg",
      alt: "Technical architectural diagram and specifications of The SanDi Machine",
      aspectRatio: "3/4",
    },
    sandiRendering: {
      id: "product-sandi-rendering",
      title: "The SanDi Machine Enclosure",
      src: "/assets/product/sandi-rendering.svg",
      alt: "Compact contactless sanitary waste processing unit",
      aspectRatio: "1/1",
    },
  },
  gallery: [
    {
      id: "gallery-srm-easwari",
      title: "SRM Easwari Engineering College",
      subtitle: "Chennai, India",
      src: "/assets/gallery/easwari-college.svg",
      alt: "SRM Easwari Engineering College Campus, Chennai",
      aspectRatio: "16/9",
    },
    {
      id: "gallery-startup-showcase",
      title: "SanDi Startup Showcase & Deployment",
      subtitle: "Easwari Startup Hub & Incubation",
      src: "/assets/gallery/sandi-showcase.svg",
      alt: "SanDi machine startup showcase, internal mechanism diagram, and student founders",
      aspectRatio: "1/1",
    },
    {
      id: "gallery-pilot-hospitals",
      title: "Pilot Testing in High-Traffic Healthcare Facilities",
      subtitle: "Sanitary Innovation",
      src: "/assets/gallery/pilot-testing.svg",
      alt: "Pilot installation of SanDi contactless unit in healthcare washroom",
      aspectRatio: "16/9",
    },
  ],
  blog: {
    wasteManagement: {
      id: "blog-waste-management",
      title: "Global Trends in Sustainable Waste Management",
      src: "/assets/blog/waste-management.svg",
      alt: "Smart tech and AI-driven sorting for biological and plastic waste",
    },
    diaperCost: {
      id: "blog-diaper-cost",
      title: "The Hidden Environmental Cost of Traditional Diapers",
      src: "/assets/blog/diaper-cost.svg",
      alt: "Landfill analysis showing traditional diaper degradation timeline",
    },
    whyGold: {
      id: "blog-why-gold",
      title: "Why We Choose Gold: The Psychology of Premium Sustainability",
      src: "/assets/blog/why-gold.svg",
      alt: "Modern luxury earth tones and metallic accent aesthetic",
    },
    pilotResults: {
      id: "blog-pilot-results",
      title: "SanDi Field Test: Results from Our Latest Pilot Program",
      src: "/assets/blog/pilot-results.svg",
      alt: "Data visualization of odor elimination and user satisfaction",
    },
    interns: {
      id: "blog-interns",
      title: "Joining the Revolution: What We Look for in Interns",
      src: "/assets/blog/interns.svg",
      alt: "Engineering and design collaborative workspace",
    },
    scienceThermal: {
      id: "blog-science-thermal",
      title: "The Science Behind Rapid Thermal Degradation",
      src: "/assets/blog/science-thermal.svg",
      alt: "Thermal degradation high-heat zero-emission diagram",
    },
  },
  team: {
    founder1: {
      id: "founder-1",
      name: "Co-Founder",
      role: "Founder & Lead Engineer",
      src: "/assets/team/founder-1.svg",
      alt: "Co-founder of Org & Aura",
    },
    founder2: {
      id: "founder-2",
      name: "Co-Founder",
      role: "Founder & Operations Director",
      src: "/assets/team/founder-2.svg",
      alt: "Co-founder of Org & Aura",
    },
    member1: {
      id: "team-lokesh-rao",
      name: "Lokesh Rao",
      role: "Product Architecture & System Integration Lead",
      src: "/assets/team/lokesh-rao.svg",
      alt: "Lokesh Rao - Product Architecture & System Integration Lead",
    },
    member2: {
      id: "team-bargav",
      name: "Bargav",
      role: "Embedded Systems",
      src: "/assets/team/bargav.svg",
      alt: "Bargav - Embedded Systems",
    },
    member3: {
      id: "team-ceo",
      name: "Executive Leadership",
      role: "Chief Executive Officer",
      src: "/assets/team/ceo.svg",
      alt: "CEO - Executive Leadership",
    },
    member4: {
      id: "team-4",
      name: "Operations Lead",
      role: "Product & Operations",
      src: "/assets/team/team-4.svg",
      alt: "Product & Operations specialist",
    },
    member5: {
      id: "team-5",
      name: "Research Associate",
      role: "Thermal Research",
      src: "/assets/team/team-5.svg",
      alt: "Thermal Research specialist",
    },
    member6: {
      id: "team-6",
      name: "Software Engineer",
      role: "IoT & Cloud Telemetry",
      src: "/assets/team/team-6.svg",
      alt: "Software Engineer",
    },
    member7: {
      id: "team-7",
      name: "Sustainability Analyst",
      role: "Life Cycle Assessment",
      src: "/assets/team/team-7.svg",
      alt: "Sustainability Analyst",
    },
    member8: {
      id: "team-8",
      name: "Quality Assurance",
      role: "Safety & Standards",
      src: "/assets/team/team-8.svg",
      alt: "Quality Assurance specialist",
    },
    member9: {
      id: "team-new",
      name: "New Team Member",
      role: "Innovation Fellow",
      src: "/assets/team/new-member.svg",
      alt: "New Team Member - Innovation Fellow",
    },
  },
};
