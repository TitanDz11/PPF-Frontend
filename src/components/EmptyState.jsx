import { Button } from 'primereact/button'

export default function EmptyState({ title, description, icon = 'pi-inbox', actionLabel, onAction }) {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                <i className={`pi ${icon}`} />
            </div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-desc">{description}</p>
            {actionLabel && onAction && (
                <Button
                    label={actionLabel}
                    icon="pi pi-plus"
                    onClick={onAction}
                    className="empty-state-btn p-button-outlined"
                />
            )}
        </div>
    )
}
