import type { MenuItem, Outlet } from '../types/catalog';
import kopiKenanganRaw from './kopiKenanganBranches.json';

export interface BrandInfo {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logoUrl: string;
  themeColor: string;
  categories: string[];
  menus: MenuItem[];
  defaultWhatsApp: string;
  branches: Array<{
    id: string;
    name: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    googleMapsQuery?: string;
  }>;
}

// 1. KOPI KENANGAN DATA
const KOPI_KENANGAN_MENUS: MenuItem[] = [
  {
    id: 'kk-01',
    name: 'Kopi Kenangan Mantan',
    description: 'Espresso dengan susu segar dan gula aren asli pilihan nusantara.',
    basePrice: 19000,
    imageUrl: '/images/kopi-kenangan-cup.png',
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
    imageUrl: '/images/kopi-kenangan-cup.png',
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
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Coffee',
    isAvailable: true,
  },
  {
    id: 'kk-04',
    name: 'Milo Dinosaurus Kenangan',
    description: 'Susu cokelat Milo kental bertabur bubuk Milo melimpah di atasnya.',
    basePrice: 20000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Non-Coffee',
    isAvailable: true,
  },
  {
    id: 'kk-05',
    name: 'Roti Cokelat Klasik',
    description: 'Roti lembut isi pasta cokelat belgian tebal dan lumer.',
    basePrice: 12000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Snacks',
    isAvailable: true,
  },
  {
    id: 'kk-06',
    name: 'Roti Daging Asap Keju',
    description: 'Roti gurih dengan isian beef bacon dan saus keju cheddar leleh.',
    basePrice: 14000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Snacks',
    isAvailable: true,
  },
];

// 2. FORE COFFEE DATA
const FORE_COFFEE_MENUS: MenuItem[] = [
  {
    id: 'fore-01',
    name: 'Aren Latte',
    description: 'Espresso Fore Signature berpadu susu murni dan sirup gula aren alami.',
    basePrice: 28000,
    imageUrl: '/images/kopi-kenangan-cup.png',
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
      {
        id: 'milk',
        name: 'Pilihan Susu',
        required: true,
        type: 'radio',
        options: [
          { id: 'dairy', name: 'Fresh Milk', priceDelta: 0 },
          { id: 'oat', name: 'Oatmilk (+Rp6.000)', priceDelta: 6000 },
        ],
      },
    ],
  },
  {
    id: 'fore-02',
    name: 'Butterscotch Sea Salt Latte',
    description: 'Rasa gurih karamel butterscotch berpadu krim sea salt lembut khas Fore.',
    basePrice: 32000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Coffee',
    isAvailable: true,
  },
  {
    id: 'fore-03',
    name: 'Pandan Latte',
    description: 'Aroma wangi daun pandan alami berpadu kopi espresso creamy.',
    basePrice: 29000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Coffee',
    isAvailable: true,
  },
  {
    id: 'fore-04',
    name: 'Matcha Green Tea',
    description: 'Matcha murni Uji Jepang yang otentik, pekat dan menenangkan.',
    basePrice: 30000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Non-Coffee',
    isAvailable: true,
  },
  {
    id: 'fore-05',
    name: 'Almond Croissant',
    description: 'Pastry renyah dengan taburan almond panggang renyah dan krim lezat.',
    basePrice: 24000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Bakery',
    isAvailable: true,
  },
];

const FORE_BRANCHES = [
  {
    id: 'fore-smg-01',
    name: 'Fore Coffee - DP Mall Semarang',
    city: 'Semarang',
    address: 'DP Mall Semarang Lt. GF, Jl. Pemuda No. 150, Sekayu',
    lat: -6.9824,
    lng: 110.4113,
    googleMapsQuery: 'Fore Coffee DP Mall Semarang',
  },
  {
    id: 'fore-smg-02',
    name: 'Fore Coffee - Pollux Paragon Mall',
    city: 'Semarang',
    address: 'Pollux Mall Paragon Lt. 2, Jl. Pemuda No. 118, Sekayu',
    lat: -6.9791,
    lng: 110.4159,
    googleMapsQuery: 'Fore Coffee Pollux Paragon Semarang',
  },
  {
    id: 'fore-smg-03',
    name: 'Fore Coffee - Tentrem Mall Semarang',
    city: 'Semarang',
    address: 'Tentrem Mall Lt. 1, Jl. Gajahmada No. 123',
    lat: -6.9867,
    lng: 110.4218,
    googleMapsQuery: 'Fore Coffee Tentrem Mall Semarang',
  },
  {
    id: 'fore-jkt-01',
    name: 'Fore Coffee - Grand Indonesia',
    city: 'Jakarta',
    address: 'Grand Indonesia West Mall Lt. 3A, Jl. M.H. Thamrin No. 1',
    lat: -6.1952,
    lng: 106.8203,
    googleMapsQuery: 'Fore Coffee Grand Indonesia',
  },
  {
    id: 'fore-sby-01',
    name: 'Fore Coffee - Tunjungan Plaza',
    city: 'Surabaya',
    address: 'Tunjungan Plaza 3 Lt. LG, Jl. Embong Malang No. 7-21',
    lat: -7.2618,
    lng: 112.7388,
    googleMapsQuery: 'Fore Coffee Tunjungan Plaza Surabaya',
  },
];

