import { useState } from 'react'
import { useStore } from '@/store'
import { Arbeitszeit, Stellenbezeichnung } from '@/types'
import {
  berechneGesamtstunden,
  berechneUeberstunden,
  formatDatum,
  formatStunden,
  generateId,
  toDateString,
  wochentag,
} from '@/utils/time'
import { PlusIcon, PencilIcon, TrashIcon } from '@/components/Icons'

export default function Arbeitszeiten() {
  const { mitarbeiter, auftraege, arbeitszeiten, addArbeitszeit, updateArbeitszeit, deleteArbeitszeit } =
    useStore()
  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState<Arbeitszeit | null>(null)
  const [filterMa, setFilterMa] = useState('')

  const gefiltert = arbeitszeiten.filter((az) => {
    if (!filterMa) return true
    return az.mitarbeiterId === filterMa
  }).sort((a, b) => b.datum.localeCompare(a.datum))

  const gesamtStunden = gefiltert.reduce((s, az) => s + az.gesamtstunden, 0)

  function handleEdit(az: Arbeitszeit) {
    setEditEntry(az)
    setShowForm(true)
  }

  function handleDelete(id: string) {
    if (confirm('Eintrag wirklich löschen?')) deleteArbeitszeit(id)
  }

  function handleClose() {
    setShowForm(false)
    setEditEntry(null)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Arbeitszeiten</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {gefiltert.length} Einträge · Gesamt: {formatStunden(gesamtStunden)}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Neue Arbeitszeit
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

      {/* Tabelle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Datum</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Mitarbeiter</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Auftrag / Betriebshof</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Beginn</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ende</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Pause</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Gesamt</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Überstunden</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Besonders</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {gefiltert.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-gray-400">
                  Noch keine Arbeitszeiten erfasst
                </td>
              </tr>
            ) : (
              gefiltert.map((az) => {
                const ma = mitarbeiter.find((m) => m.id === az.mitarbeiterId)
                const auf = auftraege.find((a) => a.id === az.auftragId)
                return (
                  <tr key={az.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>{formatDatum(az.datum)}</div>
                      <div className="text-xs text-gray-400">{wochentag(az.datum)}</div>
                    </td>
                    <td className="px-4 py-3">
                      {ma ? `${ma.vorname} ${ma.nachname}` : '–'}
                      {ma && (
                        <div className="text-xs text-gray-400">{ma.stellenbezeichnung}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {auf ? (
                        <span className="font-mono text-xs text-blue-600">{auf.auftragsnummer}</span>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Betriebshof {az.betriebshofTyp === 'ausserhalb' ? '(außerh.)' : '(innerh.)'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">{az.beginn}</td>
                    <td className="px-4 py-3 font-mono">{az.ende}</td>
                    <td className="px-4 py-3">{az.pause} Min.</td>
                    <td className="px-4 py-3 font-medium text-blue-700">{formatStunden(az.gesamtstunden)}</td>
                    <td className="px-4 py-3">
                      {az.ueberstunden > 0 ? (
                        <span className="text-orange-600 font-medium">+{formatStunden(az.ueberstunden)}</span>
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {az.nachtschicht && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Nacht</span>
                        )}
                        {az.sonn_oder_feiertag && (
                          <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">So/FT</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(az)} className="text-blue-600 hover:text-blue-800">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(az.id)} className="text-red-500 hover:text-red-700">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ArbeitszeitFormModal
          entry={editEntry}
          onClose={handleClose}
          onSave={(az) => {
            if (editEntry) updateArbeitszeit(az)
            else addArbeitszeit(az)
            handleClose()
          }}
        />
      )}
    </div>
  )
}

// ─── Modal-Formular ───────────────────────────────────────────────────────────

interface ModalProps {
  entry: Arbeitszeit | null
  onClose: () => void
  onSave: (az: Arbeitszeit) => void
}

function ArbeitszeitFormModal({ entry, onClose, onSave }: ModalProps) {
  const { mitarbeiter, auftraege } = useStore()

  const [mitarbeiterId, setMitarbeiterId] = useState(entry?.mitarbeiterId ?? '')
  const [datum, setDatum] = useState(entry?.datum ?? toDateString(new Date()))
  const [auftragId, setAuftragId] = useState(entry?.auftragId ?? '')
  const [istBetriebshof, setIstBetriebshof] = useState(!entry?.auftragId)
  const [betriebshofTyp, setBetriebshofTyp] = useState<'innerhalb' | 'ausserhalb'>(
    entry?.betriebshofTyp ?? 'innerhalb'
  )
  const [beginn, setBeginn] = useState(entry?.beginn ?? '07:00')
  const [ende, setEnde] = useState(entry?.ende ?? '16:00')
  const [pause, setPause] = useState(entry?.pause ?? 30)
  const [nachtschicht, setNachtschicht] = useState(entry?.nachtschicht ?? false)
  const [sonnFeiertag, setSonnFeiertag] = useState(entry?.sonn_oder_feiertag ?? false)
  const [bemerkung, setBemerkung] = useState(entry?.bemerkung ?? '')

  const gesamtstunden = berechneGesamtstunden(beginn, ende, pause)
  const ueberstunden = berechneUeberstunden(gesamtstunden)

  // Nur Aufträge des gewählten Mitarbeiters
  const maAuftraege = auftraege.filter((a) => a.mitarbeiterId === mitarbeiterId)

  // Stellenbezeichnung des gewählten Mitarbeiters
  const selectedMa = mitarbeiter.find((m) => m.id === mitarbeiterId)
  const istKranfahrer = (selectedMa?.stellenbezeichnung as Stellenbezeichnung) === 'Kranfahrer'

  function handleSave() {
    if (!mitarbeiterId || !datum || !beginn || !ende) return

    const az: Arbeitszeit = {
      id: entry?.id ?? generateId(),
      mitarbeiterId,
      datum,
      auftragId: istBetriebshof ? undefined : (auftragId || undefined),
      betriebshofTyp: istBetriebshof ? betriebshofTyp : undefined,
      beginn,
      ende,
      pause,
      gesamtstunden,
      ueberstunden,
      nachtschicht,
      sonn_oder_feiertag: sonnFeiertag,
      bemerkung: bemerkung || undefined,
    }
    onSave(az)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {entry ? 'Arbeitszeit bearbeiten' : 'Neue Arbeitszeit erfassen'}
          </h3>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Mitarbeiter */}
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
            {istKranfahrer && (
              <p className="text-xs text-blue-600 mt-1">
                Kranfahrer: Auf-/Abbau im Leistungsnachweis erfassen!
              </p>
            )}
          </div>

          {/* Datum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum *</label>
            <input
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Auftrag oder Betriebshof */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Einsatzart *</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={!istBetriebshof}
                  onChange={() => setIstBetriebshof(false)}
                />
                Kundenauftrag
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={istBetriebshof}
                  onChange={() => setIstBetriebshof(true)}
                />
                Betriebshof-Rapport
              </label>
            </div>

            {!istBetriebshof ? (
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
            ) : (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={betriebshofTyp === 'innerhalb'}
                    onChange={() => setBetriebshofTyp('innerhalb')}
                  />
                  Innerhalb Betriebshof
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={betriebshofTyp === 'ausserhalb'}
                    onChange={() => setBetriebshofTyp('ausserhalb')}
                  />
                  Außerhalb Betriebshof
                </label>
              </div>
            )}
          </div>

          {/* Zeiten */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beginn *</label>
              <input
                type="time"
                value={beginn}
                onChange={(e) => setBeginn(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ende *</label>
              <input
                type="time"
                value={ende}
                onChange={(e) => setEnde(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pause (Min.)</label>
              <input
                type="number"
                value={pause}
                onChange={(e) => setPause(Number(e.target.value))}
                min={0}
                step={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Berechnung */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Gesamtstunden:</span>
              <span className="font-bold text-blue-800">{formatStunden(gesamtstunden)}</span>
            </div>
            {ueberstunden > 0 && (
              <div className="flex justify-between mt-1">
                <span className="text-orange-600">Überstunden:</span>
                <span className="font-bold text-orange-700">+{formatStunden(ueberstunden)}</span>
              </div>
            )}
          </div>

          {/* Sondermerkmale */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={nachtschicht}
                onChange={(e) => setNachtschicht(e.target.checked)}
                className="rounded"
              />
              Nachtschicht
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sonnFeiertag}
                onChange={(e) => setSonnFeiertag(e.target.checked)}
                className="rounded"
              />
              Sonntag / Feiertag
            </label>
          </div>

          {/* Bemerkung */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bemerkung</label>
            <textarea
              value={bemerkung}
              onChange={(e) => setBemerkung(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
              placeholder="Optional …"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={!mitarbeiterId || !datum || !beginn || !ende}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  )
}
