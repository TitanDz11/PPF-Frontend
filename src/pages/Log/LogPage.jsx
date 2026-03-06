import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { getEntries, deleteEntry } from '../../api/entries'
import { getVehicles } from '../../api/vehicles'
import EmptyState from '../../components/EmptyState'

export default function LogPage() {
    const toast = useRef(null)
    const navigate = useNavigate()
    const [entries, setEntries] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)

    // Filter state
    const [filterDate, setFilterDate] = useState(null)
    const [filterVehicle, setFilterVehicle] = useState(null)
    const [filterDriver, setFilterDriver] = useState('')

    const buildParams = useCallback(() => {
        const p = {}
        if (filterDate) {
            // Format date as YYYY-MM-DD using local timezone (not UTC)
            const year = filterDate.getFullYear()
            const month = String(filterDate.getMonth() + 1).padStart(2, '0')
            const day = String(filterDate.getDate()).padStart(2, '0')
            const dateStr = `${year}-${month}-${day}`
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                p.fecha = dateStr
            }
        }
        if (filterVehicle) {
            // Ensure vehicle_id is numeric
            const vehicleId = Number(filterVehicle)
            if (!isNaN(vehicleId) && vehicleId > 0) {
                p.vehicle_id = vehicleId.toString()
            }
        }
        if (filterDriver && filterDriver.trim()) {
            // Sanitize motorista - remove special SQL characters and limit length
            const sanitized = filterDriver.trim()
                .replace(/['";\\]/g, '')
                .substring(0, 150)
            if (sanitized) {
                p.motorista = sanitized
            }
        }
        return p
    }, [filterDate, filterVehicle, filterDriver])

    const load = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getEntries(buildParams())
            setEntries(res.data.data)
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
        } finally {
            setLoading(false)
        }
    }, [buildParams])

    useEffect(() => {
        getVehicles().then((r) =>
            setVehicles([
                { label: 'Todos los vehículos', value: null },
                ...r.data.data.map((v) => ({ label: `${v.placa} – ${v.marca} ${v.modelo}`, value: v.id })),
            ])
        )
    }, [])

    useEffect(() => { load() }, [load])

    function clearFilters() {
        setFilterDate(null)
        setFilterVehicle(null)
        setFilterDriver('')
    }

    function confirmDelete(e) {
        confirmDialog({
            message: `¿Eliminar este registro de ${e.tipo}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await deleteEntry(e.id)
                    toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado.' })
                    load()
                } catch (err) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
                }
            },
        })
    }

    const tipoBadge = (r) => (
        <span className={r.tipo === 'entrada' ? 'badge-entrada' : 'badge-salida'}>
            {r.tipo === 'entrada' ? 'Entrada' : 'Salida'}
        </span>
    )

    const formatDate = (dateString) => {
        if (!dateString) return ''
        
        // Handle different date formats from API
        let year, month, day
        
        if (dateString.includes('T')) {
            // ISO format: 2026-03-26T00:00:00.000Z
            const datePart = dateString.split('T')[0]
            [year, month, day] = datePart.split('-')
        } else if (dateString.includes('/')) {
            // Already DD/MM/YYYY format
            [day, month, year] = dateString.split('/')
        } else {
            // YYYY-MM-DD format
            [year, month, day] = dateString.split('-')
        }
        
        // Validate parsed values
        if (!year || !month || !day || isNaN(Number(year))) {
            return dateString
        }
        
        const d = String(Number(day)).padStart(2, '0')
        const m = String(Number(month)).padStart(2, '0')
        const y = Number(year)
        return `${d}/${m}/${y}`
    }

    const actionBody = (r) => (
        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
            <Button icon="pi pi-pencil" rounded text severity="info" size="small"
                onClick={() => navigate(`/entries/${r.id}/edit`)} tooltip="Editar" aria-label="Editar" />
            <Button icon="pi pi-trash" rounded text severity="danger" size="small"
                onClick={() => confirmDelete(r)} tooltip="Eliminar" aria-label="Eliminar" />
        </div>
    )

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="page-header">
                <h1 className="page-title">
                    <span className="title-icon"><i className="pi pi-list" /></span>
                    Historial de Movimientos
                </h1>
                <p className="page-subtitle">Entradas y salidas de vehículos con filtros avanzados</p>
            </div>

            {/* Filter bar */}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <p className="card-title"><i className="pi pi-filter" /> Filtros</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Fecha</label>
                        <Calendar
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.value)}
                            dateFormat="yy-mm-dd"
                            showIcon
                            icon="pi pi-calendar"
                            showButtonBar
                            style={{ width: '100%' }}
                            placeholder="Seleccione fecha"
                            inputStyle={{ borderRadius: '8px' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Vehículo</label>
                        <Dropdown
                            value={filterVehicle}
                            options={vehicles}
                            onChange={(e) => setFilterVehicle(e.value)}
                            placeholder="Todos"
                            style={{ width: '100%' }}
                            filter
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Motorista</label>
                        <InputText
                            value={filterDriver}
                            onChange={(e) => setFilterDriver(e.target.value)}
                            placeholder="Ej. Juan Pérez"
                            style={{ width: '100%' }}
                            keyfilter={/^[a-zA-Z\s'\-]*$/}
                            tooltip="Solo se permiten letras, espacios, guiones y apóstrofes"
                            tooltipOptions={{ position: 'bottom' }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <Button label="Limpiar" icon="pi pi-times" text severity="secondary" onClick={clearFilters} />
                    <Button label="Buscar" icon="pi pi-search" onClick={load} />
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="action-bar" style={{ flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {entries.length} resultado(s)
                    </span>
                    <div className="spacer" />
                    <Button label="Nuevo Movimiento" icon="pi pi-plus" onClick={() => navigate('/entries/new')} />
                </div>

                <DataTable
                    value={entries}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    emptyMessage={<EmptyState title="No hay movimientos" description="No hay movimientos registrados para los filtros seleccionados." icon="pi-list" actionLabel={(!filterDate && !filterVehicle && !filterDriver) ? "Registrar Movimiento" : null} onAction={() => navigate('/entries/new')} />}
                    dataKey="id"
                    responsiveLayout="scroll"
                    scrollable
                    className="custom-datatable"
                >
                    <Column field="id" header="ID" sortable style={{ width: '80px', textAlign: 'center' }} />
                    <Column field="placa" header="PLACA" sortable style={{ fontWeight: '600' }} />
                    <Column body={(r) => `${r.marca} ${r.modelo}`} header="VEHÍCULO" sortable sortField="marca" />
                    <Column field="motorista" header="MOTORISTA" sortable />
                    <Column header="TIPO" body={tipoBadge} sortable sortField="tipo" style={{ textAlign: 'center' }} />
                    <Column field="fecha" header="FECHA" sortable body={(r) => formatDate(r.fecha)} style={{ whiteSpace: 'nowrap' }} />
                    <Column field="hora" header="HORA" style={{ textAlign: 'center', whiteSpace: 'nowrap' }} />
                    <Column field="kilometraje" header="KM" sortable body={(r) => r.kilometraje.toLocaleString('es-HN')} style={{ textAlign: 'right' }} />
                    <Column header="ACCIONES" body={actionBody} style={{ width: '120px', textAlign: 'center' }} />
                </DataTable>
            </div>
        </div>
    )
}
