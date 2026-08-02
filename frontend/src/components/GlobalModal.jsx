import { useEffect } from "react";
import { createPortal } from "react-dom";

const typeStyles = {
  success: {
    icon: "bi-check-circle-fill",
    color: "var(--color-primary)",
    background: "rgba(28, 107, 65, 0.08)",
  },
  error: {
    icon: "bi-x-circle-fill",
    color: "var(--color-danger)",
    background: "rgba(224, 64, 90, 0.1)",
  },
  warning: {
    icon: "bi-exclamation-triangle-fill",
    color: "var(--color-warning)",
    background: "rgba(232, 121, 46, 0.1)",
  },
  info: {
    icon: "bi-info-circle-fill",
    color: "var(--color-info)",
    background: "rgba(47, 111, 237, 0.1)",
  },
};

export default function GlobalModal({ modal, onClose }) {
  if (!modal) return null;

  const { type = "info", title, message, confirmText = "OK", onConfirm, autoClose = false, autoCloseDelay = 1000 } = modal;
  const showConfirmButton = confirmText !== false;
  const style = typeStyles[type] || typeStyles.info;

  useEffect(() => {
    if (!autoClose) return undefined;

    const timer = window.setTimeout(() => {
      onClose();
    }, autoCloseDelay);

    return () => window.clearTimeout(timer);
  }, [autoClose, autoCloseDelay, onClose]);

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return createPortal(
    <div className="global-modal-backdrop" onClick={onClose}>
      <div className="global-modal-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="global-modal-icon" style={{ color: style.color, background: style.background }}>
          <i className={`bi ${style.icon}`} />
        </div>
        {title && <h5 className="fw-semibold mb-2">{title}</h5>}
        {message && <p className="global-modal-message mb-0">{message}</p>}
        {showConfirmButton && (
          <button type="button" className="btn btn-brand rounded-3 px-3 mt-3" onClick={handleConfirm}>
            {confirmText}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
