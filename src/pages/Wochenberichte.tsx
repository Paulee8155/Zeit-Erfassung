import { useState } from 'react'
import { useStore } from '@/store'
import { Wochenbericht } from '@/types'
import { formatStunden, generateId, getKalenderwoche } from '@/utils/time'
import { CheckIcon, XMarkIcon, PlusIcon } from '@/components/Icons'

const STATUS_LABELS: Record<Wochenbericht['status'], string> = {
  entwurf:     'Entwurf',
  eingereicht: 'Eingereicht',
  genehmigt:   'Genehmigt',
  abgelehnt:   'Abgelehnt',
}

const STATUS_COLORS: Record<Wochenbericht['status'], string> = {
  entwurf:     'bg-gray-100 text-gray-600',
  eingereicht: 'bg-blue-100 text-blue-700',
  genehmigt:   'bg-green-100 text-green-700',
  abgelehnt:   'bg-red-100 text-red-700',
}

export default function Wochenberichte() {
  const { mitarbeiter, arbeitszeiten, wochenberichte, addWochenbericht, updateWochenberichtStatus } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [filterMa, setFilterMa] = useState('')
  const [pruefModal, setPruefModal] = useState<Wochenbericht | null>(null)

  const gefiltert = wochenberichte
    .filter((w) => !filterMa || w.mitarbeiterId === filterMa)
    .sort((a, b) => b.jahr !== a.jahr ? b.jahr - a.jahr : b.kalenderwoche - a.kalenderwoche)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Wochenberichte</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {wochenberichte.filter((w) => w.status === 'eingereicht').length} zur Prüfung
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          Wochenbericht erstellen
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
              <th className="text-left px-4 py-3 font-medium text-gray-600">KW / Jahr</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Mitarbeiter</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Arbeitsstunden</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Urlaub</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Krank</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Speicher</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Geprüft von</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {gefiltert.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-400">
                  Noch keine Wochenberichte vorhanden
                </td>
              </tr>
            ) : (
              gefiltert.map((w) => {
                const ma = mitarbeiter.find((m) => m.id === w.mitarbeiterId)
                return (
                  <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-800">KW {w.kalenderwoche}</span>
                      <span className="text-gray-400 ml-1 text-xs">/{w.jahr}</span>
                    </td>
                    <td className="px-4 py-3">
                      {ma ? `${ma.vorname} ${ma.nachname}` : '–'}
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-700">
                      {formatStunden(w.wochensummeStunden)}
                    </td>
                    <td className="px-4 py-3">{w.urlaubsstunden > 0 ? `${w.urlaubsstunden}h` : '–'}</td>
                    <td className="px-4 py-3">{w.krankheitsstunden > 0 ? `${w.krankheitsstunden}h` : '–'}</td>
                    <td className="px-4 py-3">{w.speicherstunden > 0 ? `${w.speicherstunden}h` : '–'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[w.status]}`}>
                        {STATUS_LABELS[w.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{w.geprueftVon ?? '–'}</td>
                    <td className="px-4 py-3">
                      {w.status === 'eingereicht' && (
                        <button
                          onClick={() => setPruefModal(w)}
                          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                        >
                          Prüfen
                        </button>
                      )}
                      {w.status === 'entwurf' && (
                        <button
                          onClick={() => updateWochenberichtStatus(w.id, 'eingereicht')}
                          className="text-xs border border-blue-300 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50"
                        >
                          Einreichen
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <WochenberichtFormModal
          onClose={() => setShowForm(false)}
          onSave={(wb) => { addWochenbericht(wb); setShowForm(false) }}
        />
      )}

      {pruefModal && (
        <PruefModal
          wochenbericht={pruefModal}
          onClose={() => setPruefModal(null)}
          onGenehmigen={(anmerkung, pruefer) => {
            updateWochenberichtStatus(pruefModal.id, 'genehmigt', pruefer, anmerkung)
            setPruefModal(null)
          }}
          onAblehnen={(anmerkung, pruefer) => {
            updateWochenberichtStatus(pruefModal.id, 'abgelehnt', pruefer, anmerkung)
            setPruefModal(null)
          }}
        />
      )}
    </div>
  )
}

// ─── Neuer Wochenbericht Modal ────────────────────────────────────────────────

function WochenberichtFormModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (wb: Wochenbericht) => void
}) {
  const { mitarbeiter, arbeitszeiten } = useStore()
  const jetzt = new Date()

  const [mitarbeiterId, setMitarbeiterId] = useState('')
  const [kw, setKw] = useState(getKalenderwoche(jetzt))
  const [jahr, setJahr] = useState(jetzt.getFullYear())
  const [urlaubsstunden, setUrlaubsstunden] = useState(0)
  const [krankheitsstunden, setKrankheitsstunden] = useState(0)
  const [speicherstunden, setSpeicherstunden] = useState(0)

  // Arbeitsstunden aus vorhandenen Einträgen der KW automatisch zusammenrechnen
  // (vereinfacht: alle Einträge des Mitarbeiters in dieser KW)
  const relevantAz = arbeitszeiten.filter((az) => {
    if (az.mitarbeiterId !== mitarbeiterId) return false
    const d = new Date(az.datum)
    return getKalenderwoche(d) === kw && d.getFullYear() === jahr
  })
  const wochensumme = relevantAz.reduce((s, az) => s + az.gesamtstunden, 0)

  function handleSave() {
    if (!mitarbeiterId) return
    const wb: Wochenbericht = {
      id: generateId(),
      mitarbeiterId,
      kalenderwoche: kw,
      jahr,
      status: 'entwurf',
      arbeitszeiten: relevantAz,
      zulagen: [],
      urlaubsstunden,
      krankheitsstunden,
      speicherstunden,
      wochensummeStunden: wochensumme,
    }
    onSave(wb)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Wochenbericht erstellen</h3>
          <button onClick={onClose}><XMarkIcon className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mitarbeiter *</label>
            <select
              value={mitarbeiterId}
              onChange={(e) => setMitarbeiterId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Bitte wählen …</option>
              {mitarbeiter.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.vorname} {m.nachname}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kalenderwoche</label>
              <input
                type="number"
                value={kw}
                onChange={(e) => setKw(Number(e.target.value))}
                min={1}
                max={53}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jahr</label>
              <input
                type="number"
                value={jahr}
                onChange={(e) => setJahr(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {mitarbeiterId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Erfasste Arbeitsstunden (KW {kw}):</span>
                <span className="font-bold text-blue-800">{formatStunden(wochensumme)}</span>
              </div>
              <div className="text-xs text-blue-500 mt-0.5">{relevantAz.length} Einträge gefunden</div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urlaub (h)</label>
              <input
                type="number"
                value={urlaubsstunden}
                onChange={(e) => setUrlaubsstunden(Number(e.target.value))}
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Krank (h)</label>
              <input
                type="number"
                value={krankheitsstunden}
                onChange={(e) => setKrankheitsstunden(Number(e.target.value))}
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speicher (h)</label>
              <input
                type="number"
                value={speicherstunden}
                onChange={(e) => setSpeicherstunden(Number(e.target.value))}
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={!mitarbeiterId}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40"
          >
            Erstellen
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Prüf-Modal ───────────────────────────────────────────────────────────────

function PruefModal({
  wochenbericht,
  onClose,
  onGenehmigen,
  onAblehnen,
}: {
  wochenbericht: Wochenbericht
  onClose: () => void
  onGenehmigen: (anmerkung: string, pruefer: string) => void
  onAblehnen: (anmerkung: string, pruefer: string) => void
}) {
  const { mitarbeiter } = useStore()
  const [anmerkung, setAnmerkung] = useState('')
  const [pruefer, setPruefer] = useState('')
  const ma = mitarbeiter.find((m) => m.id === wochenbericht.mitarbeiterId)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Wochenbericht prüfen</h3>
          <p className="text-sm text-gray-500">
            {ma ? `${ma.vorname} ${ma.nachname}` : '–'} · KW {wochenbericht.kalenderwoche}/{wochenbericht.jahr}
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Arbeitsstunden:</span>
              <span className="font-medium">{formatStunden(wochenbericht.wochensummeStunden)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Urlaub:</span>
              <span>{wochenbericht.urlaubsstunden}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Krank:</span>
              <span>{wochenbericht.krankheitsstunden}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Speicherstunden:</span>
              <span>{wochenbericht.speicherstunden}h</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geprüft von *</label>
            <input
              type="text"
              value={pruefer}
              onChange={(e) => setPruefer(e.target.value)}
              placeholder="Name des Prüfers …"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anmerkung</label>
            <textarea
              value={anmerkung}
              onChange={(e) => setAnmerkung(e.target.value)}
              rows={3}
              placeholder="Hinweise, Korrekturen …"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Abbrechen
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onAblehnen(anmerkung, pruefer)}
              disabled={!pruefer}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40"
            >
              <XMarkIcon className="w-4 h-4" />
              Ablehnen
            </button>
            <button
              onClick={() => onGenehmigen(anmerkung, pruefer)}
              disabled={!pruefer}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40"
            >
              <CheckIcon className="w-4 h-4" />
              Genehmigen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
