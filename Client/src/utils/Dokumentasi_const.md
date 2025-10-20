# Dokumentasi: const.ts

File `const.ts` berisi sekumpulan konstanta yang digunakan di seluruh proyek untuk menjaga konsistensi nilai dan mempermudah pemeliharaan kode. Konstanta ini meliputi breakpoint responsif, URL backend, simbol mata uang, serta pengaturan lingkungan (environment).

## Daftar Konstanta

### 1. `MOBILE_BREAKPOINT`
- **Nilai:** `568`
- **Deskripsi:** Menentukan lebar maksimum (dalam piksel) untuk tampilan perangkat mobile.  
  Biasanya digunakan dalam logika *responsive design* seperti media query atau komponen React.

### 2. `TABLET_BREAKPOINT`
- **Nilai:** `1022`
- **Deskripsi:** Lebar maksimum untuk tampilan perangkat tablet.

### 3. `LAPTOP_BREAKPOINT`
- **Nilai:** `1420`
- **Deskripsi:** Lebar maksimum untuk tampilan perangkat laptop.

### 4. `IS_PRODUCTION`
- **Nilai:** `process.env.NODE_ENV === 'production'`
- **Deskripsi:** Boolean yang menunjukkan apakah aplikasi sedang dijalankan dalam mode *production* atau *development*.  
  Berguna untuk menentukan perilaku tertentu seperti logging, URL API, dan konfigurasi build.

### 5. `USD_SYMBOL`
- **Nilai:** `'$'`
- **Deskripsi:** Simbol mata uang default yang digunakan di aplikasi.

### 6. `PRODUCTION_LINK`
- **Nilai:** `'https://pt-bumi-nirwana-estate.vercel.app/'`
- **Deskripsi:** URL utama aplikasi pada mode *production*.

### 7. `CATALOG_NAME`
- **Nilai:** `'catalog'`
- **Deskripsi:** Nama atau slug default yang digunakan untuk katalog properti.

### 8. `BACKEND_LOCALHOST`
- **Nilai:**
  ```ts
  IS_PRODUCTION ? PRODUCTION_LINK : 'http://localhost:5000';
  ```
- **Deskripsi:** Menentukan base URL backend berdasarkan mode aplikasi:
  - Jika *production*: menggunakan `PRODUCTION_LINK`.
  - Jika *development*: menggunakan `'http://localhost:5000'`.

## Tujuan File
File ini membantu menjaga *clean code* dengan:
- Menghindari penggunaan nilai hard-coded di banyak tempat.
- Mempermudah pengaturan ulang konfigurasi proyek.
- Mendukung pengembangan multi-environment (local vs production).

## Contoh Penggunaan

```ts
import { BACKEND_LOCALHOST, MOBILE_BREAKPOINT } from '@utils/const';

console.log('Base API URL:', BACKEND_LOCALHOST);
console.log('Mobile breakpoint:', MOBILE_BREAKPOINT);
```
