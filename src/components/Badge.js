import React from 'react';

const Badge = ({ status }) => {
  const normalized = status?.toLowerCase() || '';

  const styles = {
    active: 'bg-emerald-500/10 text-emerald-400 border border-[#10B981]/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    success: 'bg-emerald-500/10 text-emerald-400 border border-[#10B981]/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    pending: 'bg-amber-500/10 text-amber-400 border border-[#F59E0B]/25 shadow-[0_0_12px_rgba(245,158,11,0.12)]',
    offline: 'bg-slate-500/10 text-slate-400 border border-white/10',
    inactive: 'bg-slate-500/10 text-slate-400 border border-white/10',
    failed: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.12)]'
  };

  const currentStyle = styles[normalized] || 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${currentStyle}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        normalized === 'active' || normalized === 'success' ? 'bg-emerald-400 animate-pulse' :
        normalized === 'pending' ? 'bg-amber-400 animate-pulse' :
        normalized === 'failed' ? 'bg-rose-400' : 'bg-slate-400'
      }`} />
      {status}
    </span>
  );
};

export default Badge;
