import React from 'react';
import type { BrandInfo } from '../data/mockBrands';

interface BrandSelectorProps {
  brands: BrandInfo[];
  currentBrand: BrandInfo;
  onSelectBrand: (brand: BrandInfo) => void;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({
  brands,
  currentBrand,
  onSelectBrand,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-0.5">
        <h3 className="text-sm font-semibold text-ink">
          Pilih Brand Kopi
        </h3>
        <span className="text-xs text-slate">Ganti menu & gerai</span>
      </div>

      {/* Grid 3 Brand Card Bersih (Sesuai Desain Card Gerai Minimalis) */}
      <div className="grid grid-cols-3 gap-2.5">
        {brands.map((b) => {
          const isSelected = b.id === currentBrand.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBrand(b)}
              className={`text-left cursor-pointer transition-all rounded-2xl p-2.5 border flex flex-col justify-between h-24 ${
                isSelected
                  ? 'bg-ink text-gallery-white border-ink shadow-xs'
                  : 'bg-gallery-white text-ink border-hairline hover:bg-studio-mist'
              }`}
            >
              {/* Logo Brand Container */}
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl p-1.5 flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-gallery-white' : 'bg-studio-mist border border-hairline'
                  }`}
                >
                  <img
                    src={b.logoUrl}
                    alt={b.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {isSelected && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pricing-blue text-gallery-white shadow-2xs">
                    Aktif
                  </span>
                )}
              </div>

              {/* Nama Brand */}
              <div>
                <p className={`text-xs font-semibold truncate leading-tight ${isSelected ? 'text-gallery-white' : 'text-ink'}`}>
                  {b.name}
                </p>
                <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-control-gray' : 'text-slate'}`}>
                  {b.menus.length} Menu
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
