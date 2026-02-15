interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal--confirm is-open">
      <div className="modal__backdrop is-open" onClick={onClose} aria-hidden="true" />

      <div
        className="modal__panel modal__panel--confirm is-open"
        role="dialog"
        aria-modal="true"
      >
        <h3 className="modal__title">{title}</h3>
        <p className="modal__message">{message}</p>

        <div className="modal__actions modal__actions--right">
          <button type="button" onClick={onClose} className="btn btn--subtle">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn btn--danger">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
