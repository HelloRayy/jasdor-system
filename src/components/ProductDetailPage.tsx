import React, { useState } from 'react';
import { Button, TextArea, Chip, Label } from '@heroui/react';
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
  // Default varian kosong (zero) agar tidak ada opsi yang terpilih otomatis
  const [selectedOptions, setSelectedOptions] = useState<Record<string, SelectedOption>>({});

  // Default kuantitas 0 (zero) untuk mencegah miss-click
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const optionsDelta = Object.values(selectedOptions).reduce(
    (acc, opt) => acc + opt.priceDelta,
    0
  );
  const unitPrice = item.basePrice + optionsDelta;
  const totalPrice = unitPrice * quantity;

  // Cek apakah semua grup opsi wajib sudah dipilih
  const requiredGroups = item.optionGroups?.filter((g) => g.required) || [];
  const missingRequired = requiredGroups.some((g) => !selectedOptions[g.id]);
  const canAddToCart = quantity > 0 && !missingRequired;

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
    onBack();
  };

  return (
    <div className="min-h-screen bg-gallery-white text-ink pb-40 font-sans antialiased">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 inset-x-0 z-50 max-w-md mx-auto px-4 py-2.5 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={onBack}
          className="w-11 h-11 flex items-center justify-center text-ink active:opacity-60 transition-opacity pointer-events-auto"
          aria-label="Kembali"
        >
          <IconArrowLeft size={22} stroke={2.25} />
        </button>

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            className="w-11 h-11 flex items-center justify-center text-ink active:opacity-60 transition-opacity"
            aria-label="Favorit"
          >
            <IconHeart
              size={22}
              className={isFavorite ? 'fill-pricing-blue text-pricing-blue' : 'text-ink'}
              stroke={2}
            />
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center text-ink active:opacity-60 transition-opacity"
            aria-label="Bagikan"
          >
            <IconShare size={20} stroke={2} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-14 flex flex-col justify-between min-h-screen">
        <div>
          {/* Large Hero Product Image: Gallery White (#ffffff) & Hairline Silver (#d6d6d6) */}
          <div className="relative aspect-square w-full rounded-3xl bg-gallery-white border border-hairline flex items-center justify-center p-4 overflow-hidden mb-3">
            <img
              src={item.imageUrl || '/images/kopi-kenangan-cup.png'}
              alt={item.name}
              onError={(e) => {
                e.currentTarget.src = '/images/kopi-kenangan-cup.png';
              }}
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-ink/70 backdrop-blur-md flex items-center justify-center text-gallery-white">
              <IconMaximize size={16} stroke={2} />
            </div>
          </div>

          {/* Indicator Slider Dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <span className="w-5 h-1.5 rounded-full bg-ink" />
            <span className="w-1.5 h-1.5 rounded-full bg-control-gray" />
            <span className="w-1.5 h-1.5 rounded-full bg-control-gray" />
          </div>

          {/* Title & Price */}
          <div className="space-y-1 mb-2.5">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-ink leading-snug">
                {item.name}
              </h1>
              <span className="text-2xl font-bold text-ink shrink-0">
                {formatRupiah(unitPrice)}
              </span>
            </div>
          </div>

          {/* Badges: Selection with Launch Orange & Studio Mist */}
          <div className="flex items-center gap-2 mb-3">
            <Chip size="sm" variant="primary" className="text-xs font-semibold px-2.5 py-0.5 bg-launch-orange text-gallery-white">
              Pilihan 97%
            </Chip>
            <Chip size="sm" variant="secondary" className="text-xs font-medium text-slate bg-studio-mist border border-hairline">
              Produk terlaris
            </Chip>
          </div>

          {/* Description */}
          <p className="text-sm text-slate leading-relaxed mb-3">
            {isExpanded
              ? item.description + ' Dibuat dengan bahan pilihan terbaik langsung dari racikan barista andalan.'
              : item.description}
            {' '}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="font-semibold text-apple-blue hover:underline inline-block ml-1"
            >
              {isExpanded ? 'Tutup' : 'Selengkapnya'}
            </button>
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mb-6">
            <span className="font-semibold text-sm text-ink">4.9</span>
            <span className="text-xs text-steel font-medium">(332)</span>
            <div className="flex items-center gap-0.5 text-amber-500 ml-1">
              <IconStarFilled size={14} />
              <IconStarFilled size={14} />
              <IconStarFilled size={14} />
              <IconStarFilled size={14} />
              <IconStarFilled size={14} />
            </div>
          </div>

          {/* Opsi Varian: Studio Mist Backdrop, Hairline Divider */}
          {item.optionGroups && item.optionGroups.length > 0 && (
            <div className="space-y-5 mb-6 pt-4 border-t border-hairline">
              {item.optionGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-sm font-semibold text-ink">
                      {group.name}
                    </span>
                    {group.required ? (
                      <Chip size="sm" variant="secondary" className="text-[10px] font-semibold text-slate bg-studio-mist border border-hairline h-5">
                        Wajib (Pilih 1)
                      </Chip>
                    ) : (
                      <span className="text-[10px] text-steel">Opsional</span>
                    )}
                  </div>

                  {/* List Vertikal Pilihan Opsi */}
                  <div className="bg-studio-mist rounded-2xl border border-hairline overflow-hidden divide-y divide-hairline">
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
                              ? 'bg-gallery-white font-medium shadow-2xs'
                              : 'hover:bg-gallery-white/50 text-ink'
                          }`}
                        >
                          <div className="flex flex-col pr-2">
                            <span className={`text-xs sm:text-sm ${isSelected ? 'font-semibold text-ink' : 'text-slate'}`}>
                              {opt.name}
                            </span>
                            {opt.priceDelta > 0 && (
                              <span className="text-[11px] font-semibold text-apple-blue mt-0.5">
                                +{formatRupiah(opt.priceDelta)}
                              </span>
                            )}
                          </div>

                          {/* Apple-styled Radio Indicator */}
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? 'border-2 border-pricing-blue bg-pricing-blue'
                                : 'border-2 border-steel bg-gallery-white'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-gallery-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Catatan untuk Barista: HeroUI v3 TextArea */}
              <div className="space-y-1.5 pt-3 border-t border-hairline">
                <div className="flex items-center justify-between px-0.5">
                  <Label className="text-sm font-semibold text-ink block">
                    Catatan untuk Barista
                  </Label>
                  <span className="text-xs text-slate">Opsional</span>
                </div>
                <TextArea
                  rows={2}
                  fullWidth
                  variant="secondary"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kurangi es, tanpa sedotan, minta pisah es..."
                  className="w-full text-sm rounded-2xl bg-paper-frost border border-hairline focus:bg-gallery-white text-ink"
                  aria-label="Catatan untuk Barista"
                />
              </div>
            </div>
          )}
        </div>

        {/* Floating Bottom Action: Stepper + Tombol Tambah ke Keranjang */}
        <div className="fixed bottom-3 inset-x-4 max-w-md mx-auto z-40">
          <div className="bg-gallery-white/95 backdrop-blur-md rounded-[24px] p-2 border border-hairline shadow-lg flex items-center gap-2">
            {/* Quantity Stepper Ringkas (Bisa mulai dari 0) */}
            <div className="flex items-center bg-control-gray rounded-2xl p-1 shrink-0">
              <button
                type="button"
                disabled={quantity <= 0}
                onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-ink disabled:opacity-30"
                aria-label="Kurangi"
              >
                <IconMinus size={16} stroke={2} />
              </button>
              <span className={`w-7 text-center text-sm font-semibold ${quantity === 0 ? 'text-steel' : 'text-ink'}`}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-ink"
                aria-label="Tambah"
              >
                <IconPlus size={16} stroke={2} />
              </button>
            </div>

            {/* Tombol Utama: Ringkas & Responsif di Semua Ukuran Layar HP */}
            <Button
              variant="primary"
              isDisabled={!canAddToCart}
              className={`flex-1 min-w-0 h-12 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-between px-3 sm:px-4 shadow-xs transition-opacity ${
                canAddToCart
                  ? 'bg-pricing-blue text-gallery-white cursor-pointer active:scale-98'
                  : 'bg-control-gray text-steel cursor-not-allowed opacity-60'
              }`}
              onPress={handleConfirmAddToCart}
            >
              <span className="truncate">
                {quantity === 0 ? 'Pilih Jumlah' : missingRequired ? 'Pilih Varian' : '+ Keranjang'}
              </span>
              <span className="font-bold shrink-0 ml-1.5">{formatRupiah(totalPrice)}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
