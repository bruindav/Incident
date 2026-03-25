// src/components/LocatieDropdown.jsx // V1
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Search, X, Navigation, Anchor } from 'lucide-react'
import { useRwsLocatie } from '../hooks/useRwsLocatie'
import LocatieKaart from './LocatieKaart'

const TYPE_ICON = {
  'Sluis': '🔒',
  'Brug': '🌉',
  'Vaarweg': '⚓',
  'Kunstwerk': '🏗️',
  'waterlichaam': '💧',
  'kunstwerkdeel': '🏗️',
  'default': '📍',
}

export default function LocatieDropdown({ value, onChange, placeholder = 'Zoek vaarweg, sluis of brug...' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value?.naam || '')
  const [showKaart, setShowKaart] = useState(false)
  const { results, loading, search, clear } = useRwsLocatie()
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (value?.naam && query !== value.naam) setQuery(value.naam)
  }, [value?.naam])

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
        setShowKaart(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleInput(e) {
    const val = e.target.value
    setQuery(val)
    setOpen(true)
    search(val)
    if (!val) onChange(null)
  }

  function handleSelect(item) {
    setQuery(item.volledigeNaam || item.naam)
    onChange(item)
    setOpen(false)
    clear()
  }

  function handleClear() {
    setQuery('')
    onChange(null)
    clear()
    setOpen(false)
    inputRef.current?.focus()
  }

  function handleKaartSelect(coords, naam) {
    const item = { id: 'map_pick', naam: naam || `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`, volledigeNaam: naam || `Kaartpunt (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`, type: 'Kaartpunt', coords, bron: 'Kaart' }
    setQuery(item.volledigeNaam)
    onChange(item)
    setShowKaart(false)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }} ref={wrapRef}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'var(--bg-base)', border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-md)', padding: '0 10px',
        transition: 'border-color 0.15s',
        ...(open ? { borderColor: 'var(--accent-yellow)' } : {})
      }}>
        <Search size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={handleInput}
          onFocus={() => { if (query) { setOpen(true); search(query) } }}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-primary)', padding: '8px 0', fontSize: 13,
          }}
        />
        {loading && (
          <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--border-strong)', borderTopColor: 'var(--accent-yellow)', animation: 'spin 0.6s linear infinite', flexShrink: 0 }} />
        )}
        {query && (
          <button onClick={handleClear} style={{ color: 'var(--text-muted)', display: 'flex', padding: 2 }}>
            <X size={13} />
          </button>
        )}
        <button
          onClick={() => { setShowKaart(!showKaart); setOpen(false) }}
          title="Aanwijzen op kaart"
          style={{
            display: 'flex', alignItems: 'center', padding: '4px 6px',
            borderRadius: 'var(--radius-sm)', marginLeft: 2,
            color: showKaart ? 'var(--accent-yellow)' : 'var(--text-muted)',
            background: showKaart ? 'var(--accent-yellow-dim)' : 'transparent',
            transition: 'all 0.15s',
          }}
        >
          <MapPin size={13} />
        </button>
      </div>

      {/* Dropdown resultaten */}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
          marginTop: 4,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)', overflow: 'hidden',
          boxShadow: 'var(--shadow-elevated)',
          maxHeight: 280, overflowY: 'auto',
        }}>
          {results.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{
                width: '100%', textAlign: 'left', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: '1px solid var(--border)',
                background: 'transparent', cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>
                {TYPE_ICON[item.type] || TYPE_ICON.default}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.naam}
                </div>
                {item.volledigeNaam !== item.naam && (
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 1 }}>{item.volledigeNaam.replace(item.naam, '').replace(/^[,\s-]+/, '')}</div>
                )}
              </div>
              <span style={{
                fontSize: 10, padding: '2px 6px', borderRadius: 3,
                background: item.bron === 'RWS' ? 'var(--accent-blue-dim)' : 'var(--bg-hover)',
                color: item.bron === 'RWS' ? 'var(--accent-blue)' : 'var(--text-muted)',
                flexShrink: 0, fontFamily: 'var(--font-mono)', letterSpacing: '0.03em'
              }}>
                {item.type}
              </span>
            </button>
          ))}
        </div>
      )}

      {open && !loading && results.length === 0 && query.length > 1 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
          marginTop: 4,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px',
          color: 'var(--text-muted)', fontSize: 12,
          boxShadow: 'var(--shadow-elevated)',
        }}>
          Geen resultaten gevonden voor "{query}"
        </div>
      )}

      {/* Kaartpicker */}
      {showKaart && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 1000,
          marginTop: 4, width: 480,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)', overflow: 'hidden',
          boxShadow: 'var(--shadow-elevated)',
        }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={12} /> Klik op de kaart om een locatie te kiezen
            </span>
            <button onClick={() => setShowKaart(false)} style={{ color: 'var(--text-muted)' }}>
              <X size={13} />
            </button>
          </div>
          <div style={{ height: 320 }}>
            <LocatieKaart
              selectedCoords={value?.coords}
              onSelect={handleKaartSelect}
            />
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
