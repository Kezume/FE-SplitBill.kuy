import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

function Layout({ children, activePage }) {
  return (
    <div className="bg-background font-body-reg text-on-background min-h-screen flex flex-col">
      <div className="flex min-h-screen">
        <Sidebar activePage={activePage} />
        <div className="flex-grow flex flex-col">
          <Navbar />
          <main className="p-6 md:p-10 space-y-10 flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Layout
