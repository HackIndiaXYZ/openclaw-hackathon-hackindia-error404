'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  total: number;
  limit: number;
  currentOffset: number;
  onOffsetChange: (newOffset: number) => void;
}

export function OffsetPagination({
  total,
  limit,
  currentOffset,
  onOffsetChange,
}: Props) {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(currentOffset / limit);

  if (totalPages <= 1) return null;

  // Generate page numbers to show (max 5)
  const getPageNumbers = () => {
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, start + 4);
    
    if (end === totalPages - 1) {
      start = Math.max(0, end - 4);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onOffsetChange(Math.max(0, currentOffset - limit))}
        disabled={currentOffset === 0}
        className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onOffsetChange(page * limit)}
            className={`w-10 h-10 rounded-lg text-xs font-black uppercase italic transition-all border ${
              currentPage === page
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onOffsetChange(currentOffset + limit)}
        disabled={currentOffset + limit >= total}
        className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
