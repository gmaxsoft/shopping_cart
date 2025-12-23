type ToastProps = {
  message: string | null
  onClose: () => void
}

function Toast({ message, onClose }: ToastProps) {
  if (!message) return null

  return (
    <div className="fixed bottom-6 right-6 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          className="ml-2 text-xs text-slate-300 hover:text-white"
          onClick={onClose}
          aria-label="Zamknij powiadomienie"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast


