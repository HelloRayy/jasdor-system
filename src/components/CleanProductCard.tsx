import React from 'react';
import { Chip } from '@heroui/react';
import { IconHeart, IconPlus } from '@tabler/icons-react';
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
  onQuickAdd,
}) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group cursor-pointer flex flex-col focus:outline-none"
    >
      {/* Container Gambar: Gallery White (#ffffff) dengan Hairline Silver (#d6d6d6) */}
      <div className="relative aspect-square w-full rounded-3xl bg-gallery-white border border-hairline flex items-center justify-center p-2.5 overflow-hidden">
        {/* Foto Produk dengan Default Placeholder Cup Kopi Kenangan */}
        <img
          src={item.imageUrl || '/images/kopi-kenangan-cup.png'}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.src = '/images/kopi-kenangan-cup.png';
          }}
          className="w-full h-full object-contain"
          loading="lazy"
        />

        {/* Tombol Heart Outline Tipis di Pojok Kanan Atas */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id);
          }}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-steel hover:text-ink transition-colors"
          aria-label={isFavorite ? `Hapus ${item.name} dari favorit` : `Tambah ${item.name} ke favorit`}
        >
          <IconHeart
            size={18}
            className={isFavorite ? 'fill-pricing-blue text-pricing-blue' : 'text-steel'}
            stroke={1.75}
          />
        </button>

        {/* Indikator Slider Dots Kecil di Kanan Bawah */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-ink" />
          <span className="w-1.5 h-1.5 rounded-full bg-control-gray" />
          <span className="w-1.5 h-1.5 rounded-full bg-control-gray" />
        </div>

        {/* Tombol Quick Add di Pojok Kiri Bawah: Pricing Blue (#0071e3) */}
        {item.isAvailable && onQuickAdd && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(item);
            }}
            className="absolute bottom-2.5 left-2.5 w-7 h-7 rounded-full bg-pricing-blue text-gallery-white flex items-center justify-center shadow-xs"
            aria-label={`Tambah cepat ${item.name}`}
          >
            <IconPlus size={15} stroke={2.5} />
          </button>
        )}

        {/* Status Habis */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-xs flex items-center justify-center rounded-3xl">
            <Chip size="sm" variant="primary" className="bg-launch-orange text-gallery-white text-[10px] font-bold">
              Habis
            </Chip>
          </div>
        )}
      </div>

      {/* Info Minimalis di Bawah Kartu: Nama (Ink) & Harga (Ink) */}
      <div className="mt-2 px-0.5 space-y-0.5">
        <h4 className="font-semibold text-ink text-sm leading-tight truncate">
          {item.name}
        </h4>
        <p className="font-semibold text-ink text-sm tracking-tight">
          {formatRupiah(item.basePrice)}
        </p>
      </div>
    </div>
  );
};
