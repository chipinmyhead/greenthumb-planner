import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { GardenProvider } from "@/context/GardenContext";
import { PLANT_DATABASE, US_SPECIES_COUNT } from "@/data/plantDatabase";
import AddPlantPage from "@/pages/AddPlantPage";

it("includes 10,000 distinct ranked species and retains the original garden IDs", () => {
  const ranked = PLANT_DATABASE.filter((plant) => plant.observationCount !== undefined);
  expect(US_SPECIES_COUNT).toBe(10_000);
  expect(ranked).toHaveLength(10_000);
  expect(new Set(ranked.map((plant) => plant.scientificName.toLowerCase())).size).toBe(10_000);
  expect(new Set(PLANT_DATABASE.map((plant) => plant.id)).size).toBe(PLANT_DATABASE.length);
  expect(PLANT_DATABASE.filter((plant) => /^p\d+$/.test(plant.id))).toHaveLength(50);
  for (const plant of ranked.filter((entry) => entry.verifiedCare)) {
    expect(new Set(plant.verifiedCare?.sources.map((source) => new URL(source).hostname)).size)
      .toBeGreaterThanOrEqual(2);
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
