import { useEffect, useState } from 'react'
import { getVehicles } from '../api/vehicles'
import { getEntries } from '../api/entries'
import { Skeleton } from 'primereact/skeleton'

export default function Dashboard() {
    const [vehicleCount, setVehicleCount] = useState(0)
    const [totalEntries, setTotalEntries] = useState(0)
    const [todayEntries, setTodayEntries] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const today = new Date().toISOString().split('T')[0]
                const [vRes, eRes, tRes] = await Promise.all([
                    getVehicles(),
                    getEntries(),
                    getEntries({ fecha: today }),
                ])
                setVehicleCount(vRes.data.data.length)
                setTotalEntries(eRes.data.data.length)
                setTodayEntries(tRes.data.data.length)
            } catch (_) {
                // silently fail on dashboard
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return (
        <div>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <Skeleton width="20rem" height="2.5rem" className="mb-2" />
                <Skeleton width="15rem" height="1.2rem" />
            </div>
            <div className="stats-strip">
                <Skeleton width="100%" height="100px" borderRadius="12px" />
                <Skeleton width="100%" height="100px" borderRadius="12px" />
                <Skeleton width="100%" height="100px" borderRadius="12px" />
            </div>
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <Skeleton width="15rem" height="1.5rem" className="mb-3" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="80%" height="1rem" />
            </div>
        </div>
    )

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    <span className="title-icon"><i className="pi pi-th-large" /></span>
                    Dashboard
                </h1>
                <p className="page-subtitle">Resumen general de la flota vehicular</p>
            </div>

            <div className="stats-strip">
                <div className="stat-card">
                    <div className="stat-icon purple"><i className="pi pi-car" /></div>
                    <div>
                        <div className="stat-value">{vehicleCount}</div>
                        <div className="stat-label">Vehículos</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><i className="pi pi-list" /></div>
                    <div>
                        <div className="stat-value">{totalEntries}</div>
                        <div className="stat-label">Movimientos</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange"><i className="pi pi-calendar" /></div>
                    <div>
                        <div className="stat-value">{todayEntries}</div>
                        <div className="stat-label">Hoy</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <p className="card-title"><i className="pi pi-info-circle" /> Bienvenido a FleetControl</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Usa el menú lateral para gestionar <strong>vehículos</strong>, registrar{' '}
                    <strong>entradas y salidas</strong>, y consultar el <strong>historial</strong> con filtros avanzados.
                </p>
            </div>
        </div>
    )
}
