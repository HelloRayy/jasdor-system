import React, { useState, useEffect, useRef } from 'react';
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
  IconCheck,
} from '@tabler/icons-react';
import type { CartItem, CustomerProfile, OrderPayload, DeliveryMethod } from '../types/cart';
import type { Outlet } from '../types/catalog';
import { mockOutlets } from '../data/mockOutlets';
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
  onSelectOutlet?: (outlet: Outlet) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const LOCAL_STORAGE_KEY = 'jasdor_customer_profile';

export const CartStandalonePage: React.FC<CartStandalonePageProps> = ({
  onBack,
  cartItems,
  outlet,
  onSelectOutlet,
  onRemoveItem,
  onClearCart,
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>(outlet);
  const [customBranchName, setCustomBranchName] = useState<string>(outlet.name);
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce input pencarian cabang (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(customBranchName.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [customBranchName]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter cabang berdasarkan input debounced
  const matchingOutlets = debouncedQuery.length >= 2
    ? mockOutlets.filter((o) => {
        const q = debouncedQuery.toLowerCase();
        return (
          o.name.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q) ||
          o.location.city.toLowerCase().includes(q)
        );
      })
    : [];

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

    const finalBranchName = customBranchName.trim() || selectedOutlet.name;

    const orderPayload: OrderPayload = {
      orderId: generateOrderId(selectedOutlet.slug),
      outletId: selectedOutlet.id,
      outletName: finalBranchName,
      whatsappNumber: selectedOutlet.whatsappNumber,
      outletAddress: selectedOutlet.address,
      outletMapsQuery: selectedOutlet.googleMapsQuery || finalBranchName,
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
    const waUrl = buildWhatsAppUrl(selectedOutlet.whatsappNumber, message);

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
                {selectedOutlet.name}
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

            {/* Bagian 1.5: Input Field Cabang Simpel dengan Debounce Live Dropdown */}
            <div className="p-4 bg-white rounded-3xl border border-stone-200/80 space-y-2 shadow-2xs" ref={dropdownRef}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-stone-900 block">
                  Cabang Pemesanan
                </span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                  {selectedOutlet.location.city || 'Semarang'}
                </span>
              </div>

              {/* Input Text Bersih & Minimalis */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <IconBuildingStore size={18} stroke={1.75} />
                </div>
                <input
                  type="text"
                  value={customBranchName}
                  onChange={(e) => {
                    setCustomBranchName(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Ketik nama kota, mall, atau cabang terdekat..."
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white rounded-2xl border border-stone-300 focus:outline-none focus:border-stone-900 text-stone-900 font-medium placeholder:text-stone-400 transition-colors"
                  aria-label="Nama Cabang Pemesanan"
                />

                {/* Live Dropdown Hasil Debounce */}
                {isDropdownOpen && matchingOutlets.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-stone-200/90 shadow-xl overflow-hidden z-50 max-h-56 overflow-y-auto">
                    <div className="px-3 py-1.5 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-500">
                      <span>Pilihan Cabang Resmi</span>
                      <span>{matchingOutlets.length} lokasi</span>
                    </div>
                    {matchingOutlets.map((item) => {
                      const isSelected = selectedOutlet.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedOutlet(item);
                            setCustomBranchName(item.name);
                            setIsDropdownOpen(false);
                            if (onSelectOutlet) onSelectOutlet(item);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left border-b border-stone-100 last:border-0 flex items-start justify-between gap-2.5 transition-colors cursor-pointer ${
                            isSelected ? 'bg-stone-50' : 'hover:bg-stone-50/60'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900 truncate">
                                {item.name}
                              </span>
                              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 shrink-0">
                                {item.location.city}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {item.address}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                              <IconCheck size={12} stroke={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <p className="text-[11px] text-stone-400 px-0.5">
                Cari berdasarkan kota atau nama gedung, lalu pilih gerai yang sesuai.
              </p>
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
                  placeholder="Masukkan nama lengkapmu"
                  className="w-full text-sm rounded-2xl bg-white border border-stone-300 focus:border-stone-900"
                  aria-label="Nama Pemesan"
                />
              </div>

              {/* Nomor WhatsApp */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <IconPhone size={15} className="text-stone-500" />
                  <span>Nomor WhatsApp Aktif</span>
                </Label>
                <Input
                  fullWidth
                  variant="secondary"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full text-sm rounded-2xl bg-white border border-stone-300 focus:border-stone-900"
                  aria-label="Nomor WhatsApp Aktif"
                />
              </div>

              {/* Alamat Pengantaran (Khusus Delivery) */}
              {profile.deliveryMethod === 'delivery' && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                      <IconMapPin size={15} className="text-stone-500" />
                      <span>Alamat Tujuan Pengiriman</span>
                    </Label>
                    <TextArea
                      rows={2}
                      fullWidth
                      variant="secondary"
                      value={profile.address || ''}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      placeholder="Tuliskan nama jalan, nomor rumah/kantor, RT/RW, dan patokan..."
                      className="w-full text-sm rounded-2xl bg-white border border-stone-300 focus:border-stone-900"
                      aria-label="Alamat Tujuan Pengiriman"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-stone-600 block">
                        Catatan Lokasi
                      </Label>
                      <span className="text-[11px] text-stone-400">Opsional</span>
                    </div>
                    <Input
                      fullWidth
                      variant="secondary"
                      value={profile.landmark || ''}
                      onChange={(e) => handleProfileChange('landmark', e.target.value)}
                      placeholder="Contoh: Pagar hitam samping minimarket / titip pos satpam"
                      className="w-full text-sm rounded-2xl bg-white border border-stone-300 focus:border-stone-900"
                      aria-label="Catatan Lokasi Tambahan"
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
                  <span className="font-semibold text-blue-600">
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

      {/* Bilah Bawah Minimalis: Flat Edge-to-Edge Menempel di Dasar Layar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/70 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs text-stone-500 block leading-tight">
                Total
              </span>
              <span className="text-lg font-bold text-stone-900 leading-tight block mt-0.5">
                {formatRupiah(total)}
              </span>
            </div>

            <Button
              variant="primary"
              className="h-12 px-6 rounded-2xl bg-stone-900 text-white font-semibold text-sm flex items-center gap-2 shadow-xs active:scale-95 transition-transform cursor-pointer"
              onPress={handleSendWhatsApp}
            >
              <IconBrandWhatsapp size={19} stroke={2} className="text-blue-400" />
              <span>Pesan via WhatsApp</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
