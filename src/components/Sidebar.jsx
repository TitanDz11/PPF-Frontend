import { NavLink } from 'react-router-dom'

const navItems = [
    { to: '/', label: 'Dashboard', icon: 'pi pi-th-large', end: true },
    { to: '/vehicles', label: 'Vehículos', icon: 'pi pi-car' },
    { to: '/entries/new', label: 'Registrar Movimiento', icon: 'pi pi-plus-circle' },
    { to: '/log', label: 'Historial', icon: 'pi pi-list' },
]

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <i className="pi pi-car" />
                </div>
                <div className="brand-text">
                    <span className="brand-name">FleetControl</span>
                    <span className="brand-sub">Gestión de Flota</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <span className="nav-section-label">Menú</span>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                        title={item.label}
                    >
                        <i className={`nav-icon ${item.icon}`} />
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}
