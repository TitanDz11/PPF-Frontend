import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import EmptyState from '../../components/EmptyState'
import { getVehicles } from '../../api/vehicles'
import { createEntry, updateEntry, getEntry } from '../../api/entries'

const TIPO_OPTS = [
    { label: 'Entrada', value: 'entrada' },
    { label: 'Salida', value: 'salida' },
]

const EMPTY = {
    vehicle_id: null,
    motorista: '',
    tipo: null,
    fecha: null,
    hora: null,
    kilometraje: '',
}

function validate(f) {
    const e = {}
    if (!f.vehicle_id) e.vehicle_id = 'Seleccione un vehículo.'
    if (!f.motorista?.trim()) e.motorista = 'Campo requerido.'
    if (!f.tipo) e.tipo = 'Seleccione el tipo.'
    if (!f.fecha) e.fecha = 'Seleccione la fecha.'
    if (!f.hora) e.hora = 'Seleccione la hora.'
    if (f.kilometraje === '' || f.kilometraje === null) e.kilometraje = 'Campo requerido.'
    else if (Number(f.kilometraje) < 0) e.kilometraje = 'Debe ser mayor o igual a 0.'
    return e
}

function toTimeStr(dateObj) {
    if (!dateObj) return ''
    const h = String(dateObj.getHours()).padStart(2, '0')
    const m = String(dateObj.getMinutes()).padStart(2, '0')
    return `${h}:${m}:00`
}

function toDateStr(dateObj) {
    if (!dateObj) return ''
    return dateObj.toISOString().split('T')[0]
}

