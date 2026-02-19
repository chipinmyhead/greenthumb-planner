import { useState } from "react";
import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { PLANT_DATABASE } from "@/data/plantDatabase";
import { CATEGORY_ICONS, PlantCategory } from "@/types/plants";
import { Plus, Search, Droplets, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const categories: PlantCategory[] = ["shrub", "tree", "flower", "grass", "succulent", "herb", "vine"];
const zones = ["Front Yard", "Back Garden", "Side Yard", "Patio", "Driveway"];
const sunLabels = { full: "Full Sun", partial: "Partial", shade: "Shade" };
const waterLabels = { low: "Low", medium: "Med", high: "High" };

const AddPlantPage = () => {
  const { addPlant, gardenPlants } = useGarden();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | "all">("all");
  const [selectedZone, setSelectedZone] = useState(zones[0]);

  const existingIds = new Set(gardenPlants.map((gp) => gp.plant.id));

  const filtered = PLANT_DATABASE.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (plantId: string) => {
    addPlant(plantId, selectedZone);
    toast.success("Plant added to your garden!");
  };

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Add Plants</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse the plant library</p>
      </motion.div>

      {/* Search */}
      <div className="relative mt-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Zone selector */}
      <div className="mt-4">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Add to zone:</label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="w-full px-3 py-2 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {zones.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      {/* Plant list */}
      <div className="mt-5 space-y-3">
        {filtered.map((plant, i) => {
          const alreadyAdded = existingIds.has(plant.id);
          return (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-2xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{plant.image}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">{plant.name}</h3>
                  <p className="text-xs text-muted-foreground italic">{plant.scientificName}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Droplets className="w-3 h-3 text-water" />{waterLabels[plant.waterNeeds]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Sun className="w-3 h-3 text-sun" />{sunLabels[plant.sunlight]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(plant.id)}
                  disabled={alreadyAdded}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    alreadyAdded
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:scale-105 active:scale-95"
                  }`}
                >
                  {alreadyAdded ? "Added" : <><Plus className="w-3 h-3" /> Add</>}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AddPlantPage;
