import { useState } from 'react'
import { useStore } from '@/store'
import { Leistungsnachweis, Taetigkeit, TaetigkeitTyp } from '@/types'
import { formatDatum, generateId, toDateString } from '@/utils/time'
import { CheckIcon, PlusIcon, XMarkIcon } from '@/components/Icons'

const TAETIGKEITS_LABELS: Record<TaetigkeitTyp, string> = {
  aufbau_kran:  'Aufbau Kran',
  abbau_kran:   'Abbau Kran',
  einsatz:      'Einsatz beim Kunden',
  fahrt:        'An-/Abfahrt',
  betriebshof:  'Betriebshof',
  sonstiges:    'Sonstiges',
}

export default function Leistungsnachweise() {
  const { mitarbeiter, auftraege, leistungsnachweise, addLeistungsnachweis, updateLeistungsnachweis, unterzeichneLeistungsnachweis } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState<Leistungsnachweis | null>(null)
  const [filterMa, setFilterMa] = useState('')

  const gefiltert = leistungsnachweise
    .filter((l) => !filterMa || l.mitarbeiterId === filterMa)
    .sort((a, b) => b.datum.localeCompare(a.datum))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leistungsnachweise</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {gefiltert.filter((l) => !l.kundeUnterzeichnet).length} noch nicht unterschrieben
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          Neuer Leistungsnachweis
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <label className="text-sm text-gray-600 font-medium mr-3">Mitarbeiter:</label>
        <select
          value={filterMa}
          onChange={(e) => setFilterMa(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
        >
          <option value="">Alle</option>
          {mitarbeiter.map((m) => (
            <option key={m.id} value={m.id}>
              {m.vorname} {m.nachname}
            </option>
          ))}
        </select>
      </div>

      {/* Karten */}
      <div className="space-y-3">
        {gefiltert.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
            Noch keine Leistungsnachweise erfasst
          </div>
        ) : (
          gefiltert.map((ln) => {
            const ma = mitarbeiter.find((m) => m.id === ln.mitarbeiterId)
            const auf = auftraege.find((a) => a.id === ln.auftragId)
            return (
              <div
                key={ln.id}
                className={`bg-white rounded-xl border shadow-sm p-5 ${
                  ln.kundeUnterzeichnet ? 'border-green-200' : 'border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-blue-600">
                        {auf?.auftragsnummer ?? '–'}
                      </span>
                      <span className="text-gray-800 font-medium">
                        {auf?.kundenname ?? 'Unbekannter Kunde'}
                      </span>
                      {ln.kundeUnterzeichnet ? (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          <CheckIcon className="w-3 h-3" />
                          Unterschrieben
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                          Ausstehend
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ma ? `${ma.vorname} ${ma.nachname}` : '–'} · {formatDatum(ln.datum)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!ln.kundeUnterzeichnet && (
                      <button
                        onClick={() => unterzeichneLeistungsnachweis(ln.id)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700"
                      >
                        <CheckIcon className="w-3.5 h-3.5" />
                        Unterschrift bestätigen
                      </button>
                    )}
                    <button
                      onClick={() => { setEditEntry(ln); setShowForm(true) }}
                      className="text-sm text-blue-600 border border-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-50"
                    >
                      Bearbeiten
                    </button>
                  </div>
                </div>

                {/* Tätigkeiten */}
                {ln.taetigkeiten.length > 0 && (
                  <div className="mt-4">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="text-left text-gray-500 text-xs border-b border-gray-200">
                          <th className="pb-1.5 font-medium">Tätigkeit</th>
                          <th className="pb-1.5 font-medium">Von</th>
                          <th className="pb-1.5 font-medium">Bis</th>
                          <th className="pb-1.5 font-medium">Beschreibung</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ln.taetigkeiten.map((t) => (
                          <tr key={t.id} className="border-b border-gray-50">
                            <td className="py-1.5">
                              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                t.typ === 'aufbau_kran' || t.typ === 'abbau_kran'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {TAETIGKEITS_LABELS[t.typ]}
                              </span>
                            </td>
                            <td className="py-1.5 font-mono">{t.zeitVon}</td>
                            <td className="py-1.5 font-mono">{t.zeitBis}</td>
                            <td className="py-1.5 text-gray-500">{t.beschreibung ?? '–'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {ln.bemerkung && (
                  <div className="mt-3 text-sm text-gray-500 italic">
                    Bemerkung: {ln.bemerkung}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {showForm && (
        <LeistungsnachweisFormModal
          entry={editEntry}
          onClose={() => { setShowForm(false); setEditEntry(null) }}
          onSave={(ln) => {
            if (editEntry) updateLeistungsnachweis(ln)
            else addLeistungsnachweis(ln)
            setShowForm(false)
            setEditEntry(null)
          }}
        />
      )}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  entry: Leistungsnachweis | null
  onClose: () => void
  onSave: (ln: Leistungsnachweis) => void
}

function LeistungsnachweisFormModal({ entry, onClose, onSave }: ModalProps) {
  const { mitarbeiter, auftraege } = useStore()

  const [mitarbeiterId, setMitarbeiterId] = useState(entry?.mitarbeiterId ?? '')
  const [auftragId, setAuftragId] = useState(entry?.auftragId ?? '')
  const [datum, setDatum] = useState(entry?.datum ?? toDateString(new Date()))
  const [taetigkeiten, setTaetigkeiten] = useState<Taetigkeit[]>(entry?.taetigkeiten ?? [])
  const [bemerkung, setBemerkung] = useState(entry?.bemerkung ?? '')

  const maAuftraege = auftraege.filter((a) => a.mitarbeiterId === mitarbeiterId)
  const selectedMa = mitarbeiter.find((m) => m.id === mitarbeiterId)
  const istKranfahrer = selectedMa?.stellenbezeichnung === 'Kranfahrer'

  function addTaetigkeit() {
    const neu: Taetigkeit = {
      id: generateId(),
      leistungsnachweisId: entry?.id ?? '',
      typ: 'einsatz',
      zeitVon: '07:00',
      zeitBis: '16:00',
    }
    setTaetigkeiten([...taetigkeiten, neu])
  }

  function updateTaetigkeit(id: string, field: keyof Taetigkeit, value: string) {
    setTaetigkeiten(taetigkeiten.map((t) => t.id === id ? { ...t, [field]: value } : t))
  }

  function removeTaetigkeit(id: string) {
    setTaetigkeiten(taetigkeiten.filter((t) => t.id !== id))
  }

  function handleSave() {
    if (!mitarbeiterId || !auftragId || !datum) return
    const id = entry?.id ?? generateId()
    const ln: Leistungsnachweis = {
      id,
      auftragId,
      mitarbeiterId,
      datum,
      taetigkeiten: taetigkeiten.map((t) => ({ ...t, leistungsnachweisId: id })),
      kundeUnterzeichnet: entry?.kundeUnterzeichnet ?? false,
      kundeUnterschriftZeit: entry?.kundeUnterschriftZeit,
      bemerkung: bemerkung || undefined,
    }
    onSave(ln)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {entry ? 'Leistungsnachweis bearbeiten' : 'Neuer Leistungsnachweis'}
          </h3>
          <button onClick={onClose}><XMarkIcon className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
          {/* Mitarbeiter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mitarbeiter *</label>
              <select
                value={mitarbeiterId}
                onChange={(e) => { setMitarbeiterId(e.target.value); setAuftragId('') }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Bitte wählen …</option>
                {mitarbeiter.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.vorname} {m.nachname} ({m.stellenbezeichnung})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum *</label>
              <input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Auftrag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auftrag *</label>
            <select
              value={auftragId}
              onChange={(e) => setAuftragId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Auftrag wählen …</option>
              {maAuftraege.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.auftragsnummer} – {a.kundenname}
                </option>
              ))}
            </select>
          </div>

          {/* Tätigkeiten */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Tätigkeiten</label>
              {istKranfahrer && (
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                  Kranfahrer: Auf-/Abbau pflichtmäßig erfassen
                </span>
              )}
            </div>

            <div className="space-y-2">
              {taetigkeiten.map((t) => (
                <div key={t.id} className="flex gap-2 items-start bg-gray-50 rounded-lg p-3">
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    <select
                      value={t.typ}
                      onChange={(e) => updateTaetigkeit(t.id, 'typ', e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1.5"
                    >
                      {(Object.entries(TAETIGKEITS_LABELS) as [TaetigkeitTyp, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={t.zeitVon}
                      onChange={(e) => updateTaetigkeit(t.id, 'zeitVon', e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1.5"
                    />
                    <input
                      type="time"
                      value={t.zeitBis}
                      onChange={(e) => updateTaetigkeit(t.id, 'zeitBis', e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1.5"
                    />
                    <input
                      type="text"
                      value={t.beschreibung ?? ''}
                      onChange={(e) => updateTaetigkeit(t.id, 'beschreibung', e.target.value)}
                      placeholder="Beschreibung …"
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1.5"
                    />
                  </div>
                  <button onClick={() => removeTaetigkeit(t.id)} className="text-red-500 hover:text-red-700 mt-1">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addTaetigkeit}
              className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="w-4 h-4" />
              Tätigkeit hinzufügen
            </button>
          </div>

          {/* Bemerkung */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bemerkung</label>
            <textarea
              value={bemerkung}
              onChange={(e) => setBemerkung(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={!mitarbeiterId || !auftragId || !datum}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  )
}
