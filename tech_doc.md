1. Ringkasan Proyek (Project Summary)
Proyek ini bertujuan untuk membangun sebuah website modern sebagai platform dokumentasi semua kegiatan organisasi. Website ini akan berfungsi layaknya portal berita, di mana setiap kegiatan disajikan sebagai sebuah artikel. Desain antarmuka akan mengadopsi gaya minimalis modern dengan tema cerah, menonjolkan dua elemen utama: Navbar bergaya Dynamic Island dan efek visual Liquid Glass (Glassmorphism).

Sistem akan didukung oleh Supabase sebagai backend, menggunakan database PostgreSQL. Terdapat halaman admin yang terlindungi oleh sistem otentikasi (login) untuk mengelola konten kegiatan melalui operasi CRUD (Create, Read, Update, Delete). Proyek ini akan dikembangkan sebagai static site dan direncanakan untuk di-deploy menggunakan GitHub Pages.

2. Tumpukan Teknologi (Tech Stack)
Berikut adalah teknologi yang direkomendasikan untuk membangun proyek ini agar optimal, modern, dan sesuai dengan target deployment di GitHub Pages.

Frontend Framework: Next.js (dengan Static Export)

Alasan: Next.js sangat powerful dan bisa menghasilkan situs statis (HTML, CSS, JS) murni yang sempurna untuk GitHub Pages. Memberikan pengalaman development yang luar biasa (DX) dan performa website yang cepat (Core Web Vitals).

Bahasa: TypeScript

Alasan: Menambahkan type-safety pada JavaScript, mengurangi bug, dan membuat kode lebih mudah dikelola seiring waktu.

Styling: Tailwind CSS

Alasan: Sangat cocok untuk membangun desain minimalis modern dengan cepat. Memudahkan pembuatan efek Glassmorphism dan desain responsif.

Backend as a Service (BaaS): Supabase

Alasan: Menyediakan semua yang kita butuhkan: Database PostgreSQL, Otentikasi, dan File Storage. Kebijakan RLS-nya menjadi kunci keamanan karena semua akses data dilakukan dari sisi klien (browser).

Deployment: GitHub Pages & GitHub Actions

Alasan: Hosting gratis untuk situs statis, terintegrasi penuh dengan workflow development di GitHub. GitHub Actions akan mengotomatiskan proses build dan deploy setiap kali ada perubahan di kode.

3. Fitur-fitur Utama (Main Features)
A. Fitur untuk Pengguna Publik (Public-Facing Features)

Halaman Utama (Homepage)

Menampilkan daftar semua kegiatan yang telah dipublikasikan dalam format grid atau list yang menarik.

Setiap item menampilkan judul, gambar utama, dan ringkasan singkat.

Paginasi atau infinite scroll untuk memuat kegiatan yang lebih lama.

Halaman Detail Kegiatan

Ketika sebuah kegiatan di-klik dari halaman utama, pengguna akan diarahkan ke halaman detailnya.

Menampilkan judul, gambar utama, konten lengkap kegiatan, tanggal publikasi, dan nama penulis/kontributor.

URL yang bersih dan SEO-friendly (contoh: domain.com/kegiatan/judul-kegiatan-disini).

Desain Antarmuka (UI/UX)

Dynamic Island Navbar: Navbar di bagian atas yang tidak statis. Bisa bereaksi (misalnya, membesar atau menampilkan notifikasi) saat di-scroll atau saat ada interaksi tertentu.

Efek Liquid Glass (Glassmorphism): Penggunaan efek blur transparan pada beberapa elemen (seperti card, sidebar, atau navbar itu sendiri) untuk memberikan kesan modern dan berlapis.

Tema Cerah & Minimalis: Palet warna dominan putih atau warna terang lainnya, tipografi yang bersih, dan tata letak yang tidak ramai.

Desain Responsif: Tampilan website akan beradaptasi dengan baik di berbagai ukuran layar (desktop, tablet, dan mobile).

Akses Publik Penuh: Tidak ada sistem login/registrasi untuk pengguna umum. Semua konten yang berstatus "published" dapat diakses secara bebas tanpa perlu membuat akun.

B. Fitur untuk Halaman Admin (Admin-Only Features)

Halaman Login Aman

Halaman terpisah (contoh: domain.com/admin) yang menjadi satu-satunya gerbang otentikasi di seluruh website.

Hanya pengguna yang terdaftar sebagai 'admin' yang dapat masuk.

Dashboard Admin

Setelah login, admin akan diarahkan ke dashboard utama.

Menampilkan ringkasan data dan daftar semua kegiatan (baik yang sudah dipublikasi maupun yang masih draf) dalam bentuk tabel.

Manajemen Konten (CRUD)

Create: Tombol untuk membuat artikel kegiatan baru. Dilengkapi dengan form input untuk judul, konten (menggunakan rich text editor), dan unggah gambar utama.

Read: Melihat detail kegiatan dari sisi admin.

Update: Mengedit artikel kegiatan yang sudah ada.

Delete: Menghapus artikel kegiatan dengan konfirmasi.

4. Alur Pengguna (User Flow)
A. Alur Pengguna Umum (Public User)

Pengguna mengunjungi halaman utama website.

Melihat daftar kegiatan terbaru.

Meng-klik salah satu judul kegiatan yang menarik.

Diarahkan ke halaman detail kegiatan dan membaca isinya.

Kembali ke halaman utama untuk melihat kegiatan lainnya.

B. Alur Pengguna Admin (Admin User)

Admin mengakses halaman login khusus (misal: domain.com/admin).

Memasukkan email dan password, lalu klik "Login".

Sistem memverifikasi kredensial. Jika valid, admin diarahkan ke Dashboard Admin.

Dari dashboard, admin bisa melakukan operasi Create, Update, atau Delete pada kegiatan.

Setelah selesai, admin dapat melakukan Logout untuk keluar dari sesi.