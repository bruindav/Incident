// src/App.jsx // V1
import React, { useState } from 'react'
import { format } from 'date-fns'
import { Anchor, Bell, Search, Menu } from 'lucide-react'
import GebeurtenisLijst from './components/GebeurtenisLijst'
import GebeurtenisDetail from './components/GebeurtenisDetail'
import NieuweGebeurtenisModal from './components/NieuweGebeurtenisModal'
import { initialGebeurtenissen } from './data/mockData'

export default function App() {
  const [gebeurtenissen, setGebeurtenissen] = useState(initialGebeurtenissen)
  const [geselecteerd, setGeselecteerd] = useState(initialGebeurtenissen[0])
  const [showNieuw, setShowNieuw] = useState(false)
  const [now, setNow] = useState(new Date())

  // Klok live bijhouden
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  function handleUpdate(bijgewerkt) {
    setGebeurtenissen(prev => prev.map(g => g.id === bijgewerkt.id ? bijgewerkt : g))
    setGeselecteerd(bijgewerkt)
  }

  function handleNieuw(nieuw) {
    setGebeurtenissen(prev => [nieuw, ...prev])
    setGeselecteerd(nieuw)
    setShowNieuw(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Topbar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 44, flexShrink: 0,
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 0 var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--accent-yellow-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Anchor size={14} color="var(--accent-yellow)" />
          </div>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', lineHeight: 1 }}>
              Operationeel Portaal Scheepvaart
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              Stremming en Beperking
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
            <Search size={15} />
          </button>
          <button style={{ color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
            <Bell size={15} />
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Operator</span>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--accent-blue-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: 'var(--accent-blue)',
            }}>
              DB
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
            {format(now, 'dd-MM-yyyy HH:mm')}
          </div>
        </div>
      </header>

      {/* Main: lijst | detail */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Links: gebeurtenissenlijst */}
        <div style={{ width: 340, flexShrink: 0, overflow: 'hidden' }}>
          <GebeurtenisLijst
            gebeurtenissen={gebeurtenissen}
            geselecteerd={geselecteerd}
            onSelect={setGeselecteerd}
            onNieuw={() => setShowNieuw(true)}
          />
        </div>

        {/* Rechts: detail */}
        <div style={{ flex: 1, overflow: 'hidden', background: 'var(--bg-base)' }}>
          {geselecteerd ? (
            <GebeurtenisDetail
              key={geselecteerd.id}
              gebeurtenis={geselecteerd}
              onUpdate={handleUpdate}
            />
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '100%', color: 'var(--text-dim)', flexDirection: 'column', gap: 12,
            }}>
              <Anchor size={32} color="var(--text-dim)" />
              <span style={{ fontSize: 13 }}>Selecteer een gebeurtenis om te bewerken</span>
            </div>
          )}
        </div>
      </div>

      {/* Versie footer */}
      <div style={{
        padding: '3px 14px', background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
          Incidenten Registratie V1
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
          Rijkswaterstaat / PDOK
        </span>
      </div>

      {/* Nieuw modal */}
      {showNieuw && (
        <NieuweGebeurtenisModal
          onSave={handleNieuw}
          onCancel={() => setShowNieuw(false)}
        />
      )}
    </div>
  )
}
