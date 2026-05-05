import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-black text-white w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black">
      <div className="flex flex-col gap-2 items-center md:items-start">
        <Link to="/" className="text-lg font-space font-black text-white uppercase tracking-widest">
          SPLITBILL.KUY
        </Link>
        <p className="font-space font-black text-[10px] tracking-widest text-zinc-400">
          BIAR GAK ADA DRAMA SIAPA YANG KURANG BAYAR
        </p>
      </div>
      <div className="flex gap-6">
        <a
          href="#"
          className="font-space font-black text-xs tracking-widest text-zinc-300 hover:text-yellow-400 transition-colors uppercase"
        >
          TERMS
        </a>
        <a
          href="#"
          className="font-space font-black text-xs tracking-widest text-zinc-300 hover:text-yellow-400 transition-colors uppercase"
        >
          PRIVACY
        </a>
        <a
          href="#"
          className="font-space font-black text-xs tracking-widest text-zinc-300 hover:text-yellow-400 transition-colors uppercase"
        >
          GITHUB
        </a>
      </div>
    </footer>
  )
}

export default Footer
