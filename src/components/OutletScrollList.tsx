import React from 'react';
import { IconPhoto } from '@tabler/icons-react';
import type { Outlet } from '../types/catalog';

interface OutletScrollListProps {
  outlets: Outlet[];
  currentOutlet: Outlet;
  onSelectOutlet: (outlet: Outlet) => void;
}

export const OutletScrollList: React.FC<OutletScrollListProps> = ({
  outlets,
  currentOutlet,
  onSelectOutlet,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-0.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Pilih Brand & Gerai
        </h3>
        <span className="text-[11px] text-stone-400">Geser untuk pilih</span>
      </div>

      {/* Container horizontal scroll */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        {outlets.map((outlet) => {
          const isSelected = outlet.id === currentOutlet.id;
          return (
            <button
              key={outlet.id}
              type="button"
              onClick={() => onSelectOutlet(outlet)}
              className="flex flex-col items-center gap-1.5 shrink-0 text-center group cursor-pointer focus:outline-none"
            >
              {/* Box Image Placeholder: Width lebih panjang dari Height (aspect-4/3 atau w-28 h-20) */}
              <div
                className={`relative w-28 h-20 rounded-2xl overflow-hidden bg-stone-200/80 flex items-center justify-center border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-stone-900 bg-stone-300 shadow-sm'
                    : 'border-transparent hover:border-stone-300'
                }`}
              >
                {/* Fallback Icon Placeholder */}
                <div className="flex items-center justify-center text-stone-400">
                  <IconPhoto size={26} stroke={1.5} />
                </div>

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white block" />
                  </div>
                )}
              </div>

              {/* Label Outlet di Bawah Container */}
              <div className="max-w-[112px]">
                <p
                  className={`text-xs font-semibold truncate leading-tight transition-colors ${
                    isSelected ? 'text-stone-900 font-bold' : 'text-stone-600 group-hover:text-stone-900'
                  }`}
                >
                  {outlet.brand}
                </p>
                <span className="text-[10px] text-stone-400 truncate block mt-0.5">
                  {outlet.name.split('-')[1]?.trim() || 'Cabang'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
