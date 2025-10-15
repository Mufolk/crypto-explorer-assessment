import { NextRequest } from 'next/server'
import { GET as getAssets } from '@/app/api/assets/route'
import { GET as getFavorites, POST as postFavorites, DELETE as deleteFavorites } from '@/app/api/favorites/route'

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: [],
        error: null,
      })),
    })),
    insert: jest.fn(() => ({
      data: { id: 'test-id', client_id: 'test-user', asset_id: 'bitcoin' },
      error: null,
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
  })),
}))

// Mock fetch for CoinGecko API
global.fetch = jest.fn()

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('/api/assets', () => {
    it('returns cached data when available', async () => {
      const mockData = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://example.com/bitcoin.png',
          current_price: 45000,
          price_change_percentage_24h: 2.5,
        },
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const request = new NextRequest('http://localhost:3000/api/assets')
      const response = await getAssets(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.source).toBe('network')
      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe('bitcoin')
    })

    it('handles API errors gracefully', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

      const request = new NextRequest('http://localhost:3000/api/assets')
      const response = await getAssets(request)

      expect(response.status).toBe(500)
    })
  })

  describe('/api/favorites', () => {
    it('GET returns user favorites', async () => {
      const request = new NextRequest('http://localhost:3000/api/favorites?userId=test-user')
      const response = await getFavorites(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
    })

    it('POST adds asset to favorites', async () => {
      const request = new NextRequest('http://localhost:3000/api/favorites', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'test-user',
          assetId: 'bitcoin',
        }),
      })

      const response = await postFavorites(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('DELETE removes asset from favorites', async () => {
      const request = new NextRequest('http://localhost:3000/api/favorites', {
        method: 'DELETE',
        body: JSON.stringify({
          userId: 'test-user',
          assetId: 'bitcoin',
        }),
      })

      const response = await deleteFavorites(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('validates required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/favorites', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'test-user',
          // Missing assetId
        }),
      })

      const response = await postFavorites(request)

      expect(response.status).toBe(400)
    })
  })
})
