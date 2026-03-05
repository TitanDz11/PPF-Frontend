import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import VehiclesPage from './pages/Vehicles/VehiclesPage'
import EntryForm from './pages/Entries/EntryForm'
import LogPage from './pages/Log/LogPage'

export default function App() {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/vehicles" element={<VehiclesPage />} />
                    <Route path="/entries/new" element={<EntryForm />} />
                    <Route path="/entries/:id/edit" element={<EntryForm />} />
                    <Route path="/log" element={<LogPage />} />
                </Routes>
            </main>
        </div>
    )
}
