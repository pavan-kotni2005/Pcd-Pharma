const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 shadow-soft">
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-textSecondary"
    />
  </div>
);

export default SearchBar;
