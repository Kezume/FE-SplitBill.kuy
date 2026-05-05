import { useState } from 'react'

function AddExpenseModal({ isOpen, onClose }) {
  const [itemName, setItemName] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [paidBy, setPaidBy] = useState('SAYA_SENDIRI')
  const [splitWith, setSplitWith] = useState({
    SAYA_SENDIRI: true,
    USER_02: false,
    USER_03: false,
    USER_04: false,
  })

  if (!isOpen) return null

  const selectedCount = Object.values(splitWith).filter(Boolean).length
  const perPerson = totalCost && selectedCount > 0
    ? Math.ceil(parseInt(totalCost) / selectedCount)
    : 0

  const handleCheckboxChange = (name) => {
    setSplitWith((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-yellow-400/90 p-4">
      <div className="w-full max-w-2xl bg-white border-4 border-black neubrutal-shadow flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <h2 className="font-headline-lg uppercase italic tracking-tighter">
            TAMBAH_PENGELUARAN
          </h2>
          <button
            onClick={onClose}
            className="material-symbols-outlined hover:text-yellow-400 transition-colors"
          >
            close
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Details */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps uppercase">NAMA_ITEM</label>
                <input
                  className="w-full p-4 border-4 border-black font-body-reg placeholder:text-zinc-400"
                  placeholder="MISAL: PIZZA_PARTY"
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps uppercase">TOTAL_BIAYA</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black">RP</span>
                  <input
                    className="w-full p-4 pl-12 border-4 border-black font-body-reg placeholder:text-zinc-400"
                    placeholder="000.000"
                    type="number"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps uppercase">DIBAYAR_OLEH</label>
                <select
                  className="w-full p-4 border-4 border-black font-body-reg bg-white appearance-none"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                >
                  <option>SAYA_SENDIRI</option>
                  <option>USER_02</option>
                  <option>USER_03</option>
                </select>
              </div>
            </div>

            {/* Right Column: Split With */}
            <div className="border-4 border-black p-4 space-y-4">
              <label className="font-label-caps uppercase block mb-2">BAGI_DENGAN:</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {Object.keys(splitWith).map((name) => (
                  <label
                    key={name}
                    className="flex items-center gap-4 cursor-pointer hover:bg-yellow-50 p-2 border-2 border-transparent transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="brutal-checkbox"
                      checked={splitWith[name]}
                      onChange={() => handleCheckboxChange(name)}
                    />
                    <span className="font-body-bold uppercase">{name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Calculation Preview */}
          <div className="bg-surface-container border-4 border-black p-4 font-body-reg flex justify-between items-center">
            <span className="uppercase">ESTIMASI_PER_ORANG:</span>
            <span className="text-2xl font-black text-tertiary">
              RP {perPerson.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t-4 border-black flex flex-col md:flex-row gap-4 justify-end">
          <button className="bg-blue-600 text-white p-4 border-4 border-black neubrutal-shadow active-press font-black font-space uppercase flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">calculate</span>
            HITUNG
          </button>
          <button className="bg-secondary-container text-black p-4 border-4 border-black neubrutal-shadow active-press font-black font-space uppercase flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">save</span>
            SIMPAN
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddExpenseModal
