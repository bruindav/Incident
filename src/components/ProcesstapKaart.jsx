// src/components/ProcesstapKaart.jsx // V1
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Save, X, MapPin, User, FileText, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import LocatieDropdown from './LocatieDropdown'

const STAP_ICONS = {
  'Waar': MapPin,
  'Wat': FileText,
  'Wie': User,
}

function DateTimeInput({ label, value, onChange }) {
  const dateStr = value ? format(new Date(value), 'yyyy-MM-dd') : ''
  const timeStr = value ? format(new Date(value), 'HH:mm') : ''

  function handleChange(type, val) {
    const d = value ? new Date(value) : new Date()
    if (type === 'date') {
      const [y, m, day] = val.split('-').map(Number)
      d.setFullYear(y, m - 1, day)
    } else {
      const [h, min] = val.split(':').map(Number)
      d.setHours(h, min)
    }
    onChange(d)
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <label style={labelStyle}>{label} – Datum *</label>
        <input
          type="date"
          value={dateStr}
          onChange={e => handleChange('date', e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label style={labelStyle}>Tijd *</label>
        <input
          type="time"
          value={timeStr}
          onChange={e => handleChange('time', e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>
  )
}

// --- WAAR stap ---
function WaarStap({ data, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: 2 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Locatie *</label>
          <LocatieDropdown
            value={data.locatie}
            onChange={loc => onChange({ ...data, locatie: loc })}
            placeholder="Zoek vaarweg, sluis of brug..."
          />
        </div>
        <div>
          <label style={labelStyle}>Nadere specifieke locatie</label>
          <textarea
            value={data.nadereLocatie || ''}
            onChange={e => onChange({ ...data, nadereLocatie: e.target.value })}
            placeholder="Bijv. nabij km 14.5, stuurboord..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', height: 'auto' }}
          />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={labelStyle}>Coördinaten</label>
        {data.locatie?.coords ? (
          <div style={{
            background: 'var(--bg-base)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', padding: '8px 12px',
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)',
            lineHeight: 1.8,
          }}>
            <div>Lat: {data.locatie.coords[0].toFixed(5)}</div>
            <div>Lon: {data.locatie.coords[1].toFixed(5)}</div>
            <div style={{ marginTop: 4, fontSize: 10, color: 'var(--text-muted)' }}>
              Bron: {data.locatie.bron || 'RWS'}
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-base)', borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border)', padding: '8px 12px',
            color: 'var(--text-dim)', fontSize: 11, textAlign: 'center',
            lineHeight: 2,
          }}>
            Geen locatie geselecteerd
          </div>
        )}
      </div>
    </div>
  )
}

