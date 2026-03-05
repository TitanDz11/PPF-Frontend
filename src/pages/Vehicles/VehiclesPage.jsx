import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../api/vehicles'
import EmptyState from '../../components/EmptyState'
import { useDebounce } from '../../hooks/useDebounce'

const EMPTY = { marca: '', modelo: '', placa: '' }
const REQUIRED = ['marca', 'modelo', 'placa']

function validate(v) {
    const errors = {}
    REQUIRED.forEach((f) => { if (!v[f]?.trim()) errors[f] = 'Campo requerido.' })
    if (v.placa && !/^[A-Za-z0-9\-]+$/.test(v.placa))
        errors.placa = 'Solo letras, números y guiones.'
    if (v.marca && !/^[a-zA-Z\s]+$/.test(v.marca))
        errors.marca = 'Solo letras y espacios, sin números.'
    return errors
}

export default function VehiclesPage() {
    const toast = useRef(null)
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const [editId, setEditId] = useState(null)
    const [filter, setFilter] = useState('')

    async function load() {
        try {
            setLoading(true)
            const res = await getVehicles()
            setVehicles(res.data.data)
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    function openCreate() {
        setForm(EMPTY)
        setErrors({})
        setEditId(null)
        setDialogOpen(true)
    }

    function openEdit(v) {
        setForm({ marca: v.marca, modelo: v.modelo, placa: v.placa })
        setErrors({})
        setEditId(v.id)
        setDialogOpen(true)
    }

    function handleChange(field, value) {
        setForm((p) => ({ ...p, [field]: value }))
        if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }))
    }

    async function handleSave() {
        const errs = validate(form)
        if (Object.keys(errs).length) { setErrors(errs); return }
        setSaving(true)
        try {
            if (editId) {
                await updateVehicle(editId, form)
                toast.current?.show({ severity: 'success', summary: 'Actualizado', detail: 'Vehículo actualizado.' })
            } else {
                await createVehicle(form)
                toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Vehículo registrado.' })
            }
            setDialogOpen(false)
            load()
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
        } finally {
            setSaving(false)
        }
    }

    function confirmDelete(v) {
        confirmDialog({
            message: `¿Eliminar el vehículo ${v.marca} ${v.modelo} (${v.placa})?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => handleDelete(v.id),
        })
    }

    async function handleDelete(id) {
        try {
            await deleteVehicle(id)
            toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Vehículo eliminado.' })
            load()
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
        }
    }

    const debouncedFilter = useDebounce(filter, 300)

    const filtered = vehicles.filter((v) => {
        const q = debouncedFilter.toLowerCase()
        return !q || v.marca.toLowerCase().includes(q) || v.modelo.toLowerCase().includes(q) || v.placa.toLowerCase().includes(q)
    })

    const actionBody = (v) => (
        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
            <Button icon="pi pi-pencil" rounded text severity="info" size="small" onClick={() => openEdit(v)} tooltip="Editar" aria-label="Editar" />
            <Button icon="pi pi-trash" rounded text severity="danger" size="small" onClick={() => confirmDelete(v)} tooltip="Eliminar" aria-label="Eliminar" />
        </div>
    )

    const dialogFooter = (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--surface-border)', marginTop: '0.5rem' }}>
            <Button label="Cancelar" icon="pi pi-times" text onClick={() => setDialogOpen(false)} />
            <Button label={editId ? 'Guardar' : 'Registrar'} icon="pi pi-check" loading={saving} onClick={handleSave} />
        </div>
    )

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="page-header">
                <h1 className="page-title">
                    <span className="title-icon"><i className="pi pi-car" /></span>
                    Vehículos
                </h1>
                <p className="page-subtitle">Registro y gestión de la flota vehicular</p>
            </div>

            <div className="card">
                <div className="action-bar">
                    <span className="p-input-icon-left" style={{ flex: '1', minWidth: '200px' }}>
                        <i className="pi pi-search" />
                        <InputText
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Buscar vehículo..."
                            style={{ width: '100%', minWidth: '160px' }}
                        />
                    </span>
                    <div className="spacer" />
                    <Button label="Nuevo Vehículo" icon="pi pi-plus" onClick={openCreate} />
                </div>

                <DataTable
                    value={filtered}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    emptyMessage={<EmptyState title="No hay vehículos" description="No se encontraron vehículos registrados. Comienza registrando uno nuevo." icon="pi-car" actionLabel={!filter ? "Nuevo Vehículo" : null} onAction={openCreate} />}
                    dataKey="id"
                    responsiveLayout="scroll"
                >
                    <Column field="id" header="ID" sortable style={{ width: '70px' }} />
                    <Column field="marca" header="Marca" sortable />
                    <Column field="modelo" header="Modelo" sortable />
                    <Column field="placa" header="Placa" sortable />
                    <Column
                        field="created_at"
                        header="Registrado"
                        sortable
                        body={(r) => new Date(r.created_at).toLocaleDateString('es')}
                    />
                    <Column header="Acciones" body={actionBody} style={{ width: '100px', textAlign: 'center' }} />
                </DataTable>
            </div>

            <Dialog
                header={editId ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                visible={dialogOpen}
                onHide={() => setDialogOpen(false)}
                footer={dialogFooter}
                style={{ width: 'min(440px, 90vw)' }}
                modal
                draggable={false}
                breakpoints={{'960px': '90vw'}}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {['marca', 'modelo', 'placa'].map((field) => (
                    <div className="form-group" key={field}>
                        <label className="form-label" htmlFor={`veh-${field}`}>
                            {field.charAt(0).toUpperCase() + field.slice(1)} *
                        </label>
                        <InputText
                            id={`veh-${field}`}
                            value={form[field]}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className={errors[field] ? 'p-invalid' : ''}
                            style={{ width: '100%' }}
                            maxLength={field === 'placa' ? 20 : 100}
                            placeholder={field === 'marca' ? 'Ej. Toyota, Nissan' : field === 'modelo' ? 'Ej. Corolla, Sentra' : 'Ej. ABC-1234'}
                            keyfilter={field === 'marca' ? /^[a-zA-Z\s]*$/ : undefined}
                            tooltip={field === 'marca' ? 'Solo se permiten letras y espacios' : undefined}
                            tooltipOptions={{ position: 'bottom' }}
                        />
                        {errors[field] && <span className="form-error">{errors[field]}</span>}
                    </div>
                ))}
                </div>
            </Dialog>
        </div>
    )
}
