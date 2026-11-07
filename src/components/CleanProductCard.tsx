import React from 'react';
import { Card, Button, Chip } from '@heroui/react';
import { IconHeart, IconPlus } from '@tabler/icons-react';
import type { MenuItem } from '../types/catalog';
import { formatRupiah } from '../utils/whatsapp';

interface CleanProductCardProps {
  item: MenuItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onSelect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const CleanProductCard: React.FC<CleanProductCardProps> = ({
  item,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
  onQuickAdd,
}) => {
  return (
    <Card
      variant="secondary"
      className="p-3 rounded-3xl border-0 shadow-none bg-stone-100/80 hover:bg-stone-100 transition-all cursor-pointer flex flex-col justify-between group"
      onClick={() => onSelect(item)}
    >
      <div>
        {/* Gambar Produk dengan Tombol Favorit */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white/70 mb-3 flex items-center justify-center p-2">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Tombol Love / Favorit di Pojok Kanan Atas */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(item.id);
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-rose-500 shadow-xs transition-colors"
            aria-label="Simpan ke favorit"
          >
            <IconHeart
              size={16}
              className={isFavorite ? 'fill-rose-500 text-rose-500' : ''}
              stroke={1.75}
            />
          </button>

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center">
              <Chip size="sm" variant="primary" color="danger" className="text-[10px]">
                Habis
              </Chip>
            </div>
          )}
        </div>

        {/* Info Nama & Kategori */}
        <h4 className="font-semibold text-stone-900 text-sm leading-tight line-clamp-1">
          {item.name}
        </h4>
        <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
          {item.description}
        </p>
      </div>

      {/* Harga & Tombol Tambah Cepat */}
      <div className="flex items-center justify-between mt-3 pt-1">
        <span className="font-bold text-stone-900 text-sm">
          {formatRupiah(item.basePrice)}
        </span>

        <Button
          isIconOnly
          size="sm"
          variant="primary"
          isDisabled={!item.isAvailable}
          className="w-8 h-8 rounded-full shadow-xs bg-stone-900 text-white hover:bg-stone-800"
          onPress={() => onQuickAdd(item)}
          aria-label={`Tambah ${item.name}`}
        >
          <IconPlus size={16} stroke={2} />
        </Button>
      </div>
    </Card>
  );
};
