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
        if (filterDate) p.fecha = filterDate.toISOString().split('T')[0]
        if (filterVehicle) p.vehicle_id = filterVehicle
        if (filterDriver.trim()) p.motorista = filterDriver.trim()
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
            <div className="card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
                <p className="card-title"><i className="pi pi-filter" /> Filtros</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Fecha</label>
                        <Calendar
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.value)}
                            dateFormat="yy-mm-dd"
                            showIcon
                            showButtonBar
                            style={{ width: '100%' }}
                            placeholder="Seleccione fecha"
                            appendTo="self"
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
                            appendTo="self"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Motorista</label>
                        <InputText
                            value={filterDriver}
                            onChange={(e) => setFilterDriver(e.target.value)}
                            placeholder="Ej. Juan Pérez"
                            style={{ width: '100%' }}
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
                    scrollWidth="100%"
                >
                    <Column field="id" header="ID" sortable style={{ width: '70px' }} />
                    <Column field="placa" header="Placa" sortable />
                    <Column body={(r) => `${r.marca} ${r.modelo}`} header="Vehículo" sortable sortField="marca" />
                    <Column field="motorista" header="Motorista" sortable />
                    <Column header="Tipo" body={tipoBadge} sortable sortField="tipo" />
                    <Column field="fecha" header="Fecha" sortable />
                    <Column field="hora" header="Hora" />
                    <Column field="kilometraje" header="Km" sortable body={(r) => r.kilometraje.toLocaleString('es')} />
                    <Column header="Acciones" body={actionBody} style={{ width: '100px', textAlign: 'center' }} />
                </DataTable>
            </div>
        </div>
    )
}
