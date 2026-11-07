# PRD: Platform Pemesanan Multi-Outlet via WhatsApp

Nov 7, 2026 · @Raditya Rayhan

## Ringkasan & Latar Belakang

Produk ini adalah website katalog multi-outlet (contoh: Kopi Kenangan, Fore) yang mengubah pilihan menu pembeli menjadi satu pesan WhatsApp terstruktur, siap kirim ke penjual tanpa mengetik manual.

**Masalah di sisi pembeli**

- Menu dan harga tersebar sebagai gambar di Instagram atau chat, sehingga harus dibuka satu per satu.
- Pesanan diketik manual: nama item, varian, jumlah, catatan. Mudah ada yang terlewat.
- Alamat dan data diri diketik ulang di setiap pesanan.
- Total harga dihitung sendiri, sering meleset.

**Masalah di sisi penjual**

- Format pesan berbeda-beda di tiap pembeli, jadi penjual sering membalas "maksudnya yang mana kak?".
- Alamat tidak lengkap atau tanpa titik lokasi.
- Pencatatan pesanan manual rawan salah.

**Solusi**

Pembeli memilih outlet, menambah item ke keranjang, mengisi data pengiriman sekali, lalu menekan satu tombol. WhatsApp terbuka dengan pesan yang sudah tersusun rapi ke nomor penjual. Penjual cukup membaca, mengonfirmasi, dan memproses.

Platform ini tidak mengambil alih transaksi di tahap awal. Pembayaran dan konfirmasi tetap terjadi di WhatsApp antara pembeli dan penjual, sehingga biaya pembangunan dan risiko operasional tetap kecil.

## Tujuan, Non-Tujuan & Metrik

Tujuan utama: pembeli bisa dari buka website sampai kirim pesan WhatsApp dalam waktu singkat, dan penjual menerima pesanan yang langsung bisa diproses tanpa bertanya ulang.

**Tujuan**

- Menggantikan proses lihat menu gambar dan ketik pesanan manual dengan keranjang digital.
- Menghasilkan satu format pesan WhatsApp yang konsisten dan lengkap.
- Menyimpan data pembeli (nama, nomor, alamat) agar pesanan berikutnya tinggal klik.
- Mengumpulkan banyak outlet dalam satu tempat sehingga pembeli tidak perlu mencari menu di tiap akun.

**Non-tujuan (tahap MVP)**

- Pembayaran online atau payment gateway.
- Pelacakan pesanan real-time dan manajemen kurir.
- Aplikasi mobile native. MVP berupa web yang ramah ponsel.
- Dashboard penjual penuh. Penjual hanya menerima pesan di WhatsApp.

**Metrik keberhasilan**

| Metrik | Definisi | Target awal |
| --- | --- | --- |
| Konversi checkout | Sesi yang menekan tombol kirim WhatsApp dibanding sesi yang menambah item | 25% atau lebih |
| Waktu ke pesan | Dari membuka halaman outlet sampai menekan kirim | Di bawah 2 menit |
| Pembeli berulang | Pembeli yang memesan lagi dalam 30 hari | 30% atau lebih |
| Pesanan tanpa tanya ulang | Pesanan yang penjual tidak perlu klarifikasi (survei penjual) | 80% atau lebih |
| Kelengkapan alamat | Pesanan dengan alamat dan titik lokasi terisi | 95% atau lebih |

Target di atas adalah asumsi awal untuk dikalibrasi setelah ada data sebulan pertama.

## Target Pengguna & Persona

Ada tiga pihak: pembeli yang memesan, penjual atau outlet yang menerima pesanan, dan admin internal yang mengelola katalog.

| Peran | Siapa | Kebutuhan utama | Kendala saat ini |
| --- | --- | --- | --- |
| Pembeli | Pelajar, pekerja kantoran, ibu rumah tangga yang sering pesan minuman atau makanan lewat chat | Lihat menu dan harga cepat, pesan tanpa mengetik panjang | Menu berupa gambar, harus ketik ulang alamat |
| Penjual / outlet | Pemilik gerai, reseller, atau admin WhatsApp outlet | Pesanan rapi, lengkap, mudah dicatat | Pesan tidak seragam, sering harus tanya ulang |
| Admin platform | Tim internal | Mengelola outlet, menu, harga, dan nomor WhatsApp | Menu berubah, harga berubah, perlu update cepat |

