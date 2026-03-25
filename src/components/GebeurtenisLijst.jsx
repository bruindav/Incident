// src/components/GebeurtenisLijst.jsx // V1
import React, { useState } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { Plus, Filter, Zap, AlertTriangle, AlertCircle, Activity } from 'lucide-react'
import { GEBEURTENIS_TYPES } from '../data/mockData'

const TYPE_ICON = {
  [GEBEURTENIS_TYPES.INCIDENT]: { icon: Zap, color: 'var(--accent-yellow)', bg: 'var(--accent-yellow-dim)' },
  [GEBEURTENIS_TYPES.BEPERKING]: { icon: AlertCircle, color: 'var(--accent-orange)', bg: 'var(--accent-orange-dim)' },
  [GEBEURTENIS_TYPES.STREMMING]: { icon: AlertTriangle, color: 'var(--accent-red)', bg: 'var(--accent-red-dim)' },
  [GEBEURTENIS_TYPES.STORING]: { icon: Activity, color: 'var(--accent-blue)', bg: 'var(--accent-blue-dim)' },
}

const STATUS_DOT = {
  'Aangemeld': 'var(--accent-yellow)',
  'In behandeling': 'var(--accent-blue)',
  'Afgehandeld': 'var(--accent-green)',
  'Gesloten': 'var(--text-muted)',
}

const TABS = ['actueel', 'planning', 'historie']
const TAB_LABELS = { actueel: 'Actueel', planning: 'Planning', historie: 'Historie' }

export default function GebeurtenisLijst({ gebeurtenissen, geselecteerd, onSelect, onNieuw }) {
  const [actieveTab, setActieveTab] = useState('actueel')

  const gefilterd = gebeurtenissen.filter(g => g.tab === actieveTab)

  const counts = {
    actueel: gebeurtenissen.filter(g => g.tab === 'actueel').length,
    planning: gebeurtenissen.filter(g => g.tab === 'planning').length,
    historie: gebeurtenissen.filter(g => g.tab === 'historie').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid var(--border)' }}>
      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', padding: '0 4px', gap: 2 }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActieveTab(tab)}
              style={{
                flex: 1, padding: '10px 6px', fontSize: 12, fontWeight: 500,
                background: 'none', cursor: 'pointer',
                color: actieveTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: actieveTab === tab ? '2px solid var(--accent-yellow)' : '2px solid transparent',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 5,
              }}
            >
              {TAB_LABELS[tab]}
              <span style={{
                fontSize: 10, background: actieveTab === tab ? 'var(--accent-yellow-dim)' : 'var(--bg-elevated)',
                color: actieveTab === tab ? 'var(--accent-yellow)' : 'var(--text-dim)',
                padding: '1px 5px', borderRadius: 10, fontFamily: 'var(--font-mono)',
              }}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)',
          fontSize: 11, padding: '4px 8px', borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        }}>
          <Filter size={11} /> Filter
        </button>
        <button
          onClick={onNieuw}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-yellow)', color: '#0d0f14',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Plus size={11} /> NIEUW
        </button>
      </div>

      {/* Lijst */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {gefilterd.length === 0 ? (
          <div style={{ padding: 24, color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
            Geen {TAB_LABELS[actieveTab].toLowerCase()} items
          </div>
        ) : (
          gefilterd.map(g => {
            const { icon: Icon, color, bg } = TYPE_ICON[g.type] || TYPE_ICON[GEBEURTENIS_TYPES.INCIDENT]
            const active = geselecteerd?.id === g.id

            return (
              <div
                key={g.id}
                onClick={() => onSelect(g)}
                style={{
                  padding: '10px 12px', borderBottom: '1px solid var(--border)',
                  cursor: 'pointer', background: active ? 'var(--bg-active)' : 'transparent',
                  borderLeft: active ? '3px solid var(--accent-yellow)' : '3px solid transparent',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                    background: bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, marginTop: 1,
                  }}>
                    <Icon size={13} color={color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {g.titel}
                      </span>
                      <span style={{
                        fontSize: 10, padding: '2px 6px', borderRadius: 3, flexShrink: 0,
                        background: `${STATUS_DOT[g.status] || 'var(--text-muted)'}22`,
                        color: STATUS_DOT[g.status] || 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {g.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {g.beschrijving}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>
                        Laatste wijziging {format(new Date(g.gewijzigdOp), 'dd-MM-yyyy HH:mm')} door{' '}
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 18, height: 18, borderRadius: '50%',
                          background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)',
                          fontSize: 9, fontWeight: 700, verticalAlign: 'middle',
                        }}>
                          {g.gewijzigdDoor}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                        {g.dossiernummer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
