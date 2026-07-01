import React from 'react';

const Loader = ({ type = 'spinner', count = 3, className = '' }) => {
  if (type === 'skeleton-table') {
    return (
      <div className={`space-y-4 animate-pulse ${className}`}>
        <div className="h-10 bg-white/5 rounded-2xl w-full" />
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-12 bg-white/5 rounded-2xl flex-1" />
            <div className="h-12 bg-white/5 rounded-2xl flex-1" />
            <div className="h-12 bg-white/5 rounded-2xl flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'skeleton-card') {
    return (
      <div className={`rounded-3xl border border-white/10 bg-surface p-6 shadow-soft animate-pulse space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-white/5 rounded w-1/3" />
          <div className="h-12 w-12 bg-white/5 rounded-3xl" />
        </div>
        <div className="h-8 bg-white/5 rounded w-1/2" />
        <div className="h-4 bg-white/5 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#3B5BFF] animate-spin" />
      </div>
    </div>
  );
};

export default Loader;
