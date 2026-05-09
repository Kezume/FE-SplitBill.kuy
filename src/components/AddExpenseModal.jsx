import { useState } from 'react'

function AddExpenseModal({ isOpen, onClose, groupId, members = [], onSuccess }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [splitType, setSplitType] = useState('equal')
  const [splitWith, setSplitWith] = useState({})
  const [customAmounts, setCustomAmounts] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const selectedMembers = Object.entries(splitWith).filter(([, v]) => v).map(([k]) => k)
  const totalAmount = parseInt(amount) || 0

  const perPerson = splitType === 'equal' && selectedMembers.length > 0
    ? Math.ceil(totalAmount / selectedMembers.length)
    : 0

  const totalCustom = splitType === 'custom'
    ? selectedMembers.reduce((sum, id) => sum + (parseInt(customAmounts[id]) || 0), 0)
    : 0

  const customMismatch = splitType === 'custom' && totalAmount > 0 && totalCustom !== totalAmount

  const handleCheckboxChange = (userId) => {
    setSplitWith(prev => ({ ...prev, [userId]: !prev[userId] }))
    if (splitWith[userId]) {
      setCustomAmounts(prev => {
        const copy = { ...prev }
        delete copy[userId]
        return copy
      })
    }
  }

  const resetForm = () => {
    setDescription('')
    setAmount('')
    setPaidBy('')
    setDate(new Date().toISOString().split('T')[0])
    setSplitType('equal')
    setSplitWith({})
    setCustomAmounts({})
    setError('')
  }

  const handleSubmit = async () => {
    if (!description.trim()) return setError('Nama item harus diisi!')
    if (!totalAmount || totalAmount <= 0) return setError('Total biaya harus lebih dari 0!')
    if (!paidBy) return setError('Pilih siapa yang bayar!')
    if (selectedMembers.length === 0) return setError('Pilih minimal 1 orang untuk dibagi!')
    if (customMismatch) return setError(`Total pembagian (${totalCustom.toLocaleString('id-ID')}) harus sama dengan total biaya (${totalAmount.toLocaleString('id-ID')})!`)

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')

      const splitWithPayload = selectedMembers.map(userId => ({
        user_id: userId,
        amount: splitType === 'custom' ? parseInt(customAmounts[userId]) || 0 : 0
      }))

      const res = await fetch(`${import.meta.env.VITE_API_URL}/expenses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          group_id: groupId,
          description: description.trim(),
          amount: totalAmount,
          paid_by: paidBy,
          split_type: splitType,
          split_with: splitWithPayload,
          date: date
        })
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error?.message || 'Gagal menambahkan pengeluaran')
      }

      resetForm()
      onSuccess && onSuccess(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getMemberName = (id) => members.find(m => m.id === id)?.username || 'Unknown'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white border-4 border-black neubrutal-shadow flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <h2 className="font-headline-lg uppercase italic tracking-tighter">
            TAMBAH_PENGELUARAN
          </h2>
          <button
            onClick={() => { resetForm(); onClose() }}
            className="material-symbols-outlined hover:text-yellow-400 transition-colors"
          >
            close
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 bg-error/10 border-4 border-error p-3 font-bold text-error flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            {error}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Details */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps uppercase">NAMA_ITEM</label>
                <input
                  className="w-full p-4 border-4 border-black font-body-reg placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  placeholder="MISAL: PIZZA_PARTY"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps uppercase">TOTAL_BIAYA</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black">RP</span>
                  <input
                    className="w-full p-4 pl-12 border-4 border-black font-body-reg placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    placeholder="000.000"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps uppercase">TANGGAL</label>
                <input
                  className="w-full p-4 border-4 border-black font-body-reg focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps uppercase">DIBAYAR_OLEH</label>
                <select
                  className="w-full p-4 border-4 border-black font-body-reg bg-white appearance-none focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                >
                  <option value="">-- Pilih --</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>{member.username}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column: Split */}
            <div className="space-y-4">
              {/* Split Type Toggle */}
              <div className="flex flex-col gap-1">
                <label className="font-label-caps uppercase">TIPE_SPLIT</label>
                <div className="flex border-4 border-black">
                  <button
                    onClick={() => setSplitType('equal')}
                    className={`flex-1 p-3 font-space font-black uppercase text-sm transition-colors ${
                      splitType === 'equal' ? 'bg-yellow-400 text-black' : 'bg-white text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    BAGI RATA
                  </button>
                  <button
                    onClick={() => setSplitType('custom')}
                    className={`flex-1 p-3 font-space font-black uppercase text-sm border-l-4 border-black transition-colors ${
                      splitType === 'custom' ? 'bg-yellow-400 text-black' : 'bg-white text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    CUSTOM
                  </button>
                </div>
              </div>

              {/* Members Checklist */}
              <div className="border-4 border-black p-4 space-y-2">
                <label className="font-label-caps uppercase block mb-2">BAGI_DENGAN:</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {members.length > 0 ? members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 hover:bg-yellow-50 p-2 border-2 border-transparent transition-colors"
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          className="brutal-checkbox"
                          checked={!!splitWith[member.id]}
                          onChange={() => handleCheckboxChange(member.id)}
                        />
                        <div className="w-8 h-8 border-2 border-black bg-secondary-fixed flex items-center justify-center font-space font-black text-sm uppercase">
                          {member.username?.charAt(0) || '?'}
                        </div>
                        <span className="font-body-bold uppercase text-sm">{member.username}</span>
                      </label>

                      {/* Custom amount input */}
                      {splitType === 'custom' && splitWith[member.id] && (
                        <div className="relative w-28">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-black">RP</span>
                          <input
                            type="number"
                            className="w-full p-2 pl-8 border-2 border-black text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={customAmounts[member.id] || ''}
                            onChange={(e) => setCustomAmounts(prev => ({ ...prev, [member.id]: e.target.value }))}
                            placeholder="0"
                          />
                        </div>
                      )}

                      {/* Equal amount preview */}
                      {splitType === 'equal' && splitWith[member.id] && totalAmount > 0 && (
                        <span className="text-sm font-bold text-zinc-500">
                          RP {perPerson.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  )) : (
                    <p className="text-zinc-400 italic font-bold text-sm">Belum ada anggota di grup ini</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Preview */}
          <div className={`border-4 border-black p-4 font-body-reg flex justify-between items-center ${customMismatch ? 'bg-error/10 border-error' : 'bg-surface-container'}`}>
            {splitType === 'equal' ? (
              <>
                <span className="uppercase font-bold">ESTIMASI_PER_ORANG:</span>
                <span className="text-2xl font-black text-tertiary">
                  RP {perPerson.toLocaleString('id-ID')}
                </span>
              </>
            ) : (
              <>
                <span className="uppercase font-bold">
                  TOTAL_PEMBAGIAN:
                  {customMismatch && <span className="text-error text-sm ml-2">(harus = {totalAmount.toLocaleString('id-ID')})</span>}
                </span>
                <span className={`text-2xl font-black ${customMismatch ? 'text-error' : 'text-tertiary'}`}>
                  RP {totalCustom.toLocaleString('id-ID')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t-4 border-black flex flex-col md:flex-row gap-4 justify-end">
          <button
            onClick={() => { resetForm(); onClose() }}
            className="bg-white text-black p-4 border-4 border-black neubrutal-shadow active-press font-black font-space uppercase flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
            BATAL
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-secondary-container text-black p-4 border-4 border-black neubrutal-shadow active-press font-black font-space uppercase flex items-center justify-center gap-2 hover:bg-green-300 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined">save</span>
            {loading ? 'MENYIMPAN...' : 'SIMPAN'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddExpenseModal
