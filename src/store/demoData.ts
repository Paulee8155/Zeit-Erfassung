import { Mitarbeiter, Auftrag } from '@/types'

export const DEMO_MITARBEITER: Mitarbeiter[] = [
  {
    id: 'ma-001',
    vorname: 'Thomas',
    nachname: 'Müller',
    personalnummer: 'P001',
    stellenbezeichnung: 'Kranfahrer',
    lohnart: 'lohn',
    wochenstunden: 40,
    zeitkonto: 80,
  },
  {
    id: 'ma-002',
    vorname: 'Stefan',
    nachname: 'Schmidt',
    personalnummer: 'P002',
    stellenbezeichnung: 'LKW-Fahrer',
    lohnart: 'lohn',
    wochenstunden: 40,
    zeitkonto: 80,
  },
  {
    id: 'ma-003',
    vorname: 'Klaus',
    nachname: 'Weber',
    personalnummer: 'P003',
    stellenbezeichnung: 'BF-Fahrer',
    lohnart: 'gehalt',
    wochenstunden: 40,
    zeitkonto: 80,
  },
  {
    id: 'ma-004',
    vorname: 'Hans',
    nachname: 'Fischer',
    personalnummer: 'P004',
    stellenbezeichnung: 'Kranfahrer',
    lohnart: 'lohn',
    wochenstunden: 40,
    zeitkonto: 92,
  },
]

const heute = new Date()
const morgen = new Date(heute)
morgen.setDate(morgen.getDate() + 1)
const gestern = new Date(heute)
gestern.setDate(gestern.getDate() - 1)

function fmt(d: Date): string {
  return d.toISOString()
}

export const DEMO_AUFTRAEGE: Auftrag[] = [
  {
    id: 'auf-001',
    auftragsnummer: 'A-2024-0412',
    mitarbeiterId: 'ma-001',
    kundenname: 'Bau GmbH Süd',
    kundenadresse: 'Industriestr. 12, 80339 München',
    dispoZeitVon: fmt(gestern),
    dispoZeitBis: fmt(heute),
    status: 'in_bearbeitung',
    erstelltAm: fmt(gestern),
  },
  {
    id: 'auf-002',
    auftragsnummer: 'A-2024-0413',
    mitarbeiterId: 'ma-002',
    kundenname: 'Logistik Nord AG',
    kundenadresse: 'Hafenweg 5, 20359 Hamburg',
    dispoZeitVon: fmt(heute),
    dispoZeitBis: fmt(morgen),
    status: 'angenommen',
    erstelltAm: fmt(heute),
  },
  {
    id: 'auf-003',
    auftragsnummer: 'A-2024-0411',
    mitarbeiterId: 'ma-004',
    kundenname: 'Stadtwerke Berlin',
    kundenadresse: 'Berliner Allee 1, 10115 Berlin',
    dispoZeitVon: fmt(gestern),
    dispoZeitBis: fmt(gestern),
    status: 'abgeschlossen',
    erstelltAm: fmt(gestern),
  },
]
