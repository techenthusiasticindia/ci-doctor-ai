import Navbar from "./components/Navbar"
import StatusCards from "./components/StatusCards"

function App() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <StatusCards />
      </div>
    </div>
  )
}

export default App