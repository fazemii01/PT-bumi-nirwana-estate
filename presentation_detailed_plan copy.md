# Detailed Presentation Plan

## Slide 1: Title Slide
- **Title:** Project PT Bumi Nirwana Estate
- **Subtitle:** A Unified Property Catalog System
- **Presenter:** [Your Name]
- **Date:** [Date of Presentation]

## Slide 2: Introduction - Project Overview
- **Content:**
    - Ringkasan tingkat tinggi dari proyek pengembangan sistem katalog properti terpadu untuk PT Bumi Nirwana Estate.
    - Proyek ini mencakup pengembangan dua platform utama: aplikasi web berbasis React yang sudah ada dan aplikasi mobile baru yang akan dibangun.
    - Kedua platform akan menggunakan satu arsitektur back-end yang sama untuk menjaga konsistensi data dan efisiensi pengembangan.
    - Sistem ini akan menjadi solusi komprehensif untuk manajemen dan penjualan properti perumahan dengan fitur lengkap termasuk katalog produk, denah rumah, informasi harga, dan integrasi peta lokasi.
    - Teknologi chatbot yang sudah ada di web akan diperluas untuk mendukung interaksi pelanggan yang lebih baik.
- **Visuals:**
    - Company Logo (PT Bumi Nirwana Estate)
    - Screenshot of the web application's home page.

## Slide 3: Introduction - Project Goals
- **Content:**
    - **Tujuan Utama Proyek:**
        - Menciptakan platform digital terpadu yang memudahkan pelanggan dalam menemukan dan membeli properti perumahan impian mereka
        - Menyediakan akses lengkap ke informasi properti termasuk foto, denah rumah, harga terkini, dan lokasi strategis
        - Meningkatkan efisiensi tim penjualan dengan sistem manajemen properti yang terintegrasi dan real-time
        - Memperluas jangkauan pasar melalui aplikasi mobile yang dapat diakses kapan saja dan di mana saja
        - Meningkatkan kepercayaan pelanggan dengan transparansi informasi dan layanan yang responsif
    
    - **Manfaat untuk Perusahaan:**
        - Peningkatan konversi penjualan melalui visualisasi properti yang menarik dan informatif
        - Reduksi biaya operasional dengan otomasi proses penjualan dan pemasaran
        - Analisis data pelanggan yang lebih akurat untuk strategi pemasaran yang lebih efektif
        - Brand awareness yang lebih kuat di pasar properti digital
    
    - **Manfaat untuk Pelanggan:**
        - Kemudahan mencari properti sesuai budget dan lokasi yang diinginkan
        - Akses 24/7 ke informasi properti terkini tanpa perlu datang ke lokasi
        - Perbandingan properti yang objektif berdasarkan fitur, harga, dan lokasi
        - Komunikasi langsung dengan agen penjualan melalui fitur chatbot
        - Pengalaman virtual tour yang immersive sebelum keputusan pembelian
- **Visuals:**
    - Icons representing goals (e.g., a target, a checkmark).

## Slide 4: Introduction - Target Audience
- **Content:**
    - **Kelompok Pengguna Utama:**
        - **Calon Pembeli Properti (Primary Users):**
            - Keluarga muda yang mencari rumah pertama dengan budget terjangkau
            - Investor properti yang mencari peluang investasi dengan return tinggi
            - Profesional yang membutuhkan hunian strategis dekat dengan tempat kerja
            - Ekspatriat yang membutuhkan hunian berkualitas di lokasi premium
        
        - **Agen Penjualan (Internal Users):**
            - Tim sales yang membutuhkan akses real-time ke informasi properti
            - Marketing yang membutuhkan materi promosi yang up-to-date
            - Customer service yang membantu pelanggan dalam proses pembelian
        
        - **Developer dan Manajemen (Admin Users):**
            - Tim developer yang mengelola inventory properti
            - Manajemen yang memantau performa penjualan dan analisis pasar
        
        - **Partner dan Stakeholder:**
            - Bank untuk informasi properti yang bisa diajukan KPR
            - Notaris untuk proses legal transaksi properti
            - Kontraktor untuk informasi teknis properti
    
    - **Kebutuhan dan Ekspektasi Masing-masing Kelompok:**
        - Calon pembeli: Informasi yang akurat, mudah dipahami, dan dapat dipercaya
        - Agen penjualan: Akses cepat ke data, kemampuan update informasi real-time
        - Manajemen: Dashboard analitik yang komprehensif untuk pengambilan keputusan
- **Visuals:**
    - Simple personas or icons for each audience segment (e.g., a family for potential buyers, a person in a suit for agents).

