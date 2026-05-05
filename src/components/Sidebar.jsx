import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { icon: 'dashboard', label: 'DASHBOARD', path: '/dashboard' },
  { icon: 'group', label: 'GROUPS', path: '/group/1' },
  { icon: 'person', label: 'FRIENDS', path: '/friends' },
  { icon: 'history', label: 'HISTORY', path: '/history' },
]

function Sidebar({ activePage = '/dashboard' }) {
  const location = useLocation()
  const currentPath = activePage || location.pathname

  return (
    <aside className="hidden lg:flex flex-col h-full sticky left-0 top-0 overflow-y-auto h-screen w-64 border-r-4 border-black bg-white">
      {/* User Profile */}
      <div className="p-6 border-b-4 border-black">
        <h1 className="font-space font-black text-xl italic tracking-tighter uppercase">
          SPLITBILL.KUY
        </h1>
        <p className="font-label-caps text-xs text-zinc-500 mt-2">NO_DRAMA_ZONE</p>
      </div>

      {/* Navigation */}
      <div className="flex-grow py-4">
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`m-2 px-4 py-3 flex items-center gap-3 font-space font-bold uppercase transition-transform hover:translate-x-1 active:translate-x-2 ${
                  isActive
                    ? 'bg-yellow-400 text-black border-2 border-black shadow-[4px_4px_0_0_#000]'
                    : 'text-black border-2 border-transparent hover:border-black'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Info */}
      <div className="p-4 border-t-4 border-black">
        <div className="flex items-center gap-3 bg-zinc-100 p-2 border-2 border-black">
          <div className="w-10 h-10 border-2 border-black bg-yellow-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">person</span>
          </div>
          <div>
            <p className="font-body-bold text-sm">USER_01</p>
            <p className="text-[10px] font-label-caps text-zinc-500">PRO_SPLITTER</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
