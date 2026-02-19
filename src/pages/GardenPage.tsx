import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { CATEGORY_ICONS } from "@/types/plants";
import { Trash2, Droplets, Sun, Wind } from "lucide-react";

const sunLabels = { full: "Full Sun", partial: "Partial", shade: "Shade" };
const waterLabels = { low: "Low", medium: "Medium", high: "High" };

const GardenPage = () => {
  const { gardenPlants, removePlant } = useGarden();

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">My Garden</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {gardenPlants.length} plant{gardenPlants.length !== 1 ? "s" : ""} in your landscape
        </p>
      </motion.div>

      <div className="mt-6 space-y-3">
        {gardenPlants.map((gp, i) => (
          <motion.div
            key={gp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{gp.plant.image}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{gp.plant.name}</h3>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {CATEGORY_ICONS[gp.plant.category]} {gp.plant.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground italic">{gp.plant.scientificName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">📍 {gp.zone}</p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Droplets className="w-3.5 h-3.5 text-water" />
                    {waterLabels[gp.plant.waterNeeds]}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Sun className="w-3.5 h-3.5 text-sun" />
                    {sunLabels[gp.plant.sunlight]}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Wind className="w-3.5 h-3.5 text-sage" />
                    {gp.plant.hardiness}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {gp.plant.notes}
                </p>
              </div>
              <button
                onClick={() => removePlant(gp.id)}
                className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </motion.div>
        ))}

        {gardenPlants.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <span className="text-4xl">🌱</span>
            <p className="text-muted-foreground mt-2">Your garden is empty</p>
            <p className="text-xs text-muted-foreground">Add plants from the + tab</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenPage;
