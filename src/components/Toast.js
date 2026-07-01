import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import React from 'react';

const Toast = () => {
  const { toast, setToast } = useAppContext();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-[360px] overflow-hidden rounded-2xl border border-white/8 bg-sidebar p-4.5 shadow-soft"
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 shrink-0 text-lg ${
              toast.type === 'failed' ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {toast.type === 'failed' ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{toast.title}</p>
              <p className="mt-1 text-xs text-textSecondary leading-relaxed">{toast.message}</p>
            </div>

            <button
              type="button"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/5 text-textSecondary transition hover:bg-white/10 hover:text-white"
              onClick={() => setToast(null)}
            >
              <FiX size={12} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
