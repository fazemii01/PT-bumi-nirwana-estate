# Dokumentasi Modul: useMediaQuery Hook

## 1. Deskripsi Singkat
`useMediaQuery` adalah custom React Hook yang berfungsi untuk mendeteksi apakah lebar viewport (layar) saat ini berada di bawah batas tertentu (misalnya 768px untuk perangkat mobile).  
Hook ini mempermudah pembuatan layout *responsive* dengan memanfaatkan *CSS media query* di level JavaScript.

---

## 2. Dependensi
- **React Hooks:**  
  - `useState` — menyimpan status apakah ukuran layar telah mencapai batas target.  
  - `useEffect` — mendaftarkan dan membersihkan event listener saat komponen dimount dan di-unmount.  
  - `useCallback` — mencegah pembuatan ulang fungsi `updateTarget` setiap render.  

---

## 3. Parameter dan Nilai Kembalian
### Parameter:
- `width: number`  
  Batas lebar layar (dalam pixel) yang menjadi acuan media query.

### Nilai Kembalian:
- `boolean`  
  Mengembalikan `true` jika ukuran layar **kurang dari atau sama dengan** nilai `width`, dan `false` jika lebih besar.

---

## 4. Alur Kerja Hook
1. Inisialisasi state `targetReached` sebagai `false`.  
2. Mendefinisikan fungsi `updateTarget` yang akan mengubah state berdasarkan hasil pencocokan media query.  
3. Saat komponen pertama kali dimuat (`useEffect`):
   - Membuat objek `MediaQueryList` dengan `window.matchMedia("(max-width: {width}px)")`.
   - Menambahkan event listener untuk memantau perubahan ukuran layar.
   - Mengecek kondisi awal, jika cocok maka `targetReached` diset `true`.
4. Saat komponen di-unmount, event listener dihapus untuk mencegah memory leak.

---

## 5. Contoh Penggunaan
```tsx
import useMediaQuery from '@/hooks/useMediaQuery';

function Navbar() {
  const isMobile = useMediaQuery(768);

  return (
    <nav>
      {isMobile ? (
        <button>☰</button>
      ) : (
        <ul>
          <li>Beranda</li>
          <li>Tentang</li>
          <li>Kontak</li>
        </ul>
      )}
    </nav>
  );
}
```
Pada contoh di atas, ketika lebar layar kurang dari atau sama dengan **768px**, komponen menampilkan tombol menu hamburger.

---

## 6. Catatan
- Gunakan nilai `width` sesuai dengan breakpoint desain (misalnya 480, 768, 1024).  
- Pastikan hook ini hanya digunakan di dalam komponen React (bukan di luar scope fungsi komponen).  
- Properti `addEventListener` pada `matchMedia` memerlukan browser modern (alternatif lama: `media.addListener`).  
