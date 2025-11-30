import { test, expect } from '@playwright/test';

test.describe('Basic Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/Architecturium/i);
  });

  test('should display frontend view by default', async ({ page }) => {
    const frontendButton = page.getByText('Frontend');
    await expect(frontendButton).toBeVisible();
  });

  test('should switch between frontend and backend views', async ({ page }) => {
    const backendButton = page.getByText('Backend');
    await backendButton.click();
    
    await expect(page.getByText('Backend')).toBeVisible();
    await expect(page.getByText('Серверная часть')).toBeVisible();
  });

  test('should open technology picker on click', async ({ page }) => {
    // Click on the view area to open picker
    const viewWrapper = page.locator('.view-wrapper').first();
    await viewWrapper.click({ position: { x: 100, y: 100 } });
    
    // Wait for picker to appear
    const picker = page.locator('.picker-container');
    await expect(picker).toBeVisible();
  });

  test('should display metrics panel', async ({ page }) => {
    const metricsPanel = page.locator('.metrics-panel');
    await expect(metricsPanel).toBeVisible();
    await expect(metricsPanel.getByText('Параметры проекта')).toBeVisible();
  });

  test('should show empty metrics initially', async ({ page }) => {
    const performanceMetric = page.getByText('Производительность');
    await expect(performanceMetric).toBeVisible();
  });
});

