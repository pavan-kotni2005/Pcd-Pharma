import React from 'react';

const AvatarGroup = ({ users = [], max = 3, size = 'sm', extraClass = '' }) => {
  const visibleUsers = users.slice(0, max);
  const extraCount = users.length > max ? users.length - max : 0;

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const currentSize = sizeClasses[size] || sizeClasses.sm;

  // Render dummy avatar images or placeholders
  const images = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format'
  ];

  return (
    <div className={`flex items-center gap-2 ${extraClass}`}>
      <div className="flex -space-x-2.5 overflow-hidden py-1">
        {visibleUsers.map((user, idx) => {
          const initials = user
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'U';

          return (
            <div
              key={idx}
              className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-surface bg-[#0f172a] text-white font-bold select-none ${currentSize}`}
              title={user}
            >
              <img
                src={images[idx % images.length]}
                alt={initials}
                className="h-full w-full rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'; // Fallback to initials if unsplash images don't load offline
                }}
              />
              <span className="absolute">{initials}</span>
            </div>
          );
        })}
      </div>
      {extraCount > 0 && (
        <span className="text-xs font-semibold text-textSecondary select-none">
          +{extraCount}
        </span>
      )}
    </div>
  );
};

export default AvatarGroup;
