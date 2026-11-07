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

      {/* Grid 3 Brand Card Full-Fill Image */}
      <div className="grid grid-cols-3 gap-2.5">
        {brands.map((b) => {
          const isSelected = b.id === currentBrand.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBrand(b)}
              className={`relative text-left cursor-pointer transition-all rounded-2xl overflow-hidden border h-24 p-2.5 flex flex-col justify-between bg-white ${
                isSelected
                  ? 'border-ink ring-2 ring-ink shadow-xs'
                  : 'border-hairline hover:border-slate'
              }`}
            >
              {/* Full-Fill Image Container tanpa background abu/kotak */}
              <div className="w-full flex-1 flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={b.logoUrl}
                  alt={b.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Status Badge & Nama Brand */}
              <div className="flex items-center justify-between w-full pt-1 border-t border-hairline/60">
                <p className="text-[11px] font-semibold truncate text-ink">
                  {b.name}
                </p>
                {isSelected && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-pricing-blue text-gallery-white shrink-0">
                    Aktif
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
