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
  IconCheck,
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

  const hasSavedProfile = Boolean(profile.name && profile.phone);
  const [step, setStep] = useState<'cart' | 'checkout'>(() => (hasSavedProfile ? 'cart' : 'cart'));
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
      <Drawer.Content placement="right" className="max-w-md w-full bg-white">
        <Drawer.Dialog>
          <Drawer.Header className="border-b border-stone-100">
            <div>
              <Drawer.Heading className="text-base font-bold text-stone-900">
                {step === 'cart' ? 'Keranjang Pesanan' : 'Data Pemesan'}
              </Drawer.Heading>
              <p className="text-xs text-stone-500 truncate max-w-[260px]">
                {outlet.name}
              </p>
            </div>
            <Drawer.CloseTrigger />
          </Drawer.Header>

          <Drawer.Body className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <p className="text-sm">Keranjangmu masih kosong.</p>
                <p className="text-xs mt-1">Pilih menu favoritmu untuk mulai memesan.</p>
              </div>
            ) : step === 'cart' ? (
              <div className="space-y-3">
                {/* Info Profil Tersimpan untuk Repeat Customer */}
                {hasSavedProfile && (
                  <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <IconCheck size={14} stroke={2.5} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-stone-900">
                          Data Pemesan: {profile.name}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {profile.phone} • {profile.deliveryMethod === 'delivery' ? 'Diantar' : 'Ambil Sendiri'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('checkout')}
                      className="text-xs font-semibold text-emerald-800 underline"
                    >
                      Ubah
                    </button>
                  </div>
                )}

                {/* Daftar Item Pesanan */}
                {cartItems.map((item) => (
                  <Card key={item.id} variant="secondary" className="p-3 bg-white border border-stone-200/70 shadow-2xs">
                    <div className="flex items-start gap-3">
                      {/* Product Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-white border border-stone-200/60 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={item.menuItem.imageUrl || '/images/kopi-kenangan-cup.png'}
                          alt={item.menuItem.name}
                          onError={(e) => {
                            e.currentTarget.src = '/images/kopi-kenangan-cup.png';
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <Chip size="sm" variant="primary" color="default" className="text-[10px] font-bold shrink-0">
                            {item.quantity}x
                          </Chip>
                          <h4 className="font-semibold text-stone-900 text-xs sm:text-sm truncate">
                            {item.menuItem.name}
                          </h4>
                        </div>

                        {item.selectedOptions.length > 0 && (
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {item.selectedOptions.map((o) => o.optionName).join(', ')}
                          </p>
                        )}

                        {item.notes && (
                          <p className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md mt-1 italic font-medium">
                            Catatan: {item.notes}
                          </p>
                        )}

                        <span className="text-xs font-bold text-stone-900 mt-1 block">
                          {formatRupiah(item.totalPrice)}
                        </span>
                      </div>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() => onRemoveItem(item.id)}
                        aria-label="Hapus item"
                        className="text-stone-400 hover:text-rose-600 shrink-0"
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
                  className="text-stone-400 hover:text-stone-700 text-xs"
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
                  <Label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                    Metode Pemesanan
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={profile.deliveryMethod === 'delivery' ? 'primary' : 'outline'}
                      size="sm"
                      className={profile.deliveryMethod === 'delivery' ? 'bg-[#0a2e1f] text-[#2fdc8f]' : ''}
                      onPress={() => handleProfileChange('deliveryMethod', 'delivery')}
                    >
                      Diantar (Delivery)
                    </Button>
                    <Button
                      variant={profile.deliveryMethod === 'pickup' ? 'primary' : 'outline'}
                      size="sm"
                      className={profile.deliveryMethod === 'pickup' ? 'bg-[#0a2e1f] text-[#2fdc8f]' : ''}
                      onPress={() => handleProfileChange('deliveryMethod', 'pickup')}
                    >
                      Ambil Sendiri (Pickup)
                    </Button>
                  </div>
                </div>

                {/* Nama Pemesan */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                    <IconUser size={14} className="text-stone-500" />
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
                  <Label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                    <IconPhone size={14} className="text-stone-500" />
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
                      <Label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                        <IconMapPin size={14} className="text-stone-500" />
                        <span>Alamat Lengkap</span>
                      </Label>
                      <textarea
                        rows={2}
                        value={profile.address || ''}
                        onChange={(e) => handleProfileChange('address', e.target.value)}
                        placeholder="Jalan, nomor rumah/kantor, RT/RW, kelurahan..."
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border border-stone-200/80 focus:outline-none focus:bg-white focus:border-stone-900/30 transition-colors placeholder:text-stone-400 text-stone-900 resize-none leading-relaxed"
                        aria-label="Alamat Lengkap"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-stone-600 block">
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
            <Drawer.Footer className="border-t border-stone-100 bg-stone-50/80 flex flex-col gap-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-stone-500">Subtotal Item</span>
                <span className="text-base font-bold text-stone-900">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              {step === 'cart' ? (
                hasSavedProfile ? (
                  /* Repeat Customer Langsung Kirim 1 Klik */
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="secondary"
                      onPress={() => setStep('checkout')}
                      className="px-3"
                    >
                      Ubah Data
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1 justify-center gap-2 bg-[#0a2e1f] text-[#2fdc8f] border border-[#144732]"
                      onPress={handleSendWhatsApp}
                    >
                      <IconBrandWhatsapp size={18} stroke={2} />
                      <span>Kirim ke WhatsApp</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    onPress={() => setStep('checkout')}
                    className="justify-center gap-2 bg-[#0a2e1f] text-[#2fdc8f]"
                  >
                    <span>Lanjut Isi Data Pengiriman</span>
                    <IconChevronRight size={16} stroke={2} />
                  </Button>
                )
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
                    className="flex-1 justify-center gap-2 bg-[#0a2e1f] text-[#2fdc8f] border border-[#144732]"
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
