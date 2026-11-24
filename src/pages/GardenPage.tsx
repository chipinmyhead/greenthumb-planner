import PlantCareGuide from "@/components/PlantCareGuide";
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
    <div className="px-5 pt-14 pb-28 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl text-foreground">My Garden</h1>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2">
            {gardenPlants.length} plant{gardenPlants.length !== 1 ? "s" : ""} in your landscape
          </p>
        </div>
        <button
          onClick={() => navigate("/add")}
          className="mt-2 w-9 h-9 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </motion.div>

      <div className="space-y-3">
        {gardenPlants.map((gp, i) => (
          <motion.div
            key={gp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-md border border-border p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{gp.plant.image}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm">{gp.plant.name}</h3>
                  {gp.plant.category && <span className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {CATEGORY_ICONS[gp.plant.category]} {gp.plant.category}
                  </span>}
                </div>
                <p className="text-[11px] text-muted-foreground italic">{gp.plant.scientificName}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">📍 {gp.zone}</p>

                {gp.plant.verifiedCare?.light && (
                  <p className="mt-2 text-xs text-muted-foreground">{gp.plant.verifiedCare.light.value}</p>
                )}
                {!gp.plant.notes && !gp.plant.verifiedCare && (
                  <p className="mt-2 text-xs text-muted-foreground">Care guidance has not been verified for this species.</p>
                )}
                {gp.plant.notes && (
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    Original care notes (unverified): {gp.plant.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedPlant(gp)}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  <Info className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => removePlant(gp.id)}
                  className="p-1.5 rounded-full hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {gardenPlants.length === 0 && (
          <div className="border border-dashed border-border rounded-md p-10 text-center">
            <span className="text-4xl">🌱</span>
            <p className="text-muted-foreground mt-3 italic">Your garden is empty</p>
            <p className="text-xs text-muted-foreground mt-1">Tap + to browse plants</p>
          </div>
        )}
      </div>

      <Sheet open={!!selectedPlant} onOpenChange={(open) => !open && setSelectedPlant(null)}>
        <SheetContent side="bottom" className="rounded-t-lg max-h-[80vh] overflow-y-auto">
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
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedPlant.plant.category && <span className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {CATEGORY_ICONS[selectedPlant.plant.category]} {selectedPlant.plant.category}
                  </span>}
                  {selectedPlant.plant.hardiness && (
                    <span className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {selectedPlant.plant.hardiness}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    📍 {selectedPlant.zone}
                  </span>
                </div>

                {selectedPlant.plant.verifiedCare && (
                  <section className="space-y-2">
                    <h3 className="font-semibold">Verified care guidance</h3>
                    <PlantCareGuide care={selectedPlant.plant.verifiedCare} />
                  </section>
                )}
                {!selectedPlant.plant.notes && !selectedPlant.plant.verifiedCare && (
                  <p className="text-sm text-muted-foreground">Care guidance has not been verified for this species.</p>
                )}
                {selectedPlant.plant.notes && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Original care settings (unverified)</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <DetailItem icon={<Sun className="w-4 h-4 text-sun" />} label="Sunlight" value={selectedPlant.plant.sunlight ? sunLabels[selectedPlant.plant.sunlight] : "Unknown"} />
                      <DetailItem icon={<Droplets className="w-4 h-4 text-water" />} label="Water Needs" value={selectedPlant.plant.waterNeeds ? waterLabels[selectedPlant.plant.waterNeeds] : "Unknown"} />
                      <DetailItem icon={<Droplets className="w-4 h-4 text-water" />} label="Water Every" value={`${selectedPlant.plant.waterFrequencyDays} days`} />
                      <DetailItem icon={<Wind className="w-4 h-4 text-sage" />} label="Fertilize Every" value={`${selectedPlant.plant.fertilizerFrequencyDays} days`} />
                      <DetailItem icon={<Wind className="w-4 h-4 text-sage" />} label="Prune Every" value={`${selectedPlant.plant.pruneFrequencyDays} days`} />
                    </div>

                    <div className="border border-border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FlaskConical className="w-4 h-4 text-leaf" />
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground">Recommended Fertilizer</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedPlant.plant.fertilizerType}</p>
                    </div>

                    <div className="border border-border rounded-md p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground mb-1">Care Notes</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedPlant.plant.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="border border-border rounded-md p-3 flex items-start gap-2">
    {icon}
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default GardenPage;
