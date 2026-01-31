import React from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "info";
  isLoading?: boolean;
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a2130] rounded-2xl shadow-2xl p-6 transform transition-all scale-100 opacity-100">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`mb-4 p-3 rounded-full ${variant === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
            <span className="material-symbols-outlined text-3xl">
              {variant === 'danger' ? 'warning' : 'info'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-[#606e8a] dark:text-[#a0aec0] mb-6 leading-relaxed">
            {description}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#e2e8f0] dark:border-[#2d3748] text-[#111318] dark:text-white font-medium hover:bg-[#f5f6f8] dark:hover:bg-[#101622] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                variant === 'danger' 
                  ? 'bg-red-600 shadow-red-600/20' 
                  : 'bg-[#0d59f2] shadow-[#0d59f2]/20'
              }`}
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
