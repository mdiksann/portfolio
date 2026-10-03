# AWS Serverless API Architecture: Bagaimana Request Diproses hingga Data Tersimpan

Menelusuri perjalanan request melalui CloudFront, API Gateway, dan Lambda, serta peran DynamoDB, S3, dan Parameter Store dalam sebuah backend serverless.

![Diagram alur CloudFront, API Gateway, Lambda, DynamoDB, S3, dan Parameter Store](../../media/Serverless%20Architectur%20%28Edited%29.png)

Ketika pengguna membuka detail dokumen di sebuah aplikasi, yang terlihat hanya halaman berisi data. Di belakangnya, backend harus menerima request, memeriksa siapa penggunanya, mengambil data yang tepat, dan mengembalikan respons. Arsitektur ini membagi pekerjaan tersebut ke beberapa layanan AWS dengan tanggung jawab yang berbeda.

Fokus rancangan ini adalah memisahkan pintu masuk API, logika bisnis, penyimpanan data, penyimpanan berkas, dan konfigurasi aplikasi. Pendekatan serverless mengurangi kebutuhan mengelola server aplikasi sendiri, tetapi keputusan tentang akses data, kegagalan, dan biaya tetap perlu dirancang.

Artikel ini menjelaskan desain pada diagram proyek. Contoh aplikasi dokumen dan endpoint di bawah dipakai sebagai ilustrasi alur, bukan klaim fitur yang sudah di-deploy atau hasil pengujian performa.

## Membaca diagram dari kiri ke kanan

Jalur utama pada diagram adalah Pengguna → CloudFront → API Gateway HTTP API → AWS Lambda. Setelah request mencapai Lambda, fungsi backend mengakses layanan pendukung sesuai kebutuhan:

- Amazon DynamoDB menyimpan data aplikasi, misalnya pemilik dokumen, judul, status, dan referensi berkas.
- Amazon S3 menyimpan berkas, seperti gambar atau dokumen yang diunggah.
- AWS Systems Manager Parameter Store menyimpan konfigurasi dan nilai rahasia yang dibutuhkan aplikasi.

Tiga cabang di sebelah kanan bukan urutan yang harus dilalui setiap request. Membaca metadata dokumen mungkin hanya membutuhkan DynamoDB, sedangkan operasi berkas melibatkan S3. Parameter konfigurasi juga dapat digunakan ulang selama masih valid, sehingga tidak harus dibaca ulang pada setiap pemanggilan.

## Perjalanan satu request: membuka detail dokumen

Bayangkan pengguna yang sudah login meminta GET /documents/doc-123. Berikut contoh bagaimana alurnya dapat dirancang:

1. Pengguna mengirim request HTTPS ke domain aplikasi. Request masuk melalui CloudFront sebagai lapisan terdepan.
2. CloudFront meneruskan request ke API Gateway. Untuk endpoint yang mengembalikan data pribadi, rancangan yang aman adalah menonaktifkan cache dan meneruskan header autentikasi yang diperlukan.
3. API Gateway mencocokkan metode dan path dengan route. Jika JWT authorizer dikonfigurasi, token diperiksa; scope juga diperiksa bila disyaratkan pada route. Request yang lolos diteruskan ke integrasi Lambda.
4. Lambda menerima event request, memvalidasi parameter, lalu memeriksa apakah pengguna berhak mengakses dokumen tersebut. Token yang valid tidak otomatis memberi akses ke semua dokumen.
5. Lambda mengambil metadata dari DynamoDB menggunakan pola akses yang telah dirancang. Bila operasi memerlukan berkas atau konfigurasi tambahan, fungsi mengakses S3 atau Parameter Store dengan izin yang sesuai.
6. Lambda mengembalikan hasil. API Gateway membentuk respons HTTP dan meneruskannya melalui CloudFront ke pengguna. Aplikasi perlu membedakan keberhasilan, data tidak ditemukan, input tidak valid, dan akses ditolak.

Pertukaran request dan respons ini mengikuti pola [Lambda proxy integration pada HTTP API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html).

Pemeriksaan token pada pintu masuk perlu dikonfigurasi melalui [JWT authorizer API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html).

## CloudFront dan API Gateway memiliki peran berbeda

