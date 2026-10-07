# ElektrikliYanBasamak.com

Türkçe, araç seçimi ve teklif hazırlama odaklı site. Sunucuda build sırasında oluşturulan 28 HTML sayfası, mobil araç seçici, erişilebilir teklif penceresi ve yerel SVG görselleri içerir. Çalışma veya build için üçüncü taraf paket gerekmez. Node.js 22+ kullanın.

## Çalıştırma

```bash
npm run build
npm test
npm run dev
```

Önizleme: http://localhost:3000. Kaynak değişikliklerinden sonra build komutunu yeniden çalıştırın. Sunucu çıktıyı `dist/` klasöründen servis eder.

## İçerik ve mimari

- `src/config.mjs`: İşletme, iletişim, araçlar, uyumluluk doğrulaması ve indeksleme ayarı.
- `src/pages.mjs`: Sayfa envanteri ve beş karar rehberi.
- `src/render.mjs`: Semantik HTML, görünür SSS ile tutarlı JSON-LD, canonical ve sosyal metadata.
- `public/app.js`: Araç seçimi, diğer araç girişi, teklif mesajı, WhatsApp geçişi, mobil menü ve kopyalama.
- `public/message.js`: Tarayıcı ve testlerin paylaştığı teklif metni üretimi.
- `public/styles.css`: Yerel fontlarla çalışan, mobil uyumlu tasarım.
- `scripts/build.mjs`: HTML, sitemap, robots, llms ve 404 çıktısı.
- `tests/site.test.mjs`: Sayfa, bağlantı, indeksleme, schema ve teklif kapsamı kontrolleri.

### Sayfalar

Ana sayfa; araçlar; fiyat; montaj; uygulamalar; hakkımızda; iletişim; rehber; garanti/montaj bilgileri; gizlilik. Chery, Jaecoo, BYD, Volkswagen ve Ford hub sayfaları. Tiggo 7 Pro, Tiggo 7 Pro Max, Tiggo 8 Pro, Tiggo 8 Pro Max, Jaecoo 7, Seal U, Amarok ve Ranger için sekiz model sayfası. Beş satın alma rehberi.

Model sayfaları bir satış veya uyumluluk taahhüdü değildir. Mevcut araç envanteri seçim ve teknik kontrol talebi içindir; doğrulanmış ürün kataloğu değildir. Yıl seçimi talep bilgisidir, uyumlu yıl listesi değildir.

## Ticari bilgilerin tamamlanması

1. `src/config.mjs` içindeki şirket, telefon/WhatsApp, e-posta ve adresi doğrulanmış bilgilerle doldurun. WhatsApp uluslararası rakamlardan oluşmalıdır (`90...`); `+`, boşluk veya sahte numara kullanmayın.
2. Gerçek ürün/kit kodları, uyumlu yıllar, fiyat ve KDV kapsamı, stok, garanti, kapasite, montaj süresi ve şehirlerini doğrulayın. Model detay tablolarını gerçek verilerle güncelleyin. `verified` değerini tek başına değiştirmek yeterli değildir.
3. Gerçek montaj fotoğraf/video, uygulayıcı ve işletme kimliğini ekleyin. Mevcut SUV çizimi açıkça temsili olarak etiketlidir. Müşteri yorumu veya montaj kanıtı olarak kullanılmaz.
4. İşletme kimliği, garanti, iade ve veri sorumlusu bilgilerini gözden geçirip eksik sayfaları tamamlayın. Gizlilik metni bu sürümün fiili veri akışını anlatır; kişisel veri toplayan form eklenirse yeniden düzenlenmelidir.
5. Teknik veriler tamamlandığında ilgili hub/model sayfalarının `noindex` ayarını `src/pages.mjs` içinde güncelleyin. Tüm marka hub sayfaları başlangıçta `noindex` durumundadır. Model sayfaları `verified` alanından türetilir.
6. Site ticari açıdan hazır olduğunda `allowIndexing: true` yapın. Build, şirket ve en az bir gerçek iletişim kanalı olmadan indekslemeye açılmayı reddeder. Diğer doğrulama adımları içerik sorumlusunun kontrolündedir.

Başlangıçta **tüm sayfalarda noindex** vardır ve sitemap boş bir urlset içerir. Robots taramaya izin verir, böylece arama motorları noindex direktifini okuyabilir. `allowIndexing` açılınca yalnızca indekslenebilir sayfalar sitemap'e alınır. Ürün fiyatı ve doğrulama olmadan Product/Offer; adres ve işletme kimliği olmadan LocalBusiness; gerçek medya olmadan VideoObject üretilmez. SSS işaretlemesi zengin sonuç garantisi vermez.

### Teklif akışının fiili davranışı

Araç seçimi teknik kontrol talebini hazırlar. Veriler tarayıcı içinde kullanılır; sunucuya başvuru kaydı gönderilmez. WhatsApp tanımlandıysa hazırlanan mesaj gerçek numaraya açılır; kullanıcı WhatsApp içinde gönderir. Numara yoksa mesaj kopyalanabilir ve gönderilmediği açıkça belirtilir. Telefon, ad veya e-posta toplayan bir form ve sahte başarı bildirimi yoktur. Listede olmayan marka/model de talep hazırlayabilir.

## Yayınlama

Bu PR yayınlama yapmaz. Vercel'e depo bağlanırsa `vercel.json` build komutunu ve `dist/` çıktı dizinini tanımlar; framework preset **Other** seçilmelidir. Diğer statik barındırma sağlayıcıları için aynı build ve çıktı dizini kullanılabilir. Canlı domain `site.url` ile eşleşmeli, HTTPS ve tek canonical host yönlendirmesi sağlayıcıda ayarlanmalıdır.

## Doğrulama

`npm run build && npm test` dahili sayfa/asset bağlantılarını, tek H1, benzersiz başlık/canonical, JSON-LD, görünür SSS eşleşmesini, önizleme indeks korumasını, mesaj kapsamını ve HTML kaçışlarını kontrol eder. GitHub Actions bu kontrolleri her push ve PR'da çalıştırır. Lighthouse puanı, gerçek arama sıralaması veya gerçek müşteri dönüşümü ölçülmemiştir.

### Tarayıcı kontrolleri

GitHub Actions ayrıca Playwright ile masaüstü ve 390px mobil görünümde araç seçimi, mesajda yıl/model aktarımı, listede olmayan araç, menü, SSS, diyalog ve yatay taşma kontrollerini çalıştırır. Tarayıcı test araçları yalnızca bu kontrol için yüklenir; build ve çalışma zamanı bunlara bağlı değildir.

```bash
npm install --no-save --package-lock=false @playwright/test@1.62.1
npx playwright install chromium
npm run build
npx playwright test
```

Bu çalışma ortamında Chromium indirmesi başarısız olduğu için tarayıcı testleri yerelde çalıştırılamadı. Yerel build ve dokuz Node testi geçti. Tarayıcı sonuçları PR'ın GitHub Actions kontrollerinden doğrulanmalıdır.
