import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FavoriteButton } from '@/components/features/crypto/FavoriteButton'
import { FavoritesProvider } from '@/contexts/FavoritesContext'

const mockAsset = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.com/bitcoin.png',
  priceUsd: 45000,
  changePercent24Hr: 2.5,
  marketCapUsd: 850000000000,
  volumeUsd24Hr: 25000000000,
  supply: 19500000,
  maxSupply: 21000000,
  vwap24Hr: 44800,
}

// Mock fetch
global.fetch = jest.fn()

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <FavoritesProvider>
      {component}
    </FavoritesProvider>
  )
}

describe('FavoriteButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders as not favorited initially', () => {
    renderWithProvider(<FavoriteButton asset={mockAsset} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Add to favorites')
  })

  it('toggles favorite status on click', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    renderWithProvider(<FavoriteButton asset={mockAsset} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: expect.any(String),
          assetId: 'bitcoin',
        }),
      })
    })
  })

  it('handles API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    renderWithProvider(<FavoriteButton asset={mockAsset} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Should not throw error
    await waitFor(() => {
      expect(button).toBeInTheDocument()
    })
  })

  it('shows loading state during API call', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    ;(fetch as jest.Mock).mockReturnValueOnce(promise)

    renderWithProvider(<FavoriteButton asset={mockAsset} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Should show loading state
    expect(button).toBeDisabled()
    
    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
    
    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })
})
