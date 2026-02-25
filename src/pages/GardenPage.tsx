import { useState } from "react";
import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { CATEGORY_ICONS, GardenPlant } from "@/types/plants";
import { Trash2, Droplets, Sun, Wind, Info, FlaskConical, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const sunLabels = { full: "Full Sun", partial: "Partial", shade: "Shade" };
const waterLabels = { low: "Low", medium: "Medium", high: "High" };

const GardenPage = () => {
  const { gardenPlants, removePlant } = useGarden();
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(null);

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Garden</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {gardenPlants.length} plant{gardenPlants.length !== 1 ? "s" : ""} in your landscape
          </p>
        </div>
        <button
          onClick={() => navigate("/add")}
          className="mt-1 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </motion.div>

      <div className="mt-6 space-y-3">
        {gardenPlants.map((gp, i) => (
          <motion.div
            key={gp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-xl border border-border p-4"
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

                <div className="flex items-center gap-4 mt-3 flex-wrap">
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
                <div className="flex items-start gap-1 mt-2 text-xs text-muted-foreground">
                  <FlaskConical className="w-3.5 h-3.5 text-leaf shrink-0 mt-0.5" />
                  <span>{gp.plant.fertilizerType}</span>
                </div>

                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {gp.plant.notes}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedPlant(gp)}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                >
                  <Info className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => removePlant(gp.id)}
                  className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {gardenPlants.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <span className="text-4xl">🌱</span>
            <p className="text-muted-foreground mt-2">Your garden is empty</p>
            <p className="text-xs text-muted-foreground">Add plants from the + tab</p>
          </div>
        )}
      </div>

      <Sheet open={!!selectedPlant} onOpenChange={(open) => !open && setSelectedPlant(null)}>
        <SheetContent side="bottom" className="rounded-t-xl max-h-[80vh] overflow-y-auto">
          {selectedPlant && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-xl">
                  <span className="text-3xl">{selectedPlant.plant.image}</span>
                  {selectedPlant.plant.name}
                </SheetTitle>
                <SheetDescription className="italic">
                  {selectedPlant.plant.scientificName}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {CATEGORY_ICONS[selectedPlant.plant.category]} {selectedPlant.plant.category}
                  </span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {selectedPlant.plant.hardiness}
                  </span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    📍 {selectedPlant.zone}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <DetailItem icon={<Sun className="w-4 h-4 text-sun" />} label="Sunlight" value={sunLabels[selectedPlant.plant.sunlight]} />
                  <DetailItem icon={<Droplets className="w-4 h-4 text-water" />} label="Water Needs" value={waterLabels[selectedPlant.plant.waterNeeds]} />
                  <DetailItem icon={<Droplets className="w-4 h-4 text-water" />} label="Water Every" value={`${selectedPlant.plant.waterFrequencyDays} days`} />
                  <DetailItem icon={<Wind className="w-4 h-4 text-sage" />} label="Fertilize Every" value={`${selectedPlant.plant.fertilizerFrequencyDays} days`} />
                  <DetailItem icon={<Wind className="w-4 h-4 text-sage" />} label="Prune Every" value={`${selectedPlant.plant.pruneFrequencyDays} days`} />
                </div>

                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FlaskConical className="w-4 h-4 text-leaf" />
                    <p className="text-xs font-medium text-foreground">Recommended Fertilizer</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedPlant.plant.fertilizerType}</p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-foreground mb-1">Care Notes</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedPlant.plant.notes}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-secondary/50 rounded-lg p-3 flex items-start gap-2">
    {icon}
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default GardenPage;
