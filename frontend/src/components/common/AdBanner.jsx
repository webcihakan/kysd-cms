import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '')

export default function AdBanner({ code, className = '', wrapperClassName = '' }) {
  const [ad, setAd] = useState(null)
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAd()
  }, [code])

  const fetchAd = async () => {
    try {
      console.log('AdBanner: Fetching ad for code:', code)

      // Önce pozisyon bilgisini al
      const posRes = await api.get(`/ad-positions/code/${code}`)
      console.log('AdBanner: Position response:', posRes.data)
      setPosition(posRes.data)

      // Sonra bu pozisyondaki aktif reklamı al
      const adRes = await api.get(`/advertisements/position/${code}`)
      console.log('AdBanner: Advertisement response:', adRes.data)

      if (adRes.data && adRes.data.length > 0) {
        setAd(adRes.data[0])
        console.log('AdBanner: Ad set:', adRes.data[0])
      } else {
        console.log('AdBanner: No active ads found')
      }
    } catch (error) {
      console.error('AdBanner: Error loading ad:', code, error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    console.log('AdBanner: Loading...', code)
    return null
  }

  // Pozisyon yoksa veya aktif değilse gösterme
  if (!position || !position.isActive) {
    console.log('AdBanner: Position not active or not found', code, position)
    return null
  }

  console.log('AdBanner: Rendering for', code, 'Ad:', ad, 'Position:', position)

  // Reklam varsa göster
  if (ad && ad.imageDesktop) {
    console.log('AdBanner: Rendering image:', `${API_URL}${ad.imageDesktop}`)
    const content = (
      <img
        src={`${API_URL}${ad.imageDesktop}`}
        alt={ad.name || 'Reklam'}
        className="w-full h-auto object-contain"
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    )

    const innerContent = (
      <div className={`flex justify-center ${wrapperClassName}`}>
        {ad.link ? (
          <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    )

    if (className) {
      return (
        <div className={className}>
          {innerContent}
        </div>
      )
    }

    return innerContent
  }

  // Reklam yoksa placeholder göster
  const placeholder = (
    <div className={`flex justify-center ${wrapperClassName}`}>
      <Link
        to="/iletisim?subject=Reklam%20Başvurusu"
        className="block group"
        title="Reklam vermek için iletişime geçin"
      >
        <div
          className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center hover:border-primary-400 hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 transition-all duration-300 cursor-pointer"
          style={{
            width: Math.min(position.width, typeof window !== 'undefined' ? window.innerWidth - 32 : position.width),
            height: position.height,
            maxWidth: '100%'
          }}
        >
          <div className="text-center px-4">
            <p className="text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium text-sm mb-1">
              Bu alana reklam verebilirsiniz
            </p>
            <p className="text-gray-400 dark:text-gray-500 group-hover:text-primary-500 text-xs">
              {position.width} x {position.height} px
            </p>
            {position.priceMonthly && (
              <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm mt-2">
                Aylık {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(position.priceMonthly)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )

  if (className) {
    return (
      <div className={className}>
        {placeholder}
      </div>
    )
  }

  return placeholder
}

// Basit placeholder versiyonu - API çağrısı yapmadan
export function AdPlaceholder({ width, height, price, className = '' }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Link
        to="/iletisim"
        className="block group"
        title="Reklam vermek için iletişime geçin"
      >
        <div
          className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-400 hover:from-primary-50 hover:to-primary-100 transition-all duration-300 cursor-pointer"
          style={{
            width: Math.min(width, typeof window !== 'undefined' ? window.innerWidth - 32 : width),
            height: height,
            maxWidth: '100%'
          }}
        >
          <div className="text-center px-4">
            <p className="text-gray-500 group-hover:text-primary-600 font-medium text-sm mb-1">
              Bu alana reklam verebilirsiniz
            </p>
            <p className="text-gray-400 group-hover:text-primary-500 text-xs">
              {width} x {height} px
            </p>
            {price && (
              <p className="text-primary-600 font-semibold text-sm mt-2">
                Aylık {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