// 3. TOMORO COFFEE DATA
const TOMORO_COFFEE_MENUS: MenuItem[] = [
  {
    id: 'tmr-01',
    name: 'Tomoro Aren Latte',
    description: '100% biji kopi Arabika berkualitas tinggi dengan susu segar dan aren alami.',
    basePrice: 18000,
    imageUrl: '/images/kopi-kenangan-cup.png',
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
          { id: 'large', name: 'Large', priceDelta: 4000 },
        ],
      },
    ],
  },
  {
    id: 'tmr-02',
    name: 'Coconut Aren Latte',
    description: 'Kopi aromatik dipadu air kelapa murni dan gula aren yang menyegarkan.',
    basePrice: 22000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Coffee',
    isAvailable: true,
  },
  {
    id: 'tmr-03',
    name: 'Master S.O.E. Americano',
    description: 'Single Origin Espresso pilihan master barista internasional.',
    basePrice: 20000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Master Series',
    isAvailable: true,
  },
  {
    id: 'tmr-04',
    name: 'Tomoro Oat Latte',
    description: 'Paduan lembut kopi arabika dengan susu oat premium bebas laktosa.',
    basePrice: 24000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Oat Series',
    isAvailable: true,
  },
  {
    id: 'tmr-05',
    name: 'Chocolate Toast',
    description: 'Roti panggang garing dengan cokelat lumer premium.',
    basePrice: 15000,
    imageUrl: '/images/kopi-kenangan-cup.png',
    category: 'Toast',
    isAvailable: true,
  },
];

const TOMORO_BRANCHES = [
  {
    id: 'tmr-smg-01',
    name: 'Tomoro Coffee - Tembalang',
    city: 'Semarang',
    address: 'Jl. Prof. Soedarto No. 12, Tembalang, Banyumanik',
    lat: -7.0495,
    lng: 110.4378,
    googleMapsQuery: 'Tomoro Coffee Tembalang Semarang',
  },
  {
    id: 'tmr-smg-02',
    name: 'Tomoro Coffee - Simpang Lima',
    city: 'Semarang',
    address: 'Jl. Ahmad Yani No. 140, Karangkidul, Semarang Tengah',
    lat: -6.9918,
    lng: 110.4265,
    googleMapsQuery: 'Tomoro Coffee Simpang Lima Semarang',
  },
  {
    id: 'tmr-smg-03',
    name: 'Tomoro Coffee - Puri Anjasmoro',
    city: 'Semarang',
    address: 'Jl. Anjasmoro Raya No. 38, Karangayu, Semarang Barat',
    lat: -6.9745,
    lng: 110.3951,
    googleMapsQuery: 'Tomoro Coffee Puri Anjasmoro Semarang',
  },
  {
    id: 'tmr-jkt-01',
    name: 'Tomoro Coffee - Tebet Raya',
    city: 'Jakarta',
    address: 'Jl. Tebet Raya No. 45, Tebet Timur, Jakarta Selatan',
    lat: -6.2275,
    lng: 106.8569,
    googleMapsQuery: 'Tomoro Coffee Tebet Raya',
  },
  {
    id: 'tmr-bdg-01',
    name: 'Tomoro Coffee - Dago Dipatiukur',
    city: 'Bandung',
    address: 'Jl. Dipatiukur No. 82, Coblong, Kota Bandung',
    lat: -6.8921,
    lng: 107.6184,
    googleMapsQuery: 'Tomoro Coffee Dipatiukur Bandung',
  },
];

// EXPORT BRANDS
export const BRANDS: BrandInfo[] = [
  {
    id: 'kopi-kenangan',
    name: 'Kopi Kenangan',
    slug: 'kopi-kenangan',
    tagline: 'Kopi Mantan Paling Pas di Lidah',
    logoUrl: '/brands/kopi-kenangan.png',
    themeColor: '#1c1917',
    categories: ['Coffee', 'Non-Coffee', 'Snacks'],
    menus: KOPI_KENANGAN_MENUS,
    defaultWhatsApp: '6281234567890',
    branches: kopiKenanganRaw as any,
  },
  {
    id: 'fore-coffee',
    name: 'Fore Coffee',
    slug: 'fore-coffee',
    tagline: 'Grind the Essentials, Brew the Best',
    logoUrl: '/brands/fore-coffee.png',
    themeColor: '#0a422a',
    categories: ['Coffee', 'Non-Coffee', 'Bakery'],
    menus: FORE_COFFEE_MENUS,
    defaultWhatsApp: '6281234567891',
    branches: FORE_BRANCHES,
  },
  {
    id: 'tomoro-coffee',
    name: 'Tomoro Coffee',
    slug: 'tomoro-coffee',
    tagline: 'Tomoro Soon, Master of Coffee',
    logoUrl: '/brands/tomoro-coffee.png',
    themeColor: '#e05d26',
    categories: ['Coffee', 'Master Series', 'Oat Series', 'Toast'],
    menus: TOMORO_COFFEE_MENUS,
    defaultWhatsApp: '6281234567892',
    branches: TOMORO_BRANCHES,
  },
];

// Helper untuk menghasilkan daftar Outlet berdasarkan Brand
export function getOutletsByBrand(brand: BrandInfo): Outlet[] {
  return brand.branches.map((b) => ({
    id: b.id,
    slug: brand.slug,
    name: b.name,
    brand: brand.name,
    tagline: brand.tagline,
    logoUrl: brand.logoUrl,
    bannerUrl: '',
    whatsappNumber: brand.defaultWhatsApp,
    address: b.address,
    googleMapsQuery: b.googleMapsQuery || b.name,
    location: {
      lat: b.lat,
      lng: b.lng,
      city: b.city,
    },
    openingHours: '08:00 - 22:00',
    isActive: true,
    categories: brand.categories,
    menus: brand.menus,
  }));
}
