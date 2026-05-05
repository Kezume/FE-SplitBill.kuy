import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Register gagal')
      }

      // Simpan token
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data))
      setSuccess(true)

      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background font-body-reg text-on-background min-h-screen flex items-center justify-center p-6">
      {/* Background decorations */}
      <div className="fixed top-10 left-10 text-zinc-200 font-headline-xl select-none pointer-events-none opacity-30 rotate-[-12deg]">
        [ JOIN ]
      </div>
      <div className="fixed bottom-10 right-10 text-zinc-200 font-headline-xl select-none pointer-events-none opacity-30 rotate-[8deg]">
        [ SPLIT ]
      </div>

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="font-headline-xl uppercase italic tracking-tighter inline-block">
              SPLIT<span className="bg-yellow-400 px-2 border-4 border-black">BILL</span>.KUY
            </h1>
          </Link>
          <p className="font-label-caps text-zinc-500 mt-4">DAFTAR_AKUN_BARU</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white border-4 border-black neubrutal-shadow p-8 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-tertiary text-white border-4 border-black p-4 font-body-bold text-sm flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="bg-secondary-container text-black border-4 border-black p-4 font-body-bold text-sm flex items-center gap-3">
              <span className="material-symbols-outlined">check_circle</span>
              REGISTER BERHASIL! Redirecting...
            </div>
          )}

          {/* Username */}
          <div className="space-y-2">
            <label className="font-label-caps uppercase block">USERNAME</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                person
              </span>
              <input
                name="username"
                type="text"
                placeholder="NAMA_KEREN_LO"
                value={form.username}
                onChange={handleChange}
                required
                minLength={5}
                className="w-full p-4 pl-14 border-4 border-black font-body-reg placeholder:text-zinc-400 bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="font-label-caps uppercase block">EMAIL</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                mail
              </span>
              <input
                name="email"
                type="email"
                placeholder="LO@SPLITBILL.KUY"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-4 pl-14 border-4 border-black font-body-reg placeholder:text-zinc-400 bg-white"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="font-label-caps uppercase block">PHONE</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                phone
              </span>
              <input
                name="phone"
                type="tel"
                placeholder="08XXXXXXXXXX"
                value={form.phone}
                onChange={handleChange}
                required
                maxLength={13}
                className="w-full p-4 pl-14 border-4 border-black font-body-reg placeholder:text-zinc-400 bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="font-label-caps uppercase block">PASSWORD</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                lock
              </span>
              <input
                name="password"
                type="password"
                placeholder="MIN_8_KARAKTER"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full p-4 pl-14 border-4 border-black font-body-reg placeholder:text-zinc-400 bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 border-4 border-black font-space font-black text-xl uppercase neubrutal-shadow active-press transition-all flex items-center justify-center gap-3 ${
              loading
                ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-300'
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                PROCESSING...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">how_to_reg</span>
                DAFTAR SEKARANG
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-grow border-t-2 border-black"></div>
            <span className="font-label-caps text-zinc-500 text-xs">ATAU</span>
            <div className="flex-grow border-t-2 border-black"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="font-body-reg text-sm">
              UDAH PUNYA AKUN?{' '}
              <Link
                to="/login"
                className="font-body-bold text-black underline decoration-4 decoration-yellow-400 hover:bg-yellow-400 transition-colors px-1"
              >
                LOGIN_DISINI
              </Link>
            </p>
          </div>
        </form>

        {/* Footer tag */}
        <div className="text-center mt-6">
          <span className="font-label-caps text-zinc-400 text-xs">
            NO_DRAMA_ZONE © 2024
          </span>
        </div>
      </div>
    </div>
  )
}

export default Register
