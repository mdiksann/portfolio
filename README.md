This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Komponen UI dan navbar

Proyek ini sudah memakai TypeScript dan Tailwind CSS v4. Konfigurasi shadcn tersedia di `components.json`, dengan komponen reusable di `src/components/ui` dan styles global di `src/app/globals.css`. Folder UI ini membuat import `@/components/ui/...` konsisten dan memberi shadcn CLI lokasi yang jelas untuk menambahkan komponen.

Untuk menambahkan komponen shadcn lain, jalankan `npx shadcn@latest add <nama-komponen>`. Setup manual mengikuti [panduan shadcn](https://ui.shadcn.com/docs/installation/manual).

`src/components/Header.tsx` memakai `AnimatedNavFramer` dari `src/components/ui/navigation-menu.tsx`. Navbar berada di tengah dan menampilkan menu portofolio beserta tombol EN/ID di dalam menu. Saat scroll turun melewati 150px, navbar mengecil menjadi satu ikon dan menyembunyikan tombol bahasa. Navbar terbuka saat scroll naik lebih dari 80px atau ikon diklik. Menu tetap satu baris dan bisa digeser horizontal di layar kecil. Opacity meredup setelah keluar dari Home, lalu kembali penuh saat hover atau fokus keyboard.

Jalankan `node scripts/check-navigation.mjs` untuk memeriksa perilaku scroll, tombol toggle, link, ukuran mobile, dan akses keyboard saat menu tertutup.

## Getting Started

Salin `.env.example` ke `.env`, lalu isi `PAYLOAD_SECRET` dengan secret milikmu. `DATABASE_URI` memakai SQLite lokal secara default.

Database `payload.db` dan upload di `media/` tidak ikut Git. Simpan atau pindahkan keduanya secara terpisah jika ingin memakai konten CMS yang sama di mesin atau server lain. Database juga menyimpan akun admin. Berkas ikon di `public/` dan `src/app/` tetap disertakan sebagai aset aplikasi.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Blog arsitektur

1. Buka `/admin`, masuk, lalu pilih **Blog → Create New**.
2. Isi judul, ringkasan, dan **Isi artikel**. Seluruh paragraf dan bagian artikel dapat ditambah atau diedit pada kolom ini. Toolbar editor mendukung heading, daftar, tautan, dan upload diagram melalui koleksi Media. Pilih proyek terkait untuk menampilkan tech stack dan menggunakan thumbnail proyek jika cover belum diisi.
3. Ubah **Status** menjadi **Published**, atur tanggal publikasi, lalu simpan. Draft hanya dapat dibaca oleh admin yang masuk; artikel published tampil di `/blog`.
4. Setiap artikel memiliki URL tetap berdasarkan ID, misalnya `/blog/1`, `/blog/2`, dan seterusnya. Salin URL artikel ke field **Repo URL** (`repoUrl`) pada **Projects** agar tombol **View Source** membuka detail arsitektur tersebut. Path relatif seperti `/blog/1` juga dapat digunakan.

Mengubah judul atau urutan artikel tidak mengubah URL. Tanggal publikasi mengatur urutan daftar; publikasi ditentukan oleh Status, bukan penjadwalan tanggal.

Untuk mengedit artikel yang sudah ada, buka **Blog**, pilih artikelnya, ubah **Isi artikel**, lalu klik **Save**. Halaman blog membaca isi dari database Payload; berkas Markdown di `content/blog/` hanya salinan naskah dan tidak dipakai untuk merender halaman.

Untuk memeriksa rute saat server berjalan, jalankan `node scripts/check-blog.mjs http://localhost:3000`. Tambahkan ID draft sebagai argumen terakhir untuk memeriksa bahwa artikel tersebut tidak dapat dibaca publik.
