import { act, renderHook } from "@testing-library/react";
import { addDays, format } from "date-fns";
import { afterEach, expect, it, vi } from "vitest";
import { GardenProvider, useGarden } from "@/context/GardenContext";

afterEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

it("restores garden and schedule changes across reloads and keeps care recurring", () => {
  const today = new Date(2026, 5, 15, 12);
  vi.useFakeTimers();
  vi.setSystemTime(today);

  const wrapper = GardenProvider;
  const garden = renderHook(useGarden, { wrapper });
  expect(garden.result.current.gardenPlants).toEqual([]);

  act(() => {
    garden.result.current.addPlant("p1", "Front yard");
    garden.result.current.setCadence("monthly");
    garden.result.current.setPreferredDay(2);
  });
  const plantId = garden.result.current.gardenPlants[0].id;
  const wateringId = `${plantId}-water`;
  act(() => garden.result.current.completeTask(wateringId));
  garden.unmount();

  const reloaded = renderHook(useGarden, { wrapper });
  expect(reloaded.result.current.gardenPlants[0]).toMatchObject({
    id: plantId,
    zone: "Front yard",
    lastWatered: "2026-06-15",
  });
  expect(reloaded.result.current.cadence).toBe("monthly");
  expect(reloaded.result.current.preferredDay).toBe(2);
  expect(reloaded.result.current.tasks.find((task) => task.id === wateringId)?.completed).toBe(true);
  reloaded.unmount();

  vi.setSystemTime(addDays(today, 7));
  const later = renderHook(useGarden, { wrapper });
  expect(later.result.current.todayTasks).toContainEqual(expect.objectContaining({
    id: wateringId,
    dueDate: format(addDays(today, 7), "yyyy-MM-dd"),
    completed: false,
  }));

  act(() => later.result.current.removePlant(plantId));
  later.unmount();
  expect(renderHook(useGarden, { wrapper }).result.current.gardenPlants).toEqual([]);
});
