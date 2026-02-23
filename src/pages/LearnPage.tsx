import { motion } from "framer-motion";
import { Droplets, Sun, Leaf, FlaskConical, Bug, Thermometer, PawPrint, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Tip {
  id: string;
  icon: React.ReactNode;
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
}

const tips: Tip[] = [
  {
    id: "moisture",
    icon: <Droplets className="w-5 h-5 text-water" />,
    title: "Measuring Soil Moisture",
    summary: "Know exactly when your plants need water.",
    sections: [
      {
        heading: "The Finger Test",
        body: "Push your finger 2–3 inches into the soil. If it feels dry at that depth, it's time to water. If it's still moist, wait another day or two. This simple method works for most container and garden plants.",
      },
      {
        heading: "Using a Moisture Meter",
        body: "Insert a moisture meter probe about halfway into the root zone. Most meters read on a scale of 1–10: 1–3 is dry, 4–7 is moist, and 8–10 is wet. For most plants, water when the reading drops below 4.",
      },
      {
        heading: "Soil Appearance & Weight",
        body: "Dry soil tends to be lighter in color and pulls away from the edges of a pot. You can also lift containers — a noticeably lighter pot usually means it's time to water.",
      },
      {
        heading: "Watering Depth Check",
        body: "After watering, use a wooden dowel (like a chopstick) pushed into the soil. Pull it out after 10 minutes — a damp line shows how deep the water reached. Aim for moisture to reach at least 6 inches for most garden plants.",
      },
    ],
  },
  {
    id: "sunlight",
    icon: <Sun className="w-5 h-5 text-sun" />,
    title: "Assessing Sunlight Exposure",
    summary: "Figure out how much light each spot in your yard gets.",
    sections: [
      {
        heading: "Track the Sun",
        body: "Pick a spot and check it every 2 hours from morning to evening. Full sun means 6+ hours of direct sunlight. Partial sun/shade is 3–6 hours. Full shade is less than 3 hours of direct light.",
      },
      {
        heading: "Use a Sun Calculator App",
        body: "Apps like Sun Surveyor or SunCalc use your phone's camera and GPS to map the sun's path across your yard throughout the year, accounting for seasonal changes.",
      },
      {
        heading: "Watch for Reflected & Filtered Light",
        body: "Light-colored walls and fences reflect extra light, effectively increasing sun exposure. Dappled light through tree canopies counts as partial shade, even if the sky above is open.",
      },
      {
        heading: "Seasonal Considerations",
        body: "A spot that gets full sun in summer may be mostly shaded in winter due to the sun's lower angle. Deciduous trees also change the equation — an area shaded in summer may get full winter sun.",
      },
    ],
  },
  {
    id: "fertilizer",
    icon: <FlaskConical className="w-5 h-5 text-leaf" />,
    title: "Choosing the Right Fertilizer",
    summary: "Match nutrients to what your plants actually need.",
    sections: [
      {
        heading: "Understanding N-P-K",
        body: "Every fertilizer label shows three numbers (e.g., 10-10-10). These represent Nitrogen (leaf growth), Phosphorus (roots & flowers), and Potassium (overall health). A balanced ratio works for general use; high-nitrogen for lawns; high-phosphorus for blooming plants.",
      },
      {
        heading: "Granular vs. Liquid",
        body: "Granular fertilizers release slowly over weeks and are great for garden beds and lawns. Liquid fertilizers act quickly and are ideal for container plants or giving a fast boost. Slow-release granules are a low-maintenance middle ground.",
      },
      {
        heading: "Organic vs. Synthetic",
        body: "Organic fertilizers (compost, bone meal, fish emulsion) improve soil health over time and release nutrients slowly. Synthetic fertilizers deliver precise nutrients quickly but don't build soil structure. Many gardeners use a combination.",
      },
      {
        heading: "When & How Much",
        body: "Most plants benefit from fertilizing during active growth (spring and summer). Always follow package rates — more isn't better. Over-fertilizing can burn roots and harm plants. Water thoroughly after applying granular fertilizer.",
      },
    ],
  },
  {
    id: "pests",
    icon: <Bug className="w-5 h-5 text-earth" />,
    title: "Identifying Common Pests",
    summary: "Spot problems early before they spread.",
    sections: [
      {
        heading: "Aphids",
        body: "Tiny soft-bodied insects (green, black, or white) that cluster on new growth and undersides of leaves. They leave sticky honeydew residue. Blast them off with water, or use insecticidal soap. Ladybugs are natural predators.",
      },
      {
        heading: "Slugs & Snails",
        body: "Look for irregular holes in leaves and silvery slime trails. They feed at night and prefer moist conditions. Use beer traps, copper tape around pots, or iron phosphate bait. Reduce hiding spots by clearing debris.",
      },
      {
        heading: "Japanese Beetles",
        body: "Metallic green beetles that skeletonize leaves, eating everything except veins. Hand-pick them into soapy water in the morning when they're sluggish. Treat lawns with milky spore to control grubs.",
      },
      {
        heading: "Fungal Issues",
        body: "Powdery mildew (white powder on leaves) and black spot (dark circles with yellow halos) are common. Improve air circulation, water at the base of plants instead of overhead, and apply neem oil or fungicide preventatively.",
      },
    ],
  },
  {
    id: "seasonal",
    icon: <Thermometer className="w-5 h-5 text-accent" />,
    title: "Seasonal Care Calendar",
    summary: "What to do in your yard each season.",
    sections: [
      {
        heading: "Spring",
        body: "Clean up debris and dead foliage. Apply pre-emergent weed control to lawns. Start feeding plants as new growth appears. Divide overgrown perennials. Prune spring-flowering shrubs after they bloom.",
      },
      {
        heading: "Summer",
        body: "Water deeply and less frequently — early morning is best. Mulch beds 2–3 inches deep to retain moisture and suppress weeds. Deadhead spent flowers to encourage reblooming. Watch for heat stress signs like wilting.",
      },
      {
        heading: "Fall",
        body: "Plant spring-blooming bulbs. Overseed and fertilize lawns. Rake leaves or mulch them into the lawn. Move tender plants indoors before first frost. This is a great time to plant trees and shrubs.",
      },
      {
        heading: "Winter",
        body: "Protect sensitive plants with burlap wraps or mulch mounding. Prune deciduous trees and shrubs while dormant (except spring bloomers). Clean, sharpen, and oil garden tools. Plan next year's garden layout.",
      },
    ],
  },
  {
    id: "mulching",
    icon: <Leaf className="w-5 h-5 text-primary" />,
    title: "Mulching Best Practices",
    summary: "Retain moisture, suppress weeds, and enrich soil.",
    sections: [
      {
        heading: "Choosing Mulch",
        body: "Organic mulches (wood chips, bark, straw, compost) break down and improve soil. Inorganic mulches (gravel, rubber) last longer but don't feed the soil. For most gardens, shredded hardwood bark is a reliable all-purpose choice.",
      },
      {
        heading: "How Deep",
        body: "Apply 2–3 inches around most plants. Too thin won't suppress weeds; too thick can suffocate roots and trap excess moisture. For trees, extend mulch to the drip line but keep it 3–4 inches away from the trunk.",
      },
      {
        heading: "The Volcano Myth",
        body: "Never pile mulch against tree trunks in a 'volcano' shape. This traps moisture against bark, encouraging rot and disease. Instead, create a flat donut shape with a gap around the trunk.",
      },
      {
        heading: "When to Refresh",
        body: "Top up mulch once or twice a year as it decomposes. Spring is ideal — after the soil has warmed but before summer heat. Remove old, matted mulch if it's forming a water-repellent layer before adding fresh material.",
      },
    ],
  },
  {
    id: "pet-safe",
    icon: <PawPrint className="w-5 h-5 text-primary" />,
    title: "Pet-Safe Plant Choices",
    summary: "Keep your furry friends safe in the yard.",
    sections: [
      {
        heading: "Common Toxic Plants to Avoid",
        body: "Many popular garden plants are toxic to dogs and cats. Lilies (especially dangerous for cats), sago palms, azaleas, oleander, and foxglove can cause serious illness or worse. Before planting, always check the ASPCA's toxic plant database.",
      },
      {
        heading: "Safe Alternatives for Color",
        body: "Swap risky plants for pet-friendly options that still look great. Sunflowers, zinnias, snapdragons, petunias, and marigolds are all non-toxic and add vibrant color. For shrubs, consider rose bushes (thorns aside), camellias, or hibiscus.",
      },
      {
        heading: "Pet-Safe Herbs & Edibles",
        body: "Many herbs are safe and useful: basil, rosemary, thyme, sage, and cilantro. Catmint and cat grass are favorites for felines. Avoid garlic, onion, and chive plants, which are toxic to both dogs and cats.",
      },
      {
        heading: "Designing a Pet-Friendly Yard",
        body: "Use raised beds or fencing to keep pets away from any questionable plants. Create a designated digging area with loose soil to redirect behavior. Avoid cocoa mulch (toxic to dogs) — use cedar or pine bark instead. Skip chemical pesticides in areas your pets frequent.",
      },
    ],
  },
];

const LearnPage = () => {
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-foreground">Learn</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tips & techniques for a healthier yard
        </p>
      </motion.div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            {expandedTip === tip.id ? (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedTip(null)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {tip.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">
                      {tip.title}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90 transition-transform" />
                </button>

                <div className="px-4 pb-4">
                  <Accordion type="single" collapsible className="w-full">
                    {tip.sections.map((section, si) => (
                      <AccordionItem
                        key={si}
                        value={`${tip.id}-${si}`}
                        className="border-border/50"
                      >
                        <AccordionTrigger className="text-sm py-3 hover:no-underline">
                          {section.heading}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                          {section.body}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setExpandedTip(tip.id)}
                className="w-full bg-card rounded-2xl border border-border p-4 flex items-center gap-3 text-left hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {tip.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {tip.summary}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearnPage;
