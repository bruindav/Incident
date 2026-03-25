// src/hooks/useRwsLocatie.js // V1
import { useState, useCallback, useRef } from 'react'

// Rijkswaterstaat / PDOK locatieserver voor vaarwegen, sluizen, bruggen
const PDOK_SUGGEST_URL = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest'
const PDOK_LOOKUP_URL = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup'

// RWS Vaarwegmarkeringen / NWBW API (waterways network)
const RWS_NWB_WFS = 'https://geo.rijkswaterstaat.nl/services/ogc/gdr/nwb_vaarwegen/ows'

// Aanvullende bekende vaarwegobjecten als fallback
const KNOWN_OBJECTS = [
  { id: 'k001', naam: 'Doorslagsluis', type: 'Sluis', coords: [52.2833, 4.9167], regio: 'Utrecht' },
  { id: 'k002', naam: 'Prinses Beatrixsluis', type: 'Sluis', coords: [52.0667, 5.0167], regio: 'Utrecht' },
  { id: 'k003', naam: 'Julianasluis', type: 'Sluis', coords: [52.1833, 4.8833], regio: 'Zuid-Holland' },
  { id: 'k004', naam: 'Westersluis', type: 'Sluis', coords: [52.3728, 4.8833], regio: 'Noord-Holland' },
  { id: 'k005', naam: 'Oranjesluis', type: 'Sluis', coords: [52.3956, 4.9167], regio: 'Noord-Holland' },
  { id: 'k006', naam: 'Loenersluis', type: 'Sluis', coords: [52.2167, 5.0167], regio: 'Utrecht' },
  { id: 'k007', naam: 'Amsterdam-Rijnkanaal', type: 'Vaarweg', coords: [52.3, 5.0], regio: 'Noord-Holland' },
  { id: 'k008', naam: 'Noordzeekanaal', type: 'Vaarweg', coords: [52.4333, 4.75], regio: 'Noord-Holland' },
  { id: 'k009', naam: 'Merwedekanaal', type: 'Vaarweg', coords: [52.0, 5.0], regio: 'Utrecht' },
  { id: 'k010', naam: 'Nieuwe Waterweg', type: 'Vaarweg', coords: [51.9, 4.2], regio: 'Zuid-Holland' },
  { id: 'k011', naam: 'Hollandsch Diep', type: 'Vaarweg', coords: [51.7167, 4.5], regio: 'Noord-Brabant' },
  { id: 'k012', naam: 'Brug Alphen a/d Rijn', type: 'Brug', coords: [52.1222, 4.6572], regio: 'Zuid-Holland' },
  { id: 'k013', naam: 'Wilhelminabrug Leiden', type: 'Brug', coords: [52.1578, 4.4911], regio: 'Zuid-Holland' },
  { id: 'k014', naam: 'Haringvlietbrug', type: 'Brug', coords: [51.7417, 4.4], regio: 'Zuid-Holland' },
  { id: 'k015', naam: 'Moerdijkbrug', type: 'Brug', coords: [51.7, 4.6167], regio: 'Noord-Brabant' },
  { id: 'k016', naam: 'Volkeraksluizen', type: 'Sluis', coords: [51.65, 4.3667], regio: 'Noord-Brabant' },
  { id: 'k017', naam: 'Krammersluizen', type: 'Sluis', coords: [51.65, 4.1833], regio: 'Zeeland' },
  { id: 'k018', naam: 'IJsselmeer', type: 'Vaarweg', coords: [52.75, 5.3], regio: 'Flevoland' },
  { id: 'k019', naam: 'Afsluitdijk', type: 'Kunstwerk', coords: [53.05, 5.2], regio: 'Friesland' },
  { id: 'k020', naam: 'Den Oeversluis', type: 'Sluis', coords: [52.9333, 5.0417], regio: 'Noord-Holland' },
]

export function useRwsLocatie() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  const search = useCallback((query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query || query.length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        // Combineer lokale bekende objecten met PDOK-zoekresultaten
        const localResults = KNOWN_OBJECTS.filter(obj =>
          obj.naam.toLowerCase().includes(query.toLowerCase()) ||
          obj.type.toLowerCase().includes(query.toLowerCase())
        ).map(obj => ({
          id: obj.id,
          naam: obj.naam,
          volledigeNaam: `${obj.naam} - ${obj.regio}`,
          type: obj.type,
          coords: obj.coords,
          bron: 'RWS',
        }))

        // PDOK Locatieserver aanroepen
        const pdokUrl = `${PDOK_SUGGEST_URL}?q=${encodeURIComponent(query)}&rows=8&fl=id,weergavenaam,type,centroide_ll&fq=type:(kunstwerk+waterlichaam+weg)`
        const resp = await fetch(pdokUrl)

        let pdokResults = []
        if (resp.ok) {
          const data = await resp.json()
          pdokResults = (data.response?.docs || [])
            .filter(d => d.weergavenaam)
            .map(d => {
              let coords = null
              if (d.centroide_ll) {
                const match = d.centroide_ll.match(/POINT\(([^ ]+) ([^)]+)\)/)
                if (match) coords = [parseFloat(match[2]), parseFloat(match[1])]
              }
              return {
                id: d.id,
                naam: d.weergavenaam,
                volledigeNaam: d.weergavenaam,
                type: d.type || 'Object',
                coords,
                bron: 'PDOK',
              }
            })
        }

        // Dedupliceer en combineer
        const combined = [...localResults]
        for (const pr of pdokResults) {
          if (!combined.some(r => r.naam.toLowerCase() === pr.naam.toLowerCase())) {
            combined.push(pr)
          }
        }

        setResults(combined.slice(0, 12))
      } catch (err) {
        // Bij fout: toon alleen lokale resultaten
        const local = KNOWN_OBJECTS.filter(obj =>
          obj.naam.toLowerCase().includes(query.toLowerCase())
        ).map(obj => ({
          id: obj.id,
          naam: obj.naam,
          volledigeNaam: `${obj.naam} - ${obj.regio}`,
          type: obj.type,
          coords: obj.coords,
          bron: 'RWS',
        }))
        setResults(local)
      } finally {
        setLoading(false)
      }
    }, 280)
  }, [])

  const clear = useCallback(() => setResults([]), [])

  return { results, loading, search, clear }
}
