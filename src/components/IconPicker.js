import { useMemo } from 'react';
import { FiHeart, FiCheckCircle, FiCalendar, FiStar, FiShield } from 'react-icons/fi';

const icons = [
  { name: 'Shield', icon: FiShield },
  { name: 'Heart', icon: FiHeart },
  { name: 'Check', icon: FiCheckCircle },
  { name: 'Calendar', icon: FiCalendar },
  { name: 'Star', icon: FiStar }
];

const IconPicker = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {icons.map((item) => {
        const Icon = item.icon;
        const active = value === item.name;
        return (
          <button
            type="button"
            key={item.name}
            onClick={() => onChange(item.name)}
            className={`flex h-14 w-14 items-center justify-center rounded-3xl border px-3 transition ${active ? 'border-[#3B5BFF] bg-[#3B5BFF]/10 text-[#3B5BFF]' : 'border-white/10 bg-white/5 text-textSecondary hover:border-white/20 hover:bg-white/10'}`}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
};

export default IconPicker;
