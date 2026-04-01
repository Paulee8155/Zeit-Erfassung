import { useStore } from '@/store'
import { formatDatum } from '@/utils/time'

const STATUS_LABELS: Record<string, string> = {
  offen:          'Offen',
  angenommen:     'Angenommen',
  in_bearbeitung: 'In Bearbeitung',
  abgeschlossen:  'Abgeschlossen',
}

const STATUS_COLORS: Record<string, string> = {
  offen:          'bg-gray-100 text-gray-600',
  angenommen:     'bg-blue-100 text-blue-700',
  in_bearbeitung: 'bg-yellow-100 text-yellow-700',
  abgeschlossen:  'bg-green-100 text-green-700',
}

export default function Auftraege() {
  const { auftraege, mitarbeiter } = useStore()

  const sorted = [...auftraege].sort((a, b) => b.erstelltAm.localeCompare(a.erstelltAm))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Aufträge</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {auftraege.filter((a) => a.status !== 'abgeschlossen').length} aktive Aufträge
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Auftragsnr.</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Kunde</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Adresse</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Mitarbeiter</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Dispo Von</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Dispo Bis</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((auf) => {
              const ma = mitarbeiter.find((m) => m.id === auf.mitarbeiterId)
              return (
                <tr key={auf.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium">
                    {auf.auftragsnummer}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{auf.kundenname}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{auf.kundenadresse}</td>
                  <td className="px-4 py-3">
                    {ma ? (
                      <div>
                        <div>{ma.vorname} {ma.nachname}</div>
                        <div className="text-xs text-gray-400">{ma.stellenbezeichnung}</div>
                      </div>
                    ) : '–'}
                  </td>
                  <td className="px-4 py-3">{formatDatum(auf.dispoZeitVon.slice(0, 10))}</td>
                  <td className="px-4 py-3">{formatDatum(auf.dispoZeitBis.slice(0, 10))}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[auf.status]}`}>
                      {STATUS_LABELS[auf.status]}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
