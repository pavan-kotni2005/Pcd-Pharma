import { motion } from 'framer-motion';
import React from 'react';

const Table = ({ columns, data, actions, dense }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden animate-fade-in"
    >
      <div className="overflow-x-auto scrollbar-thin">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm table-auto">
          <thead className="bg-white/[0.03] text-textSecondary border-b border-white/[0.04]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className={`border-b border-white/[0.04] px-6 py-4 font-semibold uppercase tracking-[0.14em] text-[11px] text-textSecondary ${column.width || ''}`}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="border-b border-white/[0.04] px-6 py-4 font-semibold uppercase tracking-[0.14em] text-[11px] text-textSecondary text-right w-2/12">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-16 text-center text-sm text-textSecondary">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-base font-medium">No results found</p>
                    <p className="text-xs text-textSecondary">Try adjusting your search filters.</p>
                  </div>
                </td>
              </tr>
            )}
            {data.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-white/[0.01]">
                {columns.map((column) => (
                  <td
                    key={column.accessor}
                    className={`px-6 ${dense ? 'py-3' : 'py-[22px]'} align-middle text-[13px] text-white/90 ${column.width || ''}`}
                  >
                    {column.cell ? column.cell(row) : row[column.accessor]}
                  </td>
                ))}
                {actions && (
                  <td className={`px-6 ${dense ? 'py-3' : 'py-[22px]'} align-middle text-right w-2/12`}>
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Table;


