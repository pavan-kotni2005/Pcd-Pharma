import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import React from 'react';

const Drawer = ({ open, title, children, footer, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050B1A]/60 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative z-10 flex h-full w-full flex-col border-l border-white/10 bg-sidebar shadow-soft sm:max-w-md md:max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-textSecondary transition hover:bg-white/10 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-white/8 bg-surface/50 px-6 py-5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;

