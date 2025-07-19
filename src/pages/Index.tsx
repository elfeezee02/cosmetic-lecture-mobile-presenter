import { useState } from "react";
import { PresentationLayout } from "@/components/PresentationLayout";
import { HeroSlide } from "@/components/slides/HeroSlide";
import { ContentSlide } from "@/components/slides/ContentSlide";

const Index = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Welcome to Cosmetic Production",
      type: "intro" as const,
      content: (
        <HeroSlide onGetStarted={() => setCurrentSlideIndex(1)} />
      )
    },
    {
      id: 2,
      title: "Course Introduction",
      type: "content" as const,
      content: (
        <ContentSlide
          title="Introduction to Cosmetic Science"
          subtitle="Understanding the fundamentals of cosmetic formulation and production"
          learning_objectives={["Basic Chemistry", "Safety Standards", "Product Development", "Quality Control"]}
          content={{
            type: "text",
            data: "Cosmetic science combines chemistry, biology, and engineering to create products that enhance appearance and maintain skin health. This comprehensive course will guide you through every aspect of cosmetic production, from initial formulation to final packaging."
          }}
        />
      )
    },
    {
      id: 3,
      title: "Key Ingredients",
      type: "content" as const,
      content: (
        <ContentSlide
          title="Essential Cosmetic Ingredients"
          subtitle="Understanding the building blocks of cosmetic formulations"
          learning_objectives={["Active Ingredients", "Preservatives", "Emulsifiers", "Colorants"]}
          content={{
            type: "grid",
            data: [
              {
                title: "Active Ingredients",
                description: "Components that provide the primary benefit - vitamins, peptides, acids, and botanical extracts"
              },
              {
                title: "Emulsifiers",
                description: "Allow oil and water to blend smoothly - lecithin, polysorbates, and stearic acid"
              },
              {
                title: "Preservatives",
                description: "Prevent microbial growth and extend shelf life - parabens, phenoxyethanol, and natural alternatives"
              },
              {
                title: "Thickeners",
                description: "Control texture and viscosity - carbomers, xanthan gum, and natural gums"
              }
            ]
          }}
        />
      )
    },
    {
      id: 4,
      title: "Production Process",
      type: "content" as const,
      content: (
        <ContentSlide
          title="Manufacturing Process"
          subtitle="Step-by-step guide to cosmetic production"
          learning_objectives={["Mixing Techniques", "Temperature Control", "Quality Testing", "Packaging"]}
          content={{
            type: "steps",
            data: [
              {
                title: "Ingredient Preparation",
                description: "Weigh and prepare all raw materials according to the formulation. Ensure proper temperature and pH conditions."
              },
              {
                title: "Phase Mixing",
                description: "Combine oil and water phases separately, then blend together using appropriate mixing equipment."
              },
              {
                title: "Homogenization",
                description: "Use high-speed mixing or homogenizers to create a smooth, uniform texture without air bubbles."
              },
              {
                title: "Quality Control",
                description: "Test pH, viscosity, stability, and microbial contamination before packaging."
              },
              {
                title: "Packaging & Labeling",
                description: "Fill into sterile containers and apply accurate labeling with ingredient lists and usage instructions."
              }
            ]
          }}
        />
      )
    },
    {
      id: 5,
      title: "Safety & Regulations",
      type: "content" as const,
      content: (
        <ContentSlide
          title="Safety Standards & Regulations"
          subtitle="Ensuring compliance and consumer safety in cosmetic production"
          learning_objectives={["FDA Guidelines", "EU Regulations", "Safety Testing", "Documentation"]}
          content={{
            type: "list",
            data: [
              "FDA cosmetic regulations require proper labeling and ingredient disclosure",
              "EU cosmetic regulation demands safety assessments and CPNP notification",
              "Patch testing and stability studies ensure product safety and efficacy",
              "Good Manufacturing Practices (GMP) maintain quality and consistency",
              "Proper documentation tracks every batch from ingredients to final product",
              "Regular training ensures all personnel understand safety protocols"
            ]
          }}
        />
      )
    }
  ];

  return (
    <PresentationLayout 
      slides={slides}
      onSlideChange={setCurrentSlideIndex}
    />
  );
};

export default Index;
