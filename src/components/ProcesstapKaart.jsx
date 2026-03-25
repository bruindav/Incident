// src/components/ProcesstapKaart.jsx // V2
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Save, X, MapPin, User, FileText, Phone, Shield, Truck, TrendingUp, AlertTriangle, Wind, Anchor, Activity } from 'lucide-react'
import { format } from 'date-fns'
import LocatieDropdown from './LocatieDropdown'

export const STAP_DEFINITIE = {
  'Waar':                 { icon: MapPin,        accent: 'var(--accent-blue)',   groep: 'Constatering' },
  'Wat':                  { icon: FileText,       accent: 'var(--accent-yellow)', groep: 'Constatering' },
  'Wie':                  { icon: User,           accent: 'var(--accent-green)',  groep: 'Constatering' },
  'Contact hulpverlener': { icon: Phone,          accent: 'var(--accent-orange)', groep: 'Acties' },
  'Contact OvD':          { icon: Shield,         accent: 'var(--accent-red)',    groep: 'Acties' },
  'Mobiel verkeersleider':{ icon: Truck,          accent: 'var(--accent-blue)',   groep: 'Acties' },
  'Fase':                 { icon: TrendingUp,     accent: 'var(--accent-yellow)', groep: 'Schaal' },
  'GRIP niveau':          { icon: AlertTriangle,  accent: 'var(--accent-red)',    groep: 'Schaal' },
  'Omstandigheden':       { icon: Wind,           accent: 'var(--accent-blue)',   groep: 'Context' },
  'Omgeving':             { icon: Anchor,         accent: 'var(--accent-green)',  groep: 'Context' },
  'Schade':               { icon: Activity,       accent: 'var(--accent-red)',    groep: 'Context' },
}

const lbl = { display:'block',fontSize:10,color:'var(--text-muted)',marginBottom:5,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase' }
const inp = { width:'100%',background:'var(--bg-base)',border:'1px solid var(--border-strong)',borderRadius:'var(--radius-sm)',padding:'7px 10px',color:'var(--text-primary)',outline:'none',fontSize:13,fontFamily:'var(--font-ui)' }
const ta  = { ...inp, resize:'vertical', height:'auto' }
const g2  = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }
const g3  = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }

function DTRow({ value, onChange }) {
  const ds = value ? format(new Date(value),'yyyy-MM-dd') : ''
  const ts = value ? format(new Date(value),'HH:mm') : ''
  function upd(type, val) {
    const d = value ? new Date(value) : new Date()
    if (type==='date') { const [y,m,day]=val.split('-').map(Number); d.setFullYear(y,m-1,day) }
    else { const [h,min]=val.split(':').map(Number); d.setHours(h,min) }
    onChange(new Date(d))
  }
  return (
    <div style={{display:'flex',gap:8,marginBottom:14}}>
      <div style={{flex:1}}><label style={lbl}>Datum *</label><input type="date" value={ds} onChange={e=>upd('date',e.target.value)} style={inp}/></div>
      <div style={{width:100}}><label style={lbl}>Tijd *</label><input type="time" value={ts} onChange={e=>upd('time',e.target.value)} style={inp}/></div>
    </div>
  )
}

