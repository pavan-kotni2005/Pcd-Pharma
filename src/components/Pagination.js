const Pagination = ({ page, setPage, totalPages }) => {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-textSecondary sm:flex-row sm:items-center sm:justify-between">
      <div>Page {page} of {totalPages}</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={prevDisabled}
          onClick={() => setPage((value) => Math.max(1, value - 1))}
          className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
