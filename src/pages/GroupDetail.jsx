import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AddExpenseModal from '../components/AddExpenseModal'

function GroupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteExpenseModal, setShowDeleteExpenseModal] = useState(null)
  const [groupData, setGroupData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [expandedExpense, setExpandedExpense] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const currentUserId = currentUser.id || currentUser.user_id || ''

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/groups/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const result = await res.json()
        
        if (!res.ok) {
          throw new Error(result.error?.message || 'Gagal memuat detail grup')
        }

        setGroupData(result.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchGroupDetail()
  }, [id, navigate, refreshKey])

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0)
  }

  const executeDeleteGroup = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/groups/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error?.message || result.error || 'Gagal menghapus grup')
      }

      setShowDeleteModal(false)
      showToast("Grup berhasil dihapus! Lo bakal dialihin...", 'success')
      setTimeout(() => navigate('/groups'), 1500)
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error')
      setShowDeleteModal(false)
    }
  }

  const deleteExpense = async (expenseId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error?.message || 'Gagal hapus pengeluaran')
      }
      showToast('Pengeluaran berhasil dihapus!', 'success')
      setExpandedExpense(null)
      setShowDeleteExpenseModal(null)
      setRefreshKey(prev => prev + 1)
    } catch (err) {
      showToast(err.message, 'error')
      setShowDeleteExpenseModal(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-background font-body-reg min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="font-space font-black text-3xl animate-pulse uppercase">Memuat Grup...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !groupData) {
    return (
      <div className="bg-background font-body-reg min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-10 flex items-center justify-center">
          <div className="bg-tertiary text-white border-4 border-black p-8 text-center shadow-[8px_8px_0_0_#000]">
            <h2 className="font-headline-lg uppercase mb-2">YAH ERROR!</h2>
            <p className="font-bold">{error || 'Data grup tidak ditemukan'}</p>
            <button onClick={() => navigate('/groups')} className="mt-6 bg-white text-black px-6 py-2 border-4 border-black font-black uppercase active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_#000]">
              Kembali ke List Grup
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-background font-body-reg text-on-background min-h-screen flex flex-col">
      <Navbar />
      <main className="p-6 md:p-10 space-y-10 flex-grow">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative">
          <div className="absolute -inset-1 bg-black"></div>
          <div className="relative bg-white border-4 border-black p-6 md:p-8 flex items-center gap-4">
            <span className="text-4xl">{groupData.icon.length < 5 ? groupData.icon : <span className="material-symbols-outlined">{groupData.icon}</span>}</span>
            <div className="border-2 border-black p-2">
              <h1 className="font-headline-xl uppercase break-all">{groupData.name}</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 w-full justify-end">
            <span className="text-xs font-black uppercase bg-black text-white px-2 py-1">INVITE CODE</span>
          </div>
          <div className="flex">
            <div className="bg-zinc-200 border-4 border-black border-r-0 px-4 py-3 font-body-bold text-xl">
              {groupData.invite_code}
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(groupData.invite_code)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className={`${copied ? 'bg-green-400' : 'bg-yellow-400'} border-4 border-black px-4 py-3 font-black active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_#000] transition-all min-w-[100px] text-center`}
            >
              {copied ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-black text-xs uppercase">Total spent</span>
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div className="font-headline-lg">{formatRupiah(groupData.stats?.total_spent)}</div>
          <div className="mt-2 text-xs font-bold text-zinc-500 italic">"STILL CHEAPER THAN THERAPY"</div>
        </div>

        <div className={`${groupData.stats?.your_share > 0 ? 'bg-error/20' : 'bg-secondary-fixed'} border-4 border-black p-6 shadow-[8px_8px_0_0_#000]`}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-black text-xs uppercase">Your share</span>
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <div className="font-headline-lg">{formatRupiah(groupData.stats?.your_share)}</div>
          {groupData.stats?.your_share > 0 ? (
            <div className="mt-2 text-xs font-bold text-error uppercase">BELUM LUNAS ⚠️</div>
          ) : (
            <div className="mt-2 text-xs font-bold text-black bg-white inline-block px-1">LUNAS ✅</div>
          )}
        </div>

        <div className="bg-tertiary-fixed border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-black text-xs uppercase">Unpaid drama</span>
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div className="font-headline-lg text-tertiary">{formatRupiah(groupData.stats?.unpaid_amount)}</div>
          {groupData.stats?.unpaid_amount > 0 ? (
            <div className="mt-2 text-xs font-bold text-black uppercase underline decoration-4 decoration-tertiary">
              Tagih Sekarang!
            </div>
          ) : (
            <div className="mt-2 text-xs font-bold text-black uppercase">
              SEMUA AMAN TERKENDALI
            </div>
          )}
        </div>
      </section>

      {/* Members */}
      <section className="space-y-4">
        <h2 className="font-headline-lg uppercase underline decoration-8 decoration-secondary-fixed">
          ANGGOTA ({groupData.member_count || groupData.members?.length || 0})
        </h2>
        <div className="flex flex-wrap gap-3">
          {groupData.members && groupData.members.length > 0 ? (
            groupData.members.map((member) => (
              <div key={member.id} className="bg-white border-4 border-black px-4 py-3 shadow-[4px_4px_0_0_#000] flex items-center gap-3 hover:bg-yellow-50 transition-colors">
                <div className="w-10 h-10 border-3 border-black bg-secondary-fixed flex items-center justify-center font-space font-black text-lg uppercase">
                  {member.username?.charAt(0) || '?'}
                </div>
                <span className="font-bold uppercase">{member.username}</span>
              </div>
            ))
          ) : (
            <div className="bg-white border-4 border-black px-6 py-4 shadow-[4px_4px_0_0_#000] font-bold text-zinc-400 italic">
              Belum ada anggota... Ajak temen lo pake invite code!
            </div>
          )}
        </div>
      </section>

      {/* Expenses Table */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-lg uppercase underline decoration-8 decoration-yellow-400">
            EXPENSES_LIST
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-error text-white border-4 border-black px-6 py-4 font-black text-lg active:translate-y-2 active:shadow-none shadow-[8px_8px_0_0_#000] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined font-black">add_circle</span>
            + TAMBAH EXPENSE
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-black text-white text-left font-black uppercase tracking-widest text-sm">
                <th className="p-4 border-4 border-black">DATE</th>
                <th className="p-4 border-4 border-black">DESCRIPTION</th>
                <th className="p-4 border-4 border-black">PAYER</th>
                <th className="p-4 border-4 border-black text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              {groupData.expenses && groupData.expenses.length > 0 ? (
                groupData.expenses.map((expense) => (
                  <React.Fragment key={expense.id}>
                    <tr
                      className="bg-white hover:bg-yellow-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedExpense(expandedExpense === expense.id ? null : expense.id)}
                    >
                      <td className="p-4 border-4 border-black">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            {expandedExpense === expense.id ? 'expand_less' : 'expand_more'}
                          </span>
                          {expense.date || '-'}
                        </div>
                      </td>
                      <td className="p-4 border-4 border-black">{expense.description}</td>
                      <td className="p-4 border-4 border-black">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 border-2 border-black bg-secondary-fixed flex items-center justify-center text-xs font-black">
                            {expense.paid_by?.username?.charAt(0) || '?'}
                          </div>
                          {expense.paid_by?.username || 'Unknown'}
                        </div>
                      </td>
                      <td className="p-4 border-4 border-black text-right">{formatRupiah(expense.amount)}</td>
                    </tr>
                    {/* Split Detail Expandable */}
                    {expandedExpense === expense.id && (
                      <tr>
                        <td colSpan="4" className="border-4 border-black border-t-0 p-0">
                          <div className="bg-zinc-50 p-4 space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="material-symbols-outlined text-sm">groups</span>
                              <span className="font-black text-xs uppercase">PEMBAGIAN ({expense.split_with?.length || 0} orang)</span>
                            </div>
                            {expense.split_with && expense.split_with.length > 0 ? (
                              expense.split_with.map((split, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white border-2 border-black px-4 py-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-black bg-secondary-fixed flex items-center justify-center font-black text-sm uppercase">
                                      {split.user?.username?.charAt(0) || '?'}
                                    </div>
                                    <span className="uppercase text-sm">{split.user?.username || 'Unknown'}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-black">{formatRupiah(split.amount)}</span>
                                    <span className={`text-xs font-black px-2 py-1 border-2 border-black ${split.is_settled ? 'bg-green-400' : 'bg-yellow-400'}`}>
                                      {split.is_settled ? 'LUNAS' : 'BELUM'}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-zinc-400 italic text-sm">Tidak ada data pembagian</div>
                            )}
                            {/* Delete button - hanya tampil untuk yang bayar */}
                            {expense.paid_by?.id === currentUserId && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowDeleteExpenseModal(expense.id) }}
                                className="mt-3 bg-error text-white border-2 border-black px-4 py-2 font-black text-xs uppercase flex items-center gap-2 hover:bg-red-600 active:translate-y-1 transition-all shadow-[3px_3px_0_0_#000] active:shadow-none"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                HAPUS PENGELUARAN
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr className="bg-white">
                  <td colSpan="4" className="p-8 text-center border-4 border-black font-space font-black text-xl uppercase text-zinc-400">
                    BELUM ADA PENGELUARAN SAMA SEKALI
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Decorative Visuals */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
        <div className="relative group">
          <div className="absolute -inset-2 bg-yellow-400 border-4 border-black rotate-1 group-hover:rotate-0 transition-transform"></div>
          <div className="relative border-4 border-black overflow-hidden h-64 grayscale hover:grayscale-0 transition-all">
            <img
              className="w-full h-full object-cover"
              alt="Bali trip memories"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH6SCHEyJCvWeUG5XCNKh_aMRoSJzUsI6kjj1QWfi7f5wALprUOXJp6O5bbG4PPxmcHFblysWKmcUk1-7fPmRQTUE_Y_SgPTJITVYiKGu2GnwxjgaB_5g4BP9JiNTU1F2tW-IREdk-qcQWQlltik7gXwowPjVt5SIh1_EKQjsAxXb6h5CQV0HpHHtCYpJJkGeuCutU9hxmmgEu-ln-q3Cogy6Namcs2NLxBtyazdM6l_oXCpb4AN0heLbSmxMs8yVlAkFtSguDmJdG"
            />
            <div className="absolute bottom-4 left-4 bg-black text-white p-2 font-black text-xl uppercase italic">
              MEMORIES &gt; MONEY
            </div>
          </div>
        </div>

        <div className="border-4 border-dashed border-black p-8 flex flex-col justify-center items-center text-center space-y-4">
          <span className="text-6xl">🤘</span>
          <h3 className="font-headline-lg uppercase italic">NO REFUNDS ON VIBES</h3>
          <p className="font-bold max-w-sm">
            Semua pengeluaran tercatat rapi. Kalo ada yang kurang bayar, lapor admin atau handle sendiri ala anak punk.
          </p>
        </div>
      </section>

      {/* Danger Zone - Only visible to owner */}
      {groupData.is_owner && (
      <section className="mt-16 border-4 border-error border-dashed p-8 bg-error/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
           <div>
             <h2 className="font-headline-lg uppercase text-error text-2xl mb-2 flex items-center justify-center md:justify-start gap-2">
               <span className="material-symbols-outlined">warning</span>
               DANGER ZONE
             </h2>
             <p className="font-bold text-zinc-700">Tindakan ini permanen. Semua data pengeluaran dan keributan di dalam grup ini akan dihapus tak bersisa.</p>
           </div>
           <button 
             onClick={() => setShowDeleteModal(true)} 
             className="bg-error text-white border-4 border-black px-6 py-3 font-black uppercase active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_#000] hover:bg-red-600 transition-all flex items-center gap-2 whitespace-nowrap"
           >
             <span className="material-symbols-outlined">delete_forever</span> HAPUS GRUP
           </button>
        </div>
      </section>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black w-full max-w-md neubrutal-shadow animate-[popIn_0.2s_ease-out]">
            <div className="bg-error text-white border-b-4 border-black p-4 flex justify-between items-center">
              <h2 className="font-space font-black uppercase tracking-tighter text-2xl flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                HAPUS GRUP?
              </h2>
              <button onClick={() => setShowDeleteModal(false)} className="hover:bg-red-600 p-1 border-2 border-transparent hover:border-black transition-colors">
                <span className="material-symbols-outlined font-black">close</span>
              </button>
            </div>
            
            <div className="p-6 font-body-reg space-y-4">
              <p className="font-bold text-lg">Yakin lo mau hapus grup <span className="bg-yellow-400 px-1 italic font-black">{groupData.name}</span>?</p>
              <p className="text-sm text-zinc-600 font-bold">Semua history split bill, keributan, dan utang-piutang di grup ini bakal hilang ditelan bumi selamanya. Gak bisa di-undo cuy!</p>
            </div>
            
            <div className="p-6 border-t-4 border-black bg-zinc-50 flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-white border-4 border-black py-3 font-space font-black uppercase active:translate-y-1 hover:bg-zinc-200 transition-all shadow-[4px_4px_0_0_#000] active:shadow-none"
              >
                GAJADI
              </button>
              <button 
                onClick={executeDeleteGroup}
                className="flex-1 bg-error text-white border-4 border-black py-3 font-space font-black uppercase active:translate-y-1 hover:bg-red-600 transition-all shadow-[4px_4px_0_0_#000] active:shadow-none"
              >
                YAKIN HAPUS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Expense Confirmation Modal */}
      {showDeleteExpenseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black w-full max-w-md neubrutal-shadow animate-[popIn_0.2s_ease-out]">
            <div className="bg-error text-white border-b-4 border-black p-4 flex justify-between items-center">
              <h2 className="font-space font-black uppercase tracking-tighter text-2xl flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                HAPUS PENGELUARAN?
              </h2>
              <button onClick={() => setShowDeleteExpenseModal(null)} className="hover:bg-red-600 p-1 border-2 border-transparent hover:border-black transition-colors">
                <span className="material-symbols-outlined font-black">close</span>
              </button>
            </div>
            <div className="p-6 font-body-reg space-y-4">
              <p className="font-bold text-lg">Yakin mau hapus pengeluaran ini?</p>
              <p className="text-sm text-zinc-600 font-bold">Data pembagian juga bakal ikut hilang. Gak bisa di-undo!</p>
            </div>
            <div className="p-6 border-t-4 border-black bg-zinc-50 flex gap-4">
              <button
                onClick={() => setShowDeleteExpenseModal(null)}
                className="flex-1 bg-white border-4 border-black py-3 font-space font-black uppercase active:translate-y-1 hover:bg-zinc-200 transition-all shadow-[4px_4px_0_0_#000] active:shadow-none"
              >
                GAJADI
              </button>
              <button
                onClick={() => deleteExpense(showDeleteExpenseModal)}
                className="flex-1 bg-error text-white border-4 border-black py-3 font-space font-black uppercase active:translate-y-1 hover:bg-red-600 transition-all shadow-[4px_4px_0_0_#000] active:shadow-none"
              >
                YAKIN HAPUS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        groupId={id}
        members={groupData?.members || []}
        onSuccess={() => {
          setShowModal(false)
          showToast('Pengeluaran berhasil ditambahkan!', 'success')
          setRefreshKey(prev => prev + 1)
        }}
      />
      </main>
      <Footer />

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-[bounce_0.3s_ease-out]">
          <div className={`px-6 py-3 border-4 border-black font-space font-black uppercase neubrutal-shadow-sm flex items-center gap-3 ${
            toast.type === 'error' ? 'bg-error text-white' : 'bg-primary text-black'
          }`}>
            <span className="material-symbols-outlined">
              {toast.type === 'error' ? 'warning' : 'check_circle'}
            </span>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupDetail
