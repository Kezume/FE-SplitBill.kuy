import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="bg-background font-body-reg text-on-background overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-white flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 border-b-4 border-black shadow-[0_4px_0_0_#000]">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-space font-black text-black italic tracking-tighter uppercase">
            SPLIT<span className="text-yellow-500">BILL</span>.KUY
          </h1>
        </div>
        <div className="flex items-center gap-6 font-space font-black uppercase">
          <Link
            to="/login"
            className="text-black hover:text-yellow-500 transition-colors"
          >
            LOGIN
          </Link>
          <Link
            to="/register"
            className="bg-yellow-400 text-black px-6 py-2 border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all"
          >
            DAFTAR BARU
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-surface">
          {/* Decorative ASCII Background */}
          <div className="absolute top-10 left-10 opacity-20 font-body-bold text-4xl select-none hidden lg:block">
            [ $$$ ]<br />
            [ BILL ]<br />
            [ SPLT ]
          </div>
          <div className="absolute bottom-10 right-10 opacity-20 font-body-bold text-4xl select-none hidden lg:block">
            (╯°□°）╯︵ ┻━┻
          </div>

          {/* Main Headline */}
          <h1 className="font-headline-xl text-[60px] md:text-[100px] mb-8 leading-none flex flex-wrap justify-center gap-x-4">
            <span className="text-primary-container drop-shadow-[4px_4px_0px_#000]">SPLIT</span>
            <span className="text-tertiary drop-shadow-[4px_4px_0px_#000]">BILL</span>
            <span className="text-secondary-fixed-dim drop-shadow-[4px_4px_0px_#000]">.</span>
            <span className="text-on-surface drop-shadow-[4px_4px_0px_#000]">KUY</span>
          </h1>

          {/* Subheading Box */}
          <div className="bg-primary-container border-[4px] border-black p-4 mb-12 shadow-[8px_8px_0_0_#000] rotate-1 max-w-3xl">
            <p className="font-body-bold text-black uppercase tracking-widest text-lg md:text-xl">
              APLIKASI PENCATAT HUTANG & PATUNGAN PALING ANTI-RIBET. BIAR TONGKRONGAN TETEP ASYIK TANPA DRAMA SIAPA YANG BELUM BAYAR!
            </p>
          </div>

          {/* CTA Button */}
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center px-12 py-6 bg-secondary-container text-black font-headline-lg border-[4px] border-black shadow-[8px_8px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all"
          >
            COBA SEKARANG
            <span className="material-symbols-outlined ml-4 text-4xl">trending_flat</span>
          </Link>
        </section>

        {/* Apa itu SplitBill Section */}
        <section className="px-6 py-20 bg-white border-y-4 border-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-headline-xl text-4xl md:text-6xl text-black mb-10 uppercase">
              APA ITU <span className="bg-yellow-400 px-2 border-4 border-black inline-block -rotate-2">SPLITBILL.KUY?</span>
            </h2>
            <div className="font-body-reg text-xl md:text-2xl text-black leading-relaxed text-left p-8 border-4 border-black shadow-[12px_12px_0_0_#000] bg-surface-container-lowest relative">
              <span className="material-symbols-outlined absolute -top-8 -left-8 text-6xl text-tertiary bg-white rounded-full border-4 border-black p-2">
                help
              </span>
              <p className="mb-6">
                <strong>SplitBill.KUY</strong> adalah platform untuk mencatat, membagi, dan mengelola pengeluaran bersama alias <em>patungan</em>.
              </p>
              <p>
                Entah itu makan bareng temen, patungan beli kado, atau biaya liburan, semuanya bisa dicatat dengan transparan. Gak perlu lagi nagih manual lewat chat yang bikin canggung. Sistem kami yang akan menghitung pembagiannya dengan adil dan mengingatkan mereka!
              </p>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="px-6 py-20 max-w-7xl mx-auto bg-surface">
          <div className="text-center mb-16">
             <h2 className="font-headline-xl text-4xl md:text-6xl text-black uppercase">
                FITUR <span className="bg-secondary-fixed-dim text-black px-2 border-4 border-black inline-block rotate-2">ANDALAN</span>
             </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_0_#000] hover:-translate-y-2 hover:-translate-x-2 transition-transform">
              <div className="bg-black text-white w-16 h-16 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl">group</span>
              </div>
              <h3 className="font-headline-lg text-black mb-4 uppercase text-2xl">MANAJEMEN GRUP</h3>
              <p className="font-body-reg text-on-surface-variant">
                Bikin grup untuk tongkrongan, temen kos, atau keluarga. Gabung ke grup gampang banget pakai invite code.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_0_#000] hover:-translate-y-2 hover:-translate-x-2 transition-transform md:mt-12">
              <div className="bg-primary-container text-black w-16 h-16 flex items-center justify-center mb-6 border-[4px] border-black">
                <span className="material-symbols-outlined text-4xl">calculate</span>
              </div>
              <h3 className="font-headline-lg text-black mb-4 uppercase text-2xl">HITUNG OTOMATIS</h3>
              <p className="font-body-reg text-on-surface-variant">
                Input pengeluaran dan pilih siapa aja yang ikutan. Sistem otomatis membagi tagihan secara presisi tanpa pusing hitung manual.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_0_#000] hover:-translate-y-2 hover:-translate-x-2 transition-transform">
              <div className="bg-tertiary text-white w-16 h-16 flex items-center justify-center mb-6 border-[4px] border-black">
                <span className="material-symbols-outlined text-4xl">notifications_active</span>
              </div>
              <h3 className="font-headline-lg text-black mb-4 uppercase text-2xl">PENGINGAT OTOMATIS</h3>
              <p className="font-body-reg text-on-surface-variant">
                Gak enak hati nagih temen? Biar SplitBill.KUY yang kasih notifikasi ke mereka. Persahabatan aman, uang kembali!
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-surface-container-high border-y-4 border-black py-20 px-6">
           <div className="max-w-6xl mx-auto">
              <h2 className="font-headline-xl text-4xl md:text-5xl text-black text-center mb-20 uppercase">
                 CARA KERJA <span className="bg-white px-2 border-4 border-black inline-block -rotate-1">SUPER GAMPANG</span>
              </h2>
              
              <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                 {/* Step 1 */}
                 <div className="flex-1 text-center flex flex-col items-center relative">
                    <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center font-headline-xl text-5xl border-4 border-black shadow-[8px_8px_0_0_#fff] mb-8 z-10">
                       1
                    </div>
                    <h3 className="font-headline-lg text-2xl uppercase mb-3 bg-yellow-400 border-2 border-black px-4 py-1">Buat Grup</h3>
                    <p className="font-body-bold text-lg">Buat grup dan invite teman-teman patunganmu.</p>
                 </div>
                 
                 {/* Arrow */}
                 <div className="hidden md:block text-black">
                    <span className="material-symbols-outlined text-6xl">arrow_forward_ios</span>
                 </div>
                 
                 {/* Step 2 */}
                 <div className="flex-1 text-center flex flex-col items-center relative">
                    <div className="w-24 h-24 bg-yellow-400 text-black rounded-full flex items-center justify-center font-headline-xl text-5xl border-4 border-black shadow-[8px_8px_0_0_#000] mb-8 z-10">
                       2
                    </div>
                    <h3 className="font-headline-lg text-2xl uppercase mb-3 bg-secondary-container border-2 border-black px-4 py-1">Catat Tagihan</h3>
                    <p className="font-body-bold text-lg">Masukkan total bill dan siapa yang nalangin bayar.</p>
                 </div>
                 
                 {/* Arrow */}
                 <div className="hidden md:block text-black">
                    <span className="material-symbols-outlined text-6xl">arrow_forward_ios</span>
                 </div>
                 
                 {/* Step 3 */}
                 <div className="flex-1 text-center flex flex-col items-center relative">
                    <div className="w-24 h-24 bg-tertiary text-white rounded-full flex items-center justify-center font-headline-xl text-5xl border-4 border-black shadow-[8px_8px_0_0_#000] mb-8 z-10">
                       3
                    </div>
                    <h3 className="font-headline-lg text-2xl uppercase mb-3 bg-white border-2 border-black px-4 py-1">Lunas!</h3>
                    <p className="font-body-bold text-lg">Tagihan terbagi otomatis, tinggal tunggu teman lunasi hutang.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Visual Break Marquee */}
        <section className="w-full bg-black py-12 overflow-hidden">
          <div className="whitespace-nowrap flex animate-marquee">
            <span className="text-white font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">NO DRAMA</span>
            <span className="text-primary-container font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">•</span>
            <span className="text-white font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">BAYAR WOY</span>
            <span className="text-secondary-fixed-dim font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">•</span>
            <span className="text-white font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">SPLITBILL.KUY</span>
            <span className="text-tertiary font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">•</span>
            <span className="text-white font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">BILLING MADE EASY</span>
            <span className="text-primary-container font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">•</span>
            {/* Duplicate for seamless loop */}
            <span className="text-white font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">NO DRAMA</span>
            <span className="text-primary-container font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">•</span>
            <span className="text-white font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">BAYAR WOY</span>
            <span className="text-secondary-fixed-dim font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">•</span>
            <span className="text-white font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">SPLITBILL.KUY</span>
            <span className="text-tertiary font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">•</span>
            <span className="text-white font-headline-xl text-[40px] md:text-[60px] mx-8 uppercase">BILLING MADE EASY</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black text-black w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl font-space font-black uppercase tracking-tighter mb-2 italic">
            SPLIT<span className="text-yellow-500">BILL</span>.KUY
          </h2>
          <p className="font-body-bold text-sm text-zinc-600">
            BIAR GAK ADA DRAMA SIAPA YANG KURANG BAYAR
          </p>
        </div>
        <div className="font-body-bold text-sm text-black bg-yellow-400 px-4 py-2 border-2 border-black shadow-[4px_4px_0_0_#000]">
          © {new Date().getFullYear()} MADE WITH ☕ AND NO DRAMA.
        </div>
      </footer>
    </div>
  )
}

export default Home