**Persona pembeli: Rina, 26 tahun, pekerja kantoran**

Rina memesan kopi untuk dirinya dan dua rekan tiap siang. Ia malas membuka banyak gambar menu lalu mengetik pesanan satu per satu. Ia ingin memilih, melihat total, dan langsung kirim.

**Persona penjual: Pak Budi, pemilik gerai**

Pak Budi menerima puluhan chat per hari di satu nomor WhatsApp. Ia ingin tiap chat langsung berisi item, jumlah, catatan, alamat, dan total, supaya bisa langsung dibuat tanpa bolak-balik bertanya.

## User Journey & Alur Utama

Pembeli melewati delapan langkah dari memilih outlet sampai penjual mengonfirmasi, dan satu-satunya momen "mengetik" adalah mengisi data diri yang cukup dilakukan sekali.

&#91;embedded content: alur pemesanan · 8 langkah, dari pilih outlet sampai konfirmasi penjual\]

Langkah 1 sampai 6 terjadi di website. Setelah tombol kirim ditekan, WhatsApp terbuka dengan pesan yang sudah tersusun, dan sisanya terjadi di chat.

**Alur alternatif**

- Pembeli berulang: data pembeli sudah tersimpan, jadi langkah 5 dilewati dan form terisi otomatis.
- Outlet tutup atau menu habis: item tampil abu-abu dengan label, dan tidak bisa ditambahkan ke keranjang.
- Pindah outlet saat keranjang berisi: sistem meminta konfirmasi sebelum mengosongkan keranjang.
- Ambil sendiri: bagian alamat dilewati, pesan hanya memuat nama dan nomor HP.
- WhatsApp tidak terpasang: tautan membuka WhatsApp Web, atau pesan bisa disalin lewat tombol salin sebagai cadangan.

## Fitur & User Stories

MVP fokus pada alur pilih menu sampai kirim ke WhatsApp. Fitur lain masuk fase berikutnya.

| ID | User story | Prioritas |
| --- | --- | --- |
| F1 | Sebagai pembeli, saya bisa melihat daftar outlet dan mencari berdasarkan nama atau kategori | MVP |
| F2 | Sebagai pembeli, saya bisa melihat menu dan harga outlet dalam bentuk teks, lengkap dengan foto dan kategori | MVP |
| F3 | Sebagai pembeli, saya bisa memilih varian atau opsi (ukuran, gula, es, topping) dan menulis catatan per item | MVP |
| F4 | Sebagai pembeli, saya bisa mengubah jumlah item di keranjang dan melihat total otomatis | MVP |
| F5 | Sebagai pembeli, saya mengisi nama, nomor, dan alamat sekali, lalu datanya tersimpan di perangkat | MVP |
| F6 | Sebagai pembeli, saya bisa memilih ambil sendiri atau diantar, dan membagikan titik lokasi bila diantar | MVP |
| F7 | Sebagai pembeli, saya menekan satu tombol dan WhatsApp terbuka dengan pesan terstruktur ke nomor penjual | MVP |
| F8 | Sebagai penjual, saya menerima pesan dengan format seragam yang berisi semua detail pesanan | MVP |
| F9 | Sebagai admin, saya bisa menambah atau mengubah outlet, menu, harga, dan nomor WhatsApp lewat panel sederhana | MVP |
| F10 | Sebagai pembeli, saya bisa mengulang pesanan sebelumnya dengan satu klik | Fase 2 |
| F11 | Sebagai pembeli, saya bisa menandai outlet favorit | Fase 2 |
| F12 | Sebagai penjual, saya bisa menandai menu habis atau outlet tutup lewat panel sendiri | Fase 2 |
| F13 | Sebagai pembeli, saya bisa memesan dari beberapa outlet dalam satu sesi tanpa kehilangan keranjang | Fase 2 |
| F14 | Sebagai pembeli, saya bisa membayar lewat QRIS atau e-wallet dalam platform | Fase 3 |
| F15 | Sebagai penjual, saya mendapat dashboard pesanan dan laporan | Fase 3 |

**Aturan bisnis penting**

- Satu keranjang hanya berisi item dari satu outlet. Berpindah outlet mengosongkan keranjang setelah konfirmasi.
- Outlet tutup atau menu ditandai habis tidak bisa dipesan.
- Tombol kirim hanya aktif bila nama, nomor, dan alamat (untuk antar) sudah terisi.
- Platform tidak mengirim pesan atas nama pembeli. Pembeli selalu menekan kirim sendiri di WhatsApp.

