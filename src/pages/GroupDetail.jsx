import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AddExpenseModal from '../components/AddExpenseModal'

function GroupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [groupData, setGroupData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const res = await fetch(`http://localhost:8080/api/v1/groups/${id}`, {
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
  }, [id, navigate])

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0)
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
          <span className="text-xs font-black uppercase bg-black text-white px-2 py-1">INVITE CODE</span>
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

        <div className="bg-secondary-fixed border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-black text-xs uppercase">Your share</span>
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <div className="font-headline-lg">{formatRupiah(groupData.stats?.your_share)}</div>
          <div className="mt-2 text-xs font-bold text-black bg-white inline-block px-1">LUNAS / SETTLED</div>
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
                  <tr key={expense.id} className="bg-white hover:bg-yellow-50 transition-colors">
                    <td className="p-4 border-4 border-black">{expense.date || '-'}</td>
                    <td className="p-4 border-4 border-black">{expense.description}</td>
                    <td className="p-4 border-4 border-black">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 border-2 border-black ${expense.paid_by?.avatar_color || 'bg-gray-400'}`}></div>
                        {expense.paid_by?.username || 'Unknown'}
                      </div>
                    </td>
                    <td className="p-4 border-4 border-black text-right">{formatRupiah(expense.amount)}</td>
                  </tr>
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

      {/* Add Expense Modal */}
      <AddExpenseModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </main>
      <Footer />
    </div>
  )
}

export default GroupDetail
