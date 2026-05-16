import Navbar from "./components/Navbar"
import StatusCards from "./components/StatusCards"
import FailurePanel from "./components/FailurePanel"
import DiagnosisCard from "./components/DiagnosisCard"
import FixPanel from "./components/FixPanel"

function App() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6">

        <StatusCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          <div className="space-y-6">
            <FailurePanel />
            <DiagnosisCard />
          </div>

          <div className="space-y-6">
            <FixPanel />
          </div>

        </div>
      </div>
    </div>
  )
}

export default App