## Spesifikasi Format Pesan WhatsApp

Pesan dibuat otomatis dari isi keranjang dan dikirim lewat tautan `https://wa.me/<nomor>?text=<pesan ter-encode>`. Nomor memakai kode negara tanpa tanda plus (contoh: 62812xxxxxxx). Pembeli tetap menekan tombol kirim sendiri di WhatsApp.

**Contoh pesan untuk pesanan antar**

```text
*PESANAN BARU*
Outlet: Fore Coffee - Simpang Lima
No. Pesanan: #FR-0711-0042
Tanggal: 07 Nov 2026, 19:55

*Item*
1. Caffe Latte (Large, Less Sugar, Iced) x2
   @ Rp32.000 = Rp64.000
   Catatan: es dipisah
2. Butter Croissant x1
   @ Rp28.000 = Rp28.000

Subtotal: Rp92.000
Ongkir: ditentukan penjual
*Total item: Rp92.000*

*Data Pembeli*
Nama: Rina
HP: 0812xxxxxxx
Metode: Diantar
Alamat: Jl. Contoh No. 10, RT 02/RW 03, Semarang
Patokan: pagar hijau, depan minimarket
Lokasi: https://maps.google.com/?q=-6.99,110.42

Pembayaran: konfirmasi di chat ini
Mohon konfirmasi pesanan. Terima kasih!
```

**Aturan format**

| Aturan | Keterangan |
| --- | --- |
| Bagian wajib | Nama outlet, daftar item beserta jumlah dan harga, total item, nama pembeli, nomor HP, metode (antar atau ambil) |
| Wajib bila diantar | Alamat lengkap. Patokan dan tautan lokasi sangat disarankan |
| Nomor pesanan | Dibuat sistem, berguna sebagai rujukan di chat dan pencatatan |
| Format teks | Memakai penebalan WhatsApp dengan tanda bintang, tanpa emoji dan simbol khusus agar tampil sama di semua perangkat |
| Panjang pesan | Dijaga di bawah sekitar 1.500 karakter agar tautan tidak terpotong. Bila lebih, item diringkas dan pembeli diberi peringatan |
| Pembuatan | Dibuat di sisi klien dari data keranjang. Penjual dapat memilih templat (lengkap atau ringkas) di fase berikutnya |
| Harga | Harga di pesan adalah harga yang tampil di katalog saat checkout. Penjual berhak mengonfirmasi ulang |

**Pertimbangan**

- Ongkir tidak dihitung otomatis di MVP. Pesan menyebutkan bahwa ongkir ditentukan penjual.
- Bila pembeli menutup WhatsApp tanpa mengirim, pesanan tidak terjadi. Keranjang tetap tersimpan sehingga pembeli bisa mencoba lagi.
- Platform tidak bisa mengetahui apakah pesan benar-benar terkirim. Metrik konversi dihitung dari klik tombol, bukan dari pesan terkirim.

## Kebutuhan Non-Fungsional & Teknis

MVP dibangun sebagai web yang ringan dan mobile-first, karena hampir semua pembeli akan mengakses lewat ponsel dari tautan yang dibagikan di chat atau media sosial.

**Kebutuhan non-fungsional**

| Area | Kebutuhan |
| --- | --- |
| Performa | Halaman menu terbuka di bawah 3 detik pada jaringan 4G biasa. Gambar dikompres dan dimuat bertahap |
| Perangkat | Tampilan utama untuk layar 360 px ke atas. Mendukung Chrome dan Safari versi terbaru di Android dan iOS |
| Ketersediaan | Katalog tetap bisa dibaca dari cache bila koneksi lambat |
| Privasi | Data pembeli disimpan di perangkat (local storage) pada MVP. Tidak ada akun wajib. Perlu persetujuan dan kebijakan privasi bila data mulai disimpan di server |
| Keamanan | Panel admin dengan login. Validasi dan sanitasi semua teks yang masuk ke pesan WhatsApp |
| Bahasa | Bahasa Indonesia sebagai default |
| Analitik | Catat kejadian: lihat outlet, tambah item, buka keranjang, klik kirim WhatsApp |

**Model data (garis besar)**

