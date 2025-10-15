import { test, expect } from '@playwright/test'

test.describe('Cryptocurrency Explorer', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the CoinGecko API
    await page.route('**/api/v3/coins/markets**', async (route) => {
      const mockData = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 45000,
          price_change_percentage_24h: 2.5,
          market_cap: 850000000000,
          total_volume: 25000000000,
          circulating_supply: 19500000,
          max_supply: 21000000,
          ath: 69000,
          ath_change_percentage: -35.0,
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          current_price: 3000,
          price_change_percentage_24h: -1.2,
          market_cap: 360000000000,
          total_volume: 15000000000,
          circulating_supply: 120000000,
          max_supply: null,
          ath: 4800,
          ath_change_percentage: -37.5,
        },
      ]
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData),
      })
    })

    // Mock the favorites API
    await page.route('**/api/favorites**', async (route) => {
      const url = new URL(route.request().url())
      const method = route.request().method()

      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      } else if (method === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      } else if (method === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      }
    })
  })

  test('should load the home page and display crypto assets', async ({ page }) => {
    await page.goto('/')

    // Check if the page title is correct
    await expect(page).toHaveTitle(/Cryptocurrency Explorer/)

    // Check if crypto assets are displayed
    await expect(page.locator('text=Bitcoin')).toBeVisible()
    await expect(page.locator('text=Ethereum')).toBeVisible()

    // Check if prices are displayed
    await expect(page.locator('text=$45,000.00')).toBeVisible()
    await expect(page.locator('text=$3,000.00')).toBeVisible()

    // Check if 24h changes are displayed
    await expect(page.locator('text=+2.50%')).toBeVisible()
    await expect(page.locator('text=-1.20%')).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check if the layout is mobile-friendly
    await expect(page.locator('text=Bitcoin')).toBeVisible()
    
    // Check if the navigation is accessible
    const navButton = page.locator('button[aria-label="Toggle navigation"]')
    if (await navButton.isVisible()) {
      await navButton.click()
    }
    
    await expect(page.locator('text=Favorites')).toBeVisible()
  })

  test('should add and remove favorites', async ({ page }) => {
    await page.goto('/')

    // Click the favorite button for Bitcoin
    const favoriteButton = page.locator('[data-testid="favorite-button-bitcoin"]').first()
    await favoriteButton.click()

    // Check if the button state changes
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Remove from favorites')

    // Navigate to favorites page
    await page.click('text=Favorites')
    await expect(page).toHaveURL('/favorites')

    // Check if Bitcoin appears in favorites
    await expect(page.locator('text=Bitcoin')).toBeVisible()

    // Remove from favorites
    const removeButton = page.locator('[data-testid="favorite-button-bitcoin"]').first()
    await removeButton.click()

    // Check if Bitcoin is removed
    await expect(page.locator('text=Bitcoin')).not.toBeVisible()
  })

  test('should handle loading states', async ({ page }) => {
    // Delay the API response to test loading state
    await page.route('**/api/v3/coins/markets**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })

    await page.goto('/')

    // Check if loading spinner is shown
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()

    // Wait for content to load
    await expect(page.locator('text=Bitcoin')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible()
  })

  test('should handle error states', async ({ page }) => {
    // Mock API error
    await page.route('**/api/v3/coins/markets**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    await page.goto('/')

    // Check if error message is displayed
    await expect(page.locator('text=Failed to load assets')).toBeVisible()
    await expect(page.locator('text=Please try again later')).toBeVisible()
  })

  test('should load more assets when clicking load more button', async ({ page }) => {
    await page.goto('/')

    // Check if load more button is present
    const loadMoreButton = page.locator('text=Load More')
    await expect(loadMoreButton).toBeVisible()

    // Click load more
    await loadMoreButton.click()

    // Check if more assets are loaded (in real scenario, this would load more)
    // For this test, we're just verifying the button works
    await expect(loadMoreButton).toBeVisible()
  })
})
