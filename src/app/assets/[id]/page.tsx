'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { FavoriteButton } from '@/components/features/crypto/FavoriteButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { ListedAsset } from '@/types/crypto'

interface AssetDetails extends ListedAsset {
  description: string
  marketCapUsd: number
  volumeUsd24Hr: number
  supply: number
  maxSupply: number | null
  ath: number
  athChangePercent: number
  atl: number
  atlChangePercent: number
  priceChange24h: number
  priceChangePercentage24h: number
  priceChangePercentage7d: number
  priceChangePercentage14d: number
  priceChangePercentage30d: number
  priceChangePercentage60d: number
  priceChangePercentage200d: number
  priceChangePercentage1y: number
}

export default function AssetDetailsPage() {
  const params = useParams()
  const assetId = params.id as string
  const [asset, setAsset] = useState<AssetDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${assetId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch asset details')
        }

        const data = await response.json()
        
        const assetDetails: AssetDetails = {
          id: data.id,
          symbol: data.symbol,
          name: data.name,
          image: data.image.large,
          priceUsd: data.market_data.current_price.usd,
          changePercent24Hr: data.market_data.price_change_percentage_24h,
          marketCapUsd: data.market_data.market_cap.usd,
          volumeUsd24Hr: data.market_data.total_volume.usd,
          supply: data.market_data.circulating_supply,
          maxSupply: data.market_data.max_supply,
          description: data.description.en,
          ath: data.market_data.ath.usd,
          athChangePercent: data.market_data.ath_change_percentage.usd,
          atl: data.market_data.atl.usd,
          atlChangePercent: data.market_data.atl_change_percentage.usd,
          priceChange24h: data.market_data.price_change_24h,
          priceChangePercentage24h: data.market_data.price_change_percentage_24h,
          priceChangePercentage7d: data.market_data.price_change_percentage_7d,
          priceChangePercentage14d: data.market_data.price_change_percentage_14d,
          priceChangePercentage30d: data.market_data.price_change_percentage_30d,
          priceChangePercentage60d: data.market_data.price_change_percentage_60d,
          priceChangePercentage200d: data.market_data.price_change_percentage_200d,
          priceChangePercentage1y: data.market_data.price_change_percentage_1y,
        }

        setAsset(assetDetails)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (assetId) {
      fetchAssetDetails()
    }
  }, [assetId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorState message={error || 'Asset not found'} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={asset.image || '/placeholder.png'}
                alt={`${asset.name} logo`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{asset.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 uppercase">{asset.symbol}</p>
              </div>
            </div>
            <FavoriteButton 
              assetId={asset.id}
              isFavorite={false}
              onToggle={async () => {}}
            />
          </div>
        </div>

        {/* Price and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current Price</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${asset.priceUsd.toLocaleString()}</p>
            <p className={`text-sm ${asset.changePercent24Hr >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {asset.changePercent24Hr >= 0 ? '+' : ''}{asset.changePercent24Hr.toFixed(2)}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Market Cap</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(asset.marketCapUsd / 1e9).toFixed(2)}B
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">24h Volume</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(asset.volumeUsd24Hr / 1e6).toFixed(2)}M
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Circulating Supply</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {asset.supply.toLocaleString()}
            </p>
            {asset.maxSupply && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Max: {asset.maxSupply.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* All Time High/Low */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">All Time High</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${asset.ath.toLocaleString()}</p>
            <p className="text-sm text-red-600 dark:text-red-400">
              {asset.athChangePercent.toFixed(2)}% from ATH
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">All Time Low</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${asset.atl.toLocaleString()}</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {asset.atlChangePercent.toFixed(2)}% from ATL
            </p>
          </div>
        </div>

        {/* Price Changes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Changes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">24h</p>
              <p className={`font-semibold ${asset.priceChangePercentage24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {asset.priceChangePercentage24h >= 0 ? '+' : ''}{asset.priceChangePercentage24h.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">7d</p>
              <p className={`font-semibold ${asset.priceChangePercentage7d >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {asset.priceChangePercentage7d >= 0 ? '+' : ''}{asset.priceChangePercentage7d.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">30d</p>
              <p className={`font-semibold ${asset.priceChangePercentage30d >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {asset.priceChangePercentage30d >= 0 ? '+' : ''}{asset.priceChangePercentage30d.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">1y</p>
              <p className={`font-semibold ${asset.priceChangePercentage1y >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {asset.priceChangePercentage1y >= 0 ? '+' : ''}{asset.priceChangePercentage1y.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About {asset.name}</h3>
          <div 
            className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white prose-strong:text-gray-900 dark:prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: asset.description }}
          />
        </div>
      </div>
    </div>
  )
}
