import React, { useState } from 'react';
import {
  IconX,
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
  if (!isOpen) return null;

  // Muat profil dari localStorage jika pernah simpan
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
  const total = subtotal; // ongkir nanti konfirmasi di WA

  const handleProfileChange = (key: keyof CustomerProfile, value: string) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage error
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

    // Buka WhatsApp
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/45 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-900 text-base">
              {step === 'cart' ? 'Keranjang Pesanan' : 'Data Pemesan'}
            </h3>
            <p className="text-xs text-stone-500 truncate max-w-[260px]">
              {outlet.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <IconX size={18} stroke={1.75} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <p className="text-sm">Keranjangmu masih kosong.</p>
              <p className="text-xs mt-1">Pilih menu favoritmu untuk mulai memesan.</p>
            </div>
          ) : step === 'cart' ? (
            /* Tampilan Item Keranjang */
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-800">
                        {item.quantity}x
                      </span>
                      <h4 className="font-semibold text-stone-900 text-xs sm:text-sm truncate">
                        {item.menuItem.name}
                      </h4>
                    </div>

                    {item.selectedOptions.length > 0 && (
                      <p className="text-[11px] text-stone-500 mt-1">
                        {item.selectedOptions.map((o) => o.optionName).join(', ')}
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md mt-1 italic">
                        Catatan: {item.notes}
                      </p>
                    )}

                    <span className="text-xs font-bold text-stone-900 mt-1.5 block">
                      {formatRupiah(item.totalPrice)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                    title="Hapus item"
                  >
                    <IconTrash size={16} stroke={1.5} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-stone-400 hover:text-stone-600 underline block text-center pt-2"
              >
                Kosongkan Keranjang
              </button>
            </div>
          ) : (
            /* Formulir Data Pemesan */
            <div className="space-y-4">
              {errorMessage && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                  {errorMessage}
                </div>
              )}

              {/* Delivery Method Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Metode Pemesanan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleProfileChange('deliveryMethod', 'delivery')}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                      profile.deliveryMethod === 'delivery'
                        ? 'border-amber-700 bg-amber-50 text-amber-950'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    Diantar (Delivery)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProfileChange('deliveryMethod', 'pickup')}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                      profile.deliveryMethod === 'pickup'
                        ? 'border-amber-700 bg-amber-50 text-amber-950'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    Ambil Sendiri (Pickup)
                  </button>
                </div>
              </div>

              {/* Input Nama */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <IconUser size={14} className="text-stone-400" />
                  <span>Nama Lengkap</span>
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Contoh: Rina Sari"
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 focus:bg-white"
                />
              </div>

              {/* Input WhatsApp */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <IconPhone size={14} className="text-stone-400" />
                  <span>Nomor WhatsApp</span>
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 focus:bg-white"
                />
              </div>

              {/* Input Alamat (Jika Delivery) */}
              {profile.deliveryMethod === 'delivery' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                      <IconMapPin size={14} className="text-stone-400" />
                      <span>Alamat Lengkap</span>
                    </label>
                    <textarea
                      rows={2}
                      value={profile.address || ''}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      placeholder="Jalan, nomor rumah/kantor, RT/RW..."
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 block">
                      Patokan Lokasi (Opsional)
                    </label>
                    <input
                      type="text"
                      value={profile.landmark || ''}
                      onChange={(e) => handleProfileChange('landmark', e.target.value)}
                      placeholder="Contoh: Pagar hitam depan pos satpam"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 focus:bg-white"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-stone-100 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">Subtotal Item</span>
              <span className="text-sm font-bold text-stone-900">
                {formatRupiah(subtotal)}
              </span>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Lanjut Isi Data Pengiriman</span>
                <IconChevronRight size={16} stroke={2} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-3.5 py-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <IconBrandWhatsapp size={18} stroke={2} />
                  <span>Kirim Pesanan ke WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
