import type { CareRecommendation, PlantCare } from "@/types/plants";

function recommendation(value: string, first: string, second: string): CareRecommendation {
  return { value, sources: [first, second] };
}

const toolbox = "https://plants.ces.ncsu.edu/plants/";
const finder = "https://plantfinder.mobot.org/PlantFinderDetails.aspx?isprofile=0&taxonid=";
const morton = "https://mortonarb.org/plant-and-protect/";
const iowa = "https://yardandgarden.extension.iastate.edu/how-to/";
const minnesota = "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/";
const clemson = "https://hgic.clemson.edu/factsheet/";
const rhs = "https://www.rhs.org.uk/plants/";
const virginia = "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/2901/";
const woodyHandbook = "https://content.ces.ncsu.edu/extension-gardener-handbook/11-woody-ornamentals";
const marylandHydrangeas = "https://extension.umd.edu/resource/pruning-hydrangeas";
const rutgersHydrangeas = "https://extension.rutgers.edu/fs1152";
const wisconsin = "https://hort.extension.wisc.edu/articles/";

const growConeflowers = iowa + "growing-coneflowers-iowa";
const dividePerennials = iowa + "how-divide-and-transplant-perennials";
const transplantTrees = morton + "expert-advice/";
const newTransplants = morton + "tree-plant-care/plant-care-resources/caring-for-new-transplants/";
const woodyWater = recommendation(
  "After planting, water the root ball thoroughly. Check it frequently during establishment and water as it begins to dry. Adjust for rainfall and soil drainage.",
  newTransplants, minnesota + "watering-newly-planted-trees-and-shrubs",
);
const perennialWater = recommendation(
  "Water thoroughly after transplanting. Check soil moisture regularly and water deeply when the root zone begins to dry, allowing for rainfall.",
  iowa + "watering-tips-garden-lawn-and-landscape", "https://extension.psu.edu/care-and-maintenance-of-perennials",
);
const milkweedMoving = recommendation(
  "Avoid moving established plants if possible. If a move is necessary, try early spring before flowering.",
  "https://homegarden.cahnr.uconn.edu/factsheets/milkweed/", "https://ask.extension.org/kb/faq.php?id=803846",
);

const commonMilkweed = toolbox + "asclepias-syriaca/";
const commonMilkweedGarden = finder + "276792";
const butterflyWeed = toolbox + "asclepias-tuberosa/";
const butterflyWeedGarden = wisconsin + "butterflyweed-asclepias-tuberosa/";
const redMaple = morton + "trees-and-plants/red-maple/";
const redMapleExtension = toolbox + "acer-rubrum/";
const yarrow = toolbox + "achillea-millefolium/";
const yarrowGarden = finder + "277129";
const coneflower = toolbox + "echinacea-purpurea/";
const coneflowerGarden = finder + "277422";
const tuliptree = morton + "trees-and-plants/tuliptree/";
const tuliptreeExtension = virginia + "2901-1074/2901-1074.html";
const creeper = toolbox + "parthenocissus-quinquefolia/";
const creeperGarden = wisconsin + "virginia-creeper-parthenocissus-quinquefolia/";
const whiteOak = morton + "trees-and-plants/white-oak/";
const treePruning = recommendation(
  "For small branches, make removal cuts just outside the branch collar. For larger branches, use the three-cut method to prevent bark from tearing.",
  woodyHandbook, minnesota + "pruning-trees-and-shrubs",
);
const shrubTransplant = recommendation(
  "Move dormant shrubs in early spring before new growth, when the soil is workable.",
  transplantTrees, minnesota + "planting-and-transplanting-trees-and-shrubs",
);
const whiteOakExtension = virginia + "2901-1076/2901-1076.html";
const blackEyedSusan = toolbox + "rudbeckia-hirta/";
const blackEyedSusanGarden = finder + "277225";

const poisonControl = "https://www.poison.org/articles/";
const aspcaPlants = "https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants/";
const redMaplePlanting = "https://www.ncagr.gov/divisions/nc-forest-service/urban/north-carolina-arbor-day/arbor-day-giveaway/red-maple";
const redMapleClemson = clemson + "maple/";
const tuliptreeFlorida = "https://ask.ifas.ufl.edu/publication/ST363";
const blackEyedSusanFlorida = "https://ask.ifas.ufl.edu/publication/FP512";
const bigleafHydrangea = toolbox + "hydrangea-macrophylla/";
const panicleHydrangea = toolbox + "hydrangea-paniculata/";
const panicleHydrangeaRhs = rhs + "8944/hydrangea-paniculata/details";

