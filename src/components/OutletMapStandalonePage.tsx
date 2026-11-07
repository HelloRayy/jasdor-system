import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  IconCurrentLocation,
  IconMapPin,
  IconArrowLeft,
  IconSearch,
  IconCheck,
} from '@tabler/icons-react';
import type { Outlet } from '../types/catalog';
import { calculateDistanceKm, formatDistance } from '../utils/geo';

// Marker kustom untuk posisi user
const userLocationIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `<div style="position:relative; width:24px; height:24px; display:flex; align-items:center; justify-content:center;">
    <div style="position:absolute; width:24px; height:24px; border-radius:50%; background-color:rgba(37, 99, 235, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    <div style="width:14px; height:14px; border-radius:50%; background-color:#2563eb; border:3px solid #ffffff; box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Marker kustom untuk outlet
const createOutletIcon = (brand: string, isSelected: boolean) => {
  const bg = isSelected ? '#18181b' : '#ffffff';
  const textColor = isSelected ? '#ffffff' : '#18181b';
  const border = isSelected ? '#18181b' : '#d4d4d8';
  const initial = brand.slice(0, 1).toUpperCase();

  return L.divIcon({
    className: 'custom-outlet-marker',
    html: `<div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
      <div style="padding:5px 10px; border-radius:20px; background:${bg}; color:${textColor}; border:1.5px solid ${border}; box-shadow:0 4px 12px rgba(0,0,0,0.18); display:flex; align-items:center; gap:5px; font-weight:700; font-size:11px; white-space:nowrap;">
        <span style="display:inline-block; width:15px; height:15px; border-radius:50%; background:#10b981; color:#fff; text-align:center; line-height:15px; font-size:9px;">${initial}</span>
        ${brand}
      </div>
      <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid ${border}; margin-top:-1px;"></div>
    </div>`,
    iconSize: [64, 34],
    iconAnchor: [32, 34],
  });
};

function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

interface OutletMapStandalonePageProps {
  outlets: Outlet[];
  currentOutlet: Outlet;
  onSelectOutlet: (outlet: Outlet) => void;
  onBack: () => void;
}

export const OutletMapStandalonePage: React.FC<OutletMapStandalonePageProps> = ({
  outlets,
  currentOutlet,
  onSelectOutlet,
  onBack,
}) => {
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    currentOutlet.location.lat,
    currentOutlet.location.lng,
  ]);
  const [zoom, setZoom] = useState(13);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [activeOutlet, setActiveOutlet] = useState<Outlet>(currentOutlet);

  // Otomatis deteksi GPS saat halaman peta dibuka
  React.useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserCoords(coords);
          setMapCenter(coords);
          setZoom(14);
          setIsLocating(false);

          // Otomatis set active outlet ke gerai yang paling dekat dari koordinat user
          let closest = currentOutlet;
          let minDistance = Infinity;
          outlets.forEach((o) => {
            const d = calculateDistanceKm(coords[0], coords[1], o.location.lat, o.location.lng);
            if (d < minDistance) {
              minDistance = d;
              closest = o;
            }
          });
          setActiveOutlet(closest);
        },
        () => {
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, [outlets, currentOutlet]);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung geolokasi.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserCoords(coords);
        setMapCenter(coords);
        setZoom(14);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert('Gagal mendeteksi lokasi otomatis. Anda tetap bisa memilih langsung dari peta.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const brands = ['All', ...Array.from(new Set(outlets.map((o) => o.brand)))];

  const sortedOutlets = outlets
    .filter((o) => {
      const matchBrand = selectedBrandFilter === 'All' || o.brand === selectedBrandFilter;
      const matchSearch =
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBrand && matchSearch;
    })
    .map((o) => {
      const dist = userCoords
        ? calculateDistanceKm(userCoords[0], userCoords[1], o.location.lat, o.location.lng)
        : calculateDistanceKm(
            currentOutlet.location.lat,
            currentOutlet.location.lng,
            o.location.lat,
            o.location.lng
          );
      return { ...o, distanceKm: dist };
    })
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  return (
    <div className="relative w-full h-[100dvh] flex flex-col bg-stone-100 overflow-hidden font-sans">
      {/* 1. Top Floating Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-3 sm:p-4 pointer-events-none">
        <div className="max-w-md mx-auto space-y-2 pointer-events-auto">
          {/* Baris Navigasi & Search */}
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-stone-200/80">
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <IconArrowLeft size={18} stroke={2} />
            </button>

            <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200/60">
              <IconSearch size={16} className="text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari outlet terdekat..."
                className="w-full text-xs bg-transparent border-none outline-none text-stone-900 placeholder:text-stone-400"
              />
            </div>

            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
              title="Lokasi Saya"
            >
              <IconCurrentLocation size={18} className={isLocating ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Baris Filter Brand */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrandFilter(brand)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-md transition-all cursor-pointer ${
                  selectedBrandFilter === brand
                    ? 'bg-stone-900 text-white'
                    : 'bg-white/90 backdrop-blur-sm text-stone-700 hover:bg-white border border-stone-200/70'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Standalone Fullscreen Map Embed */}
      <div className="flex-1 w-full h-full z-0">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <ChangeMapView center={mapCenter} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userCoords && (
            <Marker position={userCoords} icon={userLocationIcon}>
              <Popup>
                <div className="text-xs font-semibold text-blue-600">Lokasi Anda</div>
              </Popup>
            </Marker>
          )}

          {sortedOutlets.map((outlet) => {
            const isSelected = outlet.id === activeOutlet.id;
            return (
              <Marker
                key={outlet.id}
                position={[outlet.location.lat, outlet.location.lng]}
                icon={createOutletIcon(outlet.brand, isSelected)}
                eventHandlers={{
                  click: () => {
                    setActiveOutlet(outlet);
                    setMapCenter([outlet.location.lat, outlet.location.lng]);
                  },
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      {/* 3. Bottom Floating Action Sheet (Card Outlet Terpilih & CTA) */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] p-3 sm:p-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-stone-200/80 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-stone-900 text-white">
                  {activeOutlet.brand}
                </span>
                {activeOutlet.distanceKm !== undefined && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700">
                    {formatDistance(activeOutlet.distanceKm)}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-stone-900 truncate">
                {activeOutlet.name}
              </h3>
              <p className="text-xs text-stone-500 truncate mt-0.5 flex items-center gap-1">
                <IconMapPin size={13} className="shrink-0" />
                <span>{activeOutlet.address}</span>
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <IconCheck size={16} stroke={2.5} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectOutlet(activeOutlet);
              onBack();
            }}
            className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Pilih Gerai Ini & Mulai Pesan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
