import Toggle from './Toggle';

const StatusToggle = ({ checked, onChange, label = 'Status' }) => {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm font-medium text-white">{label}</span>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.14em] font-semibold text-textSecondary">
          {checked ? 'Live' : 'Off'}
        </span>
        <Toggle checked={checked} onChange={onChange} />
      </div>
    </div>
  );
};

export default StatusToggle;