CloudFront berada di depan origin dan menyediakan pengaturan distribusi serta cache. Cache berguna untuk respons publik yang boleh digunakan bersama. Untuk data personal, meneruskan header Authorization saja belum cukup jika konfigurasi cache memungkinkan respons pengguna lain dipakai kembali. Karena itu, contoh alur ini memakai cache yang dinonaktifkan pada endpoint privat.

Perilaku tersebut perlu diperhatikan saat mengatur [Authorization dan caching di CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/http-401-unauthorized.html).

API Gateway mengurus route dan integrasi HTTP dengan backend. Diagram menggunakan HTTP API; validasi isi request tetap menjadi tanggung jawab kode Lambda. HTTP API juga menyediakan throttling pada stage atau route. Batas tersebut bersifat best effort, sehingga bukan jaminan plafon biaya maupun pengganti penanganan lonjakan beban.

Pemilihan fitur mengikuti [perbedaan HTTP API dan REST API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html).

Pengaturan pembatasan request dijelaskan dalam [dokumentasi throttling HTTP API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html).

## Lambda menjadi tempat logika bisnis

Lambda menjalankan keputusan aplikasi: apakah input masuk akal, siapa pemilik data, operasi apa yang diizinkan, dan bagaimana hasil dibentuk. Pemisahan ini membuat aturan bisnis tidak tercampur dengan pengaturan CDN atau struktur penyimpanan berkas.

Fungsi sebaiknya tidak bergantung pada memori lokal sebagai sumber data permanen. Data yang harus bertahan disimpan pada layanan penyimpanan. Execution role Lambda juga perlu dibatasi pada tindakan dan resource yang diperlukan, misalnya membaca tabel tertentu tanpa otomatis mendapat akses ke seluruh akun AWS.

Pengelolaan state, izin minimum, dan penanganan pemanggilan berulang mengikuti [praktik pengembangan Lambda](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html).

## DynamoDB untuk metadata, S3 untuk berkas

Pada contoh aplikasi dokumen, DynamoDB menyimpan informasi seperti documentId, ownerId, judul, status, dan s3Key. Desain key dimulai dari pertanyaan aplikasi: bagaimana mengambil satu dokumen, atau menampilkan dokumen milik pengguna tertentu? Pola baca dan tulis tersebut menentukan key serta indeks yang dibutuhkan.

Keputusan ini membawa trade-off: kebutuhan query yang jelas membantu desain tabel, sementara kebutuhan pencarian baru dapat memerlukan indeks atau perubahan model data. Skema tidak cukup dirancang hanya dengan memindahkan tabel relasional apa adanya.

Pendekatan tersebut sejalan dengan [pemodelan data berdasarkan pola akses di DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html).

Berkas aslinya berada di S3. Lambda dapat mengakses objek yang dirujuk metadata sesuai izin aplikasi, sebagaimana cabang Lambda → S3 pada diagram. Dengan pembagian ini, aplikasi dapat mengelola status dan kepemilikan dokumen tanpa menjadikan database sebagai penyimpanan utama berkas.

Untuk pengembangan alur upload, Lambda dapat menerbitkan presigned URL setelah memeriksa izin pengguna. Client kemudian mengunggah langsung ke S3 menggunakan URL yang memiliki masa berlaku, tanpa menerima kredensial AWS. Jalur langsung client → S3 ini merupakan opsi pengembangan dan belum digambarkan pada diagram utama. URL tetap perlu diperlakukan sebagai akses sementara yang sensitif.

Opsi tersebut didukung oleh [presigned URL untuk upload dan download S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html).

## Parameter Store memisahkan konfigurasi dari kode

Nama resource, konfigurasi integrasi, atau nilai rahasia tidak perlu ditanam langsung di source code. Parameter Store menyediakan tempat terpisah untuk nilai-nilai tersebut. Untuk rahasia, parameter perlu memakai tipe SecureString agar nilainya dienkripsi dengan AWS KMS.

Lambda memerlukan izin membaca parameter dan izin dekripsi KMS yang sesuai. Memindahkan nilai ke Parameter Store tidak otomatis menyelesaikan seluruh pengelolaan rahasia: akses, penggunaan cache, pembaruan nilai, dan pencegahan kebocoran ke log tetap harus diperhatikan.

