import React from 'react';
import { X as XIcon, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      aria-labelledby="confirmation-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-fade-in-up">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-secondary" aria-hidden="true" />
                </div>
                <h2 id="confirmation-modal-title" className="text-xl font-bold">{title}</h2>
            </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <p className="text-text-secondary dark:text-gray-400 mb-6">{message}</p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="px-6 py-2 rounded-lg font-semibold text-white bg-secondary hover:bg-secondary-dark transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};