| Entitas | Atribut utama |
| --- | --- |
| Outlet | id, nama, brand, alamat, nomor WhatsApp, jam buka, status aktif |
| Kategori | id, outlet, nama, urutan |
| Menu | id, kategori, nama, deskripsi, harga dasar, foto, status tersedia |
| Opsi menu | id, menu, grup (ukuran, gula, topping), pilihan, selisih harga |
| Pesanan (log) | id, outlet, isi keranjang, total, waktu klik kirim |
| Pembeli (lokal) | nama, nomor HP, alamat, patokan, titik lokasi |

**Catatan teknis**

- Tautan wa.me dipakai karena tidak memerlukan WhatsApp Business API dan bisa langsung berjalan di MVP. Konsekuensinya, platform tidak bisa mengirim notifikasi otomatis atau membaca balasan.
- Titik lokasi diambil lewat izin lokasi peramban atau pin pada peta, lalu diubah menjadi tautan peta di dalam pesan.
- Pembaruan menu dan harga dilakukan lewat panel admin atau impor spreadsheet agar tidak bergantung pada pengembang.
- Tahap berikutnya bila perlu notifikasi atau status pesanan: WhatsApp Business Platform (Cloud API) dengan templat pesan yang disetujui.

## Risiko, Asumsi, Pertanyaan Terbuka & Tahapan

Risiko terbesar bukan di teknologi, melainkan di sumber data menu dan kesediaan penjual menerima pesanan lewat WhatsApp.

**Risiko**

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Menu, merek, dan foto outlet besar (misalnya Kopi Kenangan, Fore) dipakai tanpa izin | Masalah hak cipta dan merek, permintaan takedown | Minta izin atau kemitraan. Alternatif: awali dengan penjual UMKM atau reseller yang mendaftar sendiri, atau gunakan nama dan harga tanpa logo dan foto resmi |
| Outlet besar tidak menerima pesanan lewat WhatsApp (biasanya lewat aplikasi sendiri) | Pesan tidak punya tujuan | Validasi di tiap outlet sebelum didaftarkan. Fokus ke outlet yang memang melayani pesanan WhatsApp |
| Harga atau menu usang | Pembeli kecewa, penjual menolak harga | Tanggal pembaruan di tiap menu, panel admin yang mudah, pembaruan berkala |
| Pembeli tidak menekan kirim di WhatsApp | Konversi tampak rendah | Tombol jelas, keranjang tersimpan, pengingat bila keranjang ditinggalkan |
| Kontak penjual dipakai salah (spam) | Penjual berhenti ikut | Format pesan rapi, pembatasan jumlah klik per sesi |
| Sumber penghasilan belum jelas | Platform sulit berkelanjutan | Putuskan model bisnis sebelum skala (lihat pertanyaan terbuka) |

**Asumsi**

- Pembeli sudah terbiasa memesan lewat WhatsApp dan nyaman dengan alur kirim manual.
- Penjual bersedia menerima pesanan dengan format baru di nomor WhatsApp yang sudah ada.
- Layanan awal terbatas pada satu kota atau area agar pengantaran dan pendaftaran outlet terkelola.

**Pertanyaan terbuka**

- [ ] Siapa penjualnya: gerai resmi brand besar, atau penjual dan reseller kecil yang mendaftar sendiri?
- [ ] Dari mana data menu berasal: input admin manual, impor spreadsheet, atau penjual mengisi sendiri?
- [ ] Bagaimana platform menghasilkan uang: biaya langganan penjual, komisi, iklan, atau gratis dulu?
- [ ] Apakah ongkir perlu dihitung otomatis sejak MVP, atau cukup ditentukan penjual?
- [ ] Apakah cakupan awal satu kota (misalnya Semarang) atau langsung beberapa kota?

**Tahapan rilis**

1. Fase 0, validasi (1 sampai 2 minggu): wawancara 5 sampai 10 penjual dan pembeli, uji format pesan dengan prototipe.
2. Fase 1, MVP (4 sampai 6 minggu): katalog, keranjang, data pembeli lokal, pesan WhatsApp, panel admin sederhana, 5 sampai 10 outlet.
3. Fase 2, penguatan: pesan ulang, favorit, status menu habis dari penjual, keranjang multi-outlet.
4. Fase 3, monetisasi dan skala: pembayaran, dashboard penjual, perluasan kota, WhatsApp Business API bila diperlukan.

Rentang waktu di atas adalah perkiraan awal dan bergantung pada ukuran tim.
