import React from 'react';
import { IconPlus } from '@tabler/icons-react';
import type { MenuItem } from '../types/catalog';
import { formatRupiah } from '../utils/whatsapp';

interface ProductCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group cursor-pointer bg-white rounded-2xl border border-stone-200/80 p-3 sm:p-3.5 flex flex-col justify-between hover:border-amber-700/50 hover:shadow-xs transition-all"
    >
      <div>
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-100 mb-3">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center">
              <span className="text-white text-xs font-semibold px-2 py-1 rounded-md bg-stone-800">
                Habis
              </span>
            </div>
          )}
        </div>

        <h4 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
          {item.name}
        </h4>
        <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100">
        <div>
          <span className="text-xs text-stone-400 block font-normal">Mulai dari</span>
          <span className="font-bold text-stone-900 text-sm">
            {formatRupiah(item.basePrice)}
          </span>
        </div>

        <button
          type="button"
          disabled={!item.isAvailable}
          className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label={`Tambah ${item.name}`}
        >
          <IconPlus size={16} stroke={2} />
        </button>
      </div>
    </div>
  );
};
