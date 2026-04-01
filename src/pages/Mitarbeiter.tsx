import { useStore } from '@/store'
import { formatStunden } from '@/utils/time'

export default function Mitarbeiter() {
  const { mitarbeiter, arbeitszeiten } = useStore()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mitarbeiter</h2>
        <p className="text-sm text-gray-500 mt-0.5">{mitarbeiter.length} Mitarbeiter</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Personal-Nr.</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Stellenbezeichnung</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Lohnart</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Wochenstunden</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Zeitkonto</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Gesamtstunden (ges.)</th>
            </tr>
          </thead>
          <tbody>
            {mitarbeiter.map((ma) => {
              const stunden = arbeitszeiten
                .filter((az) => az.mitarbeiterId === ma.id)
                .reduce((s, az) => s + az.gesamtstunden, 0)

              return (
                <tr key={ma.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{ma.personalnummer}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {ma.vorname} {ma.nachname}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      ma.stellenbezeichnung === 'Kranfahrer'
                        ? 'bg-orange-100 text-orange-700'
                        : ma.stellenbezeichnung === 'LKW-Fahrer'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {ma.stellenbezeichnung}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{ma.lohnart}</td>
                  <td className="px-4 py-3">{ma.wochenstunden}h</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${ma.zeitkonto > 80 ? 'text-orange-600' : 'text-green-600'}`}>
                      {ma.zeitkonto}h
                    </span>
                    {ma.zeitkonto > 80 && (
                      <span className="text-xs text-orange-500 ml-1">(+{ma.zeitkonto - 80}h über Soll)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-blue-700 font-medium">
                    {stunden > 0 ? formatStunden(stunden) : '–'}
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