export const VERIFIED_PLANT_CARE: Partial<Record<string, PlantCare>> = {
  "Asclepias syriaca": {
    hardinessZone: recommendation("USDA zones 3–9.", commonMilkweed, commonMilkweedGarden),
    light: recommendation("Full sun.", commonMilkweed, commonMilkweedGarden),
    moisture: recommendation("Well-drained soil. Tolerates relatively dry conditions.", commonMilkweed, commonMilkweedGarden),
    wateringFrequency: perennialWater,
    transplantSeason: milkweedMoving,
    matureSize: recommendation("Published garden guides put flowering stems at about 2–5 ft tall. The plant spreads by rhizomes and can form a colony wider than a single stem.", commonMilkweed, commonMilkweedGarden),
    bloomSeason: recommendation("Summer, commonly June through August.", commonMilkweed, commonMilkweedGarden),
    humanToxicity: recommendation("Poisonous if eaten. The sap can irritate skin and eyes.", commonMilkweed, poisonControl + "milkweed-can-cause-serious-poisoning-204"),
    petToxicity: recommendation("Toxic to cats and dogs if eaten.", commonMilkweed, aspcaPlants + "milkweed"),
  },
  "Asclepias tuberosa": {
    hardinessZone: recommendation("USDA zones 3–9.", butterflyWeed, butterflyWeedGarden),
    light: recommendation("Full sun for best flowering.", butterflyWeed, butterflyWeedGarden),
    moisture: recommendation("Well-drained soil. Dry sites are suitable once established.", butterflyWeed, butterflyWeedGarden),
    wateringFrequency: perennialWater,
    transplantSeason: milkweedMoving,
    matureSize: recommendation("About 1–2 ft tall and 1–1½ ft wide.", butterflyWeed, finder + "276924"),
    soilTexture: recommendation("Sandy soil works well. Clay can also work if it drains freely.", butterflyWeed, butterflyWeedGarden),
    bloomSeason: recommendation("Summer, with timing varying by region.", butterflyWeed, butterflyWeedGarden),
    humanToxicity: recommendation("Poisonous if eaten.", butterflyWeed, poisonControl + "milkweed-can-cause-serious-poisoning-204"),
    petToxicity: recommendation("Toxic to cats and dogs if eaten.", butterflyWeed, aspcaPlants + "milkweed"),
  },
  "Acer rubrum": {
    hardinessZone: recommendation("USDA zones 3–9.", redMaple, redMapleExtension),
    light: recommendation("Full sun to partial shade.", redMaple, redMapleExtension),
    moisture: recommendation("Moist soil is preferred. The species tolerates a range of moisture conditions.", redMaple, redMapleExtension),
    wateringFrequency: woodyWater,
    pruningSeason: recommendation("Early summer after leaves have fully expanded.", redMaple, minnesota + "pruning-trees-and-shrubs"),
    pruningInstructions: treePruning,
    transplantSeason: recommendation("Early spring while dormant is a good time to move a small tree.", transplantTrees, minnesota + "planting-and-transplanting-trees-and-shrubs"),
    matureSize: recommendation("About 40–70 ft tall and 30–50 ft wide in typical landscapes. Some specimens grow taller.", redMaple, redMaplePlanting),
    soilPh: recommendation("Slightly acidic soil is preferred.", redMaple, redMapleClemson),
    bloomSeason: recommendation("Late winter to early spring, often before the leaves open.", redMapleExtension, redMapleClemson),
  },
  "Achillea millefolium": {
    light: recommendation("Full sun.", yarrow, yarrowGarden),
    moisture: recommendation("Well-drained, dry to moderately moist soil.", yarrow, yarrowGarden),
    wateringFrequency: perennialWater,
    pruningSeason: recommendation("Optional deadheading after the first flush of flowers fades.", yarrowGarden, yarrow),
    pruningInstructions: recommendation("Cut spent flower stems back to lateral buds to encourage another flush of flowers.", yarrowGarden, yarrow),
    transplantSeason: recommendation("Divide and replant in spring.", rhs + "311/achillea-millefolium/details", dividePerennials),
    matureSize: recommendation("Often about 1–3 ft tall and 1–3 ft across. It can spread beyond that by rhizomes.", yarrow, yarrowGarden),
    bloomSeason: recommendation("Summer.", yarrow, yarrowGarden),
    petToxicity: recommendation("Toxic to cats and dogs if eaten.", yarrow, aspcaPlants + "yarrow"),
  },
  "Echinacea purpurea": {
    hardinessZone: recommendation("USDA zones 3–8.", coneflowerGarden, growConeflowers),
    light: recommendation("Full sun to partial shade.", coneflower, coneflowerGarden),
    moisture: recommendation("Well-drained soil. Established plants tolerate dry spells.", coneflower, coneflowerGarden),
    wateringFrequency: perennialWater,
    pruningSeason: recommendation("Optional deadheading during flowering.", coneflowerGarden, growConeflowers),
    pruningInstructions: recommendation("Remove fading flower heads to limit self-seeding, or leave some seed heads in place.", coneflowerGarden, growConeflowers),
    transplantSeason: recommendation("Divide and replant established clumps in spring as growth begins.", dividePerennials, clemson + "echinacea/"),
    matureSize: recommendation("Commonly about 3–4 ft tall and 1½–2 ft wide.", coneflower, coneflowerGarden),
    soilTexture: recommendation("Well-drained loam is suitable. The plant can also grow in well-drained clay.", coneflower, "https://ask.ifas.ufl.edu/publication/fp192"),
    soilPh: recommendation("Near-neutral soil is suitable.", coneflower, "https://ask.ifas.ufl.edu/publication/EP605"),
    bloomSeason: recommendation("Summer, often with a strong early-summer flush.", coneflower, growConeflowers),
  },
  "Liriodendron tulipifera": {
    hardinessZone: recommendation("USDA zones 5–9.", tuliptree, tuliptreeExtension),
    light: recommendation("Full sun preferred.", tuliptree, toolbox + "liriodendron-tulipifera/"),
    moisture: recommendation("Moist, well-drained soil. Avoid sites that routinely dry out.", tuliptree, tuliptreeExtension),
    wateringFrequency: woodyWater,
    pruningSeason: recommendation("Winter, while dormant.", tuliptreeExtension, transplantTrees),
    pruningInstructions: treePruning,
    transplantSeason: recommendation("Move small trees in early spring, while dormant.", tuliptreeExtension, transplantTrees),
    matureSize: recommendation("Allow room for a tree around 90 ft tall with a crown around 50 ft wide.", tuliptree, tuliptreeExtension),
    soilTexture: recommendation("Loam is suitable if it drains well.", toolbox + "liriodendron-tulipifera/", tuliptreeFlorida),
    soilPh: recommendation("Slightly acidic soil is preferred.", tuliptree, toolbox + "liriodendron-tulipifera/"),
    bloomSeason: recommendation("Late spring to early summer.", tuliptree, tuliptreeFlorida),
  },
  "Parthenocissus quinquefolia": {
    light: recommendation("Full sun to partial shade.", creeper, creeperGarden),
    moisture: recommendation("Moderately moist, well-drained soil. Established vines tolerate drier conditions.", creeper, creeperGarden),
    matureSize: recommendation("Can climb roughly 30–50 ft on a support. Its spread varies with support and pruning.", creeper, creeperGarden),
    soilTexture: recommendation("Adapts to several textures, including sand, loam, and clay.", creeper, creeperGarden),
    bloomSeason: recommendation("Late spring to early summer.", creeper, creeperGarden),
    humanToxicity: recommendation("Berries are poisonous if eaten.", creeper, poisonControl + "virginia-creeper-and-wisteria-toxicity-192"),
  },
  "Quercus alba": {
    hardinessZone: recommendation("USDA zones 5–9.", whiteOak, whiteOakExtension),
    light: recommendation("Full sun preferred.", whiteOak, whiteOakExtension),
    moisture: recommendation("Deep, moist, well-drained soil preferred.", whiteOak, whiteOakExtension),
    wateringFrequency: woodyWater,
    pruningSeason: recommendation("Winter while dormant, before the local oak-wilt risk period.", whiteOakExtension, morton + "tree-plant-care/plant-care-resources/oak-wilt/"),
    pruningInstructions: treePruning,
    transplantSeason: recommendation("Transplant as a small tree in early spring.", whiteOakExtension, transplantTrees),
    matureSize: recommendation("Published landscape guides describe trees around 50–100 ft tall. Allow roughly 80–100 ft for the crown of a large specimen.", whiteOak, whiteOakExtension),
    soilTexture: recommendation("Well-drained loam, sandy soil, or clay loam can be suitable.", toolbox + "quercus-alba/", whiteOakExtension),
    soilPh: recommendation("Acidic soil is preferred.", toolbox + "quercus-alba/", whiteOakExtension),
    bloomSeason: recommendation("Spring.", toolbox + "quercus-alba/", whiteOak),
  },
  "Rudbeckia hirta": {
    hardinessZone: recommendation("USDA zones 3–7.", blackEyedSusan, blackEyedSusanGarden),
    light: recommendation("Full sun preferred.", blackEyedSusan, blackEyedSusanGarden),
    moisture: recommendation("Moderately moist, well-drained soil.", blackEyedSusan, blackEyedSusanGarden),
    wateringFrequency: perennialWater,
    pruningSeason: recommendation("Optional deadheading as flowers fade.", blackEyedSusanGarden, clemson + "rudbeckia/"),
    pruningInstructions: recommendation("Remove spent blooms to reduce self-seeding and encourage more flowers.", blackEyedSusanGarden, clemson + "rudbeckia/"),
    transplantSeason: recommendation("Divide and replant surviving perennial clumps in spring.", dividePerennials, clemson + "rudbeckia/"),
    matureSize: recommendation("Commonly about 2–3 ft tall. Allow about 2 ft of width per plant.", blackEyedSusan, blackEyedSusanFlorida),
    soilTexture: recommendation("Well-drained clay, loam, or sand can be suitable.", blackEyedSusan, blackEyedSusanFlorida),
    soilPh: recommendation("Acidic soil is suitable.", blackEyedSusan, blackEyedSusanFlorida),
    bloomSeason: recommendation("Summer. Flowering can continue toward fall in favorable conditions.", blackEyedSusanGarden, growConeflowers),
  },
  "Hydrangea macrophylla": {
    hardinessZone: recommendation("USDA zones 6–9 for typical bigleaf hydrangeas. Check the cultivar in colder gardens.", toolbox + "hydrangea-macrophylla/", "https://www.missouribotanicalgarden.org/gardens-gardening/your-garden/help-for-the-home-gardener/advice-tips-resources/gardening-help-faqs/question/1187/how-do-i-prune-my-hydrangeas"),
    light: recommendation("Partial shade, especially protection from strong afternoon sun.", toolbox + "hydrangea-macrophylla/", rutgersHydrangeas),
    moisture: recommendation("Moist, well-drained soil.", toolbox + "hydrangea-macrophylla/", rutgersHydrangeas),
    wateringFrequency: woodyWater,
    pruningSeason: recommendation("If pruning is needed, do it just after flowering for varieties that bloom on old wood.", marylandHydrangeas, rutgersHydrangeas),
    pruningInstructions: recommendation("Cut back selected flowered shoots just above healthy buds. Preserve the old stems that will carry next season’s flowers.", marylandHydrangeas, rutgersHydrangeas),
    transplantSeason: shrubTransplant,
    matureSize: recommendation("About 3–6 ft tall and wide for many garden forms. Check the cultivar for its mature dimensions.", bigleafHydrangea, rutgersHydrangeas),
    soilPh: recommendation("Acidic soil favors blue flowers on many cultivars. Higher pH favors pink, although cultivar and aluminum availability also matter.", bigleafHydrangea, rutgersHydrangeas),
    bloomSeason: recommendation("Summer. Reblooming cultivars can flower again later in the season.", bigleafHydrangea, rutgersHydrangeas),
    humanToxicity: recommendation("Plant parts can be harmful if eaten.", bigleafHydrangea, "https://www.poisonsinfo.health.qld.gov.au/plants-and-mushrooms/hydrangea-hydrangea-macrophylla"),
  },
  "Hydrangea paniculata": {
    hardinessZone: recommendation("USDA zones 3–8.", toolbox + "hydrangea-paniculata/", rutgersHydrangeas),
    light: recommendation("Full sun to partial shade.", toolbox + "hydrangea-paniculata/", rutgersHydrangeas),
    moisture: recommendation("Moist, well-drained soil.", toolbox + "hydrangea-paniculata/", rutgersHydrangeas),
    wateringFrequency: woodyWater,
    pruningSeason: recommendation("Late winter before new growth begins.", marylandHydrangeas, rutgersHydrangeas),
    pruningInstructions: recommendation("Thin or shorten selected shoots if needed. It flowers on new growth, so avoid a severe annual cutback that can leave weak, floppy stems.", marylandHydrangeas, rutgersHydrangeas),
    transplantSeason: shrubTransplant,
    matureSize: recommendation("Unpruned standard forms can reach 15–20 ft tall and wide. Compact cultivars can be much smaller.", panicleHydrangea, rutgersHydrangeas),
    soilTexture: recommendation("Well-drained loam, sand, or clay can be suitable.", panicleHydrangea, panicleHydrangeaRhs),
    soilPh: recommendation("Acidic to neutral soil is suitable.", panicleHydrangea, panicleHydrangeaRhs),
    bloomSeason: recommendation("Late summer into early fall.", panicleHydrangea, panicleHydrangeaRhs),
  },
};
