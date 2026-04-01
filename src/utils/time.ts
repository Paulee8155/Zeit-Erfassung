/**
 * Berechnet Gesamtstunden aus Beginn/Ende und Pause (Minuten).
 */
export function berechneGesamtstunden(beginn: string, ende: string, pauseMinuten: number): number {
  const [bh, bm] = beginn.split(':').map(Number)
  const [eh, em] = ende.split(':').map(Number)
  const beginnMin = bh * 60 + bm
  let endeMin = eh * 60 + em
  if (endeMin < beginnMin) endeMin += 24 * 60 // Mitternacht-Überschreitung
  return Math.max(0, (endeMin - beginnMin - pauseMinuten) / 60)
}

/**
 * Gibt Überstunden zurück (> 8h/Tag).
 */
export function berechneUeberstunden(gesamtstunden: number): number {
  return Math.max(0, gesamtstunden - 8)
}

/**
 * Formatiert Stunden als "7h 30m".
 */
export function formatStunden(stunden: number): string {
  const h = Math.floor(stunden)
  const m = Math.round((stunden - h) * 60)
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/**
 * Aktuelle KW ermitteln.
 */
export function getKalenderwoche(datum: Date): number {
  const d = new Date(Date.UTC(datum.getFullYear(), datum.getMonth(), datum.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/**
 * YYYY-MM-DD aus Date.
 */
export function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/**
 * Deutsches Datumsformat DD.MM.YYYY.
 */
export function formatDatum(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}.${m}.${y}`
}

/**
 * Wochentag auf Deutsch.
 */
export function wochentag(iso: string): string {
  const tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  return tage[new Date(iso).getDay()]
}

/**
 * UUID-ähnliche ID generieren.
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}
