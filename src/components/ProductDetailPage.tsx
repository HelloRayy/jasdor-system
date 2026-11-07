import React, { useState } from 'react';
import { Button } from '@heroui/react';
import {
  IconArrowLeft,
  IconHeart,
  IconShare,
  IconStarFilled,
  IconMaximize,
  IconPlus,
  IconMinus,
} from '@tabler/icons-react';
import type { MenuItem } from '../types/catalog';
import type { CartItem, SelectedOption } from '../types/cart';
import { formatRupiah } from '../utils/whatsapp';

interface ProductDetailPageProps {
  item: MenuItem;
  onBack: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  item,
  onBack,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, SelectedOption>>(() => {
    const initial: Record<string, SelectedOption> = {};
    item.optionGroups?.forEach((group) => {
      if (group.required && group.options.length > 0) {
        const first = group.options[0];
        initial[group.id] = {
          groupId: group.id,
          groupName: group.name,
          optionId: first.id,
          optionName: first.name,
          priceDelta: first.priceDelta,
        };
      }
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const optionsDelta = Object.values(selectedOptions).reduce(
    (acc, opt) => acc + opt.priceDelta,
    0
  );
  const unitPrice = item.basePrice + optionsDelta;
  const totalPrice = unitPrice * quantity;

  const handleSelectOption = (
    groupId: string,
    groupName: string,
    optionId: string,
    optionName: string,
    priceDelta: number
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: { groupId, groupName, optionId, optionName, priceDelta },
    }));
  };

  const createCartItem = (): CartItem => {
    const optionsArray = Object.values(selectedOptions);
    const optionsKey = optionsArray
      .map((o) => o.optionId)
      .sort()
      .join('-');
    const cartItemId = `${item.id}-${optionsKey}-${Date.now()}`;

    return {
      id: cartItemId,
      menuItem: item,
      quantity,
      selectedOptions: optionsArray,
      notes: notes.trim() ? notes.trim() : undefined,
      unitPrice,
      totalPrice,
    };
  };

  const handleConfirmAddToCart = () => {
    onAddToCart(createCartItem());
    onBack(); // Otomatis fallback ke Home
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 pb-28 font-sans antialiased">
      {/* Fixed Top Bar tanpa BG Container */}
      <div className="fixed top-0 inset-x-0 z-50 max-w-md mx-auto px-4 py-2.5 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={onBack}
          className="w-11 h-11 flex items-center justify-center text-stone-900 active:opacity-60 transition-opacity pointer-events-auto"
          aria-label="Kembali"
        >
          <IconArrowLeft size={22} stroke={2.25} />
        </button>

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            className="w-11 h-11 flex items-center justify-center text-stone-900 active:opacity-60 transition-opacity"
            aria-label="Favorit"
          >
            <IconHeart
              size={22}
              className={isFavorite ? 'fill-rose-500 text-rose-500' : ''}
              stroke={2}
            />
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center text-stone-900 active:opacity-60 transition-opacity"
            aria-label="Bagikan"
          >
            <IconShare size={20} stroke={2} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-14 flex flex-col justify-between min-h-screen">
        <div>
          {/* Large Hero Product Image Container */}
          <div className="relative aspect-square w-full rounded-3xl bg-stone-100 border border-stone-200/80 flex items-center justify-center p-6 overflow-hidden mb-3">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />

            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-stone-900/60 backdrop-blur-md flex items-center justify-center text-white">
              <IconMaximize size={16} stroke={2} />
            </div>
          </div>

          {/* Indicator Slider Dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <span className="w-5 h-1.5 rounded-full bg-stone-900" />
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          </div>

          {/* Title & Price: WCAG Compliant Font Hierarchy */}
          <div className="space-y-1 mb-2.5">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 leading-snug">
                {item.name}
              </h1>
              <span className="text-2xl font-bold text-stone-900 shrink-0">
                {formatRupiah(unitPrice)}
              </span>
            </div>
          </div>

          {/* Pill Tags: Monokrom Minimalis */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-900 text-white">
              Selection 97%
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 text-stone-700">
              Best product
            </span>
          </div>

          {/* Description: Standard WCAG AA Body Text (14px / text-sm, high contrast) */}
          <p className="text-sm text-stone-700 leading-relaxed mb-3">
            {isExpanded
              ? item.description + ' Dibuat dengan bahan pilihan terbaik langsung dari racikan barista andalan.'
              : item.description}
            {' '}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="font-bold text-stone-900 underline inline-block ml-1"
            >
              {isExpanded ? 'Tutup' : 'Read more'}
            </button>
          </p>

          {/* Ratings: Clear Contrast */}
          <div className="flex items-center gap-1.5 mb-6">
            <span className="font-bold text-sm text-stone-900">4.9</span>
            <span className="text-xs text-stone-500 font-medium">(332)</span>
            <div className="flex items-center gap-0.5 text-amber-500 ml-1">
              <IconStarFilled size={14} />
              <IconStarFilled size={14} />
              <IconStarFilled size={14} />
              <IconStarFilled size={14} />
              <IconStarFilled size={14} />
            </div>
          </div>

          {/* OPSI VARIAN: List Vertikal Bersih dengan Radio Minimalis (GrabFood/GoFood Style) */}
          {item.optionGroups && item.optionGroups.length > 0 && (
            <div className="space-y-5 mb-6 pt-4 border-t border-stone-100">
              {item.optionGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      {group.name}
                    </span>
                    {group.required ? (
                      <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                        Wajib (Pilih 1)
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400">Opsional</span>
                    )}
                  </div>

                  {/* List Vertikal Pilihan Opsi */}
                  <div className="bg-stone-50/70 rounded-2xl border border-stone-200/70 overflow-hidden divide-y divide-stone-100/90">
                    {group.options.map((opt) => {
                      const isSelected = selectedOptions[group.id]?.optionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            handleSelectOption(
                              group.id,
                              group.name,
                              opt.id,
                              opt.name,
                              opt.priceDelta
                            )
                          }
                          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                            isSelected
                              ? 'bg-white font-medium shadow-2xs'
                              : 'hover:bg-white/50 text-stone-700'
                          }`}
                        >
                          <div className="flex flex-col pr-2">
                            <span className={`text-xs sm:text-sm ${isSelected ? 'font-bold text-stone-900' : 'text-stone-700'}`}>
                              {opt.name}
                            </span>
                            {opt.priceDelta > 0 && (
                              <span className="text-[11px] font-semibold text-stone-500 mt-0.5">
                                +{formatRupiah(opt.priceDelta)}
                              </span>
                            )}
                          </div>

                          {/* Minimalist Radio Indicator */}
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? 'border-2 border-stone-900 bg-stone-900'
                                : 'border-2 border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Catatan untuk Barista */}
              <div className="space-y-1.5 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between px-0.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                    Catatan untuk Barista
                  </label>
                  <span className="text-xs text-stone-500">Opsional</span>
                </div>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kurangi es, tanpa sedotan..."
                  className="w-full px-4 py-3 text-sm bg-stone-50/70 rounded-2xl border border-stone-200/70 focus:outline-none focus:bg-white focus:border-stone-900/30 transition-colors placeholder:text-stone-400 text-stone-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* Floating Bottom Action: Stepper + Tombol Tambah ke Keranjang Langsung */}
        <div className="fixed bottom-3 inset-x-4 max-w-md mx-auto z-40">
          <div className="bg-white/95 backdrop-blur-md rounded-[24px] p-2 border border-stone-200/80 shadow-lg flex items-center gap-2">
            {/* Quantity Stepper Ringkas */}
            <div className="flex items-center bg-stone-100 rounded-2xl p-1 shrink-0">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-800 disabled:opacity-30"
                aria-label="Kurangi"
              >
                <IconMinus size={16} stroke={2} />
              </button>
              <span className="w-7 text-center text-sm font-bold text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-800"
                aria-label="Tambah"
              >
                <IconPlus size={16} stroke={2} />
              </button>
            </div>

            {/* Tombol Utama: Masukkan ke Keranjang -> Fallback ke Home */}
            <Button
              variant="primary"
              className="flex-1 h-12 rounded-2xl bg-stone-900 text-white font-semibold text-sm flex items-center justify-between px-5 shadow-xs"
              onPress={handleConfirmAddToCart}
            >
              <span>Tambah ke Keranjang</span>
              <span className="font-bold">{formatRupiah(totalPrice)}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
