
<a href="" rel="nofollow">
<img src="https://github.com/efegorkemumit/crypto-n8n/blob/master/public/kripto.jpg"
 style="max-width: 100%;">
</a>

<div></div>

## 🌐 Socials:
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/efegorkemumit) [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/efe-g%C3%B6rkem-%C3%BCmit-a084009b/) [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://youtube.com/@@EfeGorkemUmit) 


## Video
- 00:00 Tanıtım
- 01:23 Alternatif Yapay Zeka ile Dashboard Tasarımı 
- 03:34 Next.js 15 Kurulumu ve Prisma DB Ayarları 
- 13:53 prisma.ts Dosyası Oluşturma ve Kullanımı
- 17:17 n8n Şema Tasarımı 
- 29:48 verifySecret Middleware ve Bulk Route API
- 49:07 Dashboard Sayfası ve GET İsteği
- 01:19:36 n8n Schedule Trigger ile Otomasyon


# 📊 Kripto Canlı Dashboard (Next.js 15 + Prisma + n8n)

Bu proje, **Next.js 15 App Router**, **Prisma** ve **n8n** kullanılarak geliştirilmiş **Kripto Canlı Dashboard** uygulamasıdır.  
Amaç, farklı kripto para birimlerinin anlık fiyatlarını, 24 saatlik değişimlerini ve geçmiş fiyat serilerini görsel olarak takip edebilmektir.  

---

## ✨ Özellikler

- 🔐 **Webhook & Auth** desteği (`x-webhook-secret` kontrolü)  
- 📥 **Toplu veri ekleme API'si** (`/api/markets/bulk`)  
- 📈 **Özet API'si** (`/api/markets/summary`) ile:
  - En son fiyatlar
  - 24 saatlik değişim yüzdesi
  - Son 200 fiyat kaydından oluşan zaman serisi  
- 🗄️ **Prisma + PostgreSQL** uyumlu veri tabanı  
- 🖥️ **Next.js 15 App Router** ile modern frontend mimarisi  
- ⚡ **n8n entegrasyonu** ile otomatik veri akışı (örn. CoinGecko → API → DB)  

---

## 📂 Proje Yapısı

```bash
app/
  api/
    markets/
      bulk/route.ts       # Toplu fiyat verisi kaydı
      summary/route.ts    # Özet fiyat ve zaman serisi API'si
lib/
  prisma.ts               # Prisma client
  verifySignature.ts      # Webhook auth


# Repoyu klonla
git clone https://github.com/efegorkemumit/kripto-dashboard.git
cd kripto-dashboard

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# Prisma migrate
npx prisma migrate dev

# Geliştirme modunda başlat
npm run dev

n8n ile Kullanım

npx n8n@latest ile n8n’i çalıştır.

CoinGecko API’sinden fiyatları çekip /api/markets/bulk endpoint’ine POST atan bir workflow oluştur.

Böylece dashboard otomatik güncel verilerle beslenir.

🌐 Canlı Demo & Video

🎥 YouTube Videosu


🌍 Web Sitem: efegorkemumit.com

📸 Ekran Görüntüleri

Dashboard arayüzü örneği:

🔄 n8n Workflow Diyagramı

n8n üzerinde CoinGecko’dan verileri çekip API’ye gönderen basit senaryo:

🤝 Katkı

Pull request ve issue’lar açıktır. Her türlü öneri ve katkıya açığım.

👨‍💻 Geliştirici

Efe Görkem Ümit

🔗 LinkedIn

🌐 efegorkemumit.com

📺 YouTube


---


