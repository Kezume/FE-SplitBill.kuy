import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const transactions = [
  { date: '01 MEI 2024', desc: 'LO BAYAR BAKSO KE @BUDI_DOREMI', amount: 'Rp 25.000', status: 'LUNAS', statusColor: 'bg-secondary-container text-black', icon: 'restaurant' },
  { date: '30 APR 2024', desc: '@SITI_KEREN BELUM BAYAR TIKET BIOSKOP', amount: 'Rp 45.000', status: 'PENDING', statusColor: 'bg-primary-container text-black', icon: 'movie' },
  { date: '28 APR 2024', desc: 'TAGIHAN KOPI BARENG ANAK KANTOR', amount: 'Rp 120.000', status: 'TERKIRIM', statusColor: 'bg-primary-container text-black', icon: 'coffee' },
  { date: '25 APR 2024', desc: 'SPLIT BILL DINNER LA FAVELA', amount: 'Rp 600.000', status: 'LUNAS', statusColor: 'bg-secondary-container text-black', icon: 'restaurant' },
  { date: '22 APR 2024', desc: '@ANDI_PUNK BAYAR RENTAL SCOOTER', amount: 'Rp 150.000', status: 'LUNAS', statusColor: 'bg-secondary-container text-black', icon: 'two_wheeler' },
  { date: '20 APR 2024', desc: 'BAYAR SURF LESSON BARENG', amount: 'Rp 200.000', status: 'GAGAL', statusColor: 'bg-tertiary text-white', icon: 'surfing' },
  { date: '18 APR 2024', desc: '@SARAH_CORE BELUM BAYAR BEER', amount: 'Rp 80.000', status: 'PENDING', statusColor: 'bg-primary-container text-black', icon: 'sports_bar' },
  { date: '15 APR 2024', desc: 'TOP UP BENSIN ROAD TRIP', amount: 'Rp 300.000', status: 'LUNAS', statusColor: 'bg-secondary-container text-black', icon: 'local_gas_station' },
]

function History() {
  return (
    <div className="bg-background font-body-reg text-on-background min-h-screen flex flex-col">
      <Navbar />
      <main className="p-6 md:p-10 space-y-10 flex-grow max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline-xl uppercase">HISTORY_LOG</h1>
            <p className="font-label-caps text-zinc-500 mt-2">
              SEMUA DRAMA TERCATAT RAPI
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-black text-white font-space font-black uppercase border-4 border-black px-4 py-2 text-sm neubrutal-shadow-sm active-press">
              SEMUA
            </button>
            <button className="bg-white text-black font-space font-black uppercase border-4 border-black px-4 py-2 text-sm hover:bg-yellow-400 transition-colors active-press">
              LUNAS
            </button>
            <button className="bg-white text-black font-space font-black uppercase border-4 border-black px-4 py-2 text-sm hover:bg-yellow-400 transition-colors active-press">
              PENDING
            </button>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="bg-black text-white p-6 border-4 border-black neubrutal-shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="font-label-caps text-zinc-400 text-xs mb-1">TOTAL TRANSAKSI</p>
              <p className="font-headline-lg">{transactions.length}</p>
            </div>
            <div>
              <p className="font-label-caps text-zinc-400 text-xs mb-1">TOTAL LUNAS</p>
              <p className="font-headline-lg text-secondary-container">
                {transactions.filter(t => t.status === 'LUNAS').length}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-zinc-400 text-xs mb-1">MASIH PENDING</p>
              <p className="font-headline-lg text-primary-container">
                {transactions.filter(t => t.status === 'PENDING').length}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-zinc-400 text-xs mb-1">GAGAL</p>
              <p className="font-headline-lg text-tertiary">
                {transactions.filter(t => t.status === 'GAGAL').length}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <section className="space-y-0">
          {transactions.map((tx, idx) => (
            <div key={idx} className="flex gap-6 group">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-black border-2 border-black group-hover:bg-yellow-400 transition-colors"></div>
                {idx < transactions.length - 1 && (
                  <div className="w-1 flex-grow bg-black"></div>
                )}
              </div>

              {/* Card */}
              <div className="bg-white border-4 border-black p-5 mb-4 flex-grow neubrutal-shadow-sm hover:-translate-x-1 hover:-translate-y-1 transition-transform">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-100 border-2 border-black p-2">
                      <span className="material-symbols-outlined">{tx.icon}</span>
                    </div>
                    <div>
                      <p className="font-body-bold uppercase text-sm">{tx.desc}</p>
                      <p className="font-label-caps text-xs text-zinc-500 mt-1">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-body-bold font-black">{tx.amount}</span>
                    <span className={`${tx.statusColor} px-3 py-1 text-xs font-black border-2 border-black uppercase`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default History
