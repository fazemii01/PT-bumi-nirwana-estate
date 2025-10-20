# Dokumentasi Hook usePropertiesPhoto

## Deskripsi
Hook `usePropertiesPhoto` berfungsi untuk mengambil data properti dari API berdasarkan filter yang ditentukan. Hook ini mengelola status loading dan error, serta mengembalikan data yang diperoleh dari server.

## Parameter
- **filters**: Objek berisi parameter filter untuk pencarian properti.

## State
- **data**: Menyimpan hasil data properti yang diambil dari API.
- **loading**: Boolean yang menunjukkan apakah proses pengambilan data sedang berlangsung.
- **error**: Menyimpan pesan error jika terjadi kesalahan saat fetch data.

## Fungsi Utama
1. **fetchData()**  
   Fungsi utama yang melakukan fetch ke endpoint `/api/properties` menggunakan query berdasarkan `filters`.

## Flow
1. Saat komponen di-render atau `filters` berubah, `useEffect` akan memicu `fetchData`.
2. `loading` diset ke `true` sebelum data diambil.
3. Jika fetch berhasil, data disimpan ke state `data`.
4. Jika fetch gagal, state `error` diisi dengan pesan error.
5. Setelah proses selesai, `loading` diubah menjadi `false`.

## Return Value
Hook mengembalikan objek:
```ts
{
  data,
  loading,
  error
}
```

## Contoh Penggunaan
```tsx
const { data, loading, error } = usePropertiesFetching(filters);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

return (
  <div>
    {data.map((property) => (
      <PropertyCard key={property.id} {...property} />
    ))}
  </div>
);
```
