import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Mitarbeiter,
  Auftrag,
  Leistungsnachweis,
  Arbeitszeit,
  Wochenbericht,
  BetriebshofRapport,
  Zulage,
} from '@/types'
import { DEMO_MITARBEITER, DEMO_AUFTRAEGE } from './demoData'

interface AppState {
  // Stammdaten
  mitarbeiter: Mitarbeiter[]
  auftraege: Auftrag[]
  leistungsnachweise: Leistungsnachweis[]
  arbeitszeiten: Arbeitszeit[]
  wochenberichte: Wochenbericht[]
  betriebshofRapporte: BetriebshofRapport[]
  zulagen: Zulage[]

  // Navigation
  aktiverBereich: string
  aktiverMitarbeiterId: string | null

  // Aktionen – Mitarbeiter
  setAktiverBereich: (bereich: string) => void
  setAktiverMitarbeiter: (id: string | null) => void

  // Aktionen – Arbeitszeit
  addArbeitszeit: (az: Arbeitszeit) => void
  updateArbeitszeit: (az: Arbeitszeit) => void
  deleteArbeitszeit: (id: string) => void

  // Aktionen – Leistungsnachweis
  addLeistungsnachweis: (ln: Leistungsnachweis) => void
  updateLeistungsnachweis: (ln: Leistungsnachweis) => void
  unterzeichneLeistungsnachweis: (id: string) => void

  // Aktionen – Wochenbericht
  addWochenbericht: (wb: Wochenbericht) => void
  updateWochenberichtStatus: (id: string, status: Wochenbericht['status'], prueferName?: string, anmerkung?: string) => void

  // Aktionen – Betriebshof
  addBetriebshofRapport: (rapport: BetriebshofRapport) => void
  updateBetriebshofRapport: (rapport: BetriebshofRapport) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      mitarbeiter: DEMO_MITARBEITER,
      auftraege: DEMO_AUFTRAEGE,
      leistungsnachweise: [],
      arbeitszeiten: [],
      wochenberichte: [],
      betriebshofRapporte: [],
      zulagen: [],

      aktiverBereich: 'dashboard',
      aktiverMitarbeiterId: null,

      setAktiverBereich: (bereich) => set({ aktiverBereich: bereich }),
      setAktiverMitarbeiter: (id) => set({ aktiverMitarbeiterId: id }),

      addArbeitszeit: (az) =>
        set((s) => ({ arbeitszeiten: [...s.arbeitszeiten, az] })),
      updateArbeitszeit: (az) =>
        set((s) => ({
          arbeitszeiten: s.arbeitszeiten.map((a) => (a.id === az.id ? az : a)),
        })),
      deleteArbeitszeit: (id) =>
        set((s) => ({ arbeitszeiten: s.arbeitszeiten.filter((a) => a.id !== id) })),

      addLeistungsnachweis: (ln) =>
        set((s) => ({ leistungsnachweise: [...s.leistungsnachweise, ln] })),
      updateLeistungsnachweis: (ln) =>
        set((s) => ({
          leistungsnachweise: s.leistungsnachweise.map((l) =>
            l.id === ln.id ? ln : l
          ),
        })),
      unterzeichneLeistungsnachweis: (id) =>
        set((s) => ({
          leistungsnachweise: s.leistungsnachweise.map((l) =>
            l.id === id
              ? { ...l, kundeUnterzeichnet: true, kundeUnterschriftZeit: new Date().toISOString() }
              : l
          ),
        })),

      addWochenbericht: (wb) =>
        set((s) => ({ wochenberichte: [...s.wochenberichte, wb] })),
      updateWochenberichtStatus: (id, status, prueferName, anmerkung) =>
        set((s) => ({
          wochenberichte: s.wochenberichte.map((w) =>
            w.id === id
              ? {
                  ...w,
                  status,
                  geprueftVon: prueferName ?? w.geprueftVon,
                  geprueftAm: new Date().toISOString(),
                  anmerkungPruefung: anmerkung ?? w.anmerkungPruefung,
                }
              : w
          ),
        })),

      addBetriebshofRapport: (rapport) =>
        set((s) => ({ betriebshofRapporte: [...s.betriebshofRapporte, rapport] })),
      updateBetriebshofRapport: (rapport) =>
        set((s) => ({
          betriebshofRapporte: s.betriebshofRapporte.map((r) =>
            r.id === rapport.id ? rapport : r
          ),
        })),
    }),
    { name: 'zeit-erfassung-store' }
  )
)