// --- WAT stap ---
function WatStap({ data, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <label style={labelStyle}>Wat is gezien, gehoord, geroken etc. *</label>
        <textarea
          value={data.watGezien || ''}
          onChange={e => onChange({ ...data, watGezien: e.target.value })}
          placeholder="Beschrijf wat er waargenomen is..."
          rows={5}
          style={{ ...inputStyle, resize: 'vertical', height: 'auto' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label style={labelStyle}>Wat is de gewenste hulp</label>
        <textarea
          value={data.gewensteHulp || ''}
          onChange={e => onChange({ ...data, gewensteHulp: e.target.value })}
          placeholder="Beschrijf de gewenste hulp of actie..."
          rows={5}
          style={{ ...inputStyle, resize: 'vertical', height: 'auto' }}
        />
      </div>
    </div>
  )
}

// --- WIE stap ---
function WieStap({ data, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <label style={labelStyle}>Naam melder</label>
        <input
          value={data.naamMelder || ''}
          onChange={e => onChange({ ...data, naamMelder: e.target.value })}
          placeholder="Naam van de melder..."
          style={inputStyle}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label style={labelStyle}>Contactgegevens</label>
        <input
          value={data.contact || ''}
          onChange={e => onChange({ ...data, contact: e.target.value })}
          placeholder="Telefoon, marifoon kanaal..."
          style={inputStyle}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label style={labelStyle}>Schip / Vaartuig</label>
        <input
          value={data.schip || ''}
          onChange={e => onChange({ ...data, schip: e.target.value })}
          placeholder="Naam of MMSI..."
          style={inputStyle}
        />
      </div>
    </div>
  )
}

// --- Hoofd ProcesstapKaart ---
export default function ProcesstapKaart({ stap, onSave, onCancel, isNew = false }) {
  const [expanded, setExpanded] = useState(isNew)
  const [editing, setEditing] = useState(isNew)
  const [localData, setLocalData] = useState(stap.data || {})
  const [localDatum, setLocalDatum] = useState(stap.datum ? new Date(stap.datum) : new Date())

  const Icon = STAP_ICONS[stap.subtitel] || FileText

  const accentMap = { 'Waar': 'var(--accent-blue)', 'Wat': 'var(--accent-yellow)', 'Wie': 'var(--accent-green)' }
  const accent = accentMap[stap.subtitel] || 'var(--accent-yellow)'

  function handleSave() {
    onSave({ ...stap, data: localData, datum: localDatum })
    setEditing(false)
  }

  function handleCancel() {
    setLocalData(stap.data || {})
    setLocalDatum(stap.datum ? new Date(stap.datum) : new Date())
    setEditing(false)
    if (isNew && onCancel) onCancel()
  }

  function getSamenvatting() {
    if (stap.subtitel === 'Waar') {
      const loc = localData.locatie?.naam || localData.locatieNaam
      return loc ? `${loc}${localData.nadereLocatie ? ' – ' + localData.nadereLocatie : ''}` : '—'
    }
    if (stap.subtitel === 'Wat') return localData.watGezien || '—'
    if (stap.subtitel === 'Wie') return localData.naamMelder || '—'
    return '—'
  }

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: 'var(--radius-md)', marginBottom: 8,
      overflow: 'hidden', transition: 'box-shadow 0.2s',
    }}>
      {/* Header */}
      <div
        onClick={() => !editing && setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
          cursor: editing ? 'default' : 'pointer',
          background: expanded ? 'var(--bg-elevated)' : 'transparent',
          borderBottom: expanded ? '1px solid var(--border)' : 'none',
          transition: 'background 0.15s',
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 'var(--radius-sm)',
          background: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={13} color={accent} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              {format(localDatum, 'HH:mm')}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
              {stap.type} – {stap.subtitel}
            </span>
          </div>
          {!expanded && (
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {getSamenvatting()}
            </div>
          )}
        </div>
        {!editing && (
          expanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />
        )}
      </div>

      {/* Content */}
      {expanded && (
        <div style={{ padding: '14px 16px' }}>
          <div style={{ marginBottom: 14 }}>
            <DateTimeInput
              label="Datum"
              value={localDatum}
              onChange={setLocalDatum}
            />
          </div>

          {stap.subtitel === 'Waar' && <WaarStap data={localData} onChange={setLocalData} />}
          {stap.subtitel === 'Wat' && <WatStap data={localData} onChange={setLocalData} />}
          {stap.subtitel === 'Wie' && <WieStap data={localData} onChange={setLocalData} />}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <button onClick={handleCancel} style={btnSecondary}>
              <X size={12} /> Annuleren
            </button>
            <button onClick={handleSave} style={btnPrimary}>
              <Save size={12} /> Opslaan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: 11, color: 'var(--text-muted)',
  marginBottom: 5, fontWeight: 500, letterSpacing: '0.03em',
  textTransform: 'uppercase',
}

const inputStyle = {
  width: '100%', background: 'var(--bg-base)',
  border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
  padding: '7px 10px', color: 'var(--text-primary)', outline: 'none',
  fontSize: 13, fontFamily: 'var(--font-ui)',
  transition: 'border-color 0.15s',
}

const btnPrimary = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 'var(--radius-sm)',
  background: 'var(--accent-yellow)', color: '#0d0f14',
  fontWeight: 600, fontSize: 12, cursor: 'pointer',
}

const btnSecondary = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 'var(--radius-sm)',
  background: 'var(--bg-hover)', color: 'var(--text-secondary)',
  fontWeight: 500, fontSize: 12, cursor: 'pointer',
  border: '1px solid var(--border-strong)',
}
