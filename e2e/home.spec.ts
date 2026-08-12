import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("home page renders the learning levels and opens a route", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  await expect(page.getByText("Noras Pokédex")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Level 6: Kalos" })).toBeVisible();
  await expect(page.getByText("Pallet Town")).toBeVisible();
  await expect(page.getByText("0 / 72 badges optjent")).toBeVisible();

  await page.getByRole("button", { name: /Pallet Town/ }).click();
  await expect(page.getByText("Rute 1 · Vælg en øvelse")).toBeVisible();
  await expect(page.getByText("Fang Ordet!")).toBeVisible();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("level tabs remain reachable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const kalosTab = page.getByRole("tab", { name: "Level 6: Kalos" });
  await kalosTab.scrollIntoViewIfNeeded();
  await expect(kalosTab).toBeVisible();
  await kalosTab.click();
  await expect(page.getByText("Vaniville Town")).toBeVisible();
  await expect(page.getByText("Kalos Liga")).toBeVisible();
});