## Slide 5: Project Design - System Overview
- **Content:**
    - Arsitektur sistem yang dirancang menggunakan pendekatan microservices dengan satu back-end yang melayani dua front-end berbeda.
    - Sistem ini terdiri dari beberapa komponen utama:
        - **API Gateway**: Menangani semua permintaan dari web dan mobile dengan autentikasi dan otorisasi yang konsisten
        - **Property Service**: Mengelola data properti termasuk gambar, denah, dan informasi detail
        - **User Service**: Manajemen pengguna, autentikasi, dan otorisasi multi-level
        - **Search Service**: Mesin pencarian properti berbasis lokasi, harga, dan spesifikasi
        - **Chatbot Service**: AI-powered customer service untuk menjawab pertanyaan pelanggan
        - **File Storage Service**: Penyimpanan dan distribusi file gambar dan dokumen dengan CDN
        - **Notification Service**: Sistem notifikasi real-time untuk update harga dan promo
    
    - Keamanan sistem dilakukan melalui JWT tokens, rate limiting, dan enkripsi data sensitif.
    - Skalabilitas dijamin melalui load balancing dan caching dengan Redis.
- **Visuals:**
    - The Mermaid diagram from the `presentation.md` file.

## Slide 6: Project Design - Data Model
- **Content:**
    - Model data yang dirancang untuk efisiensi dan fleksibilitas dalam mengelola properti perumahan:
        - **Property Entity**: Struktur utama yang mencakup informasi lengkap properti
            - Identitas properti: ID unik, nama proyek, slug untuk SEO
            - Informasi lokasi: Koordinat geografis, alamat lengkap, aksesibilitas
            - Detail properti: Luas tanah, luas bangunan, jumlah kamar tidur dan kamar mandi
            - Informasi harga: Harga jual, satuan harga, status ketersediaan
            - Media: Array URL untuk foto, denah rumah, dan virtual tour
            - Spesifikasi teknis: Material bangunan, fasilitas, legalitas
    
    - **Supporting Entities:**
        - Developer: Informasi pengembang proyek
        - Agent: Data agen penjualan yang bertanggung jawab
        - User: Profil pengguna dengan role-based access
        - Favorite: Sistem favorit untuk user preferences
        - Search History: Riwayat pencarian untuk personalisasi
    
    - Semua data menggunakan PostgreSQL dengan PostGIS untuk query geografis yang efisien.
- **Visuals:**
    - The data model code block from the `presentation.md` file.

## Slide 7: Project Design - API Contract
- **Content:**
    - **REST API Endpoints yang Tersedia:**
        - `GET /v1/properties` - Mendapatkan daftar properti dengan filter dan pagination
            - Parameter: page, limit, location, price range, property type
            - Response: Array properti dengan metadata pagination
        
        - `GET /v1/properties/:id` - Detail lengkap satu properti
            - Response: Semua informasi properti termasuk media URLs
        
        - `POST /v1/properties` - Tambah properti baru (admin/developer only)
            - Body: Semua field properti dengan validasi
        
        - `PUT /v1/properties/:id` - Update informasi properti
            - Body: Partial update untuk efisiensi
        
        - `DELETE /v1/properties/:id` - Soft delete properti
        
        - `POST /v1/favorites` - Menambahkan properti ke favorit user
        - `GET /v1/favorites` - Daftar properti favorit user
        
        - `GET /v1/search/suggestions` - Auto-complete untuk pencarian
        - `POST /v1/search/nearby` - Properti berdasarkan lokasi terdekat
    
    - **GraphQL API Alternatif:**
        - Query kompleks untuk filtering yang lebih advanced
        - Subscription real-time untuk update harga dan ketersediaan
        - Optimasi dengan field selection untuk mobile bandwidth
    
    - **WebSocket untuk Chatbot:**
        - Real-time messaging dengan thread management
        - Typing indicators dan read receipts
        - File sharing untuk dokumen pendukung
- **Visuals:**
    - The API contract code block from the `presentation.md` file.

## Slide 8: Tech Stack - Back-End
- **Content:**
    - **Framework Utama: NestJS dengan TypeScript**
        - Arsitektur modular yang scalable dan maintainable
        - Dependency injection untuk testing yang mudah
        - Decorator-based routing yang clean dan readable
    
    - **Database: PostgreSQL 15 dengan PostGIS**
        - Query geografis yang powerful untuk pencarian berbasis lokasi
        - Full-text search untuk pencarian nama properti dan lokasi
        - Transaction support untuk integritas data
    
    - **Caching: Redis**
        - Session management untuk user authentication
        - Cache query untuk performa yang optimal
        - Real-time pub/sub untuk notifikasi
    
    - **File Storage: MinIO / AWS S3**
        - CDN integration untuk akses global yang cepat
        - Image optimization dan resizing on-the-fly
        - Backup dan disaster recovery
    
    - **Search Engine: Elasticsearch**
        - Full-text search dengan fuzzy matching
        - Aggregations untuk analitik dan filtering
        - Auto-suggestions untuk user experience yang baik
    
    - **Authentication: JWT dengan Refresh Tokens**
        - Multi-role support (user, agent, admin, developer)
        - OAuth2 integration untuk social login
        - Rate limiting untuk security
    
    - **Real-time: Socket.io**
        - WebSocket untuk chatbot dan notifikasi
        - Room-based messaging untuk support yang terorganisir
        - Presence detection untuk online status
