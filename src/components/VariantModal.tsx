import React, { useState } from 'react';
import {
  Modal,
  Button,
  Chip,
  Input,
  Label,
  Card,
} from '@heroui/react';
import { IconPlus, IconMinus, IconCheck } from '@tabler/icons-react';
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
    <Modal isOpen={!!item} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="sm">
          <Modal.Dialog className="w-full">
            <Modal.Header>
              <div>
                <Modal.Heading>{item.name}</Modal.Heading>
                <p className="text-xs text-muted mt-0.5">Sesuaikan varian pesananmu</p>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Item Preview */}
              <Card variant="secondary" className="p-3">
                <div className="flex gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-foreground">{item.name}</h4>
                    <p className="text-xs text-muted line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                    <span className="text-xs font-bold text-accent mt-1 block">
                      {formatRupiah(item.basePrice)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Option Groups */}
              {item.optionGroups && item.optionGroups.length > 0 ? (
                item.optionGroups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {group.name}
                      </span>
                      {group.required ? (
                        <Chip size="sm" variant="soft" color="accent" className="h-4.5 text-[10px]">
                          Wajib
                        </Chip>
                      ) : (
                        <span className="text-[11px] text-muted">Opsional</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.options.map((opt) => {
                        const isSelected = selectedOptions[group.id]?.optionId === opt.id;
                        return (
                          <Button
                            key={opt.id}
                            variant={isSelected ? 'primary' : 'outline'}
                            className={`justify-between h-auto py-2.5 px-3 text-xs w-full ${
                              isSelected ? '' : 'border-border'
                            }`}
                            onPress={() =>
                              handleSelectOption(
                                group.id,
                                group.name,
                                opt.id,
                                opt.name,
                                opt.priceDelta
                              )
                            }
                          >
                            <span>{opt.name}</span>
                            <div className="flex items-center gap-1.5">
                              {opt.priceDelta > 0 && (
                                <span className="opacity-80 font-normal">
                                  +{formatRupiah(opt.priceDelta)}
                                </span>
                              )}
                              {isSelected && <IconCheck size={14} stroke={2.5} />}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : null}

              {/* Catatan Khusus */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted block">
                  Catatan Pesanan (Opsional)
                </Label>
                <Input
                  fullWidth
                  variant="secondary"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Pisahkan es, sedikit gula..."
                  aria-label="Catatan pesanan"
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="flex items-center justify-between gap-3 border-t border-separator">
              {/* Quantity Controls */}
              <div className="flex items-center gap-1 bg-surface-secondary border border-border rounded-xl p-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  isDisabled={quantity <= 1}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Kurangi jumlah"
                >
                  <IconMinus size={14} stroke={2} />
                </Button>
                <span className="w-8 text-center text-xs font-bold text-foreground">
                  {quantity}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  onPress={() => setQuantity((q) => q + 1)}
                  aria-label="Tambah jumlah"
                >
                  <IconPlus size={14} stroke={2} />
                </Button>
              </div>

              <Button
                variant="primary"
                className="flex-1 justify-between"
                onPress={handleConfirm}
              >
                <span>Tambah ke Pesanan</span>
                <span className="font-bold">{formatRupiah(totalPrice)}</span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
