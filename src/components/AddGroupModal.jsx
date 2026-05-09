import { useState } from 'react'

function AddGroupModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('group')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  // Pilihan icon yang sesuai dengan gaya Neobrutalism dan use-case
  const iconOptions = ['group', 'restaurant', 'flight_takeoff', 'sports_esports', 'home', 'shopping_cart', 'local_cafe', 'movie']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/groups/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, icon })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Gagal membuat grup')
      }

      setName('')
      setIcon('group')
      onSuccess(result.data) // Kirim data grup baru ke Dashboard
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[scale-in_0.2s_ease-out]">
      <div className="w-full max-w-md bg-white border-4 border-black neubrutal-shadow flex flex-col">
        {/* Modal Header */}
        <div className="bg-primary text-black p-4 flex justify-between items-center border-b-4 border-black">
          <h2 className="font-headline-lg uppercase italic tracking-tighter">
            BUAT GRUP BARU
          </h2>
          <button
            onClick={onClose}
            className="material-symbols-outlined hover:text-white transition-colors"
          >
            close
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="bg-tertiary text-white p-3 mb-4 font-body-bold text-sm uppercase border-2 border-black flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              {error}
            </div>
          )}

          <form id="create-group-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-caps uppercase">NAMA GRUP (TONGKRONGAN)</label>
              <input
                className="w-full p-4 border-4 border-black font-body-reg focus:outline-none focus:bg-yellow-50"
                placeholder="MISAL: ANAK KOS RASA SULTAN"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-caps uppercase">PILIH ICON GRUP</label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map((opt) => (
                  <div 
                    key={opt}
                    onClick={() => setIcon(opt)}
                    className={`h-12 border-2 border-black flex items-center justify-center cursor-pointer transition-colors ${icon === opt ? 'bg-black text-white' : 'bg-zinc-100 hover:bg-yellow-200 text-black'}`}
                  >
                    <span className="material-symbols-outlined">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t-4 border-black bg-surface flex gap-4 justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="bg-white text-black p-3 px-6 border-4 border-black neubrutal-shadow-sm active-press font-black font-space uppercase hover:bg-zinc-100"
          >
            BATAL
          </button>
          <button 
            type="submit"
            form="create-group-form"
            disabled={loading}
            className={`bg-primary text-black p-3 px-6 border-4 border-black neubrutal-shadow-sm active-press font-black font-space uppercase flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'}`}
          >
            <span className="material-symbols-outlined">group_add</span>
            {loading ? 'MEMBUAT...' : 'BUAT SEKARANG'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddGroupModal
