import type { Outlet, MenuItem } from '../types/catalog';
import kopiKenanganRaw from './kopiKenanganBranches.json';

// Menu resmi standar Kopi Kenangan
const KOPI_KENANGAN_PLACEHOLDER = '/images/kopi-kenangan-cup.png';

const STANDARD_KOPI_KENANGAN_MENUS: MenuItem[] = [
  {
    id: 'kk-01',
    name: 'Kopi Kenangan Mantan',
    description: 'Espresso dengan susu segar dan gula aren asli pilihan nusantara.',
    basePrice: 19000,
    imageUrl: KOPI_KENANGAN_PLACEHOLDER,
    category: 'Coffee',
    isAvailable: true,
    optionGroups: [
      {
        id: 'size',
        name: 'Ukuran',
        required: true,
        type: 'radio',
        options: [
          { id: 'regular', name: 'Regular', priceDelta: 0 },
          { id: 'large', name: 'Large', priceDelta: 5000 },
        ],
      },
      {
        id: 'sugar',
        name: 'Level Gula',
        required: true,
        type: 'radio',
        options: [
          { id: 'normal-sugar', name: 'Normal Sugar (100%)', priceDelta: 0 },
          { id: 'less-sugar', name: 'Less Sugar (50%)', priceDelta: 0 },
          { id: 'no-sugar', name: 'No Sugar (0%)', priceDelta: 0 },
        ],
      },
      {
        id: 'ice',
        name: 'Level Es',
        required: true,
        type: 'radio',
        options: [
          { id: 'normal-ice', name: 'Normal Ice', priceDelta: 0 },
          { id: 'less-ice', name: 'Less Ice', priceDelta: 0 },
          { id: 'no-ice', name: 'No Ice', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'kk-02',
    name: 'Avocado Coffee',
    description: 'Paduan alpukat gurih dengan espresso pekat dan susu kental manis.',
    basePrice: 28000,
    imageUrl: KOPI_KENANGAN_PLACEHOLDER,
    category: 'Coffee',
    isAvailable: true,
    optionGroups: [
      {
        id: 'size',
        name: 'Ukuran',
        required: true,
        type: 'radio',
        options: [
          { id: 'regular', name: 'Regular', priceDelta: 0 },
          { id: 'large', name: 'Large', priceDelta: 6000 },
        ],
      },
    ],
  },
  {
    id: 'kk-03',
    name: 'Dua Shot Iced Shaken',
    description: 'Espresso double shot dikocok dingin dengan susu kental creamy.',
    basePrice: 22000,
    imageUrl: KOPI_KENANGAN_PLACEHOLDER,
    category: 'Coffee',
    isAvailable: true,
  },
  {
    id: 'kk-04',
    name: 'Milo Dinosaurus Kenangan',
    description: 'Susu cokelat Milo kental bertabur bubuk Milo melimpah di atasnya.',
    basePrice: 20000,
    imageUrl: KOPI_KENANGAN_PLACEHOLDER,
    category: 'Non-Coffee',
    isAvailable: true,
  },
  {
    id: 'kk-05',
    name: 'Roti Cokelat Klasik',
    description: 'Roti lembut isi pasta cokelat belgian tebal dan lumer.',
    basePrice: 12000,
    imageUrl: KOPI_KENANGAN_PLACEHOLDER,
    category: 'Snacks',
    isAvailable: true,
  },
  {
    id: 'kk-06',
    name: 'Roti Daging Asap Keju',
    description: 'Roti gurih dengan isian beef bacon dan saus keju cheddar leleh.',
    basePrice: 14000,
    imageUrl: KOPI_KENANGAN_PLACEHOLDER,
    category: 'Snacks',
    isAvailable: true,
  },
];

// Mapping seluruh 59+ cabang Kopi Kenangan di Indonesia (Semarang, Jakarta, Bandung, Surabaya, dll)
export const mockOutlets: Outlet[] = (kopiKenanganRaw as Array<{
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  city: string;
}>).map((item) => ({
  id: item.id,
  slug: 'kopi-kenangan',
  name: item.name,
  brand: 'Kopi Kenangan',
  tagline: 'Kopi Mantan Paling Pas di Lidah',
  logoUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  whatsappNumber: '6281234567890',
  address: item.address,
  location: {
    lat: item.lat,
    lng: item.lng,
    city: item.city,
  },
  openingHours: '08:00 - 22:00',
  isActive: true,
  qrisImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126580016ID.CO.QRIS.WWW01189360052300000000005204581253033605802ID5913KOPI_KENANGAN6008INDONESIA6304C1B5',
  categories: ['Coffee', 'Non-Coffee', 'Snacks'],
  menus: STANDARD_KOPI_KENANGAN_MENUS,
}));