- **Visuals:**
    - Logos of the technologies (NestJS, PostgreSQL, Redis, etc.).

## Slide 9: Tech Stack - Front-End Web
- **Content:**
    - **Framework: Next.js 14 dengan App Router**
        - Server-side rendering untuk SEO yang optimal
        - Static site generation untuk performa yang cepat
        - API routes untuk integrasi yang seamless
    
    - **UI Library: React 18 dengan Concurrent Features**
        - Suspense untuk loading states yang smooth
        - Server components untuk bundle size yang kecil
        - Error boundaries untuk user experience yang baik
    
    - **Styling: TailwindCSS + HeadlessUI**
        - Utility-first CSS untuk development yang cepat
        - Responsive design yang mobile-first
        - Dark mode support untuk preferensi user
    
    - **State Management: Zustand + React-Query**
        - Lightweight state management untuk client state
        - React-Query untuk server state caching yang efisien
        - Offline support dengan background refetching
    
    - **Maps: Mapbox GL JS**
        - Interactive maps dengan custom styling
        - Clustering untuk banyak properti di satu area
        - Geocoding untuk alamat yang akurat
    
    - **Image Handling: Next/Image + Lightbox**
        - Lazy loading untuk performa yang optimal
        - Responsive images untuk berbagai device
        - Zoom functionality untuk detail gambar
    
    - **Chatbot: React-Chatbotify**
        - Customizable UI yang sesuai dengan brand
        - WebSocket integration untuk real-time messaging
        - Typing indicators dan rich media support
- **Visuals:**
    - Logos of the technologies (Next.js, React, TailwindCSS, etc.).

## Slide 10: Tech Stack - Front-End Mobile
- **Content:**
    - **Framework: Flutter 3.22 dengan Dart 3**
        - Cross-platform development untuk iOS dan Android
        - Native performance dengan compiled code
        - Hot reload untuk development yang cepat
    
    - **Architecture: Clean Architecture dengan Riverpod**
        - Separation of concerns untuk maintainability
        - Dependency injection untuk testing yang mudah
        - Reactive state management untuk UI yang responsive
    
    - **Navigation: Auto_route**
        - Type-safe routing dengan generated code
        - Deep linking untuk integrasi dengan web
        - Nested navigation untuk complex flows
    
    - **Networking: Retrofit/Dio**
        - REST API client dengan type safety
        - Interceptors untuk authentication dan logging
        - Offline caching dengan Hive
    
    - **Local Storage: Hive**
        - Lightweight NoSQL database untuk favorites
        - Encrypted storage untuk sensitive data
        - Fast read/write untuk performa yang optimal
    
    - **Maps: Google Maps Flutter**
        - Native maps dengan custom markers
        - Current location dan directions
        - Street view untuk virtual tour
    
    - **Image Handling: Extended Image**
        - Cached network images untuk performa
        - Zoomable image viewer untuk detail
        - Progressive loading untuk user experience
    
    - **Push Notifications: Firebase Cloud Messaging**
        - Real-time updates untuk harga dan promo
        - Targeted notifications berdasarkan preferensi
        - Analytics untuk campaign effectiveness
- **Visuals:**
    - Logos of the technologies (Flutter, Dart, Riverpod, etc.).

## Slide 11: Tech Stack - DevOps & Tooling
- **Content:**
    - **Infrastructure as Code: Terraform**
        - Reproducible infrastructure deployment
        - Multi-environment support (dev, staging, prod)
        - Cost optimization dengan auto-scaling
    
    - **CI/CD: GitHub Actions**
        - Automated testing untuk setiap pull request
        - Deployment otomatis ke staging dan production
        - Build caching untuk waktu build yang cepat
    
    - **Containerization: Docker**
        - Consistent environment dari development ke production
        - Microservices architecture yang scalable
        - Health checks dan monitoring
    
    - **Testing: Multi-layer Testing**
        - Unit tests untuk business logic
        - Integration tests untuk API endpoints
        - E2E tests untuk user flows yang lengkap
    
    - **Code Quality: ESLint + Prettier + Husky**
        - Consistent code style di seluruh tim
        - Pre-commit hooks untuk quality gates
        - Automated code formatting
    
    - **Monitoring: Sentry + Prometheus + Grafana**
        - Error tracking untuk quick issue resolution
        - Performance monitoring untuk optimization
        - Business metrics untuk decision making
    
    - **Security: Dependabot + Code Scanning**
        - Automated security updates
        - Vulnerability scanning untuk dependencies
        - Security best practices enforcement
