import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const navLinks = [
    { label: 'DASHBOARD', path: '/dashboard' },
    { label: 'GROUPS', path: '/groups' },
    { label: 'FRIENDS', path: '/friends' },
    { label: 'HISTORY', path: '/history' },
  ]

  return (
    <header className="bg-white flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 border-b-4 border-black shadow-[0_4px_0_0_#000]">
      <div className="flex items-center gap-4">
        <Link to="/">
          <h1 className="text-3xl font-space font-black text-black italic tracking-tighter uppercase">
            SPLITBILL
          </h1>
        </Link>
      </div>

      <nav className="hidden md:flex gap-8 items-center font-space font-black uppercase tracking-tighter">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className={`px-2 transition-all active:translate-y-1 active:shadow-none ${
              location.pathname === link.path
                ? 'text-black border-b-4 border-black'
                : 'text-zinc-600 hover:bg-yellow-400 hover:text-black'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-black p-2 border-2 border-transparent hover:border-black hover:bg-yellow-400 transition-all active:translate-y-1">
          notifications
        </button>
        <Link
          to="/profile"
          className="material-symbols-outlined text-black p-2 border-2 border-transparent hover:border-black hover:bg-yellow-400 transition-all active:translate-y-1"
        >
          account_circle
        </Link>
      </div>
    </header>
  )
}

export default Navbar
