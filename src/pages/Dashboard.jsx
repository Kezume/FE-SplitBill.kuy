import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AddExpenseModal from '../components/AddExpenseModal'
import AddGroupModal from '../components/AddGroupModal'

function Dashboard() {
  const navigate = useNavigate()
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [groupsData, setGroupsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [refreshKey, setRefreshKey] = useState(0) // Untuk men-trigger ulang fetch

  // Fungsi untuk memunculkan Toast Notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const resDash = await fetch('http://localhost:8080/api/v1/dashboard/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const dashResult = await resDash.json()
        if (!resDash.ok) {
          throw new Error(dashResult.error || 'Gagal memuat dashboard')
        }
        setDashboardData(dashResult.data)

        // Fetch Real Groups Data
        const resGroups = await fetch('http://localhost:8080/api/v1/groups/list', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const groupsResult = await resGroups.json()
        if (resGroups.ok && groupsResult.data) {
          setGroupsData(groupsResult.data)
        }
      } catch (err) {
        setError(err.message)
        if (err.message.includes('Token') || err.message.includes('Unauthorized')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setTimeout(() => navigate('/login'), 1500)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [navigate, refreshKey])

  // Formatter mata uang Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number)
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="font-space font-black text-2xl animate-pulse text-black uppercase border-4 border-black p-6 bg-white neubrutal-shadow">
            LOADING DASHBOARD...
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center flex-col gap-6">
          <div className="bg-tertiary text-white border-4 border-black p-6 font-body-bold text-center neubrutal-shadow">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p>ERROR: {error}</p>
          </div>
          <button onClick={() => window.location.reload()} className="bg-yellow-400 text-black border-4 border-black px-6 py-3 font-space font-black uppercase neubrutal-shadow active-press">
            COBA LAGI
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-background font-body-reg text-on-background min-h-screen flex flex-col">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-[bounce_0.3s_ease-out]">
          <div className={`px-6 py-3 border-4 border-black font-space font-black uppercase neubrutal-shadow-sm flex items-center gap-3 ${
            toast.type === 'error' ? 'bg-tertiary text-white' : 'bg-primary text-black'
          }`}>
            <span className="material-symbols-outlined">
              {toast.type === 'error' ? 'warning' : 'check_circle'}
            </span>
            {toast.message}
          </div>
        </div>
      )}

      <main className="p-6 md:p-10 space-y-10 flex-grow">
        {/* Top Greeting Bar */}
        <div className="flex justify-between items-center -mt-4 mb-2">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-lg uppercase tracking-tighter">HALO, {dashboardData?.user?.username || 'USER'}</h2>
            <span className="bg-black text-white px-2 py-1 text-xs font-label-caps">
              STAY HONEST! 💸
            </span>
          </div>
        </div>

        {/* Summary Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-4 border-black p-8 neubrutal-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-9xl text-error">trending_down</span>
            </div>
            <p className="font-label-caps text-zinc-500 mb-2">LO HUTANG KE ORANG</p>
            <h3 className="font-headline-xl text-error">{formatRupiah(dashboardData?.summary?.total_owe || 0)}</h3>
            <div className="mt-4 border-t-2 border-black pt-4 flex items-center justify-between">
              <span className="text-xs font-body-bold">BAYAR SEBELUM DITAGIH!</span>
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-8 neubrutal-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:-rotate-12 transition-transform">
              <span className="material-symbols-outlined text-9xl text-secondary">payments</span>
            </div>
            <p className="font-label-caps text-zinc-500 mb-2">DITAGIH KE ORANG</p>
            <h3 className="font-headline-xl text-secondary">{formatRupiah(dashboardData?.summary?.total_owed || 0)}</h3>
            <div className="mt-4 border-t-2 border-black pt-4 flex items-center justify-between">
              <span className="text-xs font-body-bold">JANGAN KASIH KENDOR!</span>
              <span className="material-symbols-outlined">verified</span>
            </div>
          </div>
        </section>

        {/* Groups Section */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
            <h2 className="font-headline-lg uppercase italic underline decoration-yellow-400 decoration-8 underline-offset-4">
              GRUP AKTIF LO
            </h2>
            <button
              onClick={() => setShowGroupModal(true)}
              className="hidden md:flex items-center gap-2 bg-primary-container text-black font-headline-lg text-lg border-4 border-black px-6 py-2 neubrutal-shadow active-press hover:bg-yellow-400 transition-all"
            >
              <span className="material-symbols-outlined">add_box</span>
              <span>BUAT GRUP</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {groupsData.length > 0 && groupsData.map((group) => (
              <Link key={group.id} to={`/group/${group.id}`} className="bg-white border-4 border-black p-6 neubrutal-shadow active-press-lg block">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-black text-white p-2 border-2 border-black w-12 h-12 flex items-center justify-center">
                    <span className="text-2xl">{group.icon.length < 5 ? group.icon : <span className="material-symbols-outlined">{group.icon}</span>}</span>
                  </div>
                  <span className="bg-secondary-container text-black px-2 py-1 text-[10px] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    {group.member_count} FRIENDS
                  </span>
                </div>
                <h3 className="font-headline-lg uppercase underline decoration-black decoration-4 mb-4">
                  {group.name}
                </h3>
                <p className="font-body-reg text-sm text-zinc-600 mb-6">
                  Total keributan: {formatRupiah(group.total_amount)}
                </p>
                <div className="flex items-center justify-between border-t-4 border-black pt-4">
                  <div className="flex -space-x-2">
                    {/* Placeholder for members since the list API doesn't return full members details yet */}
                    <div className="w-8 h-8 border-2 border-black bg-yellow-200 flex items-center justify-center">
                       <span className="text-[10px] font-black">YOU</span>
                    </div>
                    {group.member_count > 1 && (
                       <div className="w-8 h-8 border-2 border-black bg-zinc-200 flex items-center justify-center text-[10px] font-black">
                         +{group.member_count - 1}
                       </div>
                    )}
                  </div>
                  <span className="material-symbols-outlined hover:text-yellow-500 cursor-pointer">
                    arrow_forward_ios
                  </span>
                </div>
              </Link>
            ))}

            {/* Empty State / Add Group Button */}
            <div
              onClick={() => setShowGroupModal(true)}
              className="bg-surface border-4 border-dashed border-black p-6 flex flex-col items-center justify-center text-center group hover:bg-white transition-colors cursor-pointer active-press-lg min-h-[250px]"
            >
              <span className="material-symbols-outlined text-6xl mb-4 group-hover:scale-110 transition-transform">
                add_circle
              </span>
              <h3 className="font-headline-lg uppercase">TAMBAH GRUP BARU</h3>
              <p className="font-label-caps text-xs mt-2 text-zinc-500">BIAR GAK LUPA TAGIHAN</p>
            </div>
          </div>
        </section>

        {/* History / Tabloid Section */}
        <section className="bg-black text-white p-6 border-4 border-black neubrutal-shadow">
          <h2 className="font-headline-lg uppercase mb-6 tracking-widest flex items-center gap-4">
            <span className="material-symbols-outlined">history_edu</span>
            BERITA TERKINI: TRANSAKSI TERAKHIR
          </h2>
          <div className="space-y-4">
            {dashboardData?.recent_transactions?.length > 0 ? (
              dashboardData.recent_transactions.map((trx) => (
                <div key={trx.id} className="flex justify-between items-center border-b border-zinc-700 pb-2">
                  <span className="font-body-bold">
                    {trx.description} <span className="text-zinc-500 text-xs italic">({trx.group_name})</span>
                  </span>
                  <span className={`font-black ${trx.status.toLowerCase() === 'paid' ? 'text-secondary' : 'text-error'}`}>
                    {trx.status.toLowerCase() === 'paid' ? 'LUNAS' : formatRupiah(trx.amount)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-500 italic py-4">Belum ada drama transaksi akhir-akhir ini.</div>
            )}
          </div>
          <div className="mt-6 text-center">
            <button className="font-label-caps text-xs underline decoration-yellow-400 decoration-2 hover:text-yellow-400">
              LIHAT SEMUA DRAMA →
            </button>
          </div>
        </section>

        {/* Mobile FAB */}
        <button
          onClick={() => setShowExpenseModal(true)}
          className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-primary-container border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none z-50"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>

        {/* Add Group Modal */}
        <AddGroupModal 
          isOpen={showGroupModal} 
          onClose={() => setShowGroupModal(false)} 
          onSuccess={(newGroup) => {
            setShowGroupModal(false)
            showToast(`Grup ${newGroup.name} berhasil dibuat! (Invite Code: ${newGroup.invite_code})`, 'success')
            setRefreshKey(prev => prev + 1) // Refresh dashboard
          }} 
        />

        {/* Add Expense Modal */}
        <AddExpenseModal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} />
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
