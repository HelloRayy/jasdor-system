import React, { useState } from 'react';
import { IconX, IconPlus, IconMinus, IconCheck } from '@tabler/icons-react';
import type { MenuItem } from '../types/catalog';
import type { CartItem, SelectedOption } from '../types/cart';
import { formatRupiah } from '../utils/whatsapp';

interface VariantModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const VariantModal: React.FC<VariantModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  // Inisialisasi opsi default (ambil opsi pertama dari tiap grup required)
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

  // Hitung harga satuan dinamis
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

  const handleConfirm = () => {
    const optionsArray = Object.values(selectedOptions);
    const optionsKey = optionsArray
      .map((o) => o.optionId)
      .sort()
      .join('-');
    const cartItemId = `${item.id}-${optionsKey}-${Date.now()}`;

    const cartItem: CartItem = {
      id: cartItemId,
      menuItem: item,
      quantity,
      selectedOptions: optionsArray,
      notes: notes.trim() ? notes.trim() : undefined,
      unitPrice,
      totalPrice,
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/45 backdrop-blur-xs">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header Modal */}
        <div className="relative p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="min-w-0 pr-8">
            <h3 className="font-semibold text-stone-900 text-base truncate">
              {item.name}
            </h3>
            <p className="text-xs text-stone-500">Sesuaikan varian pesananmu</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <IconX size={18} stroke={1.75} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* Item Preview */}
          <div className="flex gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-medium text-stone-900 text-sm">{item.name}</h4>
              <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                {item.description}
              </p>
              <span className="text-xs font-semibold text-amber-800 mt-1 block">
                {formatRupiah(item.basePrice)}
              </span>
            </div>
          </div>

          {/* Option Groups */}
          {item.optionGroups && item.optionGroups.length > 0 ? (
            item.optionGroups.map((group) => (
              <div key={group.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    {group.name}
                  </span>
                  {group.required ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">
                      Wajib
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400">Opsional</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                          isSelected
                            ? 'border-amber-700 bg-amber-50 text-amber-950 font-medium'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <div className="flex items-center gap-1.5">
                          {opt.priceDelta > 0 && (
                            <span className="text-stone-500 font-normal">
                              +{formatRupiah(opt.priceDelta)}
                            </span>
                          )}
                          {isSelected && (
                            <IconCheck size={14} className="text-amber-800" stroke={2.5} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-500 italic">
              Menu ini tidak memiliki opsi tambahan.
            </p>
          )}

          {/* Notes Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
              Catatan untuk Outlet (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pisahkan es, jangan terlalu manis..."
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 focus:bg-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-3">
          <div className="flex items-center border border-stone-200 rounded-xl bg-white p-1">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <IconMinus size={14} stroke={2} />
            </button>
            <span className="w-8 text-center text-xs font-bold text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <IconPlus size={14} stroke={2} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-medium text-xs sm:text-sm flex items-center justify-between transition-colors shadow-xs"
          >
            <span>Tambah ke Pesanan</span>
            <span className="font-bold">{formatRupiah(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
