import { useState } from "react";
import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { PLANT_DATABASE, US_SPECIES_COUNT } from "@/data/plantDatabase";
import { CATEGORY_ICONS, PlantCategory } from "@/types/plants";
import { Plus, Search, Droplets, Sun } from "lucide-react";
import { toast } from "sonner";

const pageSize = 30;
const categories: PlantCategory[] = ["shrub", "tree", "flower", "grass", "succulent", "herb", "vine"];
const zones = ["Front Yard", "Back Garden", "Side Yard", "Patio", "Driveway"];
const sunLabels = { full: "Full Sun", partial: "Partial", shade: "Shade" };
const waterLabels = { low: "Low", medium: "Med", high: "High" };

const AddPlantPage = () => {
  const { addPlant, gardenPlants } = useGarden();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | "all">("all");
  const [selectedZone, setSelectedZone] = useState(zones[0]);

  const existingIds = new Set(gardenPlants.map((gp) => gp.plant.id));

  const query = search.trim().toLowerCase();
  const filtered = PLANT_DATABASE.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(query) ||
      p.scientificName.toLowerCase().includes(query);
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (plantId: string) => {
    addPlant(plantId, selectedZone);
    toast.success("Plant added to your garden!");
  };

  return (
    <div className="px-5 pt-14 pb-28 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl text-foreground">Add Plants</h1>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2">{US_SPECIES_COUNT.toLocaleString()} ranked U.S. species</p>
      </motion.div>

      {/* Search */}
      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          aria-label="Search by common or scientific name"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => { setSelectedCategory("all"); setPage(0); }}
          className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-medium whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "border border-border text-muted-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setPage(0); }}
            className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground"
            }`}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      {selectedCategory !== "all" && (
        <p className="mt-2 text-xs text-muted-foreground">Shows plants with a known garden category. Choose All to search the full catalog.</p>
      )}

      {/* Zone selector */}
      <div className="mt-4">
        <label className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5 block">Add to zone</label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="w-full px-3 py-2.5 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {zones.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      {/* Plant list */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No plants match your search.</p>
        )}
        {filtered.slice(page * pageSize, (page + 1) * pageSize).map((plant, i) => {
          const alreadyAdded = existingIds.has(plant.id);
          return (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-md border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{plant.image}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">{plant.name}</h3>
                  <p className="text-[11px] text-muted-foreground italic">{plant.scientificName}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {plant.waterNeeds && <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Droplets className="w-3 h-3 text-water" />{waterLabels[plant.waterNeeds]}
                    </span>}
                    {plant.sunlight && <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Sun className="w-3 h-3 text-sun" />{sunLabels[plant.sunlight]}
                    </span>}

                  </div>
                </div>
                <button
                  onClick={() => handleAdd(plant.id)}
                  disabled={alreadyAdded}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all ${
                    alreadyAdded
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:scale-105 active:scale-95"
                  }`}
                >
                  {alreadyAdded ? "Added" : <><Plus className="w-3 h-3" /> Add</>}
                </button>
              </div>
              {plant.verifiedCare && (
                <details className="mt-2 text-sm text-muted-foreground">
                  <summary className="cursor-pointer text-primary">Verified care guide</summary>
                  <p className="mt-2">{plant.verifiedCare.guidance}</p>
                  <ul className="mt-2 space-y-1">
                    {plant.verifiedCare.sources.map((source) => (
                      <li key={source}>
                        <a href={source} target="_blank" rel="noreferrer" className="text-primary underline">
                          {new URL(source).hostname}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </motion.div>
          );
        })}
      </div>
      {filtered.length > pageSize && (
        <nav aria-label="Plant search pages" className="mt-5 flex items-center justify-between gap-2 text-sm">
          <button className="rounded-md border px-3 py-2 disabled:opacity-40" disabled={page === 0}
            onClick={() => setPage(page - 1)}>Previous</button>
          <span aria-live="polite">Page {page + 1} of {Math.ceil(filtered.length / pageSize)}</span>
          <button className="rounded-md border px-3 py-2 disabled:opacity-40"
            disabled={(page + 1) * pageSize >= filtered.length} onClick={() => setPage(page + 1)}>Next</button>
        </nav>
      )}
    </div>
  );
};

export default AddPlantPage;
