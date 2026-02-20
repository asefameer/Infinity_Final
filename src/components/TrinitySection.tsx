import { motion } from "framer-motion";
import { useRef } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import trinityNova from "@/assets/trinity-nova.jpg";
import trinityLtm from "@/assets/trinity-live-the-moment.jpg";
import trinityXforce from "@/assets/trinity-xforce.jpg";

const springConfig = { stiffness: 60, damping: 18, mass: 0.6 };

const cards = [
  {
    title: "NOVA",
    image: trinityNova,
    description:
      "NOVA is a lifestyle platform that goes beyond the ordinary to create Bangladesh's most exceptional experiences.",
  },
  {
    title: "LIVE THE MOMENT",
    image: trinityLtm,
    description:
      "Live the Moment is a lifestyle platform where you truly live every bit of the moment.",
  },
  {
    title: "X FORCE",
    image: trinityXforce,
    description:
      "X Force is not just a platform, but a tribe for those who refuse to settle. For the ones who push limits, chase adrenaline, and live their passion loud.",
  },
];

/** Image with parallax depth — image moves slower than scroll */
const ParallaxImage = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 0"],
  });
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  const y = useTransform(smoothProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1.1, 1.05, 1.1]);

  return (
    <div ref={ref} className="relative aspect-[3/4] rounded-lg overflow-hidden mb-5">
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        style={{
          y,
          scale,
          willChange: "transform",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

const TrinitySection = () => {
  return (
    <section
      id="the-trinity"
      className="relative min-h-screen flex flex-col items-center py-24 px-8 bg-background"
    >
      {/* Heading */}
      <ScrollReveal className="text-center mb-16" offsetY={60} blur={8}>
        <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">
          The Trinity Collective
        </h2>
        <p className="text-muted-foreground text-lg">
          A singular destination for your multifaceted life.
        </p>
      </ScrollReveal>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {cards.map((card) => (
          <ScrollReveal
            key={card.title}
            className="group cursor-pointer"
            offsetY={80}
            blur={10}
          >
            <ParallaxImage src={card.image} alt={card.title} />

            <h3 className="font-display text-xl font-bold text-foreground mb-2 tracking-wide">
              {card.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.description}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default TrinitySection;
