# NextGen Unfollowers - Premium Instagram Tool

Modern, karanlık mod (Dark Mode) destekli ve mobil uyumlu Instagram Takipçi Analiz aracı. Bu proje React, Vite ve Tailwind CSS kullanılarak geliştirilmiştir.

**NOT:** Bu proje standalone (tek başına) bir web sitesi olarak çalışırken, Instagram'ın güvenlik politikaları (CORS) nedeniyle gerçek veri çekme işlemleri yerine **demo/simülasyon verileri** kullanır.

## 🚀 Kurulum ve Hostinger'a Yükleme

Bu projeyi Hostinger veya benzeri bir sunucuda çalıştırmak için önce "Build" (Derleme) işlemi yapmanız gerekir. İndirdiğiniz dosyaları doğrudan yüklerseniz çalışmaz.

### Adım 1: Bilgisayarınızda Hazırlık

1. **Node.js Yükleyin:**
   Eğer bilgisayarınızda yoksa [Node.js](https://nodejs.org/) adresinden indirin ve kurun.

2. **Projeyi Açın:**
   İndirdiğiniz proje klasörünü terminalde veya komut satırında açın.

3. **Gerekli Paketleri Yükleyin:**
   Aşağıdaki komutu yazıp enter'a basın:
   ```bash
   npm install
   ```

### Adım 2: Build (Derleme) İşlemi

Sitenin yayınlanmaya hazır versiyonunu oluşturmak için şu komutu çalıştırın:
```bash
npm run build
```

Bu işlem tamamlandığında proje klasörünüzde **`dist`** adında yeni bir klasör oluşacaktır.

### Adım 3: Hostinger'a Yükleme

1. Hostinger panelinize girin ve Dosya Yöneticisi'ni (File Manager) açın.
2. `public_html` klasörüne girin.
3. Bilgisayarınızdaki **`dist`** klasörünün **içindeki tüm dosyaları** (index.html, assets klasörü vb.) Hostinger'daki `public_html` içine sürükleyip bırakın.
4. `dist` klasörünün kendisini değil, **içindekileri** yüklediğinizden emin olun.

Artık siteniz çalışacaktır!

## 🛠 Geliştirme (Development)

Projeyi kendi bilgisayarınızda geliştirmek için:

```bash
npm run dev
```
Komutu ile yerel sunucuyu başlatabilirsiniz.

## 📱 Özellikler

- **Premium UI:** Glassmorphism etkileri ve modern animasyonlar.
- **Responsive:** Telefondan ve bilgisayardan kusursuz erişim.
- **Filtreleme:** Takip etmeyenler, gizli hesaplar, yumurta kafalar vb. filtreleme.
- **Toplu İşlem:** Listeyi kopyalama veya toplu seçim yapma.
