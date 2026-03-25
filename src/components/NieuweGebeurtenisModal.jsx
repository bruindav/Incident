// src/components/NieuweGebeurtenisModal.jsx // V1
import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import { GEBEURTENIS_TYPES, PRIO_TYPES } from '../data/mockData'

const TABS = ['actueel', 'planning', 'historie']
const TAB_LABELS = { actueel: 'Actueel', planning: 'Planning', historie: 'Historie' }

export default function NieuweGebeurtenisModal({ onSave, onCancel }) {
  const [form, setForm] = useState({
    type: GEBEURTENIS_TYPES.INCIDENT,
    onderwerp: '',
    locatie: '',
    prio: '',
    tab: 'actueel',
    beschrijving: '',
  })

  function handleSave() {
    if (!form.onderwerp) return
    const nu = new Date()
    const id = `G${Date.now()}`
    const titel = `${form.type} – ${form.locatie || form.onderwerp}`
    onSave({
      id,
      type: form.type,
      titel,
      status: 'Aangemeld',
      prio: form.prio || null,
      tab: form.tab,
      aangemeldDoor: 'DB',
      aangemeldOp: nu,
      gewijzigdOp: nu,
      gewijzigdDoor: 'DB',
      dossiernummer: `#${Math.floor(10000000 + Math.random() * 90000000)}`,
      beschrijving: form.beschrijving,
      samenvatting: { constatering: nu },
      processtappen: [],
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)', width: 480,
        boxShadow: 'var(--shadow-elevated)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            Nieuwe Gebeurtenis
          </h3>
          <button onClick={onCancel} style={{ color: 'var(--text-muted)', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={lbl}>Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {Object.values(GEBEURTENIS_TYPES).map(t => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  style={{
                    padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                    fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                    border: `1px solid ${form.type === t ? 'var(--accent-yellow)' : 'var(--border-strong)'}`,
                    background: form.type === t ? 'var(--accent-yellow-dim)' : 'var(--bg-base)',
                    color: form.type === t ? 'var(--accent-yellow)' : 'var(--text-secondary)',
                    transition: 'all 0.15s',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={lbl}>Onderwerp *</label>
            <input
              value={form.onderwerp}
              onChange={e => setForm({ ...form, onderwerp: e.target.value })}
              placeholder="Korte omschrijving..."
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>Locatie</label>
            <input
              value={form.locatie}
              onChange={e => setForm({ ...form, locatie: e.target.value })}
              placeholder="Bijv. Doorslagsluis, Amsterdam-Rijnkanaal..."
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>Prioriteit</label>
            <select
              value={form.prio}
              onChange={e => setForm({ ...form, prio: e.target.value })}
              style={{ ...inp, appearance: 'none' }}
            >
              <option value="">Geen prioriteit</option>
              {Object.values(PRIO_TYPES).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={lbl}>Tabblad</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setForm({ ...form, tab })}
                  style={{
                    flex: 1, padding: '7px', fontSize: 12, borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${form.tab === tab ? 'var(--accent-blue)' : 'var(--border-strong)'}`,
                    background: form.tab === tab ? 'var(--accent-blue-dim)' : 'var(--bg-base)',
                    color: form.tab === tab ? 'var(--accent-blue)' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={lbl}>Beschrijving</label>
            <textarea
              value={form.beschrijving}
              onChange={e => setForm({ ...form, beschrijving: e.target.value })}
              placeholder="Aanvullende omschrijving..."
              rows={2}
              style={{ ...inp, resize: 'vertical', height: 'auto' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          padding: '12px 18px', borderTop: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
        }}>
          <button onClick={onCancel} style={{
            padding: '7px 14px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)', background: 'transparent',
            color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
          }}>
            Annuleren
          </button>
          <button
            onClick={handleSave}
            disabled={!form.onderwerp}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 'var(--radius-sm)',
              background: form.onderwerp ? 'var(--accent-yellow)' : 'var(--bg-hover)',
              color: form.onderwerp ? '#0d0f14' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 600, cursor: form.onderwerp ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            <Save size={12} /> Aanmaken
          </button>
        </div>
      </div>
    </div>
  )
}

const lbl = {
  display: 'block', fontSize: 11, color: 'var(--text-muted)',
  marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
}
const inp = {
  width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-sm)', padding: '8px 10px',
  color: 'var(--text-primary)', outline: 'none', fontSize: 13,
  fontFamily: 'var(--font-ui)',
}
