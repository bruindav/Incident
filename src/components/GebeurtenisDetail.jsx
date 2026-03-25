// src/components/GebeurtenisDetail.jsx // V2
import React, { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Hash, CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import ProcesstapKaart, { STAP_DEFINITIE, getStapPreview } from './ProcesstapKaart'

const STATUS_COLORS = {
  'Aangemeld':      'var(--accent-yellow)',
  'In behandeling': 'var(--accent-blue)',
  'Afgehandeld':    'var(--accent-green)',
  'Gesloten':       'var(--text-muted)',
}

// Protocol: volgorde en groepering
const PROTOCOL = [
  { groep: 'Constatering',  stappen: ['Waar', 'Wat', 'Wie'] },
  { groep: 'Acties',        stappen: ['Contact hulpverlener', 'Contact OvD', 'Mobiel verkeersleider'] },
  { groep: 'Schaal',        stappen: ['Fase', 'GRIP niveau'] },
  { groep: 'Context',       stappen: ['Omstandigheden', 'Omgeving', 'Schade'] },
]

// ─── Protocol voortgangskaart ─────────────────────────────────────────────────
function ProtocolKaart({ stappen, onAddStap }) {
  const geregistreerd = stap => stappen.find(s => s.subtitel === stap)

  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
      <div style={{ padding:'8px 14px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-muted)' }}>Protocol voortgang</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-muted)' }}>
          {PROTOCOL.flatMap(g=>g.stappen).filter(s=>geregistreerd(s)).length} / {PROTOCOL.flatMap(g=>g.stappen).length}
        </span>
      </div>
      <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:10 }}>
        {PROTOCOL.map(groep => (
          <div key={groep.groep}>
            <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-dim)', marginBottom:6 }}>
              {groep.groep}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:5 }}>
              {groep.stappen.map(stapNaam => {
                const gevonden = geregistreerd(stapNaam)
                const def = STAP_DEFINITIE[stapNaam] || {}
                const accent = def.accent || 'var(--accent-yellow)'
                const preview = gevonden ? getStapPreview(stapNaam, gevonden.data) : null

                return (
                  <div
                    key={stapNaam}
                    onClick={() => !gevonden && onAddStap(stapNaam)}
                    title={gevonden ? `${stapNaam}: ${preview}` : `Klik om ${stapNaam} toe te voegen`}
                    style={{
                      padding:'6px 8px', borderRadius:'var(--radius-sm)',
                      border:`1px solid ${gevonden ? accent : 'var(--border)'}`,
                      background: gevonden ? `${accent}12` : 'var(--bg-base)',
                      cursor: gevonden ? 'default' : 'pointer',
                      transition:'all 0.15s',
                      display:'flex', flexDirection:'column', gap:2,
                    }}
                    onMouseEnter={e => { if(!gevonden) e.currentTarget.style.borderColor = accent }}
                    onMouseLeave={e => { if(!gevonden) e.currentTarget.style.borderColor = 'var(--border)' }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      {gevonden
                        ? <CheckCircle size={11} color={accent} style={{flexShrink:0}}/>
                        : <Circle size={11} color="var(--text-dim)" style={{flexShrink:0}}/>
                      }
                      <span style={{ fontSize:11, fontWeight:600, color: gevonden ? accent : 'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {stapNaam}
                      </span>
                    </div>
                    {gevonden && (
                      <div style={{ fontSize:10, color:'var(--text-muted)', fontFamily:'var(--font-mono)', paddingLeft:16, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {format(new Date(gevonden.datum), 'dd-MM HH:mm')}
                      </div>
                    )}
                    {!gevonden && (
                      <div style={{ fontSize:10, color:'var(--text-dim)', paddingLeft:16 }}>niet geregistreerd</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Twee-koloms stappen lijst ────────────────────────────────────────────────
const GROEP_KOLOM_LINKS  = ['Constatering', 'Schaal']
const GROEP_KOLOM_RECHTS = ['Acties', 'Context']

function StappenKolom({ titel, groepen, stappen, addingStap, onStapSave, onStapCancel, onAddStap }) {
  return (
    <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:10 }}>
      <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-dim)', paddingBottom:4, borderBottom:'1px solid var(--border)' }}>
        {titel}
      </div>
      {groepen.map(groepNaam => {
        const groepStappen = stappen.filter(s => (STAP_DEFINITIE[s.subtitel]?.groep || 'Constatering') === groepNaam)
        const nieuweStap = addingStap?.groep === groepNaam ? addingStap : null

        if (groepStappen.length === 0 && !nieuweStap) return null

        return (
          <div key={groepNaam}>
            <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-dim)', marginBottom:5 }}>
              {groepNaam}
            </div>
            {groepStappen.map(stap => (
              <ProcesstapKaart key={stap.id} stap={stap} onSave={onStapSave} isNew={false}/>
            ))}
            {nieuweStap && (
              <ProcesstapKaart stap={nieuweStap} onSave={onStapSave} onCancel={onStapCancel} isNew={true}/>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Hoofd component ──────────────────────────────────────────────────────────
export default function GebeurtenisDetail({ gebeurtenis, onUpdate }) {
  const [addingStap, setAddingStap] = useState(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const stappen = gebeurtenis.processtappen || []

  function handleStapSave(nieuwStap) {
    const idx = stappen.findIndex(s => s.id === nieuwStap.id)
    const updated = idx >= 0
      ? stappen.map((s,i) => i===idx ? nieuwStap : s)
      : [...stappen, { ...nieuwStap, id:`PS${Date.now()}` }]
    onUpdate({ ...gebeurtenis, processtappen: updated })
    setAddingStap(null)
  }

  function handleAddStap(stapNaam) {
    setShowAddMenu(false)
    const groep = STAP_DEFINITIE[stapNaam]?.groep || 'Constatering'
    setAddingStap({
      id: `new_${Date.now()}`,
      type: 'Constatering incident',
      subtitel: stapNaam,
      datum: new Date(),
      data: {},
      groep,
    })
  }

  const alleStapNamen = PROTOCOL.flatMap(g => g.stappen)
  const ontbrekendeStappen = alleStapNamen.filter(n => !stappen.find(s => s.subtitel === n))

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>

      {/* ── Header ── */}
      <div style={{ padding:'12px 18px 10px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ fontSize:10,padding:'2px 8px',borderRadius:3,background:`${STATUS_COLORS[gebeurtenis.status]||'var(--text-muted)'}22`,color:STATUS_COLORS[gebeurtenis.status]||'var(--text-muted)',fontFamily:'var(--font-mono)',fontWeight:600,letterSpacing:'0.04em' }}>
                {gebeurtenis.status}
              </span>
              {gebeurtenis.prio && <span style={{fontSize:10,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{gebeurtenis.prio}</span>}
            </div>
            <h2 style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',lineHeight:1.3 }}>{gebeurtenis.titel}</h2>
            <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:2 }}>Op {format(new Date(gebeurtenis.aangemeldOp),'dd-MM-yyyy HH:mm')}</div>
          </div>
          <div style={{ fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)' }}>
            <Hash size={10} style={{display:'inline',marginRight:2}}/>{gebeurtenis.dossiernummer?.replace('#','')}
          </div>
        </div>
      </div>

      {/* ── Scrollbaar gebied: protocol + stappen ── */}
      <div style={{ flex:1, overflow:'auto', padding:'12px 18px' }}>

        {/* Protocol voortgangskaart */}
        <div style={{ marginBottom:14 }}>
          <ProtocolKaart stappen={stappen} onAddStap={handleAddStap}/>
        </div>

        {/* Twee kolommen met processtappen */}
        <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>

          {/* Kolom links: Constatering + Schaal */}
          <div style={{ flex:1, minWidth:0 }}>
            {GROEP_KOLOM_LINKS.map(groepNaam => {
              const groepStappen = stappen.filter(s => (STAP_DEFINITIE[s.subtitel]?.groep||'Constatering') === groepNaam)
              const nieuweStap = addingStap?.groep === groepNaam ? addingStap : null
              if (groepStappen.length===0 && !nieuweStap) return null
              return (
                <div key={groepNaam} style={{marginBottom:10}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--text-dim)',marginBottom:5,paddingBottom:4,borderBottom:'1px solid var(--border)'}}>
                    {groepNaam}
                  </div>
                  {groepStappen.map(stap=><ProcesstapKaart key={stap.id} stap={stap} onSave={handleStapSave} isNew={false}/>)}
                  {nieuweStap && <ProcesstapKaart stap={nieuweStap} onSave={handleStapSave} onCancel={()=>setAddingStap(null)} isNew={true}/>}
                </div>
              )
            })}
          </div>

          {/* Kolom rechts: Acties + Context */}
          <div style={{ flex:1, minWidth:0 }}>
            {GROEP_KOLOM_RECHTS.map(groepNaam => {
              const groepStappen = stappen.filter(s => (STAP_DEFINITIE[s.subtitel]?.groep||'Constatering') === groepNaam)
              const nieuweStap = addingStap?.groep === groepNaam ? addingStap : null
              if (groepStappen.length===0 && !nieuweStap) return null
              return (
                <div key={groepNaam} style={{marginBottom:10}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--text-dim)',marginBottom:5,paddingBottom:4,borderBottom:'1px solid var(--border)'}}>
                    {groepNaam}
                  </div>
                  {groepStappen.map(stap=><ProcesstapKaart key={stap.id} stap={stap} onSave={handleStapSave} isNew={false}/>)}
                  {nieuweStap && <ProcesstapKaart stap={nieuweStap} onSave={handleStapSave} onCancel={()=>setAddingStap(null)} isNew={true}/>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Toevoeg-knop */}
        {ontbrekendeStappen.length > 0 && (
          <div style={{ position:'relative', marginTop:8 }}>
            <button
              onClick={()=>setShowAddMenu(!showAddMenu)}
              style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:'var(--radius-md)',border:'1px dashed var(--border-strong)',background:'transparent',color:'var(--text-muted)',fontSize:12,cursor:'pointer',width:'100%',justifyContent:'center',transition:'all 0.15s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent-yellow)';e.currentTarget.style.color='var(--accent-yellow)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.color='var(--text-muted)'}}
            >
              <Plus size={13}/> Processtap toevoegen
            </button>

            {showAddMenu && (
              <div style={{ position:'absolute',bottom:'100%',left:0,right:0,zIndex:50,marginBottom:4,background:'var(--bg-elevated)',border:'1px solid var(--border-strong)',borderRadius:'var(--radius-md)',overflow:'hidden',boxShadow:'var(--shadow-elevated)' }}>
                {PROTOCOL.map(groep => {
                  const beschikbaar = groep.stappen.filter(s => !stappen.find(ps=>ps.subtitel===s))
                  if (beschikbaar.length===0) return null
                  return (
                    <div key={groep.groep}>
                      <div style={{padding:'5px 12px 3px',fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--text-dim)',background:'var(--bg-base)'}}>
                        {groep.groep}
                      </div>
                      {beschikbaar.map(stapNaam => {
                        const def = STAP_DEFINITIE[stapNaam] || {}
                        const Icon = def.icon
                        return (
                          <button key={stapNaam} onClick={()=>handleAddStap(stapNaam)} style={{ width:'100%',textAlign:'left',padding:'8px 12px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid var(--border)',background:'transparent',cursor:'pointer',fontSize:13,color:'var(--text-primary)',transition:'background 0.1s' }}
                            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-hover)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                          >
                            {Icon && <Icon size={13} color={def.accent||'var(--text-muted)'}/>}
                            {stapNaam}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
