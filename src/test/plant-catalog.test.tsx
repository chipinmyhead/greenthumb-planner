import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { GardenProvider } from "@/context/GardenContext";
import { PLANT_DATABASE, US_SPECIES_COUNT } from "@/data/plantDatabase";
import { VERIFIED_PLANT_CARE } from "@/data/verifiedPlantCare";
import AddPlantPage from "@/pages/AddPlantPage";

it("includes 10,000 distinct ranked species and retains the original garden IDs", () => {
  const ranked = PLANT_DATABASE.filter((plant) => plant.observationCount !== undefined);
  expect(US_SPECIES_COUNT).toBe(10_000);
  expect(ranked).toHaveLength(10_000);
  expect(new Set(ranked.map((plant) => plant.scientificName.toLowerCase())).size).toBe(10_000);
  expect(new Set(PLANT_DATABASE.map((plant) => plant.id)).size).toBe(PLANT_DATABASE.length);
  expect(PLANT_DATABASE.filter((plant) => /^p\d+$/.test(plant.id))).toHaveLength(50);
  expect(PLANT_DATABASE.filter((plant) => plant.verifiedCare)).toHaveLength(Object.keys(VERIFIED_PLANT_CARE).length);
  for (const plant of PLANT_DATABASE) {
    for (const field of Object.values(plant.verifiedCare ?? {})) {
      expect(new Set(field.sources.map((source) => new URL(source).hostname)).size)
        .toBeGreaterThanOrEqual(2);
    }
  }
});

it("pages the catalog and searches beyond the first page", () => {
  localStorage.clear();
  render(<GardenProvider><AddPlantPage /></GardenProvider>);
  expect(screen.getAllByRole("button", { name: "Add" })).toHaveLength(30);

  const pages = screen.getByRole("navigation", { name: "Plant search pages" });
  fireEvent.click(within(pages).getByRole("button", { name: "Next" }));
  expect(within(pages).getByText(/^Page 2 of/)).toBeInTheDocument();

  fireEvent.change(screen.getByRole("textbox", { name: "Search by common or scientific name" }), {
    target: { value: "Geranium wislizeni" },
  });
  expect(screen.getByText("Geranium wislizeni", { exact: true })).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "Add" })).toHaveLength(1);
});

it("shows horticultural recommendations and sources in the catalog", () => {
  localStorage.clear();
  render(<GardenProvider><AddPlantPage /></GardenProvider>);
  fireEvent.change(screen.getByRole("textbox", { name: "Search by common or scientific name" }), {
    target: { value: "Asclepias syriaca" },
  });

  const guide = screen.getByText("Verified care guide").closest("details");
  expect(guide).not.toBeNull();
  const care = within(guide!);
  expect(care.getByText("When to transplant")).toBeInTheDocument();
  expect(care.getByText("Full sun.", { exact: true })).toBeInTheDocument();
  for (const field of [
    "Mature height and spread", "Soil texture", "Soil pH", "Bloom season",
    "Toxicity to people", "Toxicity to pets",
  ]) {
    expect(care.getByText(field)).toBeInTheDocument();
  }
  const petToxicity = care.getByText("Toxicity to pets").parentElement!;
  expect(within(petToxicity).getByText("Toxic to cats and dogs if eaten.")).toBeInTheDocument();
  expect(within(petToxicity).getAllByRole("link", { hidden: true })).toHaveLength(2);
  expect(care.getAllByText("No cross-checked recommendation yet.").length).toBeGreaterThan(0);

  fireEvent.change(screen.getByRole("textbox", { name: "Search by common or scientific name" }), {
    target: { value: "Echinacea purpurea" },
  });
  expect(screen.getAllByText("Toxicity unverified. Safety is unknown.")).toHaveLength(2);
});