function WaarForm({data,onChange}) {
  return <div style={g2}>
    <div>
      <label style={lbl}>Locatie *</label>
      <LocatieDropdown value={data.locatie} onChange={loc=>onChange({...data,locatie:loc})} placeholder="Zoek vaarweg, sluis of brug..."/>
      <div style={{marginTop:10}}><label style={lbl}>Nadere specifieke locatie</label>
        <textarea value={data.nadereLocatie||''} onChange={e=>onChange({...data,nadereLocatie:e.target.value})} placeholder="Bijv. nabij km 14.5, stuurboord..." rows={3} style={ta}/>
      </div>
    </div>
    <div>
      <label style={lbl}>Coördinaten</label>
      {data.locatie?.coords ? (
        <div style={{background:'var(--bg-base)',borderRadius:'var(--radius-md)',border:'1px solid var(--border)',padding:'8px 12px',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-secondary)',lineHeight:1.9}}>
          <div>Lat: {data.locatie.coords[0].toFixed(5)}</div>
          <div>Lon: {data.locatie.coords[1].toFixed(5)}</div>
          <div style={{marginTop:4,fontSize:10,color:'var(--text-muted)'}}>Bron: {data.locatie.bron||'RWS'}</div>
        </div>
      ) : (
        <div style={{background:'var(--bg-base)',borderRadius:'var(--radius-md)',border:'1px dashed var(--border)',padding:'16px 12px',color:'var(--text-dim)',fontSize:11,textAlign:'center'}}>Geen locatie</div>
      )}
    </div>
  </div>
}

function WatForm({data,onChange}) {
  return <div style={g2}>
    <div><label style={lbl}>Wat gezien / gehoord / geroken *</label><textarea value={data.watGezien||''} onChange={e=>onChange({...data,watGezien:e.target.value})} rows={5} placeholder="Beschrijf de waarneming..." style={ta}/></div>
    <div><label style={lbl}>Gewenste hulp</label><textarea value={data.gewensteHulp||''} onChange={e=>onChange({...data,gewensteHulp:e.target.value})} rows={5} placeholder="Gewenste hulp of actie..." style={ta}/></div>
  </div>
}

function WieForm({data,onChange}) {
  return <div style={g3}>
    <div><label style={lbl}>Naam melder</label><input value={data.naamMelder||''} onChange={e=>onChange({...data,naamMelder:e.target.value})} placeholder="Naam..." style={inp}/></div>
    <div><label style={lbl}>Contact</label><input value={data.contact||''} onChange={e=>onChange({...data,contact:e.target.value})} placeholder="Tel. / marifoon..." style={inp}/></div>
    <div><label style={lbl}>Schip / MMSI</label><input value={data.schip||''} onChange={e=>onChange({...data,schip:e.target.value})} placeholder="Naam of MMSI..." style={inp}/></div>
  </div>
}

function ContactHulpForm({data,onChange}) {
  return <div style={g2}>
    <div>
      <label style={lbl}>Organisatie / Dienst</label><input value={data.organisatie||''} onChange={e=>onChange({...data,organisatie:e.target.value})} placeholder="Brandweer, Politie, SAR..." style={inp}/>
      <div style={{marginTop:10}}><label style={lbl}>Naam contactpersoon</label><input value={data.contactpersoon||''} onChange={e=>onChange({...data,contactpersoon:e.target.value})} placeholder="Naam..." style={inp}/></div>
    </div>
    <div>
      <label style={lbl}>Telefoon / kanaal</label><input value={data.telefoon||''} onChange={e=>onChange({...data,telefoon:e.target.value})} placeholder="Tel. of marifoon kanaal..." style={inp}/>
      <div style={{marginTop:10}}><label style={lbl}>Notities</label><textarea value={data.notities||''} onChange={e=>onChange({...data,notities:e.target.value})} rows={3} placeholder="Afspraken, status..." style={ta}/></div>
    </div>
  </div>
}

function ContactOvdForm({data,onChange}) {
  return <div style={g2}>
    <div>
      <label style={lbl}>Naam OvD</label><input value={data.naamOvd||''} onChange={e=>onChange({...data,naamOvd:e.target.value})} placeholder="Naam Officier van Dienst..." style={inp}/>
      <div style={{marginTop:10}}><label style={lbl}>Dienst</label><input value={data.dienst||''} onChange={e=>onChange({...data,dienst:e.target.value})} placeholder="Bijv. Brandweer Rotterdam-Rijnmond..." style={inp}/></div>
    </div>
    <div>
      <label style={lbl}>Contact</label><input value={data.contact||''} onChange={e=>onChange({...data,contact:e.target.value})} placeholder="Telefoon / portofoon..." style={inp}/>
      <div style={{marginTop:10}}><label style={lbl}>Notities</label><textarea value={data.notities||''} onChange={e=>onChange({...data,notities:e.target.value})} rows={3} placeholder="Briefing, afspraken..." style={ta}/></div>
    </div>
  </div>
}

function MobielForm({data,onChange}) {
  return <div style={g2}>
    <div>
      <label style={lbl}>Naam verkeersleider</label><input value={data.naam||''} onChange={e=>onChange({...data,naam:e.target.value})} placeholder="Naam..." style={inp}/>
      <div style={{marginTop:10}}><label style={lbl}>Inzetlocatie</label><input value={data.inzetLocatie||''} onChange={e=>onChange({...data,inzetLocatie:e.target.value})} placeholder="Waar ingezet..." style={inp}/></div>
    </div>
    <div>
      <label style={lbl}>ETA / aankomsttijd</label><input value={data.eta||''} onChange={e=>onChange({...data,eta:e.target.value})} placeholder="Verwachte aankomsttijd..." style={inp}/>
      <div style={{marginTop:10}}><label style={lbl}>Notities</label><textarea value={data.notities||''} onChange={e=>onChange({...data,notities:e.target.value})} rows={3} placeholder="Opdracht, bevoegdheden..." style={ta}/></div>
    </div>
  </div>
}

function FaseForm({data,onChange}) {
  return <div style={g2}>
    <div>
      <label style={lbl}>Fase *</label>
      <div style={{display:'flex',gap:8}}>
        {['0','1','2','3','4'].map(f=>(
          <button key={f} onClick={()=>onChange({...data,fase:f})} style={{width:44,height:44,borderRadius:'var(--radius-md)',border:`2px solid ${data.fase===f?'var(--accent-yellow)':'var(--border-strong)'}`,background:data.fase===f?'var(--accent-yellow-dim)':'var(--bg-base)',color:data.fase===f?'var(--accent-yellow)':'var(--text-muted)',fontSize:16,fontWeight:700,cursor:'pointer',transition:'all 0.15s'}}>{f}</button>
        ))}
      </div>
    </div>
    <div><label style={lbl}>Toelichting</label><textarea value={data.toelichting||''} onChange={e=>onChange({...data,toelichting:e.target.value})} rows={3} placeholder="Reden voor fasewisseling..." style={ta}/></div>
  </div>
}

function GripForm({data,onChange}) {
  const labels = {'0':'Normale situatie','1':'Bronbestrijding','2':'Effectbestrijding','3':'Bedreiging welzijn bevolking','4':'Bestuurlijke noodsituatie'}
  return <div style={g2}>
    <div>
      <label style={lbl}>GRIP niveau *</label>
      <div style={{display:'flex',gap:8}}>
        {['0','1','2','3','4'].map(g=>(
          <button key={g} onClick={()=>onChange({...data,grip:g})} style={{width:44,height:44,borderRadius:'var(--radius-md)',border:`2px solid ${data.grip===g?'var(--accent-red)':'var(--border-strong)'}`,background:data.grip===g?'var(--accent-red-dim)':'var(--bg-base)',color:data.grip===g?'var(--accent-red)':'var(--text-muted)',fontSize:16,fontWeight:700,cursor:'pointer',transition:'all 0.15s'}}>{g}</button>
        ))}
      </div>
      {data.grip!==undefined && <div style={{marginTop:8,fontSize:11,color:'var(--text-muted)'}}>GRIP {data.grip} – {labels[data.grip]}</div>}
    </div>
    <div><label style={lbl}>Toelichting</label><textarea value={data.toelichting||''} onChange={e=>onChange({...data,toelichting:e.target.value})} rows={4} placeholder="Reden voor GRIP-opschaling..." style={ta}/></div>
  </div>
}

function OmstandighedenForm({data,onChange}) {
  return <div style={g2}>
    <div>
      <label style={lbl}>Weersomstandigheden</label><textarea value={data.weer||''} onChange={e=>onChange({...data,weer:e.target.value})} rows={3} placeholder="Wind, neerslag, zicht, temperatuur..." style={ta}/>
      <div style={{marginTop:10}}><label style={lbl}>Stroming / getij</label><input value={data.stroming||''} onChange={e=>onChange({...data,stroming:e.target.value})} placeholder="Bijv. ebstroom 2 knopen..." style={inp}/></div>
    </div>
    <div>
      <label style={lbl}>Zichtbaarheid</label><input value={data.zicht||''} onChange={e=>onChange({...data,zicht:e.target.value})} placeholder="Bijv. >1000m, mist..." style={inp}/>
      <div style={{marginTop:10}}><label style={lbl}>Overige omstandigheden</label><textarea value={data.overig||''} onChange={e=>onChange({...data,overig:e.target.value})} rows={3} placeholder="Donker, nacht, druk vaarwater..." style={ta}/></div>
    </div>
  </div>
}

function OmgevingForm({data,onChange}) {
  return <div style={g2}>
    <div><label style={lbl}>Omgevingsbeschrijving</label><textarea value={data.omschrijving||''} onChange={e=>onChange({...data,omschrijving:e.target.value})} rows={4} placeholder="Type waterweg, breedte, diepte, andere scheepvaart..." style={ta}/></div>
    <div><label style={lbl}>Aangrenzende objecten / infrastructuur</label><textarea value={data.objecten||''} onChange={e=>onChange({...data,objecten:e.target.value})} rows={4} placeholder="Bruggen, sluizen, oevers, bebouwing..." style={ta}/></div>
  </div>
}

function SchadeForm({data,onChange}) {
  return <div style={g2}>
    <div>
      <label style={lbl}>Schade vaartuig / object</label><textarea value={data.schadeVaartuig||''} onChange={e=>onChange({...data,schadeVaartuig:e.target.value})} rows={3} placeholder="Omschrijf de schade..." style={ta}/>
      <div style={{marginTop:10}}><label style={lbl}>Slachtoffers / gewonden</label><input value={data.slachtoffers||''} onChange={e=>onChange({...data,slachtoffers:e.target.value})} placeholder="Aantal en toestand..." style={inp}/></div>
    </div>
    <div>
      <label style={lbl}>Milieuschade</label><textarea value={data.milieu||''} onChange={e=>onChange({...data,milieu:e.target.value})} rows={3} placeholder="Lekkage, verontreiniging..." style={ta}/>
      <div style={{marginTop:10}}><label style={lbl}>Geschatte hersteltijd</label><input value={data.herstelTijd||''} onChange={e=>onChange({...data,herstelTijd:e.target.value})} placeholder="Bijv. 4 uur, onbekend..." style={inp}/></div>
    </div>
  </div>
}

export function getStapPreview(subtitel, data) {
  if (!data) return '—'
  switch(subtitel) {
    case 'Waar': return data.locatie?.naam || data.locatieNaam || '—'
    case 'Wat': return data.watGezien || '—'
    case 'Wie': return data.naamMelder || '—'
    case 'Contact hulpverlener': return data.organisatie || '—'
    case 'Contact OvD': return data.naamOvd || '—'
    case 'Mobiel verkeersleider': return data.naam || '—'
    case 'Fase': return data.fase !== undefined ? `Fase ${data.fase}` : '—'
    case 'GRIP niveau': return data.grip !== undefined ? `GRIP ${data.grip}` : '—'
    case 'Omstandigheden': return data.weer || '—'
    case 'Omgeving': return data.omschrijving || '—'
    case 'Schade': return data.schadeVaartuig || '—'
    default: return '—'
  }
}

export default function ProcesstapKaart({ stap, onSave, onCancel, isNew = false }) {
  const [expanded, setExpanded] = useState(isNew)
  const [localData, setLocalData] = useState(stap.data || {})
  const [localDatum, setLocalDatum] = useState(stap.datum ? new Date(stap.datum) : new Date())

  const def = STAP_DEFINITIE[stap.subtitel] || { icon: FileText, accent: 'var(--accent-yellow)' }
  const Icon = def.icon
  const accent = def.accent
  const preview = getStapPreview(stap.subtitel, localData)

  function handleSave() {
    onSave({ ...stap, data: localData, datum: localDatum })
    setExpanded(false)
  }
  function handleCancel() {
    setLocalData(stap.data || {})
    setLocalDatum(stap.datum ? new Date(stap.datum) : new Date())
    setExpanded(false)
    if (isNew && onCancel) onCancel()
  }

  return (
    <div style={{ background:'var(--bg-surface)',border:'1px solid var(--border)',borderLeft:`3px solid ${accent}`,borderRadius:'var(--radius-md)',marginBottom:6,overflow:'hidden' }}>
      <div onClick={()=>setExpanded(!expanded)} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 12px',cursor:'pointer',background:expanded?'var(--bg-elevated)':'transparent',borderBottom:expanded?'1px solid var(--border)':'none',transition:'background 0.12s' }}>
        <div style={{ width:26,height:26,borderRadius:4,background:`${accent}20`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <Icon size={12} color={accent}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-muted)'}}>{format(localDatum,'dd-MM HH:mm')}</span>
            <span style={{fontSize:12,fontWeight:600,color:'var(--text-primary)'}}>{stap.subtitel}</span>
          </div>
          {!expanded && <div style={{color:'var(--text-muted)',fontSize:11,marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{preview}</div>}
        </div>
        {expanded ? <ChevronUp size={13} color="var(--text-muted)"/> : <ChevronDown size={13} color="var(--text-muted)"/>}
      </div>

      {expanded && (
        <div style={{padding:'14px 14px 12px'}}>
          <DTRow value={localDatum} onChange={setLocalDatum}/>
          {stap.subtitel==='Waar'                 && <WaarForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='Wat'                  && <WatForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='Wie'                  && <WieForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='Contact hulpverlener' && <ContactHulpForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='Contact OvD'          && <ContactOvdForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='Mobiel verkeersleider'&& <MobielForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='Fase'                 && <FaseForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='GRIP niveau'          && <GripForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='Omstandigheden'       && <OmstandighedenForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='Omgeving'             && <OmgevingForm data={localData} onChange={setLocalData}/>}
          {stap.subtitel==='Schade'               && <SchadeForm data={localData} onChange={setLocalData}/>}
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:14,borderTop:'1px solid var(--border)',paddingTop:10}}>
            <button onClick={handleCancel} style={btnSec}><X size={11}/> Annuleren</button>
            <button onClick={handleSave} style={btnPri}><Save size={11}/> Opslaan</button>
          </div>
        </div>
      )}
    </div>
  )
}

const btnPri = { display:'flex',alignItems:'center',gap:5,padding:'6px 14px',borderRadius:'var(--radius-sm)',background:'var(--accent-yellow)',color:'#0d0f14',fontWeight:700,fontSize:12,cursor:'pointer' }
const btnSec = { display:'flex',alignItems:'center',gap:5,padding:'6px 12px',borderRadius:'var(--radius-sm)',background:'var(--bg-hover)',color:'var(--text-secondary)',fontWeight:500,fontSize:12,cursor:'pointer',border:'1px solid var(--border-strong)' }
