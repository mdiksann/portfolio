# Highly Available Web Infrastructure on AWS: Cara Kerja dan Batas Ketersediaannya

Rancangan web di AWS dengan CloudFront, Application Load Balancer, EC2 lintas dua Availability Zone, dan RDS Multi-AZ. Artikel ini menelusuri alur request, S3, Parameter Store, serta keputusan yang masih perlu diuji sebelum menyebut sistemnya highly available.

![Diagram Highly Available Web Infrastructure on AWS: CloudFront, ALB, EC2, RDS Multi-AZ, S3, dan Parameter Store](../../media/CloudForge.drawio.png)

Sebuah halaman web mungkin terlihat seperti satu layanan, padahal responsnya bergantung pada beberapa lapisan: jaringan, web server, database, konfigurasi, dan penyimpanan berkas. Diagram proyek ini memisahkan lapisan tersebut agar jalur request dan titik kegagalannya lebih mudah dibaca.

Artikel ini membahas **rancangan pada diagram**, bukan laporan infrastruktur yang sudah berjalan. Belum ada hasil pengujian failover, metrik uptime, ataupun angka performa yang dapat diklaim dari gambar saja.

## Membaca jalur utama

Alur request bergerak dari pengguna ke Amazon CloudFront, lalu ke Application Load Balancer (ALB), web server EC2, dan Amazon RDS. Diagram membentangkan VPC ke dua Availability Zone (AZ). Masing-masing AZ memiliki public subnet untuk EC2, sedangkan RDS Multi-AZ berada pada private subnet.

- **CloudFront** menjadi lapisan di depan origin. Konten yang aman untuk di-cache dapat dilayani dari edge; respons personal atau dinamis memerlukan aturan cache dan penerusan header yang tepat.
- **ALB** menerima request dari CloudFront, memeriksa kesehatan target, lalu mengarahkannya ke instance EC2 yang sehat. ALB perlu dikonfigurasi pada subnet di setidaknya dua AZ untuk pola ini.
- **EC2** menjalankan web server atau aplikasi. Auto Scaling Group pada diagram bertanda minimum 1 dan maksimum 2 instance.
- **RDS Multi-AZ** menyimpan data relasional dengan standby di AZ lain untuk failover. Standby pada tipe Multi-AZ DB instance bukan replika baca untuk membagi query.

AWS menjelaskan cara ALB memilih [target yang sehat dan penggunaan beberapa AZ](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html), serta perbedaan [primary dan standby pada RDS Multi-AZ](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html).

## Perjalanan satu request

Bayangkan pengguna membuka halaman yang menampilkan data dan sebuah berkas. Contoh ini menunjukkan interaksi yang mungkin terjadi; diagram tidak menetapkan endpoint atau implementasi aplikasinya.

1. Browser mengirim request HTTPS ke CloudFront. Untuk konten publik yang jarang berubah, kebijakan cache dapat mengurangi request ke origin. Halaman yang bergantung pada identitas pengguna harus memakai kebijakan cache yang sesuai agar respons antar pengguna tidak tercampur.
2. CloudFront meneruskan request yang perlu diproses ke ALB. Jika ALB bersifat internet-facing, akses langsung ke origin perlu dibatasi sesuai kebutuhan agar jalur CloudFront tidak mudah dilewati.
3. ALB meneruskan request ke target EC2 yang lolos health check. Health check harus mewakili kesiapan aplikasi menerima traffic, bukan sekadar proses yang masih hidup.
4. Aplikasi di EC2 membaca atau menulis data melalui endpoint RDS. Jika request membutuhkan objek, aplikasi mengakses S3. Jika membutuhkan konfigurasi atau secret, aplikasi membaca Parameter Store dengan izin yang sesuai.
5. Respons kembali melalui ALB dan CloudFront ke browser. Hanya respons yang aman dibagikan yang sebaiknya di-cache bersama.

Panduan AWS tentang [membatasi akses ke ALB dari CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html) menunjukkan opsi untuk origin yang dapat dijangkau dari internet. ALB dan RDS menangani jenis kegagalan yang berbeda: ALB memilih target aplikasi yang sehat, sedangkan RDS mengalihkan database ke standby ketika kondisi failover terpenuhi.

## Dua AZ belum cukup bila kapasitas minimum satu

Diagram menggambar EC2 di dua AZ, tetapi label Auto Scaling Group menyebut **minimum 1, maksimum 2**. Dengan satu instance aktif, aplikasi bisa saja hanya berjalan di satu AZ pada suatu waktu. Jika AZ itu terganggu, Auto Scaling harus meluncurkan pengganti sebelum layanan kembali siap. Karena itu, gambar dua AZ saja belum membuktikan bahwa aplikasi tetap melayani request tanpa jeda.

