## **Dokumen Spesifikasi Teknis: Website Berita Organisasi**

### **1. Tumpukan Teknologi (Tech Stack)**

Website ini akan dibangun menggunakan tumpukan teknologi modern yang disediakan oleh CodeGuide Starter Kit, dengan beberapa penyesuaian untuk kebutuhan spesifik proyek berita.

  * **Framework:** **Next.js 15** (dengan App Router) akan digunakan sebagai kerangka utama untuk membangun antarmuka pengguna yang cepat dan SEO-friendly.
  * **Bahasa:** **TypeScript** akan digunakan untuk memastikan kode yang lebih aman dan mudah dikelola.
  * **Styling:** **Tailwind CSS v4** akan digunakan untuk membangun antarmuka yang responsif dan modern dengan cepat.
  * **Komponen UI:** **shadcn/ui** akan menyediakan koleksi komponen antarmuka yang siap pakai dan dapat disesuaikan.
  * **Autentikasi & Manajemen Pengguna:** **Clerk** akan menangani semua kebutuhan autentikasi, termasuk login, registrasi, dan manajemen sesi untuk halaman admin.
  * **Database:** **Supabase** akan digunakan sebagai basis data utama untuk menyimpan semua konten berita, informasi penulis, dan data terkait lainnya. Supabase juga menyediakan fitur *real-time* jika diperlukan di masa depan.

### **2. Fitur-fitur Aplikasi**

Aplikasi akan dibagi menjadi dua bagian utama: halaman publik untuk pembaca dan halaman admin untuk manajemen konten.

#### **Fitur Halaman Publik:**

  * **Tampilan Berita Utama:** Menampilkan berita-berita terbaru dan terpopuler di halaman depan.
  * **Daftar Berita:** Halaman yang menampilkan semua berita dengan fitur *pagination*.
  * **Detail Berita:** Halaman untuk membaca satu artikel berita secara lengkap, menampilkan judul, gambar utama, isi konten, nama penulis, dan tanggal publikasi.
  * **Kategori Berita:** Pengguna dapat memfilter berita berdasarkan kategori tertentu (misalnya, "Kegiatan Sosial," "Prestasi," "Pengumuman").
  * **Pencarian Berita:** Fitur pencarian untuk menemukan berita berdasarkan judul atau kata kunci.
  * **Halaman Penulis:** Menampilkan daftar semua penulis dan artikel yang telah mereka tulis.

#### **Fitur Halaman Admin (Dilindungi Autentikasi):**

  * **Dashboard Admin:** Halaman utama setelah admin login, menampilkan ringkasan jumlah berita, kategori, dan penulis.
  * **Manajemen Berita (CRUD):**
      * **Create:** Menambahkan berita baru melalui editor teks.
      * **Read:** Melihat daftar semua berita yang ada.
      * **Update:** Mengedit berita yang sudah ada.
      * **Delete:** Menghapus berita.
  * **Manajemen Kategori:** Admin dapat menambah, mengedit, dan menghapus kategori berita.
  * **Manajemen Penulis:** Admin dapat menambah, mengedit, dan menghapus data penulis.
  * **Unggah Gambar:** Kemampuan untuk mengunggah gambar sebagai *thumbnail* atau gambar pendukung dalam berita.

### **3. Alur Kerja Aplikasi**

#### **Alur Pengguna (Pembaca):**

1.  Pengguna membuka website dan langsung melihat halaman utama yang berisi daftar berita terbaru.
2.  Pengguna dapat mengklik salah satu berita untuk membacanya secara lengkap.
3.  Pengguna dapat menavigasi ke halaman kategori untuk melihat berita berdasarkan topik tertentu.
4.  Pengguna dapat menggunakan fitur pencarian untuk menemukan berita yang spesifik.

#### **Alur Admin (Pengelola Konten):**

1.  Admin mengakses halaman login khusus (misalnya, `/admin/login`).
2.  Admin memasukkan kredensial dan diautentikasi oleh **Clerk**.
3.  Setelah berhasil login, admin diarahkan ke *dashboard* admin.
4.  Di *dashboard*, admin dapat memilih menu untuk mengelola berita, kategori, atau penulis.
5.  Misalnya, untuk menambah berita baru, admin akan membuka formulir pembuatan berita, mengisi judul, konten, memilih kategori, penulis, dan mengunggah gambar, lalu menyimpannya.
6.  Berita yang baru ditambahkan akan langsung tersimpan di **Supabase** dan dapat dilihat oleh publik.

### **4. Skema Database**

Database akan dirancang untuk mendukung semua fitur yang telah disebutkan. Berikut adalah skema dan kode SQL untuk membuat tabel-tabel yang dibutuhkan di Supabase.

#### **Tabel `authors`**

Menyimpan informasi tentang penulis berita.

```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Tabel `categories`**

Menyimpan kategori-kategori berita.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Tabel `articles`**

Tabel utama untuk menyimpan semua artikel berita.

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Aturan Keamanan (Row Level Security - RLS)**

Meskipun halaman admin akan dilindungi oleh Clerk, kita tetap akan menerapkan RLS di Supabase sebagai lapisan keamanan tambahan. Untuk proyek berita ini, tabel `articles`, `categories`, dan `authors` perlu dapat dibaca oleh publik, namun hanya admin yang dapat memodifikasinya.

Karena starter kit ini sudah mengintegrasikan Clerk dengan Supabase, kita bisa memanfaatkan `auth.jwt() ->> 'sub'` untuk mengidentifikasi pengguna yang sedang login. Namun, untuk website berita di mana kontennya publik, kita bisa menerapkan aturan yang lebih sederhana.

Berikut adalah contoh SQL untuk mengaktifkan RLS yang memungkinkan semua orang membaca data, tetapi membatasi operasi tulis hanya pada pengguna yang terautentikasi (yang dalam kasus ini adalah admin).

```sql
-- Aktifkan RLS untuk semua tabel
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Izinkan semua orang membaca (SELECT) data
CREATE POLICY "Allow public read access" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON authors FOR SELECT USING (true);

-- Hanya izinkan pengguna yang terautentikasi untuk melakukan operasi tulis (INSERT, UPDATE, DELETE)
-- Anda perlu menambahkan peran 'admin' atau 'editor' di Supabase Auth untuk ini
-- atau cukup andalkan `authenticated` jika semua pengguna yang bisa login adalah admin.
CREATE POLICY "Allow write access for authenticated users" ON articles FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for authenticated users" ON categories FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for authenticated users" ON authors FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

```

