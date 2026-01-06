import { useEffect, useRef, useState } from 'react'
import { View, Smartphone, RotateCcw, ZoomIn, ZoomOut, Maximize2, Box, ExternalLink } from 'lucide-react'

// model-viewer web component'ini import et
import '@google/model-viewer'

// Sketchfab Fuar Standı Modelleri (Ücretsiz CC-BY lisanslı)
const SKETCHFAB_BOOTHS = {
  // Exhibition Booth Model by muxhtaq
  exhibition1: 'b5db4e32f8c64c93ba88666f1d417ab3',
  // 3D Exhibition Booth Design by alirezamoarrefi
  exhibition2: 'bfb2728b9e2b4b778f03b7019e1d9402',
  // Kiosk Design
  kiosk: '646118f72f024595afc751d388a831ff',
  // Exhibition Booth by ulineila10
  exhibition3: '9efeeff019a44bd493e028fc69c8ddf6'
}

// Varsayılan Sketchfab model ID
const DEFAULT_SKETCHFAB_ID = SKETCHFAB_BOOTHS.exhibition1

export default function ARBoothViewer({
  modelUrl,        // GLB model URL (opsiyonel)
  sketchfabId,     // Sketchfab model ID (opsiyonel)
  posterUrl,
  companyName = 'Sanal Stant',
  useSketchfab = true, // Varsayılan olarak Sketchfab kullan
  onARStart,
  onAREnd
}) {
  const modelViewerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [arSupported, setArSupported] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Sketchfab mı yoksa model-viewer mı kullanılacak?
  const useSketchfabViewer = useSketchfab && !modelUrl

  // Sketchfab embed URL'i
  const sketchfabEmbedUrl = `https://sketchfab.com/models/${sketchfabId || DEFAULT_SKETCHFAB_ID}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0`

  useEffect(() => {
    if (!useSketchfabViewer) {
      const modelViewer = modelViewerRef.current
      if (modelViewer) {
        modelViewer.addEventListener('load', () => setIsLoading(false))
        modelViewer.addEventListener('ar-status', (event) => {
          if (event.detail.status === 'session-started') onARStart?.()
          else if (event.detail.status === 'not-presenting') onAREnd?.()
        })
        if (modelViewer.canActivateAR) setArSupported(true)
      }
    } else {
      // Sketchfab iframe yüklendiğinde
      setTimeout(() => setIsLoading(false), 2000)
    }
  }, [useSketchfabViewer, onARStart, onAREnd])

  const handleReset = () => {
    if (!useSketchfabViewer && modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = '0deg 75deg 105%'
      modelViewerRef.current.fieldOfView = '30deg'
    }
  }

  const handleZoomIn = () => {
    if (!useSketchfabViewer && modelViewerRef.current) {
      const currentFov = parseFloat(modelViewerRef.current.fieldOfView)
      modelViewerRef.current.fieldOfView = `${Math.max(10, currentFov - 5)}deg`
    }
  }

  const handleZoomOut = () => {
    if (!useSketchfabViewer && modelViewerRef.current) {
      const currentFov = parseFloat(modelViewerRef.current.fieldOfView)
      modelViewerRef.current.fieldOfView = `${Math.min(60, currentFov + 5)}deg`
    }
  }

  const toggleFullscreen = () => {
    const container = document.getElementById('ar-viewer-container')
    if (!document.fullscreenElement) {
      container?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div
      id="ar-viewer-container"
      className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white text-sm">3D Fuar Standı Yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Sketchfab Embed Viewer */}
      {useSketchfabViewer ? (
        <iframe
          title={`${companyName} 3D Fuar Standı`}
          src={sketchfabEmbedUrl}
          style={{
            width: '100%',
            height: isFullscreen ? '100vh' : '450px',
            border: 'none'
          }}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        /* model-viewer for custom GLB models */
        <model-viewer
          ref={modelViewerRef}
          src={modelUrl}
          poster={posterUrl}
          alt={`${companyName} 3D Stant Görünümü`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          auto-rotate-delay="3000"
          rotation-per-second="30deg"
          interaction-prompt="auto"
          shadow-intensity="1"
          shadow-softness="1"
          exposure="1"
          environment-image="neutral"
          camera-orbit="0deg 75deg 105%"
          min-camera-orbit="auto auto 50%"
          max-camera-orbit="auto auto 200%"
          field-of-view="30deg"
          style={{
            width: '100%',
            height: isFullscreen ? '100vh' : '450px',
            backgroundColor: 'transparent'
          }}
        >
          <button
            slot="ar-button"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg"
          >
            <Smartphone className="w-5 h-5" />
            AR'da Görüntüle
          </button>
        </model-viewer>
      )}

      {/* Controls - Sadece model-viewer için */}
      {!useSketchfabViewer && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button onClick={handleZoomIn} className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20" title="Yakınlaştır">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button onClick={handleZoomOut} className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20" title="Uzaklaştır">
            <ZoomOut className="w-5 h-5" />
          </button>
          <button onClick={handleReset} className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20" title="Görünümü Sıfırla">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
        title="Tam Ekran"
      >
        <Maximize2 className="w-5 h-5" />
      </button>

      {/* Info Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
        <Box className="w-4 h-4 text-purple-400" />
        <span className="text-white text-sm font-medium">3D Fuar Standı</span>
      </div>

      {/* AR Support Badge - Sadece model-viewer için */}
      {!useSketchfabViewer && arSupported && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30">
          <View className="w-4 h-4 text-green-400" />
          <span className="text-green-300 text-xs font-medium">AR Destekleniyor</span>
        </div>
      )}

      {/* Sketchfab için kaynak linki */}
      {useSketchfabViewer && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-lg">
          <a
            href={`https://sketchfab.com/3d-models/${sketchfabId || DEFAULT_SKETCHFAB_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white/70 hover:text-white text-xs"
          >
            <ExternalLink className="w-3 h-3" />
            Sketchfab'da Görüntüle
          </a>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs text-center">
        <p>Fare ile döndürün • Scroll ile yakınlaştırın</p>
      </div>
    </div>
  )
}
