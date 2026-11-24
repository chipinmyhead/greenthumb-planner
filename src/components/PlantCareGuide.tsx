import type { PlantCare } from "@/types/plants";

const careFields: ReadonlyArray<[keyof PlantCare, string]> = [
  ["hardinessZone", "Hardiness zone"],
  ["light", "Light exposure"],
  ["moisture", "Soil moisture"],
  ["wateringFrequency", "When to water"],
  ["pruningSeason", "When to prune"],
  ["pruningInstructions", "How to prune"],
  ["transplantSeason", "When to transplant"],
];

export default function PlantCareGuide({ care }: { care: PlantCare }) {
  return (
    <dl className="divide-y divide-border text-sm">
      {careFields.map(([key, label]) => {
        const recommendation = care[key];
        return (
          <div key={key} className="py-2">
            <dt className="font-medium text-foreground">{label}</dt>
            <dd className="mt-1 text-muted-foreground">
              {recommendation?.value ?? "No cross-checked recommendation yet."}
              {recommendation && (
                <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  {recommendation.sources.map((source) => (
                    <li key={source}>
                      <a href={source} target="_blank" rel="noreferrer" className="text-primary underline">
                        {new URL(source).hostname}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
