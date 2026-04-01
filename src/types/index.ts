// ─── Enums ───────────────────────────────────────────────────────────────────

export type Stellenbezeichnung = 'Kranfahrer' | 'LKW-Fahrer' | 'BF-Fahrer'

export type AuftragStatus =
  | 'offen'
  | 'angenommen'
  | 'in_bearbeitung'
  | 'abgeschlossen'

export type WochenberichtStatus =
  | 'entwurf'
  | 'eingereicht'
  | 'genehmigt'
  | 'abgelehnt'

export type TaetigkeitTyp =
  | 'aufbau_kran'
  | 'abbau_kran'
  | 'einsatz'
  | 'fahrt'
  | 'betriebshof'
  | 'sonstiges'

export type BetriebshofTyp = 'innerhalb' | 'ausserhalb'

// ─── Mitarbeiter ─────────────────────────────────────────────────────────────

export interface Mitarbeiter {
  id: string
  vorname: string
  nachname: string
  personalnummer: string
  stellenbezeichnung: Stellenbezeichnung
  lohnart: 'gehalt' | 'lohn'
  wochenstunden: number
  zeitkonto: number // Stunden auf dem Zeitkonto
}

// ─── Auftrag ─────────────────────────────────────────────────────────────────

export interface Auftrag {
  id: string
  auftragsnummer: string
  mitarbeiterId: string
  kundenname: string
  kundenadresse: string
  dispoZeitVon: string  // ISO datetime
  dispoZeitBis: string  // ISO datetime
  status: AuftragStatus
  erstelltAm: string
}

// ─── Tätigkeit (Leistungsnachweis-Zeile) ─────────────────────────────────────

export interface Taetigkeit {
  id: string
  leistungsnachweisId: string
  typ: TaetigkeitTyp
  zeitVon: string   // HH:mm
  zeitBis: string   // HH:mm
  beschreibung?: string
}

// ─── Leistungsnachweis ───────────────────────────────────────────────────────

export interface Leistungsnachweis {
  id: string
  auftragId: string
  mitarbeiterId: string
  datum: string   // YYYY-MM-DD
  taetigkeiten: Taetigkeit[]
  kundeUnterzeichnet: boolean
  kundeUnterschriftZeit?: string
  bemerkung?: string
}

// ─── Arbeitszeiterfassung ────────────────────────────────────────────────────

export interface Arbeitszeit {
  id: string
  mitarbeiterId: string
  datum: string          // YYYY-MM-DD
  auftragId?: string     // optional – kein Auftrag = Betriebshof
  betriebshofTyp?: BetriebshofTyp
  beginn: string         // HH:mm
  ende: string           // HH:mm
  pause: number          // Minuten
  gesamtstunden: number  // berechnet
  ueberstunden: number   // berechnet
  nachtschicht: boolean
  sonn_oder_feiertag: boolean
  bemerkung?: string
}

// ─── Betriebshof-Rapport ─────────────────────────────────────────────────────

export interface BetriebshofRapport {
  id: string
  mitarbeiterId: string
  datum: string
  typ: BetriebshofTyp
  beginn: string
  ende: string
  pause: number
  taetigkeitsBeschreibung: string
  dispoFreigabe?: boolean
  dispoFreigabeDatum?: string
}

// ─── Spesen & Zulagen ────────────────────────────────────────────────────────

export interface Zulage {
  id: string
  arbeitszeitId: string
  typ:
    | 'spesen_einfach'
    | 'spesen_doppelt'
    | 'erschwerniszulage'
    | 'nachtschichtzulage'
    | 'sonntagszulage'
    | 'feiertagszulage'
    | 'praemie'
    | 'abzug_vorschuss'
    | 'abzug_bussgeld'
    | 'sonstiges'
  betrag: number
  beschreibung?: string
}

// ─── Wochenbericht ───────────────────────────────────────────────────────────

export interface Wochenbericht {
  id: string
  mitarbeiterId: string
  kalenderwoche: number
  jahr: number
  status: WochenberichtStatus
  arbeitszeiten: Arbeitszeit[]
  zulagen: Zulage[]
  urlaubsstunden: number
  krankheitsstunden: number
  speicherstunden: number
  wochensummeStunden: number  // berechnet
  geprueftVon?: string
  geprueftAm?: string
  anmerkungPruefung?: string
}

// ─── Lohnerfassung-Tabelle (Export-Vorbereitung) ─────────────────────────────

export interface LohnerfassungsZeile {
  mitarbeiterId: string
  mitarbeiterName: string
  monat: number
  jahr: number
  gesamtstunden: number
  urlaubsstunden: number
  krankheitsstunden: number
  speicherstunden: number
  ueberstundenAuszahlung: number
  spesen: number
  erschwerniszulagen: number
  nachtschichtzulagen: number
  sonntagsFeiertagszulagen: number
  praemien: number
  abzuege: number
  zeitkontoSaldo: number
}
