import React, { useState } from 'react';
import {
  Button,
  Input,
  TextArea,
  Label,
  Chip,
  Alert,
} from '@heroui/react';
import {
  IconArrowLeft,
  IconTrash,
  IconBrandWhatsapp,
  IconMapPin,
  IconUser,
  IconPhone,
  IconTruck,
  IconBuildingStore,
  IconAlertCircle,
} from '@tabler/icons-react';
import type { CartItem, CustomerProfile, OrderPayload, DeliveryMethod } from '../types/cart';
import type { Outlet } from '../types/catalog';
import {
  formatRupiah,
  generateOrderId,
  constructWhatsAppMessage,
  buildWhatsAppUrl,
} from '../utils/whatsapp';

interface CartStandalonePageProps {
  onBack: () => void;
  cartItems: CartItem[];
  outlet: Outlet;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const LOCAL_STORAGE_KEY = 'jasdor_customer_profile';

export const CartStandalonePage: React.FC<CartStandalonePageProps> = ({
  onBack,
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
    <div className="min-h-screen bg-stone-50/70 text-stone-900 pb-36 font-sans antialiased">
      {/* Fixed Header Standalone: Left-aligned with Back Button */}
      <div className="sticky top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-md mx-auto px-4 h-15 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 -ml-1.5 rounded-full flex items-center justify-center text-stone-900 active:bg-stone-100 transition-colors shrink-0"
              aria-label="Kembali ke Menu"
            >
              <IconArrowLeft size={22} stroke={2} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold text-stone-900 truncate leading-tight">
                Keranjang & Checkout
              </h1>
              <p className="text-xs text-stone-500 truncate leading-tight mt-0.5">
                {outlet.name}
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs font-semibold text-rose-600 active:opacity-70 px-2 py-1 shrink-0"
            >
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Error Alert */}
        {errorMessage && (
          <Alert status="danger" className="text-xs py-2 px-3">
            <div className="flex items-center gap-2">
              <IconAlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          </Alert>
        )}

        {/* Jika Keranjang Kosong */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-stone-200/70 text-center space-y-3 mt-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <IconTrash size={28} stroke={1.5} />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Keranjangmu Masih Kosong
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
              Belum ada menu yang dipilih. Jelajahi menu lezat dari {outlet.name} sekarang.
            </p>
            <Button
              variant="primary"
              className="mt-2 rounded-2xl bg-stone-900 text-white font-semibold text-xs px-6 py-2.5"
              onPress={onBack}
            >
              Pilih Menu Sekarang
            </Button>
          </div>
        ) : (
          <>
            {/* Bagian 1: Daftar Menu yang Dipesan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-bold text-stone-900">
                  Daftar Pesanan ({cartItems.length} menu)
                </span>
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs font-semibold text-stone-900 underline"
                >
                  + Tambah Menu Lain
                </button>
              </div>

              <div className="space-y-2.5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-3"
                  >
                    {/* Thumbnail Cup */}
                    <div className="w-14 h-14 rounded-2xl bg-white border border-stone-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={item.menuItem.imageUrl || '/images/kopi-kenangan-cup.png'}
                        alt={item.menuItem.name}
                        onError={(e) => {
                          e.currentTarget.src = '/images/kopi-kenangan-cup.png';
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Info Menu */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Chip size="sm" variant="secondary" className="text-[10px] font-bold px-1.5 py-0.5 bg-stone-100 text-stone-800">
                          {item.quantity}x
                        </Chip>
                        <h4 className="font-bold text-stone-900 text-sm truncate">
                          {item.menuItem.name}
                        </h4>
                      </div>

                      {item.selectedOptions.length > 0 && (
                        <p className="text-xs text-stone-500 mt-1">
                          {item.selectedOptions.map((o) => o.optionName).join(' • ')}
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-xs text-stone-700 bg-stone-100/80 px-2 py-1 rounded-xl mt-1.5 italic">
                          "{item.notes}"
                        </p>
                      )}

                      <span className="text-sm font-bold text-stone-900 mt-1.5 block">
                        {formatRupiah(item.totalPrice)}
                      </span>
                    </div>

                    {/* Tombol Hapus */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-rose-600 active:bg-rose-50 transition-colors shrink-0"
                      aria-label="Hapus pesanan"
                    >
                      <IconTrash size={16} stroke={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bagian 2: Opsi Pengantaran (Delivery vs Pickup) */}
            <div className="p-4 bg-white rounded-3xl border border-stone-200/80 space-y-3 shadow-2xs">
              <span className="text-sm font-bold text-stone-900 block">
                Metode Penerimaan
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleProfileChange('deliveryMethod', 'delivery')}
                  className={`py-3 px-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    profile.deliveryMethod === 'delivery'
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200/80 bg-stone-50 text-stone-700'
                  }`}
                >
                  <IconTruck size={20} stroke={2} />
                  <div>
                    <span className="text-xs font-bold block leading-tight">
                      Diantar
                    </span>
                    <span className={`text-[10px] block ${profile.deliveryMethod === 'delivery' ? 'text-stone-300' : 'text-stone-400'}`}>
                      Kirim ke Alamat
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleProfileChange('deliveryMethod', 'pickup')}
                  className={`py-3 px-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    profile.deliveryMethod === 'pickup'
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200/80 bg-stone-50 text-stone-700'
                  }`}
                >
                  <IconBuildingStore size={20} stroke={2} />
                  <div>
                    <span className="text-xs font-bold block leading-tight">
                      Ambil Sendiri
                    </span>
                    <span className={`text-[10px] block ${profile.deliveryMethod === 'pickup' ? 'text-stone-300' : 'text-stone-400'}`}>
                      Pick up di Gerai
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bagian 3: Form Data Pemesan */}
            <div className="p-4 bg-white rounded-3xl border border-stone-200/80 space-y-3.5 shadow-2xs">
              <span className="text-sm font-bold text-stone-900 block">
                Informasi Pemesan
              </span>

              {/* Nama Lengkap */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <IconUser size={15} className="text-stone-500" />
                  <span>Nama Pemesan</span>
                </Label>
                <Input
                  fullWidth
                  variant="secondary"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Contoh: Rina Sari"
                  className="w-full text-sm rounded-2xl bg-stone-50 border border-stone-200/80 focus:bg-white"
                  aria-label="Nama Pemesan"
                />
              </div>

              {/* Nomor WhatsApp */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <IconPhone size={15} className="text-stone-500" />
                  <span>Nomor WhatsApp</span>
                </Label>
                <Input
                  fullWidth
                  variant="secondary"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full text-sm rounded-2xl bg-stone-50 border border-stone-200/80 focus:bg-white"
                  aria-label="Nomor WhatsApp"
                />
              </div>

              {/* Alamat Pengantaran (Khusus Delivery) */}
              {profile.deliveryMethod === 'delivery' && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                      <IconMapPin size={15} className="text-stone-500" />
                      <span>Alamat Pengantaran Lengkap</span>
                    </Label>
                    <TextArea
                      rows={2}
                      fullWidth
                      variant="secondary"
                      value={profile.address || ''}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      placeholder="Jalan, nomor rumah/kantor, RT/RW, kelurahan..."
                      className="w-full text-sm rounded-2xl bg-stone-50 border border-stone-200/80 focus:bg-white"
                      aria-label="Alamat Pengantaran Lengkap"
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
                      className="w-full text-sm rounded-2xl bg-stone-50 border border-stone-200/80 focus:bg-white"
                      aria-label="Patokan Lokasi"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Bagian 4: Rincian Pembayaran */}
            <div className="p-4 bg-white rounded-3xl border border-stone-200/80 space-y-2.5 shadow-2xs">
              <span className="text-sm font-bold text-stone-900 block">
                Ringkasan Pembayaran
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal Pesanan</span>
                  <span className="font-semibold text-stone-900">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Biaya Pengantaran</span>
                  <span className="font-semibold text-emerald-700">
                    {profile.deliveryMethod === 'delivery' ? 'Sesuai Jarak (COD/Transfer)' : 'Gratis (Ambil Sendiri)'}
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
                <span className="text-sm font-bold text-stone-900">Total Perkiraan</span>
                <span className="text-base font-bold text-stone-900">{formatRupiah(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed Sticky Bottom Dock: Langsung Pesan via WhatsApp */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-stone-500 block leading-tight">
                Total Tagihan ({cartItems.length} menu)
              </span>
              <span className="text-lg font-bold text-stone-900 leading-tight">
                {formatRupiah(total)}
              </span>
            </div>

            <Button
              variant="primary"
              className="h-12 px-6 rounded-2xl bg-[#0a2e1f] text-white font-bold text-sm flex items-center gap-2 shadow-xs active:scale-95 transition-transform"
              onPress={handleSendWhatsApp}
            >
              <IconBrandWhatsapp size={20} stroke={2} className="text-[#2fdc8f]" />
              <span>Pesan via WhatsApp</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
