import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Profile() {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // State untuk Modal & Toast
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editForm, setEditForm] = useState({ username: '', email: '', phone: '' })
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  // Fungsi untuk memunculkan Toast Notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const res = await fetch('http://localhost:8080/api/v1/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || 'Gagal memuat profil')
        }

        setProfileData(result.data)
        setEditForm({
          username: result.data.username,
          email: result.data.email,
          phone: result.data.phone
        })
      } catch (err) {
        setError(err.message)
        if (err.message.includes('Token') || err.message.includes('Authentication') || err.message.includes('Unauthorized')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setTimeout(() => navigate('/login'), 1500)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await fetch('http://localhost:8080/api/v1/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/')
    }
  }

  // Handle Form Input Change
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  // Submit Update Profile
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })

      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || 'Gagal update profil')
      }

      setProfileData(result.data)
      setIsEditModalOpen(false)
      showToast('Profil berhasil diupdate!', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Execute Delete Account
  const executeDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || 'Gagal menghapus akun')
      }

      showToast('Akun berhasil dihapus. Sampai jumpa lagi!', 'success')
      
      // Delay sedikit agar user sempat membaca toast sebelum dilempar
      setTimeout(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
      }, 1500)
    } catch (err) {
      showToast(err.message, 'error')
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="font-space font-black text-2xl animate-pulse text-black uppercase border-4 border-black p-6 bg-white neubrutal-shadow">
            LOADING PROFILE...
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
          <button onClick={() => navigate('/login')} className="bg-yellow-400 text-black border-4 border-black px-6 py-3 font-space font-black uppercase neubrutal-shadow active-press">
            KEMBALI KE LOGIN
          </button>
        </main>
      </div>
    )
  }

  const memberSinceYear = profileData?.member_since 
    ? new Date(profileData.member_since).getFullYear() 
    : '2024'

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

      <main className="p-6 md:p-10 space-y-10 flex-grow max-w-4xl mx-auto w-full relative">
        {/* Profile Header */}
        <section className="bg-white border-4 border-black neubrutal-shadow p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-primary-container border-4 border-black flex items-center justify-center shadow-[8px_8px_0_0_#000] overflow-hidden">
                {profileData?.avatar_url ? (
                  <img src={profileData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-black">person</span>
                )}
              </div>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -bottom-2 -right-2 bg-black text-white p-1 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>

            <div className="flex-grow text-center md:text-left">
              <h1 className="font-headline-xl uppercase">{profileData?.username}</h1>
              <p className="font-label-caps text-zinc-500 mt-1">{profileData?.badge} • NO_DRAMA_ZONE</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="bg-primary-container text-black border-2 border-black px-3 py-1 text-xs font-black uppercase">
                  MEMBER SINCE {memberSinceYear}
                </span>
                <span className="bg-secondary-container text-black border-2 border-black px-3 py-1 text-xs font-black uppercase">
                  VERIFIED
                </span>
              </div>
              <p className="font-body-reg text-sm text-zinc-600 mt-4">
                {profileData?.email} • {profileData?.phone || 'No Phone Number'}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border-4 border-black p-4 text-center neubrutal-shadow-sm">
            <p className="font-headline-lg">{profileData?.stats?.total_split || 0}</p>
            <p className="font-label-caps text-xs text-zinc-500 mt-1">TOTAL SPLIT</p>
          </div>
          <div className="bg-white border-4 border-black p-4 text-center neubrutal-shadow-sm">
            <p className="font-headline-lg text-secondary">{profileData?.stats?.active_group || 0}</p>
            <p className="font-label-caps text-xs text-zinc-500 mt-1">GRUP AKTIF</p>
          </div>
          <div className="bg-white border-4 border-black p-4 text-center neubrutal-shadow-sm">
            <p className="font-headline-lg text-primary">{profileData?.stats?.total_friend || 0}</p>
            <p className="font-label-caps text-xs text-zinc-500 mt-1">TEMAN</p>
          </div>
          <div className="bg-white border-4 border-black p-4 text-center neubrutal-shadow-sm">
            <p className="font-headline-lg text-tertiary">{profileData?.stats?.total_drama || 0}</p>
            <p className="font-label-caps text-xs text-zinc-500 mt-1">DRAMA</p>
          </div>
        </section>

        {/* Settings Section */}
        <section className="space-y-4">
          <h2 className="font-headline-lg uppercase underline decoration-yellow-400 decoration-8 underline-offset-4">
            SETTINGS
          </h2>

          <div 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-white border-4 border-black p-5 flex items-center justify-between hover:-translate-x-1 hover:-translate-y-1 transition-transform neubrutal-shadow-sm cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-zinc-100 border-2 border-black p-2 group-hover:bg-yellow-400 transition-colors">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-body-bold uppercase">EDIT PROFIL</p>
                <p className="font-body-reg text-sm text-zinc-500">Ubah nama, email, dan no HP</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-zinc-400 group-hover:text-black transition-colors">
              chevron_right
            </span>
          </div>

          {[
            { icon: 'notifications', label: 'NOTIFIKASI', desc: 'Atur notifikasi tagihan dan reminder' },
            { icon: 'account_balance_wallet', label: 'METODE PEMBAYARAN', desc: 'Kelola QRIS, e-wallet, dan rekening bank' },
            { icon: 'palette', label: 'TAMPILAN', desc: 'Dark mode, bahasa, dan tema warna' },
            { icon: 'security', label: 'KEAMANAN', desc: 'Password, 2FA, dan perangkat terhubung' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border-4 border-black p-5 flex items-center justify-between hover:-translate-x-1 hover:-translate-y-1 transition-transform neubrutal-shadow-sm cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-zinc-100 border-2 border-black p-2 group-hover:bg-yellow-400 transition-colors">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div>
                  <p className="font-body-bold uppercase">{item.label}</p>
                  <p className="font-body-reg text-sm text-zinc-500">{item.desc}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-zinc-400 group-hover:text-black transition-colors">
                chevron_right
              </span>
            </div>
          ))}
        </section>

        {/* Danger Zone */}
        <section className="bg-tertiary-fixed border-4 border-black p-6 neubrutal-shadow">
          <h3 className="font-headline-lg uppercase text-tertiary mb-4">DANGER_ZONE</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={handleLogout}
              className="bg-white text-black border-4 border-black px-6 py-3 font-space font-black uppercase neubrutal-shadow-sm active-press hover:bg-zinc-100 transition-colors"
            >
              LOGOUT
            </button>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-tertiary text-white border-4 border-black px-6 py-3 font-space font-black uppercase neubrutal-shadow-sm active-press hover:bg-red-600 transition-colors"
            >
              HAPUS AKUN
            </button>
          </div>
        </section>

        {/* MODAL EDIT PROFIL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-4 border-black w-full max-w-md p-6 neubrutal-shadow animate-[scale-in_0.2s_ease-out]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-lg uppercase text-black">EDIT PROFIL</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="material-symbols-outlined text-black hover:text-tertiary">
                  close
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block font-space font-black uppercase text-sm mb-1">Username</label>
                  <input 
                    type="text" 
                    name="username"
                    value={editForm.username} 
                    onChange={handleChange}
                    className="w-full border-4 border-black p-3 font-body-reg focus:outline-none focus:bg-yellow-50"
                  />
                </div>
                <div>
                  <label className="block font-space font-black uppercase text-sm mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={editForm.email} 
                    onChange={handleChange}
                    className="w-full border-4 border-black p-3 font-body-reg focus:outline-none focus:bg-yellow-50"
                  />
                </div>
                <div>
                  <label className="block font-space font-black uppercase text-sm mb-1">Nomor HP</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={editForm.phone} 
                    onChange={handleChange}
                    className="w-full border-4 border-black p-3 font-body-reg focus:outline-none focus:bg-yellow-50"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`w-full text-white border-4 border-black px-6 py-4 font-space font-black uppercase neubrutal-shadow-sm transition-colors mt-6 ${isSaving ? 'bg-zinc-500 cursor-not-allowed' : 'bg-primary hover:bg-black active-press'}`}
                >
                  {isSaving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DELETE CONFIRMATION */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-tertiary border-4 border-black w-full max-w-md p-8 neubrutal-shadow animate-[scale-in_0.2s_ease-out]">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-white mb-4">warning</span>
                <h3 className="font-headline-lg uppercase text-white mb-2">YAKIN MAU HAPUS?</h3>
                <p className="font-body-bold text-white/90 mb-8">
                  Aksi ini tidak bisa dibatalkan! Semua data, riwayat patungan, dan profil kamu akan dihapus permanen ke black hole.
                </p>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={executeDeleteAccount}
                    disabled={isDeleting}
                    className={`w-full bg-black text-white border-4 border-black px-6 py-4 font-space font-black uppercase transition-colors ${
                      isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800 active-press'
                    }`}
                  >
                    {isDeleting ? 'MENGHAPUS...' : 'YA, HAPUS AKUN'}
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="w-full bg-white text-black border-4 border-black px-6 py-4 font-space font-black uppercase hover:bg-yellow-400 transition-colors active-press"
                  >
                    GAK JADI DEH
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  )
}

export default Profile
