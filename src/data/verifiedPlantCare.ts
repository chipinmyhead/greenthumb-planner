interface VerifiedCare {
  guidance: string;
  sources: readonly [string, string, ...string[]];
}

export const VERIFIED_PLANT_CARE: Partial<Record<string, VerifiedCare>> = {
  "Asclepias syriaca": {
    guidance: "Grow in full sun in well-drained soil. This species tolerates dry or poor soil and can spread into a colony, so give it room to naturalize.",
    sources: [
      "https://plants.ces.ncsu.edu/plants/asclepias-syriaca/",
      "https://plantfinder.mobot.org/PlantFinderDetails.aspx?taxonid=276792",
    ],
  },
  "Asclepias tuberosa": {
    guidance: "Choose a site with full sun and well-drained soil.",
    sources: [
      "https://plants.ces.ncsu.edu/plants/asclepias-tuberosa/",
      "https://hort.extension.wisc.edu/articles/butterflyweed-asclepias-tuberosa/",
    ],
  },
  "Acer rubrum": {
    guidance: "Choose a site with moist, slightly acidic soil where possible. Red maple tolerates a range of soil conditions.",
    sources: [
      "https://nwmissouri.edu/arboretum/tree/acerrubrum.htm",
      "https://ohiodnr.gov/discover-and-learn/plants-trees/broad-leaf-trees/red-maple-acer-rubrum",
    ],
  },
  "Achillea millefolium": {
    guidance: "Choose a site with well-drained soil.",
    sources: [
      "https://plants.ces.ncsu.edu/plants/achillea-millefolium/",
      "https://plants.sc.egov.usda.gov/DocumentLibrary/plantguide/pdf/pg_acmi2.pdf",
    ],
  },
  "Echinacea purpurea": {
    guidance: "Plant in well-drained soil in full sun. The plant also tolerates some shade.",
    sources: [
      "https://plants.ces.ncsu.edu/plants/echinacea-purpurea/",
      "https://www.rhs.org.uk/plants/41568/echinacea-purpurea/details",
    ],
  },
  "Liriodendron tulipifera": {
    guidance: "Give tuliptree a sunny site with moist, well-drained, slightly acidic soil.",
    sources: [
      "https://plants.ces.ncsu.edu/plants/liriodendron-tulipifera/",
      "https://mortonarb.org/plant-and-protect/trees-and-plants/tuliptree/",
    ],
  },
  "Parthenocissus quinquefolia": {
    guidance: "Grow in full sun or partial shade. Allow room for this vigorous climbing vine to spread.",
    sources: [
      "https://plants.ces.ncsu.edu/plants/parthenocissus-quinquefolia/",
      "https://hort.extension.wisc.edu/articles/virginia-creeper-parthenocissus-quinquefolia/",
    ],
  },
  "Quercus alba": {
    guidance: "Choose full sun and moist, well-drained soil for white oak. Allow room for a large mature tree.",
    sources: [
      "https://plants.ces.ncsu.edu/plants/quercus-alba/",
      "https://mortonarb.org/plant-and-protect/trees-and-plants/white-oak/",
    ],
  },
  "Rudbeckia hirta": {
    guidance: "Grow in full sun to partial shade and choose a well-drained site.",
    sources: [
      "https://plants.ces.ncsu.edu/plants/rudbeckia-hirta/",
      "https://www.rhs.org.uk/plants/68850/rudbeckia-hirta/details",
    ],
  },
};
