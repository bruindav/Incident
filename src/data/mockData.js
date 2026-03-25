// src/data/mockData.js // V1 
import { format, subHours, subDays, subMonths } from 'date-fns'

const now = new Date()

export const GEBEURTENIS_TYPES = {
  INCIDENT: 'Incident',
  BEPERKING: 'Beperking',
  STREMMING: 'Stremming',
  STORING: 'Storing',
}

export const STATUS_TYPES = {
  AANGEMELD: 'Aangemeld',
  IN_BEHANDELING: 'In behandeling',
  AFGEHANDELD: 'Afgehandeld',
  GESLOTEN: 'Gesloten',
}

export const PRIO_TYPES = {
  LAAG: 'Laag',
  MIDDEL: 'Middel',
  HOOG: 'Hoog',
  KRITIEK: 'Kritiek',
}

export const initialGebeurtenissen = [
  {
    id: 'G001',
    type: GEBEURTENIS_TYPES.INCIDENT,
    titel: 'Incident - Doorslagsluis - Doorslagsluis',
    status: STATUS_TYPES.AANGEMELD,
    prio: 'Fase 0',
    tab: 'actueel',
    aangemeldDoor: 'DB',
    aangemeldOp: subHours(now, 4),
    gewijzigdOp: subHours(now, 0.5),
    gewijzigdDoor: 'DB',
    dossiernummer: '#41008846',
    beschrijving: '- van 25-03-2026 11:16 verwacht tot onbekend',
    samenvatting: {
      constatering: subHours(now, 4),
      eersteContact: null,
      contactOvd: null,
      looptijd: '04:05',
      einde: null,
    },
    processtappen: [
      {
        id: 'PS001',
        type: 'Constatering incident',
        subtitel: 'Wat',
        tijdstip: subHours(now, 4),
        datum: subHours(now, 4),
        data: {
          watGezien: 'dsdsdsd',
          gewensteHulp: '',
        }
      },
      {
        id: 'PS002',
        type: 'Constatering incident',
        subtitel: 'Waar',
        tijdstip: subHours(now, 4),
        datum: subHours(now, 4),
        data: {
          locatieNaam: 'Doorslagsluis',
          locatieType: 'Sluis',
          nadereLocatie: '',
          coords: [52.3, 4.9],
        }
      },
    ]
  },
  {
    id: 'G002',
    type: GEBEURTENIS_TYPES.BEPERKING,
    titel: 'Beperking - Doorslagsluis - Gehele object',
    status: STATUS_TYPES.IN_BEHANDELING,
    prio: null,
    tab: 'actueel',
    aangemeldDoor: 'DB',
    aangemeldOp: subDays(now, 33),
    gewijzigdOp: subHours(now, 1),
    gewijzigdDoor: 'DB',
    dossiernummer: '#90566025',
    beschrijving: 'Gepland onderhoud van 19-02-2026 13:47 verwacht tot onbekend',
    samenvatting: {},
    processtappen: []
  },
  {
    id: 'G003',
    type: GEBEURTENIS_TYPES.STREMMING,
    titel: 'Stremming - Doorslagsluis - Doorslagsluis',
    status: STATUS_TYPES.IN_BEHANDELING,
    prio: null,
    tab: 'actueel',
    aangemeldDoor: 'RH',
    aangemeldOp: subMonths(now, 4),
    gewijzigdOp: subDays(now, 70),
    gewijzigdDoor: 'RH',
    dossiernummer: '#77801493',
    beschrijving: 'Ongepland onderhoud van 20-11-2025 11:18 verwacht tot 20-11-2025 15:18',
    samenvatting: {},
    processtappen: []
  },
  {
    id: 'G004',
    type: GEBEURTENIS_TYPES.STORING,
    titel: 'Storing - Doorslagsluis - i.r.t. Kunstwerk',
    status: STATUS_TYPES.IN_BEHANDELING,
    prio: PRIO_TYPES.LAAG,
    tab: 'actueel',
    aangemeldDoor: 'RH',
    aangemeldOp: subMonths(now, 3),
    gewijzigdOp: subDays(now, 72),
    gewijzigdDoor: 'RH',
    dossiernummer: '#98783878',
    beschrijving: 'Kunstwerk van 01-12-2025 17:03 verwacht tot onbekend',
    samenvatting: {},
    processtappen: []
  },
  {
    id: 'G005',
    type: GEBEURTENIS_TYPES.INCIDENT,
    titel: 'Incident - Amsterdam-Rijnkanaal - Schip in problemen',
    status: STATUS_TYPES.AFGEHANDELD,
    prio: PRIO_TYPES.HOOG,
    tab: 'historie',
    aangemeldDoor: 'JK',
    aangemeldOp: subDays(now, 5),
    gewijzigdOp: subDays(now, 5),
    gewijzigdDoor: 'JK',
    dossiernummer: '#77123456',
    beschrijving: '15-03-2026 - schip vastgelopen, hulpverlening ingeschakeld',
    samenvatting: {},
    processtappen: []
  },
]
