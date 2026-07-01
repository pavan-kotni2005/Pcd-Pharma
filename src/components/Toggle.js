import React from 'react';
import { motion } from 'framer-motion';

const Toggle = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-2">
      {(label || description) && (
        <div className="flex flex-col pr-4">
          {label && <span className="text-sm font-semibold text-white">{label}</span>}
          {description && <span className="text-xs text-textSecondary">{description}</span>}
        </div>
      )}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-[#3B5BFF] shadow-[0_0_12px_rgba(59,91,255,0.4)]' : 'bg-white/10'
        }`}
      >
        <span className="sr-only">Toggle setting</span>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default Toggle;