export default function EntryForm() {
    const toast = useRef(null)
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = Boolean(id)

    const [vehicles, setVehicles] = useState([])
    const [form, setForm] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getVehicles().then((r) => {
            setVehicles(r.data.data.map((v) => ({ label: `${v.placa} – ${v.marca} ${v.modelo}`, value: v.id })))
        }).finally(() => {
            if (!isEdit) setLoading(false)
        })

        if (isEdit) {
            setLoading(true)
            getEntry(id).then((r) => {
                const e = r.data.data
                setForm({
                    vehicle_id: e.vehicle_id,
                    motorista: e.motorista,
                    tipo: e.tipo,
                    fecha: new Date(e.fecha + 'T00:00:00'),
                    hora: (() => { const [h, m] = e.hora.split(':'); const d = new Date(); d.setHours(Number(h), Number(m)); return d })(),
                    kilometraje: String(e.kilometraje),
                })
            }).finally(() => setLoading(false))
        }
    }, [id, isEdit])

    function handleChange(field, value) {
        setForm((p) => ({ ...p, [field]: value }))
        if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }))
    }

    async function handleSubmit() {
        const errs = validate(form)
        if (Object.keys(errs).length) { setErrors(errs); return }
        setSaving(true)
        try {
            const payload = {
                vehicle_id: form.vehicle_id,
                motorista: form.motorista.trim(),
                tipo: form.tipo,
                fecha: toDateStr(form.fecha),
                hora: toTimeStr(form.hora),
                kilometraje: Number(form.kilometraje),
            }
            if (isEdit) {
                await updateEntry(id, payload)
                toast.current?.show({ severity: 'success', summary: 'Actualizado', detail: 'Movimiento actualizado.' })
            } else {
                await createEntry(payload)
                toast.current?.show({ severity: 'success', summary: 'Registrado', detail: 'Movimiento registrado correctamente.' })
                setForm(EMPTY)
            }
            setTimeout(() => navigate('/log'), 1000)
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return null

    if (!loading && vehicles.length === 0 && !isEdit) {
        return (
            <div style={{ padding: '2rem 0' }}>
                <EmptyState
                    title="No hay vehículos registrados"
                    description="Para poder registrar una entrada o salida, primero necesitas tener vehículos en la flota."
                    icon="pi-car"
                    actionLabel="Ir a Vehículos"
                    onAction={() => navigate('/vehicles')}
                />
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className="page-header">
                <h1 className="page-title">
                    <span className="title-icon"><i className="pi pi-plus-circle" /></span>
                    {isEdit ? 'Editar Movimiento' : 'Registrar Movimiento'}
                </h1>
                <p className="page-subtitle">Complete todos los campos obligatorios</p>
            </div>

            <div className="card" style={{ maxWidth: 'min(600px, 95vw)' }}>
                {/* Vehicle */}
                <div className="form-group">
                    <label className="form-label" htmlFor="entry-vehicle">Vehículo *</label>
                    <Dropdown
                        inputId="entry-vehicle"
                        value={form.vehicle_id}
                        options={vehicles}
                        onChange={(e) => handleChange('vehicle_id', e.value)}
                        placeholder="Seleccione un vehículo"
                        className={errors.vehicle_id ? 'p-invalid' : ''}
                        style={{ width: '100%' }}
                        filter
                    />
                    {errors.vehicle_id && <span className="form-error">{errors.vehicle_id}</span>}
                </div>

                {/* Motorista */}
                <div className="form-group">
                    <label className="form-label" htmlFor="entry-motorista">Motorista *</label>
                    <InputText
                        id="entry-motorista"
                        value={form.motorista}
                        onChange={(e) => handleChange('motorista', e.target.value)}
                        className={errors.motorista ? 'p-invalid' : ''}
                        style={{ width: '100%' }}
                        maxLength={150}
                        placeholder="Ej. Juan Pérez"
                        keyfilter={/^[a-zA-Z\s'\-]*$/}
                        tooltip="Solo se permiten letras, espacios, guiones y apóstrofes"
                        tooltipOptions={{ position: 'bottom' }}
                    />
                    {errors.motorista && <span className="form-error">{errors.motorista}</span>}
                </div>

                {/* Tipo */}
                <div className="form-group">
                    <label className="form-label" htmlFor="entry-tipo">Tipo *</label>
                    <Dropdown
                        inputId="entry-tipo"
                        value={form.tipo}
                        options={TIPO_OPTS}
                        onChange={(e) => handleChange('tipo', e.value)}
                        placeholder="Entrada o Salida"
                        className={errors.tipo ? 'p-invalid' : ''}
                        style={{ width: '100%' }}
                    />
                    {errors.tipo && <span className="form-error">{errors.tipo}</span>}
                </div>

                {/* Fecha + Hora */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="entry-fecha">Fecha *</label>
                        <Calendar
                            inputId="entry-fecha"
                            value={form.fecha}
                            onChange={(e) => handleChange('fecha', e.value)}
                            dateFormat="yy-mm-dd"
                            showIcon
                            className={errors.fecha ? 'p-invalid' : ''}
                            style={{ width: '100%' }}
                        />
                        {errors.fecha && <span className="form-error">{errors.fecha}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="entry-hora">Hora *</label>
                        <Calendar
                            inputId="entry-hora"
                            value={form.hora}
                            onChange={(e) => handleChange('hora', e.value)}
                            timeOnly
                            showIcon
                            hourFormat="24"
                            className={errors.hora ? 'p-invalid' : ''}
                            style={{ width: '100%' }}
                        />
                        {errors.hora && <span className="form-error">{errors.hora}</span>}
                    </div>
                </div>

                {/* Kilometraje */}
                <div className="form-group">
                    <label className="form-label" htmlFor="entry-km">Kilometraje *</label>
                    <InputText
                        id="entry-km"
                        value={form.kilometraje}
                        onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleChange('kilometraje', e.target.value) }}
                        className={errors.kilometraje ? 'p-invalid' : ''}
                        style={{ width: '100%' }}
                        placeholder="Ej. 15000"
                        keyfilter="int"
                    />
                    {errors.kilometraje && <span className="form-error">{errors.kilometraje}</span>}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)', flexWrap: 'wrap' }}>
                    <Button label="Cancelar" icon="pi pi-times" text onClick={() => navigate('/log')} />
                    <Button label={isEdit ? 'Guardar' : 'Registrar'} icon="pi pi-check" loading={saving} onClick={handleSubmit} />
                </div>
            </div>
        </div>
    )
}
