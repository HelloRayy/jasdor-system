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
  IconCup,
  IconFlame,
  IconSnowflake,
  IconCheck,
} from '@tabler/icons-react';
import type { MenuItem } from '../types/catalog';
import type { CartItem, SelectedOption } from '../types/cart';
import { formatRupiah } from '../utils/whatsapp';

interface ProductDetailPageProps {
  item: MenuItem;
  onBack: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  onBuyNow: (cartItem: CartItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  item,
  onBack,
  onAddToCart,
  onBuyNow,
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

  // Helper untuk Icon Visual Tiap Kategori Varian
  const getGroupIcon = (groupId: string) => {
    if (groupId.includes('size')) return <IconCup size={16} className="text-[#2fdc8f]" />;
    if (groupId.includes('sugar') || groupId.includes('sweet')) return <IconFlame size={16} className="text-amber-400" />;
    if (groupId.includes('ice') || groupId.includes('temp')) return <IconSnowflake size={16} className="text-sky-400" />;
    return <IconCup size={16} className="text-[#2fdc8f]" />;
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 pb-28 font-sans antialiased">
      <div className="max-w-md mx-auto px-4 pt-3 flex flex-col justify-between min-h-screen">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between py-2 mb-2">
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center text-stone-800 bg-stone-100"
              aria-label="Kembali"
            >
              <IconArrowLeft size={20} stroke={2} />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(item.id)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-stone-800 bg-stone-100"
                aria-label="Favorit"
              >
                <IconHeart
                  size={20}
                  className={isFavorite ? 'fill-rose-500 text-rose-500' : ''}
                  stroke={1.75}
                />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full flex items-center justify-center text-stone-800 bg-stone-100"
                aria-label="Bagikan"
              >
                <IconShare size={18} stroke={1.75} />
              </button>
            </div>
          </div>

          {/* Large Hero Product Image Container */}
          <div className="relative aspect-square w-full rounded-3xl bg-stone-100 border border-stone-200/80 flex items-center justify-center p-6 overflow-hidden mb-3">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />

            <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-stone-900/60 backdrop-blur-md flex items-center justify-center text-white">
              <IconMaximize size={15} stroke={2} />
            </div>
          </div>

          {/* Indicator Slider Dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <span className="w-5 h-1 rounded-full bg-stone-900" />
            <span className="w-1.5 h-1 rounded-full bg-stone-300" />
            <span className="w-1.5 h-1 rounded-full bg-stone-300" />
          </div>

          {/* Title & Price */}
          <div className="space-y-1 mb-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                {item.name}
              </h1>
              <span className="text-xl font-extrabold text-[#0a2e1f]">
                {formatRupiah(unitPrice)}
              </span>
            </div>
          </div>

          {/* Pill Tags */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0a2e1f] text-[#2fdc8f]">
              Selection 97%
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 text-stone-700">
              Best product
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-stone-600 leading-relaxed mb-3">
            {isExpanded
              ? item.description + ' Dibuat dengan bahan pilihan terbaik langsung dari racikan barista andalan.'
              : item.description}
            {' '}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="font-bold text-stone-900 underline inline-block"
            >
              {isExpanded ? 'Tutup' : 'Read more'}
            </button>
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mb-6">
            <span className="font-bold text-xs text-stone-900">4.9</span>
            <span className="text-[11px] text-stone-400">(332)</span>
            <div className="flex items-center gap-0.5 text-amber-400 ml-1">
              <IconStarFilled size={13} />
              <IconStarFilled size={13} />
              <IconStarFilled size={13} />
              <IconStarFilled size={13} />
              <IconStarFilled size={13} />
            </div>
          </div>

          {/* OPSI VARIAN VISUAL OPEN-LAYOUT (Tanpa Container Box Kaku) */}
          {item.optionGroups && item.optionGroups.length > 0 && (
            <div className="space-y-5 mb-6 pt-4 border-t border-stone-100">
              {item.optionGroups.map((group) => (
                <div key={group.id} className="space-y-2.5">
                  {/* Header Grup dengan Icon Visual */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {getGroupIcon(group.id)}
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                        {group.name}
                      </span>
                    </div>
                    {group.required ? (
                      <span className="text-[10px] font-semibold text-[#0a2e1f] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Wajib
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400">Opsional</span>
                    )}
                  </div>

                  {/* Horizontal Visual Pills (Open Flow) */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
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
                          className={`px-4 py-2.5 rounded-2xl text-xs font-medium shrink-0 flex items-center gap-2 border transition-all ${
                            isSelected
                              ? 'bg-[#0a2e1f] text-[#2fdc8f] border-[#0a2e1f] font-bold shadow-xs'
                              : 'bg-stone-100 text-stone-700 border-transparent hover:border-stone-300'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {opt.priceDelta > 0 && (
                            <span className={`text-[11px] ${isSelected ? 'text-[#2fdc8f]/80' : 'text-stone-400'}`}>
                              +{formatRupiah(opt.priceDelta)}
                            </span>
                          )}
                          {isSelected && <IconCheck size={14} stroke={2.5} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Catatan untuk Barista Open Input */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                  Catatan untuk Barista
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kurangi es, tanpa sedotan..."
                  className="w-full px-4 py-3 text-xs bg-stone-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-stone-900/10 placeholder:text-stone-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Fixed Action Bar */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/60 p-4 pb-safe">
          <div className="max-w-md mx-auto flex items-center gap-2.5">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-stone-100 rounded-2xl p-1 shrink-0">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 disabled:opacity-30"
                aria-label="Kurangi"
              >
                <IconMinus size={15} stroke={2} />
              </button>
              <span className="w-7 text-center text-xs font-bold text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700"
                aria-label="Tambah"
              >
                <IconPlus size={15} stroke={2} />
              </button>
            </div>

            {/* Buy Now Button */}
            <Button
              variant="primary"
              className="flex-1 h-12 rounded-[20px] bg-stone-900 text-white font-semibold text-xs sm:text-sm shadow-xs"
              onPress={() => onBuyNow(createCartItem())}
            >
              Buy now
            </Button>

            {/* Add to Cart Button */}
            <Button
              variant="primary"
              className="flex-1 h-12 rounded-[20px] bg-[#0a2e1f] text-[#2fdc8f] border border-[#144732] font-semibold text-xs sm:text-sm shadow-xs"
              onPress={() => {
                onAddToCart(createCartItem());
                onBack();
              }}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
