# Dokumentasi Modul: usePropertiesFetching Hook

## 1. Deskripsi Singkat
`usePropertiesFetching` adalah custom React Hook yang digunakan untuk mengambil data properti dari backend, memformatnya ke dalam struktur `ICatalogData`, dan menyediakan data tersebut ke komponen lain yang memerlukannya.

Hook ini membantu memisahkan logika pengambilan dan transformasi data dari komponen presentasi, sehingga kode menjadi lebih modular dan mudah diuji.

---

## 2. Dependensi
- **React Hooks:** `useEffect`, `useState`
- **Konstanta:** `BACKEND_LOCALHOST` (URL backend API)
- **Tipe Data:**
  - `Property` – tipe data mentah properti dari backend
  - `ICatalogData`, `ITransVersion` – tipe data hasil format
- **Library Tambahan:**
  - `cheerio/lib/api/traversing` (hanya diimpor, tidak digunakan dalam kode ini)

---

## 3. Fungsi Utama

### a. formatPropertiesForCatalog(properties: Property[]): ICatalogData[]
Fungsi ini berfungsi untuk mengonversi data properti mentah dari backend (`Property`) menjadi struktur data `ICatalogData` yang siap digunakan di frontend.

**Langkah-langkah:**
1. Mengecek apakah `properties` ada, jika tidak, mengembalikan array kosong.
2. Melakukan iterasi setiap item `property` untuk:
   - Parsing data alamat (`address`) dari JSON string jika perlu.
   - Menentukan koordinat `latitude` dan `longitude`.
   - Menyusun struktur lengkap data properti (seperti `price`, `address`, `specifications`, `images`, dan lainnya).

**Contoh Output Sederhana:**
```json
{
  "id": "123",
  "name": "Rumah Minimalis",
  "price": "500000000",
  "visibility": true,
  "address": { "en": "Jl. Raya Lumajang", "id": "Jl. Raya Lumajang" },
  "location": { "lat": "-8.125", "lng": "113.226" },
  "table": { "bedrooms": 3, "bathrooms": 2 },
  "images": [],
  "status": "AVAILABLE"
}
```

---

### b. usePropertiesFetching()
Hook utama untuk mengambil data properti dari backend.

**Alur kerja:**
1. Inisialisasi state:
   - `data`: berisi array hasil format data properti.
   - `loading`: status pemuatan (true/false).
2. Menggunakan `useEffect` untuk melakukan fetch ke endpoint `${BACKEND_LOCALHOST}/properties`.
3. Jika data berhasil diambil:
   - Data diubah menjadi format `ICatalogData` menggunakan `formatPropertiesForCatalog`.
   - Disimpan ke state `data`.
4. Jika terjadi error selain `AbortError`, akan dicetak ke konsol.
5. Mengembalikan fungsi cleanup untuk membatalkan fetch jika komponen di-unmount.

**Nilai Kembalian:**
```ts
{
  data: ICatalogData[],
  loading: boolean
}
```

**Contoh Penggunaan:**
```tsx
import usePropertiesFetching from '@/hooks/usePropertiesFetching';

function CatalogPage() {
  const { data, loading } = usePropertiesFetching();

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      {data.map((property) => (
        <div key={property.id}>
          <h3>{property.name}</h3>
          <p>Harga: Rp {property.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Catatan
- Pastikan nilai `BACKEND_LOCALHOST` sudah sesuai dengan alamat server backend yang aktif.
- Impor `add` dari `cheerio` tampaknya tidak digunakan dan bisa dihapus untuk menjaga kebersihan kode.
- Error handling bisa diperluas untuk menampilkan pesan di UI.
