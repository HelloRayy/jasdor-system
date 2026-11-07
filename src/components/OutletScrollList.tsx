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
        <h3 className="text-sm font-bold text-stone-900">
          Pilihan Gerai
        </h3>
        <span className="text-[11px] text-stone-400">Geser untuk pilih</span>
      </div>

      {/* Container horizontal scroll */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {outlets.map((outlet) => {
          const isSelected = outlet.id === currentOutlet.id;
          return (
            <button
              key={outlet.id}
              type="button"
              onClick={() => onSelectOutlet(outlet)}
              className="relative shrink-0 text-left cursor-pointer focus:outline-none"
            >
              {/* Card Container Landscape (Rasio 16:10 Lebar > Tinggi) */}
              <div
                className={`relative w-32 h-20 rounded-2xl overflow-hidden bg-stone-100 flex items-center justify-center border-2 transition-all ${
                  isSelected
                    ? 'border-stone-900 shadow-xs'
                    : 'border-stone-200/80 hover:border-stone-300'
                }`}
              >
                {/* Logo Image atau Placeholder Abu-Abu Netral */}
                {outlet.bannerUrl || outlet.logoUrl ? (
                  <img
                    src={outlet.bannerUrl || outlet.logoUrl}
                    alt={outlet.brand}
                    className="w-full h-full object-cover opacity-75"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center text-stone-400">
                    <IconPhoto size={24} stroke={1.5} />
                  </div>
                )}

                {/* Gradient Shading agar Teks Terbaca Jelas */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Dot Indikator Hijau Saat Terpilih di Kanan Atas */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2fdc8f] ring-2 ring-white block" />
                  </div>
                )}

                {/* Label Brand Overlay di Dalam Kartu (Pill Bersih di Kiri Bawah) */}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[11px] font-bold text-white tracking-tight leading-tight truncate drop-shadow-xs">
                    {outlet.brand}
                  </p>
                  <p className="text-[9px] text-stone-300 font-medium tracking-tight leading-tight truncate mt-0.5 opacity-90">
                    {outlet.name.split('-')[1]?.trim() || 'Cabang'}
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
