import { OpenPlaces } from 'openplaces';
import fs from 'fs';
import path from 'path';

// Helper sleep acak agar perilaku scraper mirip manusia dan anti-rate-limit
function randomDelay(minMs = 800, maxMs = 1800) {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function syncRealKopiKenanganFromGoogleMaps(cities = ['Semarang', 'Surabaya', 'Jakarta']) {
  console.log('Memulai scraping resmi Google Maps via OpenPlaces (Anti-Rate-Limit)...');
  const op = new OpenPlaces();
  const allBranches = [];
  const seenPlaceIds = new Set();

  for (const city of cities) {
    console.log(`Mengambil cabang Kopi Kenangan di ${city}...`);
    const query = `Kopi Kenangan in ${city}`;

    try {
      let cityCount = 0;
      for await (const place of op.places.stream(query)) {
        if (!place.id || seenPlaceIds.has(place.id)) continue;
        seenPlaceIds.add(place.id);

        allBranches.push({
          id: place.id,
          name: place.name,
          googleMapsQuery: place.name,
          address: place.address || `${place.street || ''}, ${place.city || city}`,
          lat: place.latitude,
          lng: place.longitude,
          city: place.city || city,
          rating: place.rating,
          phone: place.phone || '6281234567890',
          imageUrl: place.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80',
        });

        cityCount++;
        // Delay acak per request batch internal
        await randomDelay(300, 700);
      }
      console.log(`Berhasil mengambil ${cityCount} cabang resmi di ${city}.`);
    } catch (err) {
      console.error(`Gagal scraping di ${city}:`, err.message);
    }

    // Jeda antar kota agar aman dari deteksi Google
    await randomDelay(1500, 3000);
  }

  const outputPath = path.resolve('src/data/kopiKenanganBranches.json');
  fs.writeFileSync(outputPath, JSON.stringify(allBranches, null, 2), 'utf-8');
  console.log(`Selesai! Total ${allBranches.length} cabang Google Maps tersimpan di ${outputPath}`);
}

// Eksekusi jika dijalankan langsung via CLI
syncRealKopiKenanganFromGoogleMaps(['Semarang']);