Untuk target ketersediaan lintas AZ, kapasitas awal yang lebih masuk akal adalah setidaknya satu instance sehat di setiap AZ, dengan kapasitas tersisa yang cukup saat satu AZ hilang. Nilai minimum, desired, maksimum, ukuran instance, serta kebijakan scaling perlu ditentukan dari beban nyata. AWS menjelaskan bagaimana [Auto Scaling mendistribusikan instance antar AZ](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-benefits.html) dan bagaimana batas maksimum membatasi [scale-out](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html).

RDS Multi-AZ mengurangi risiko kehilangan layanan database karena gangguan pada primary, tetapi failover tidak instan. Aplikasi harus siap menangani koneksi yang putus, mencoba ulang operasi yang aman, dan memulihkan koneksi ke endpoint database. [Dokumentasi failover RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html) menjelaskan bahwa durasinya bergantung pada kondisi saat kejadian.

## Jaringan dan akses layanan pendukung

Pada diagram, web server EC2 berada di public subnet dan RDS berada di private subnet. Public subnet berarti route table-nya memiliki jalur ke internet gateway; ini tidak otomatis membuat setiap instance dapat diakses publik, karena alamat IP dan security group juga berpengaruh. Untuk implementasi berikutnya, EC2 dapat dipindah ke private subnet sementara ALB tetap menjadi pintu masuk publik. Kebutuhan akses keluar dari private subnet kemudian ditangani dengan NAT atau VPC endpoint sesuai layanan yang dipakai. Lihat [opsi route table VPC](https://docs.aws.amazon.com/vpc/latest/userguide/route-table-options.html).

Security group perlu membatasi alur ALB ke EC2 dan EC2 ke port database. Web server tidak perlu menerima traffic langsung dari internet jika semua request seharusnya melalui ALB. Untuk S3 dan Parameter Store, instance role dengan izin terbatas lebih tepat daripada kredensial statis di aplikasi. Diagram menunjukkan akses S3 untuk berkas dan Parameter Store untuk secret serta konfigurasi; izin baca dan tulis perlu diberikan hanya pada resource yang dibutuhkan.

Parameter sensitif dapat menggunakan tipe `SecureString` yang dienkripsi melalui KMS. Izin membaca parameter dan mendekripsinya harus sesuai dengan role aplikasi. Detailnya ada pada [pengaturan akses Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-setting-up.html) dan [enkripsi SecureString](https://docs.aws.amazon.com/systems-manager/latest/userguide/secure-string-parameter-kms-encryption.html).

## Langkah operasional di luar diagram

Diagram berfokus pada jalur request dan penyimpanan. Pipeline deployment, alarm, audit, serta pengendalian biaya belum tergambar; semuanya perlu dirancang sebelum layanan ini dioperasikan. Gambar tidak membuktikan bahwa resource atau proses tersebut sudah dikonfigurasi.

Sebagai langkah implementasi, pipeline dapat menjalankan pemeriksaan kode, meninjau rencana perubahan Infrastructure as Code, menerapkan perubahan dengan kredensial berumur pendek, lalu menguji endpoint setelah deployment. Untuk operasional, metrik target sehat, error ALB, kapasitas EC2, serta koneksi dan failover RDS dapat dijadikan dasar alarm. CloudWatch dapat [mengirim notifikasi perubahan status alarm melalui SNS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Notify_Users_Alarm_Changes.html).

CloudTrail membantu menelusuri aktivitas API dan perubahan infrastruktur, sedangkan Budgets memberi peringatan saat biaya atau pemakaian melewati ambang yang dipilih. Keduanya tidak menggantikan kontrol akses atau pengujian ketahanan. Dokumentasi AWS memisahkan fungsi [audit CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/) dari [peringatan anggaran](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html).

## Yang perlu diuji sebelum menyebutnya highly available

- Jalankan minimal dua instance sehat pada dua AZ, lalu hentikan satu instance dan periksa apakah request tetap berhasil selama pengganti diluncurkan.
- Simulasikan hilangnya satu AZ dan ukur kapasitas yang tersisa, error, latensi, serta waktu pemulihan. Pastikan batas maksimum Auto Scaling tidak menghalangi penambahan kapasitas yang diperlukan.
- Uji failover RDS dan cara aplikasi menangani koneksi yang terputus. Ukur waktu pulih dan tentukan target RTO/RPO berdasarkan kebutuhan produk.
- Periksa health check, cache CloudFront, akses langsung ke ALB, aturan security group, izin IAM, alarm, dan biaya aktual setelah sumber daya dijalankan.

Rancangan ini menunjukkan jalur web yang memiliki komponen redundan, tetapi ketersediaan adalah sifat sistem yang **dikonfigurasi dan diuji**, bukan hasil yang otomatis muncul dari nama layanan. Diagram menjadi titik awal untuk menilai kapasitas per AZ, pemulihan database, keamanan jaringan, dan respons operasional secara terukur.
