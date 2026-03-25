// src/components/GebeurtenisDetail.jsx // V1
import React, { useState } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { Plus, MapPin, FileText, User, Clock, Hash } from 'lucide-react'
import ProcesstapKaart from './ProcesstapKaart'

const STATUS_COLORS = {
  'Aangemeld': 'var(--accent-yellow)',
  'In behandeling': 'var(--accent-blue)',
  'Afgehandeld': 'var(--accent-green)',
  'Gesloten': 'var(--text-muted)',
}

function SamenvattingBlok({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '12px 14px',
      minWidth: 0,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: value ? 'var(--text-primary)' : 'var(--text-dim)', fontWeight: value ? 500 : 400 }}>
        {value || '—'}
      </div>
    </div>
  )
}

const STAP_TYPES = [
  { type: 'Constatering incident', subtitel: 'Wat', label: 'Wat (constatering)', icon: FileText },
  { type: 'Constatering incident', subtitel: 'Waar', label: 'Waar (locatie)', icon: MapPin },
  { type: 'Constatering incident', subtitel: 'Wie', label: 'Wie (melder)', icon: User },
]

export default function GebeurtenisDetail({ gebeurtenis, onUpdate }) {
  const [addingStap, setAddingStap] = useState(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const stappen = gebeurtenis.processtappen || []

  function handleStapSave(nieuwStap) {
    const bestaand = stappen.findIndex(s => s.id === nieuwStap.id)
    let updated
    if (bestaand >= 0) {
      updated = stappen.map((s, i) => i === bestaand ? nieuwStap : s)
    } else {
      updated = [...stappen, { ...nieuwStap, id: `PS${Date.now()}` }]
    }
    onUpdate({ ...gebeurtenis, processtappen: updated })
    setAddingStap(null)
  }

  function handleAddStap(stapType) {
    setShowAddMenu(false)
    setAddingStap({
      id: `new_${Date.now()}`,
      type: stapType.type,
      subtitel: stapType.subtitel,
      tijdstip: new Date(),
      datum: new Date(),
      data: {},
    })
  }

  const samenvat = gebeurtenis.samenvatting || {}

  // Groepeer stappen op datum
  const groups = {}
  for (const stap of stappen) {
    const d = stap.datum ? format(new Date(stap.datum), 'dd-MM-yyyy') : 'Onbekend'
    if (!groups[d]) groups[d] = []
    groups[d].push(stap)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px 12px', borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 3,
                background: `${STATUS_COLORS[gebeurtenis.status] || 'var(--text-muted)'}22`,
                color: STATUS_COLORS[gebeurtenis.status] || 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.04em',
              }}>
                {gebeurtenis.status}
              </span>
              {gebeurtenis.prio && (
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {gebeurtenis.prio}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {gebeurtenis.titel}
            </h2>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
              Op {format(new Date(gebeurtenis.aangemeldOp), 'dd-MM-yyyy HH:mm')}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
            <Hash size={10} style={{ display: 'inline', marginRight: 2 }} />
            {gebeurtenis.dossiernummer?.replace('#', '')}
          </div>
        </div>
      </div>

      {/* Samenvatting */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <SamenvattingBlok label="Constatering" value={samenvat.constatering ? format(new Date(samenvat.constatering), 'dd-MM-yyyy HH:mm') : null} />
          <SamenvattingBlok label="Eerste contact hulpverlener" value={samenvat.eersteContact} />
          <SamenvattingBlok label="Contact OvD" value={samenvat.contactOvd} />
          <SamenvattingBlok label="Status" value={gebeurtenis.status} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
          <SamenvattingBlok label="Fase" value={samenvat.fase || '0'} />
          <SamenvattingBlok label="Looptijd (uu:mm)" value={samenvat.looptijd} />
          <SamenvattingBlok label="Einde" value={samenvat.einde} />
          <SamenvattingBlok label="Aangemeld door" value={gebeurtenis.aangemeldDoor} />
        </div>

        {/* Snel-samenvatting: Wat / Waar / Wie */}
        {stappen.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
            {['Wat', 'Waar', 'Wie'].map(type => {
              const stap = stappen.find(s => s.subtitel === type)
              let val = '—'
              if (stap) {
                if (type === 'Wat') val = stap.data?.watGezien || '—'
                if (type === 'Waar') val = stap.data?.locatie?.naam || stap.data?.locatieNaam || '—'
                if (type === 'Wie') val = stap.data?.naamMelder || '—'
              }
              return <SamenvattingBlok key={type} label={type} value={val} />
            })}
          </div>
        )}
      </div>

      {/* Processtappen */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px' }}>
        {Object.keys(groups).map(datum => (
          <div key={datum}>
            <div style={{
              fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
              marginBottom: 8, marginTop: 4,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              {datum}
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            {groups[datum].map(stap => (
              <ProcesstapKaart
                key={stap.id}
                stap={stap}
                onSave={handleStapSave}
                isNew={false}
              />
            ))}
          </div>
        ))}

        {/* Nieuwe stap die toegevoegd wordt */}
        {addingStap && (
          <ProcesstapKaart
            stap={addingStap}
            onSave={handleStapSave}
            onCancel={() => setAddingStap(null)}
            isNew={true}
          />
        )}

        {/* Knop: processtap toevoegen */}
        <div style={{ position: 'relative', marginTop: 8 }}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-strong)', background: 'transparent',
              color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
              width: '100%', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-yellow)'; e.currentTarget.style.color = 'var(--accent-yellow)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <Plus size={13} /> Processtap toevoegen
          </button>

          {showAddMenu && (
            <div style={{
              position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 50,
              marginBottom: 4, background: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
              overflow: 'hidden', boxShadow: 'var(--shadow-elevated)',
            }}>
              {STAP_TYPES.map(st => (
                <button
                  key={`${st.type}_${st.subtitel}`}
                  onClick={() => handleAddStap(st)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '9px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    borderBottom: '1px solid var(--border)',
                    background: 'transparent', cursor: 'pointer', fontSize: 13,
                    color: 'var(--text-primary)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <st.icon size={13} color="var(--text-muted)" />
                  {st.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
