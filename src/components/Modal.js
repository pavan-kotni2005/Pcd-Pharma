import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { FiAlertTriangle } from 'react-icons/fi';

const Modal = ({ open, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onClose, variant = 'danger' }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050B1A]/80 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-sidebar p-6 shadow-soft"
          >
            <div className="flex gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                variant === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-[#3B5BFF]/10 text-[#3B5BFF]'
              }`}>
                <FiAlertTriangle size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-textSecondary leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onClose}>
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
