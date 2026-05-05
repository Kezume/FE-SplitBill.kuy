import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const friends = [
  { name: 'BUDI_DOREMI', status: 'LUNAS', statusColor: 'text-secondary', avatar: 'bg-blue-400', mutual: 3 },
  { name: 'SITI_KEREN', status: 'HUTANG RP 45.000', statusColor: 'text-error', avatar: 'bg-pink-400', mutual: 5 },
  { name: 'ANDI_PUNK', status: 'LUNAS', statusColor: 'text-secondary', avatar: 'bg-green-400', mutual: 2 },
  { name: 'SARAH_CORE', status: 'HUTANG RP 30.000', statusColor: 'text-error', avatar: 'bg-purple-400', mutual: 4 },
  { name: 'REZA_GAMING', status: 'LUNAS', statusColor: 'text-secondary', avatar: 'bg-orange-400', mutual: 1 },
  { name: 'DINA_CHEF', status: 'HUTANG RP 15.000', statusColor: 'text-error', avatar: 'bg-yellow-400', mutual: 6 },
]

function Friends() {
  return (
    <div className="bg-background font-body-reg text-on-background min-h-screen flex flex-col">
      <Navbar />
      <main className="p-6 md:p-10 space-y-10 flex-grow max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline-xl uppercase">FRIENDS_LIST</h1>
            <p className="font-label-caps text-zinc-500 mt-2">
              TEMAN SEPERJUANGAN SPLIT BILL
            </p>
          </div>
          <button className="bg-secondary-container text-black font-space font-black uppercase border-4 border-black px-6 py-3 neubrutal-shadow active-press flex items-center gap-2 hover:bg-green-300 transition-colors">
            <span className="material-symbols-outlined">person_add</span>
            TAMBAH TEMAN
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            search
          </span>
          <input
            type="text"
            placeholder="CARI_TEMAN..."
            className="w-full p-4 pl-14 border-4 border-black font-body-reg placeholder:text-zinc-400 bg-white neubrutal-shadow-sm"
          />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-4 border-black p-4 neubrutal-shadow-sm flex items-center gap-4">
            <div className="bg-black text-white p-2">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <p className="font-label-caps text-zinc-500 text-xs">TOTAL TEMAN</p>
              <p className="font-headline-lg">{friends.length}</p>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4 neubrutal-shadow-sm flex items-center gap-4">
            <div className="bg-secondary-container text-black p-2 border-2 border-black">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="font-label-caps text-zinc-500 text-xs">SEMUA LUNAS</p>
              <p className="font-headline-lg text-secondary">{friends.filter(f => f.status === 'LUNAS').length}</p>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4 neubrutal-shadow-sm flex items-center gap-4">
            <div className="bg-tertiary text-white p-2">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div>
              <p className="font-label-caps text-zinc-500 text-xs">MASIH NGUTANG</p>
              <p className="font-headline-lg text-tertiary">{friends.filter(f => f.status !== 'LUNAS').length}</p>
            </div>
          </div>
        </div>

        {/* Friends List */}
        <section className="space-y-4">
          {friends.map((friend, idx) => (
            <div
              key={idx}
              className="bg-white border-4 border-black p-6 neubrutal-shadow hover:-translate-y-1 hover:-translate-x-1 transition-transform flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${friend.avatar} border-4 border-black flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-2xl text-black">person</span>
                </div>
                <div>
                  <h3 className="font-headline-lg text-lg uppercase">@{friend.name}</h3>
                  <p className="font-label-caps text-xs text-zinc-500">
                    {friend.mutual} GRUP BARENG
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-body-bold font-black ${friend.statusColor}`}>
                  {friend.status}
                </span>
                {friend.status !== 'LUNAS' && (
                  <button className="bg-primary-container text-black border-2 border-black px-4 py-2 font-space font-black uppercase text-xs neubrutal-shadow-sm active-press hover:bg-yellow-400 transition-colors">
                    TAGIH!
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Friends
