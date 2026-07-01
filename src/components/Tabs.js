const Tabs = ({ items, active, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 rounded-3xl border border-white/[0.04] bg-white/5 p-2 w-fit">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-3xl px-4 py-2 text-sm font-medium transition ${active === item ? 'bg-[#3B5BFF] text-white shadow-glow' : 'text-textSecondary hover:bg-white/5'}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
