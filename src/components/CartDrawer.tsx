import React, { useState } from 'react';
import {
  Drawer,
  Button,
  Card,
  Input,
  Label,
  Chip,
  Alert,
} from '@heroui/react';
import {
  IconTrash,
  IconBrandWhatsapp,
  IconMapPin,
  IconUser,
  IconPhone,
  IconChevronRight,
} from '@tabler/icons-react';
import type { CartItem, CustomerProfile, OrderPayload, DeliveryMethod } from '../types/cart';
import type { Outlet } from '../types/catalog';
import {
  formatRupiah,
  generateOrderId,
  constructWhatsAppMessage,
  buildWhatsAppUrl,
} from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  outlet: Outlet;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const LOCAL_STORAGE_KEY = 'jasdor_customer_profile';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  outlet,
  onRemoveItem,
  onClearCart,
}) => {
  const [profile, setProfile] = useState<CustomerProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      name: '',
      phone: '',
      deliveryMethod: 'delivery' as DeliveryMethod,
      address: '',
      landmark: '',
      googleMapsUrl: '',
    };
  });

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal;

  const handleProfileChange = (key: keyof CustomerProfile, value: string) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleSendWhatsApp = () => {
    if (!profile.name.trim()) {
      setErrorMessage('Nama pemesan wajib diisi.');
      return;
    }
    if (!profile.phone.trim()) {
      setErrorMessage('Nomor WhatsApp wajib diisi.');
      return;
    }
    if (profile.deliveryMethod === 'delivery' && !profile.address?.trim()) {
      setErrorMessage('Alamat pengantaran wajib diisi.');
      return;
    }

    setErrorMessage('');

    const orderPayload: OrderPayload = {
      orderId: generateOrderId(outlet.slug),
      outletId: outlet.id,
      outletName: outlet.name,
      whatsappNumber: outlet.whatsappNumber,
      items: cartItems,
      subtotal,
      deliveryFee: 0,
      total,
      customer: profile,
      createdAt: new Date().toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    const message = constructWhatsAppMessage(orderPayload);
    const waUrl = buildWhatsAppUrl(outlet.whatsappNumber, message);

    window.open(waUrl, '_blank');
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Backdrop variant="blur" />
      <Drawer.Content placement="right" className="max-w-md w-full">
        <Drawer.Dialog>
          <Drawer.Header>
            <div>
              <Drawer.Heading>
                {step === 'cart' ? 'Keranjang Pesanan' : 'Data Pemesan'}
              </Drawer.Heading>
              <p className="text-xs text-muted truncate max-w-[260px]">
                {outlet.name}
              </p>
            </div>
            <Drawer.CloseTrigger />
          </Drawer.Header>

          <Drawer.Body className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <p className="text-sm">Keranjangmu masih kosong.</p>
                <p className="text-xs mt-1">Pilih menu favoritmu untuk mulai memesan.</p>
              </div>
            ) : step === 'cart' ? (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <Card key={item.id} variant="secondary" className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Chip size="sm" variant="primary" color="default" className="text-[10px]">
                            {item.quantity}x
                          </Chip>
                          <h4 className="font-semibold text-foreground text-xs sm:text-sm truncate">
                            {item.menuItem.name}
                          </h4>
                        </div>

                        {item.selectedOptions.length > 0 && (
                          <p className="text-[11px] text-muted mt-1">
                            {item.selectedOptions.map((o) => o.optionName).join(', ')}
                          </p>
                        )}

                        {item.notes && (
                          <p className="text-[11px] text-accent mt-1 italic">
                            Catatan: {item.notes}
                          </p>
                        )}

                        <span className="text-xs font-bold text-foreground mt-1.5 block">
                          {formatRupiah(item.totalPrice)}
                        </span>
                      </div>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() => onRemoveItem(item.id)}
                        aria-label="Hapus item"
                      >
                        <IconTrash size={16} stroke={1.5} />
                      </Button>
                    </div>
                  </Card>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="text-muted hover:text-foreground text-xs"
                  onPress={onClearCart}
                >
                  Kosongkan Keranjang
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {errorMessage && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>{errorMessage}</Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}

                {/* Delivery Method */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted block">
                    Metode Pemesanan
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={profile.deliveryMethod === 'delivery' ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => handleProfileChange('deliveryMethod', 'delivery')}
                    >
                      Diantar (Delivery)
                    </Button>
                    <Button
                      variant={profile.deliveryMethod === 'pickup' ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => handleProfileChange('deliveryMethod', 'pickup')}
                    >
                      Ambil Sendiri (Pickup)
                    </Button>
                  </div>
                </div>

                {/* Nama Pemesan */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <IconUser size={14} className="text-muted" />
                    <span>Nama Lengkap</span>
                  </Label>
                  <Input
                    fullWidth
                    variant="secondary"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    placeholder="Contoh: Rina Sari"
                    aria-label="Nama Lengkap"
                  />
                </div>

                {/* Nomor WhatsApp */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <IconPhone size={14} className="text-muted" />
                    <span>Nomor WhatsApp</span>
                  </Label>
                  <Input
                    fullWidth
                    variant="secondary"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    placeholder="Contoh: 08123456789"
                    aria-label="Nomor WhatsApp"
                  />
                </div>

                {/* Alamat Pengantaran */}
                {profile.deliveryMethod === 'delivery' && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <IconMapPin size={14} className="text-muted" />
                        <span>Alamat Lengkap</span>
                      </Label>
                      <Input
                        fullWidth
                        variant="secondary"
                        value={profile.address || ''}
                        onChange={(e) => handleProfileChange('address', e.target.value)}
                        placeholder="Jalan, nomor rumah/kantor, RT/RW..."
                        aria-label="Alamat Lengkap"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-muted block">
                        Patokan Lokasi (Opsional)
                      </Label>
                      <Input
                        fullWidth
                        variant="secondary"
                        value={profile.landmark || ''}
                        onChange={(e) => handleProfileChange('landmark', e.target.value)}
                        placeholder="Contoh: Depan pos satpam pagar hitam"
                        aria-label="Patokan Lokasi"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </Drawer.Body>

          {cartItems.length > 0 && (
            <Drawer.Footer className="border-t border-separator bg-surface flex flex-col gap-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-muted">Subtotal Item</span>
                <span className="text-sm font-bold text-foreground">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              {step === 'cart' ? (
                <Button
                  variant="primary"
                  fullWidth
                  onPress={() => setStep('checkout')}
                  className="justify-center gap-2"
                >
                  <span>Lanjut Isi Data Pengiriman</span>
                  <IconChevronRight size={16} stroke={2} />
                </Button>
              ) : (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="secondary"
                    onPress={() => setStep('cart')}
                  >
                    Kembali
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 justify-center gap-2"
                    onPress={handleSendWhatsApp}
                  >
                    <IconBrandWhatsapp size={18} stroke={2} />
                    <span>Kirim ke WhatsApp</span>
                  </Button>
                </div>
              )}
            </Drawer.Footer>
          )}
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer>
  );
};
