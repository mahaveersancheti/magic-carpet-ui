import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NeomorphicCard from './NeomorphicCard';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface NeomorphicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

const NeomorphicTable = <T extends { id: string | number }>({ 
  data, 
  columns, 
  loading, 
  onRowClick,
  actions 
}: NeomorphicTableProps<T>) => {
  return (
    <div className="flex flex-col gap-6">
      <NeomorphicCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-color-bg/50">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-6 py-5 text-[10px] font-sora font-black uppercase tracking-[2px] text-[#777] border-b border-[#777]/5 ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
                {actions && <th className="px-6 py-5 text-[10px] font-sora font-black uppercase tracking-[2px] text-[#777] border-b border-[#777]/5 w-20">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid rgba(193,39,45,0.15)', borderTopColor: '#C1272D' }} />
                      <span className="text-xs font-sora font-bold text-[#777] uppercase tracking-[2px]">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                    <span className="text-xs font-sora font-bold text-[#777] uppercase tracking-[2px]">No records found</span>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => onRowClick?.(item)}
                    className={`
                      neo-transition group
                      ${onRowClick ? 'cursor-pointer hover:bg-[rgba(193,39,45,0.04)]' : ''}
                    `}
                  >
                    {columns.map((col, i) => (
                      <td key={i} className={`px-6 py-5 text-sm font-dm text-[#1A1A1A] ${col.className || ''}`}>
                        {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                        {actions(item)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </NeomorphicCard>

      {/* Pagination Container */}
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-sora font-black text-[#777] uppercase tracking-[2px]">
          Showing <span className="text-[#1A1A1A]">{data.length}</span> of <span className="text-[#1A1A1A]">{data.length}</span> results
        </span>

        <div className="flex gap-3">
          <button className="w-10 h-10 neo-inset rounded-xl flex items-center justify-center text-[#777] hover:text-[#C1272D] neo-transition border-none outline-none cursor-pointer disabled:opacity-40">
            <ChevronLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-sora font-black text-xs text-white"
            style={{ background: 'linear-gradient(135deg, #C1272D, #F7941D)', boxShadow: '2px 2px 8px rgba(193,39,45,0.35)' }}
          >
            1
          </div>
          <button className="w-10 h-10 neo-outset rounded-xl flex items-center justify-center text-[#777] hover:text-[#C1272D] neo-transition border-none outline-none cursor-pointer">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeomorphicTable;
