import React from 'react';
import { IconBuildingStore, IconMapPin } from '@tabler/icons-react';
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
        <h3 className="text-sm font-bold text-stone-900">
          Pilihan Gerai
        </h3>
        <span className="text-xs text-stone-400">Geser untuk pilih cabang</span>
      </div>

      {/* Container horizontal scroll: Clean Minimalist Branch Cards */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {outlets.map((outlet) => {
          const isSelected = outlet.id === currentOutlet.id;
          const branchShortName = outlet.name.replace('Kopi Kenangan - ', '').replace('Kopi Kenangan ', '');

          return (
            <button
              key={outlet.id}
              type="button"
              onClick={() => onSelectOutlet(outlet)}
              className={`shrink-0 text-left cursor-pointer transition-all rounded-2xl p-3 border w-44 flex flex-col justify-between ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-800 border-stone-200/80 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/15 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <IconBuildingStore size={15} stroke={2} />
                </div>

                {isSelected ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2fdc8f] text-[#0a2e1f]">
                    Aktif
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400 font-medium">
                    {outlet.location.city || 'Semarang'}
                  </span>
                )}
              </div>

              <div>
                <p className={`text-xs font-bold truncate leading-tight ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                  {branchShortName}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <IconMapPin size={12} className={isSelected ? 'text-stone-400' : 'text-stone-400'} />
                  <p className={`text-[11px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {outlet.address}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