Mekanisme enkripsi dan izin dijelaskan dalam [SecureString dan integrasi AWS KMS](https://docs.aws.amazon.com/systems-manager/latest/userguide/secure-string-parameter-kms-encryption.html).

## Melengkapi alur dengan SQS dan CloudWatch

SQS dan CloudWatch tercantum pada stack proyek, tetapi belum terlihat pada diagram. Keduanya dapat melengkapi jalur utama saat backend membutuhkan pekerjaan latar belakang dan pemantauan operasional.

Contohnya, pemrosesan berkas setelah upload bisa dipindahkan ke antrean SQS. Lambda penerima request mencatat pekerjaan dan mengirim pesan ke antrean; worker Lambda memprosesnya melalui event source mapping. Jika pekerjaan diterima untuk diproses kemudian, API dapat mengembalikan 202 Accepted beserta ID pekerjaan, sementara client memeriksa statusnya lewat endpoint terpisah.

Pemrosesan pesan bisa terjadi lebih dari sekali. Worker perlu idempotent: menerima pesan yang sama kembali tidak boleh menggandakan efek bisnis. Kebijakan retry dan dead-letter queue juga perlu dikonfigurasi agar pekerjaan gagal dapat diperiksa dan ditangani.

Perilaku batch, retry, dan pengiriman berulang dijelaskan dalam [integrasi Lambda dengan Amazon SQS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html).

Untuk pemantauan, rancangan dapat memakai metrik CloudWatch serta access log API Gateway dan log Lambda dengan konfigurasi serta izin yang sesuai. Request ID membantu menelusuri satu permintaan antarlog. Durasi eksekusi, error, dan throttling menjadi sinyal untuk diselidiki; token, rahasia, serta isi dokumen pribadi tidak perlu dicatat ke log.

Dukungan metrik dan access log tercantum pada [fitur observability API Gateway HTTP API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html).

## Dari diagram menuju sistem yang bisa dioperasikan

Deskripsi proyek menempatkan Infrastructure as Code, CI/CD, keamanan, dan monitoring biaya sebagai bagian dari arah rancangan. Agar dapat dibuktikan saat implementasi, resource beserta izin aksesnya perlu didefinisikan secara konsisten, perubahan diuji, dan hasil deployment diperiksa. Diagram saja belum menjelaskan konfigurasi atau menunjukkan bahwa pipeline tersebut sudah dijalankan.

Sebagai contoh pendekatan, CloudFormation dapat mendefinisikan resource dalam template yang disimpan bersama versi kode. Pipeline kemudian dapat menjalankan pengujian, menerapkan perubahan pada environment yang dituju, dan melakukan smoke test. Detail tool, rollback, serta pemisahan development dan production tetap perlu ditetapkan pada implementasi.

Contoh pendekatan Infrastructure as Code ini menggunakan [konsep template dan stack CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html).

- Uji jalur berhasil dan gagal: input salah, token tidak valid, akses ke dokumen pengguna lain, serta kegagalan layanan penyimpanan.
- Ukur latensi, termasuk inisialisasi Lambda, dan perilaku saat concurrency atau throughput meningkat sebelum membuat klaim performa.
- Tentukan retensi log, batas penggunaan yang sesuai, dan pemantauan pengeluaran. Biaya aktual harus dinilai dari pola request, komputasi, penyimpanan, serta transfer data.
- Jika memakai antrean, uji pesan duplikat dan kegagalan worker agar status pekerjaan tidak menyesatkan pengguna.

## Hal yang ingin ditunjukkan melalui arsitektur ini

Rancangan ini menunjukkan bagaimana sebuah backend dapat dibagi menjadi alur yang mudah ditelusuri: CloudFront menerima lalu lintas, API Gateway menghubungkan HTTP dengan backend, Lambda menjalankan aturan bisnis, DynamoDB menyimpan data aplikasi, S3 menyimpan berkas, dan Parameter Store menyediakan konfigurasi. Setiap komponen memiliki alasan dan batas tanggung jawab yang jelas.

Nilai desainnya terletak pada hubungan antarbagian tersebut: siapa boleh mengakses data, di mana data disimpan, kapan pekerjaan perlu diproses di belakang layar, dan bagaimana kegagalan dapat diketahui. Itu menjadi dasar untuk menilai implementasi berikutnya melalui kode, konfigurasi infrastruktur, dan hasil pengujian.
