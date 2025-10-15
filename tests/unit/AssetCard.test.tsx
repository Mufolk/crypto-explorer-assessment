import { render, screen, fireEvent } from '@testing-library/react'
import { AssetCard } from '@/components/features/crypto/AssetCard'
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

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <FavoritesProvider>
      {component}
    </FavoritesProvider>
  )
}

describe('AssetCard', () => {
  it('renders asset information correctly', () => {
    renderWithProvider(<AssetCard asset={mockAsset} />)
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('BTC')).toBeInTheDocument()
    expect(screen.getByText('$45,000.00')).toBeInTheDocument()
    expect(screen.getByText('+2.50%')).toBeInTheDocument()
  })

  it('displays positive change in green', () => {
    renderWithProvider(<AssetCard asset={mockAsset} />)
    
    const changeElement = screen.getByText('+2.50%')
    expect(changeElement).toHaveClass('text-green-600')
  })

  it('displays negative change in red', () => {
    const negativeAsset = { ...mockAsset, changePercent24Hr: -1.5 }
    renderWithProvider(<AssetCard asset={negativeAsset} />)
    
    const changeElement = screen.getByText('-1.50%')
    expect(changeElement).toHaveClass('text-red-600')
  })

  it('renders asset image with correct alt text', () => {
    renderWithProvider(<AssetCard asset={mockAsset} />)
    
    const image = screen.getByAltText('Bitcoin logo')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/bitcoin.png')
  })

  it('handles click events', () => {
    const mockOnClick = jest.fn()
    renderWithProvider(<AssetCard asset={mockAsset} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button')
    fireEvent.click(card)
    
    expect(mockOnClick).toHaveBeenCalledWith(mockAsset)
  })
})
