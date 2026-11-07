import React from 'react';
import { Chip } from '@heroui/react';
import { IconHeart } from '@tabler/icons-react';
import type { MenuItem } from '../types/catalog';
import { formatRupiah } from '../utils/whatsapp';

interface CleanProductCardProps {
  item: MenuItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onSelect: (item: MenuItem) => void;
  onQuickAdd?: (item: MenuItem) => void;
}

export const CleanProductCard: React.FC<CleanProductCardProps> = ({
  item,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group cursor-pointer flex flex-col focus:outline-none"
    >
      {/* Container Gambar Abu-Abu Bersih (Soft Gray Background) */}
      <div className="relative aspect-square w-full rounded-3xl bg-stone-100 flex items-center justify-center p-3 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]">
        {/* Foto Produk */}
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-contain mix-blend-multiply"
          loading="lazy"
        />

        {/* Tombol Heart Outline Tipis di Pojok Kanan Atas */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id);
          }}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-stone-600 hover:text-rose-500 transition-colors"
          aria-label="Favorit"
        >
          <IconHeart
            size={18}
            className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}
            stroke={1.5}
          />
        </button>

        {/* Indikator Slider Dots Kecil di Kanan Bawah */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
        </div>

        {/* Status Habis */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center rounded-3xl">
            <Chip size="sm" variant="primary" color="danger" className="text-[10px]">
              Habis
            </Chip>
          </div>
        )}
      </div>

      {/* Info Minimalis di Bawah Kartu: Nama & Harga Bold */}
      <div className="mt-2 px-0.5 space-y-0.5">
        <h4 className="font-semibold text-stone-900 text-sm leading-tight truncate">
          {item.name}
        </h4>
        <p className="font-bold text-stone-950 text-sm tracking-tight">
          {formatRupiah(item.basePrice)}
        </p>
      </div>
    </div>
  );
};
