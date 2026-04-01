import { useStore } from '@/store'
import {
  ClockIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UsersIcon,
  ChartBarIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from './Icons'

const NAV_ITEMS = [
  { id: 'dashboard',         label: 'Dashboard',         icon: HomeIcon },
  { id: 'mitarbeiter',       label: 'Mitarbeiter',        icon: UsersIcon },
  { id: 'auftraege',         label: 'Aufträge',           icon: BuildingOfficeIcon },
  { id: 'arbeitszeiten',     label: 'Arbeitszeiten',      icon: ClockIcon },
  { id: 'leistungsnachweise',label: 'Leistungsnachweise', icon: DocumentTextIcon },
  { id: 'wochenberichte',    label: 'Wochenberichte',     icon: CalendarDaysIcon },
  { id: 'lohnerfassung',     label: 'Lohnerfassung',      icon: ChartBarIcon },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { aktiverBereich, setAktiverBereich } = useStore()

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col shadow-xl">
        <div className="px-5 py-4 border-b border-blue-800">
          <h1 className="text-lg font-bold tracking-tight">Zeit-Erfassung</h1>
          <p className="text-xs text-blue-300 mt-0.5">Kran & Transport</p>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAktiverBereich(id)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors ${
                aktiverBereich === id
                  ? 'bg-blue-700 text-white font-medium'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-3 border-t border-blue-800">
          <p className="text-xs text-blue-400">v0.1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
