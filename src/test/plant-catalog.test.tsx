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

  expect(screen.getByText("When to transplant")).toBeInTheDocument();
  expect(screen.getByText("Full sun.", { exact: true })).toBeInTheDocument();
  expect(screen.getAllByText("No cross-checked recommendation yet.").length).toBeGreaterThan(0);
});
