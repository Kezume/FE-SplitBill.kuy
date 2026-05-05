import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AddGroupModal from '../components/AddGroupModal'

function Groups() {
  const navigate = useNavigate()
  const [groupsData, setGroupsData] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [refreshKey, setRefreshKey] = useState(0)

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const res = await fetch(`http://localhost:8080/api/v1/groups/list?page=${page}&limit=9`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || 'Gagal memuat daftar grup')
        }

        setGroupsData(result.data || [])
        setMeta(result.meta || null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [navigate, refreshKey, page])

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number)
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
        <section>
          <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
            <h2 className="font-headline-lg uppercase italic tracking-tighter text-3xl">
              SEMUA GRUP LO
            </h2>
            <button
              onClick={() => setShowGroupModal(true)}
              className="flex items-center gap-2 bg-primary-container text-black font-headline-lg text-lg border-4 border-black px-6 py-2 neubrutal-shadow active-press hover:bg-yellow-400 transition-all"
            >
              <span className="material-symbols-outlined">add_box</span>
              <span className="hidden md:inline">BUAT GRUP</span>
            </button>
          </div>

          {loading ? (
            <div className="font-space font-black text-2xl animate-pulse text-black uppercase border-4 border-black p-6 bg-white neubrutal-shadow text-center">
              LOADING GRUP...
            </div>
          ) : error ? (
            <div className="bg-tertiary text-white border-4 border-black p-6 font-body-bold text-center neubrutal-shadow">
              <span className="material-symbols-outlined text-4xl mb-2">error</span>
              <p>ERROR: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {groupsData.length > 0 ? (
                groupsData.map((group) => (
                  <Link key={group.id} to={`/group/${group.id}`} className="bg-white border-4 border-black p-6 neubrutal-shadow active-press-lg block transition-transform hover:-translate-y-2">
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
                ))
              ) : (
                <div className="col-span-full bg-surface border-4 border-dashed border-black p-10 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-6xl mb-4 text-zinc-400">group_off</span>
                  <h3 className="font-headline-lg uppercase text-2xl">BELUM ADA GRUP</h3>
                  <p className="font-body-reg mt-2 text-zinc-600 max-w-md">Lo belum join atau bikin grup satupun. Bikin grup baru sekarang biar bisa mulai split bill bareng temen-temen lo!</p>
                  <button 
                    onClick={() => setShowGroupModal(true)}
                    className="mt-6 bg-primary text-black px-8 py-3 border-4 border-black font-space font-black uppercase neubrutal-shadow active-press"
                  >
                    BUAT GRUP PERTAMA LO
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {meta && meta.total > meta.limit && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white border-4 border-black p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 active-press transition-all"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
              </button>
              <div className="font-space font-black uppercase text-lg border-4 border-black px-4 py-1 bg-secondary-fixed">
                PAGE {meta.page} OF {Math.ceil(meta.total / meta.limit)}
              </div>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(meta.total / meta.limit)}
                className="bg-white border-4 border-black p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 active-press transition-all"
              >
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </button>
            </div>
          )}
        </section>

        <AddGroupModal 
          isOpen={showGroupModal} 
          onClose={() => setShowGroupModal(false)} 
          onSuccess={(newGroup) => {
            setShowGroupModal(false)
            showToast(`Grup ${newGroup.name} berhasil dibuat! (Invite Code: ${newGroup.invite_code})`, 'success')
            setRefreshKey(prev => prev + 1)
          }} 
        />
      </main>
      <Footer />
    </div>
  )
}

export default Groups