- **Visuals:**
    - Logos of the tools (GitHub Actions, Docker, Jest, Sentry, etc.).

## Slide 12: 8-Week Sprint Plan (MVP)
- **Content:**
    - **Minggu 0 - Discovery & Planning**
        - Finalisasi requirement dan scope proyek
        - Setup development environment dan tools
        - Kickoff meeting dengan seluruh stakeholder
    
    - **Minggu 1 - Back-End Foundation**
        - Setup NestJS project dengan struktur modular
        - Implementasi database schema dengan PostgreSQL
        - Basic authentication dan authorization system
        - Seed data untuk 5 properti sample
    
    - **Minggu 2 - Media & File Management**
        - Setup MinIO/AWS S3 untuk file storage
        - Implementasi image upload dengan optimization
        - CDN configuration untuk global distribution
        - Image processing pipeline untuk thumbnails
    
    - **Minggu 3 - Web Catalog Development**
        - Property listing page dengan filtering
        - Detail page dengan image gallery dan maps
        - SEO optimization dengan Next.js
        - Responsive design untuk mobile web
    
    - **Minggu 4 - Mobile App Foundation**
        - Flutter project setup dengan clean architecture
        - Basic navigation dan routing structure
        - Catalog screen dengan shared components
        - State management dengan Riverpod
    
    - **Minggu 5 - Maps & Location Features**
        - PostGIS radius queries untuk pencarian lokasi
        - Web: Mapbox clusters untuk visualisasi
        - Mobile: Google Maps dengan custom markers
        - Location-based filtering dan sorting
    
    - **Minggu 6 - Chatbot Integration**
        - WebSocket gateway untuk real-time messaging
        - AI-powered chatbot dengan property knowledge base
        - UI implementation untuk web dan mobile
        - Conversation history dan context management
    
    - **Minggu 7 - Polish & Quality Assurance**
        - Offline mode untuk mobile app
        - Performance optimization dan caching
        - Comprehensive testing (unit, integration, E2E)
        - Security audit dan penetration testing
    
    - **Minggu 8 - Deployment & Launch**
        - Production deployment untuk web dan mobile
        - Monitoring dan performance tuning
        - User feedback collection dan bug fixing
        - Perencanaan untuk v1.1 (fitur tambahan)
- **Visuals:**
    - A timeline or a Gantt chart to visualize the sprint plan.

## Slide 13: Risk Register
- **Content:**
    - **Risiko Teknis:**
        - **Biaya penyimpanan gambar:** Mitigasi dengan kompresi gambar saat upload dan penggunaan format WebP.
        - **Akurasi lokasi:** Mitigasi dengan menggunakan Google Place ID sebagai fallback.
        - **Halusinasi Chatbot:** Mitigasi dengan menambahkan opsi "human hand-off" setelah 3 jawaban yang gagal.
        - **Kebijakan toko aplikasi seluler:** Mitigasi dengan memastikan navigasi asli dan bukan hanya aplikasi WebView.
    - **Risiko Proyek:**
        - **Perubahan Lingkup (Scope Creep):** Mitigasi dengan proses manajemen perubahan yang ketat dan komunikasi yang jelas dengan pemangku kepentingan.
        - **Keterlambatan Jadwal:** Mitigasi dengan perencanaan sprint yang realistis, pemantauan kemajuan harian, dan alokasi sumber daya buffer.
        - **Ketersediaan Sumber Daya:** Mitigasi dengan perencanaan kapasitas tim dan identifikasi sumber daya cadangan.
- **Visuals:**
    - A table with two columns: "Risk" and "Mitigation".

## Slide 14: Hand-off Checklist
- **Content:**
    - **Dokumentasi:**
        - [ ] Skema OpenAPI & GraphQL digabungkan ke branch utama
        - [ ] `.env.example` & README untuk setiap repositori
        - [ ] Dokumentasi arsitektur sistem
        - [ ] Panduan pengguna untuk admin dan agen
    - **Kode & Repositori:**
        - [ ] Badge GitHub Actions berwarna hijau (semua tes lulus)
        - [ ] DSN Sentry dikonfigurasi untuk staging & produksi
        - [ ] Akses ke semua repositori diberikan kepada tim internal
    - **Aset & Akun:**
        - [ ] Aset toko aplikasi (screenshot, kebijakan privasi) siap
        - [ ] Kepemilikan akun layanan pihak ketiga (AWS, Vercel, Mapbox) ditransfer
- **Visuals:**
    - A checklist with items to be ticked off.

## Slide 15: Q&A
- **Content:**
    - "Terima Kasih"
    - "Ada Pertanyaan?"
- **Visuals:**
    - Company Logo