const Input = ({ label, error, className = '', ...props }) => {
  return (
    <label className={`block text-sm text-white/90 ${className}`}>
      {label && <span className="mb-0.5 block text-[10px] font-semibold text-textSecondary">{label}</span>}
      <input
        className="w-full rounded-lg border border-white/[0.04] bg-white/5 px-2.5 py-1 text-xs text-white outline-none transition focus:border-[#3B5BFF] focus:ring-1 focus:ring-[#3B5BFF]/20"
        {...props}
      />
      {error && <p className="mt-0.5 text-[10px] text-[#FFB3B8]">{error}</p>}
    </label>
  );
};

export default Input;
