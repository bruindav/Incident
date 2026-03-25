// src/components/LocatieKaart.jsx // V1
import React, { useEffect, useRef, useState } from 'react'

// Dynamisch Leaflet laden (vermijdt SSR issues)
let L = null

export default function LocatieKaart({ selectedCoords, onSelect, height = '100%' }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)
  const markerRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {
      if (!L) {
        L = await import('leaflet')
        // Fix Leaflet marker icon issues in Vite
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })
      }

      if (instanceRef.current || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: selectedCoords || [52.3, 5.0],
        zoom: selectedCoords ? 13 : 8,
        zoomControl: true,
      })

      // RWS BRT Achtergrondkaart (Rijkswaterstaat / PDOK)
      L.tileLayer(
        'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:3857/{z}/{x}/{y}.png',
        {
          attribution: '© <a href="https://www.rijkswaterstaat.nl">Rijkswaterstaat</a> | <a href="https://www.pdok.nl">PDOK</a>',
          maxZoom: 19,
          opacity: 0.85,
        }
      ).addTo(map)

      // Vaarwegen WMS laag van Rijkswaterstaat
      L.tileLayer.wms(
        'https://geo.rijkswaterstaat.nl/services/ogc/gdr/nwb_vaarwegen/ows',
        {
          layers: 'vaarwegvakken',
          format: 'image/png',
          transparent: true,
          version: '1.3.0',
          opacity: 0.6,
          attribution: '© Rijkswaterstaat NWB Vaarwegen',
        }
      ).addTo(map)

      // Klik-handler
      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        placeMarker(map, [lat, lng])

        // Reverse geocode via PDOK
        reverseGeocode(lat, lng).then(naam => {
          if (onSelect) onSelect([lat, lng], naam)
        })
      })

      instanceRef.current = map
      setReady(true)

      // Initieel marker als coords bekend
      if (selectedCoords) {
        placeMarker(map, selectedCoords)
      }
    }

    init()

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  // Bijwerken bij nieuwe geselecteerde coords
  useEffect(() => {
    if (!ready || !instanceRef.current) return
    if (selectedCoords) {
      placeMarker(instanceRef.current, selectedCoords)
      instanceRef.current.setView(selectedCoords, 13)
    }
  }, [selectedCoords, ready])

  function placeMarker(map, coords) {
    if (markerRef.current) {
      markerRef.current.setLatLng(coords)
    } else {
      const yellowIcon = L.divIcon({
        html: `<div style="
          width:20px;height:20px;
          background:var(--accent-yellow,#f5c842);
          border:3px solid #fff;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.5)
        "></div>`,
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 20],
      })
      markerRef.current = L.marker(coords, { icon: yellowIcon }).addTo(map)
    }
  }

  async function reverseGeocode(lat, lng) {
    try {
      const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?X=${lng}&Y=${lat}&rows=1&distance=500`
      const resp = await fetch(url)
      if (!resp.ok) return null
      const data = await resp.json()
      const doc = data.response?.docs?.[0]
      return doc?.weergavenaam || null
    } catch {
      return null
    }
  }

  return (
    <div style={{ width: '100%', height }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
