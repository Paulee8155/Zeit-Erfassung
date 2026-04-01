import { useStore } from '@/store'
import { formatDatum, formatStunden } from '@/utils/time'

export default function Dashboard() {
  const { mitarbeiter, auftraege, arbeitszeiten, wochenberichte, leistungsnachweise } = useStore()

  const offeneAuftraege = auftraege.filter((a) => a.status !== 'abgeschlossen').length
  const nichtUnterschrieben = leistungsnachweise.filter((l) => !l.kundeUnterzeichnet).length
  const offeneWochenberichte = wochenberichte.filter(
    (w) => w.status === 'eingereicht'
  ).length

  const gesamtstundenHeute = arbeitszeiten
    .filter((az) => az.datum === new Date().toISOString().slice(0, 10))
    .reduce((sum, az) => sum + az.gesamtstunden, 0)

  const heute = new Date().toISOString().slice(0, 10)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">{formatDatum(heute)}</p>
      </div>

      {/* KPI-Karten */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Mitarbeiter"
          value={mitarbeiter.length}
          color="blue"
        />
        <KpiCard
          label="Offene Aufträge"
          value={offeneAuftraege}
          color="yellow"
        />
        <KpiCard
          label="Nicht unterschrieben"
          value={nichtUnterschrieben}
          sub="Leistungsnachweise"
          color="red"
        />
        <KpiCard
          label="Zur Prüfung"
          value={offeneWochenberichte}
          sub="Wochenberichte"
          color="green"
        />
      </div>

      {/* Heutige Aktivität */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Heutige Aufträge</h3>
          {auftraege.filter((a) => a.status !== 'abgeschlossen').length === 0 ? (
            <p className="text-gray-400 text-sm">Keine aktiven Aufträge</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-medium">Nr.</th>
                  <th className="pb-2 font-medium">Kunde</th>
                  <th className="pb-2 font-medium">Mitarbeiter</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {auftraege
                  .filter((a) => a.status !== 'abgeschlossen')
                  .map((a) => {
                    const ma = mitarbeiter.find((m) => m.id === a.mitarbeiterId)
                    return (
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 font-mono text-xs text-blue-600">{a.auftragsnummer}</td>
                        <td className="py-2">{a.kundenname}</td>
                        <td className="py-2">{ma ? `${ma.vorname} ${ma.nachname}` : '–'}</td>
                        <td className="py-2">
                          <StatusBadge status={a.status} />
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Erfasste Stunden heute</h3>
          {arbeitszeiten.filter((az) => az.datum === heute).length === 0 ? (
            <p className="text-gray-400 text-sm">Noch keine Zeiten erfasst</p>
          ) : (
            <>
              <div className="text-3xl font-bold text-blue-700 mb-3">
                {formatStunden(gesamtstundenHeute)}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2 font-medium">Mitarbeiter</th>
                    <th className="pb-2 font-medium">Von</th>
                    <th className="pb-2 font-medium">Bis</th>
                    <th className="pb-2 font-medium">Stunden</th>
                  </tr>
                </thead>
                <tbody>
                  {arbeitszeiten
                    .filter((az) => az.datum === heute)
                    .map((az) => {
                      const ma = mitarbeiter.find((m) => m.id === az.mitarbeiterId)
                      return (
                        <tr key={az.id} className="border-b border-gray-50">
                          <td className="py-2">{ma ? `${ma.vorname} ${ma.nachname}` : '–'}</td>
                          <td className="py-2">{az.beginn}</td>
                          <td className="py-2">{az.ende}</td>
                          <td className="py-2 font-medium text-blue-700">{formatStunden(az.gesamtstunden)}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: number
  sub?: string
  color: 'blue' | 'yellow' | 'red' | 'green'
}) {
  const colors = {
    blue:   'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red:    'bg-red-50 border-red-200 text-red-700',
    green:  'bg-green-50 border-green-200 text-green-700',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-1">{label}</div>
      {sub && <div className="text-xs opacity-70">{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    offen:          'bg-gray-100 text-gray-600',
    angenommen:     'bg-blue-100 text-blue-700',
    in_bearbeitung: 'bg-yellow-100 text-yellow-700',
    abgeschlossen:  'bg-green-100 text-green-700',
  }
  const labels: Record<string, string> = {
    offen:          'Offen',
    angenommen:     'Angenommen',
    in_bearbeitung: 'In Bearbeitung',
    abgeschlossen:  'Abgeschlossen',
  }
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  )
}
