// All commercial claims must come from verified business/product information.
export const site = {
  name: 'ElektrikliYanBasamak.com',
  url: 'https://elektrikliyanbasamak.com',
  whatsapp: '', // International digits only, e.g. 905XXXXXXXXX. Never a placeholder.
  phone: '',
  email: '',
  company: '',
  address: '',
  installationCities: [],
  updated: '2026-10-07',
  // Keep previews out of search until contact details and policies are reviewed.
  allowIndexing: false,
};

export const vehicles = [
  { brand: 'Chery', brandSlug: 'chery', model: 'Tiggo 7 Pro', slug: 'tiggo-7-pro', body: 'SUV', note: 'Tiggo 7 Pro ile Pro Max için bağlantı ve elektronik kit eşleştirmesi ayrı yapılmalıdır.' },
  { brand: 'Chery', brandSlug: 'chery', model: 'Tiggo 7 Pro Max', slug: 'tiggo-7-pro-max', body: 'SUV', note: 'Pro Max donanımı için araç yılı ve gövde altı bağlantıları birlikte kontrol edilmelidir.' },
  { brand: 'Chery', brandSlug: 'chery', model: 'Tiggo 8 Pro', slug: 'tiggo-8-pro', body: 'SUV', note: 'Tiggo 8 Pro kitinin Pro Max ile aynı olduğu varsayılmamalıdır. Teklifte tam model adı belirtilmelidir.' },
  { brand: 'Chery', brandSlug: 'chery', model: 'Tiggo 8 Pro Max', slug: 'tiggo-8-pro-max', body: 'SUV', note: 'Model yılı, donanım ve kapı sinyal bağlantısı uyumluluk kontrolünün birlikte ele alınan parçalarıdır.' },
  { brand: 'Jaecoo', brandSlug: 'jaecoo', model: '7', slug: '7', body: 'SUV', note: 'Donanım versiyonu ve varsa gövde altı aksesuarları, montaj alanı değerlendirmesi için belirtilmelidir.' },
  { brand: 'BYD', brandSlug: 'byd', model: 'Seal U', slug: 'seal-u', body: 'SUV', note: 'Elektrikli ve hibrit versiyonların aynı montaj kitini kullandığı varsayılmamalıdır. Güç aktarım versiyonunu belirtin.' },
  { brand: 'Volkswagen', brandSlug: 'volkswagen', model: 'Amarok', slug: 'amarok', body: 'Pick-up', note: 'Kasa nesli ve kabin tipi, basamak uzunluğu ve bağlantı kitinin seçiminde kontrol edilmelidir.' },
  { brand: 'Ford', brandSlug: 'ford', model: 'Ranger', slug: 'ranger', body: 'Pick-up', note: 'Çift kabin, diğer kabin seçenekleri ve Raptor gibi versiyonlar ayrı değerlendirilmelidir.' },
].map(v => ({ ...v, path: `/${v.brandSlug}/${v.slug}-elektrikli-yan-basamak/`, verified: false }));

export const faqs = [
  ['Elektrikli yan basamak nedir?', 'Kapı açıldığında dışarı çıkan, kapı kapandığında gövde altına çekilen motorlu bir basamak sistemidir. Çalışma şekli ürünün kontrol ünitesi ve araç bağlantısına bağlıdır. Yüksek araçlarda iniş ve binişi kolaylaştırmak için kullanılır.'],
  ['Elektrikli yan basamak fiyatı ne kadar?', 'Fiyat; araç modeli, bağlantı kiti, mekanizma, motor sistemi ve montaj kapsamına göre belirlenir. Kesin tutar için marka, model ve yıl ile teklif istenmelidir. Ürün, montaj, KDV ve varsa ilave işlemlerin teklifte ayrı belirtilmesini isteyin.'],
  ['Her araca takılır mı?', 'Her araç için uyumlu bir kit bulunacağı varsayılamaz. Model yılı, donanım ve gövde altı bağlantıları kontrol edilmelidir. Burada araç seçmek, ürünün stokta olduğunu veya aracınıza kesin uyduğunu göstermez.'],
  ['Montaj ne kadar sürer?', 'Süre, araç bağlantı noktalarına, elektrik bağlantısına ve kitin yapısına göre değişir. Randevu öncesinde uygulayıcıdan aracınıza özel süre ve işlem kapsamını yazılı olarak alın.'],
  ['Kaç kilogram taşır?', 'Taşıma kapasitesi ürün ve mekanizmaya göre değişir. Aracınıza teklif edilen ürünün üretici teknik belgesindeki kapasiteyi ve kullanım sınırlarını kontrol edin. Ürün doğrulanmadan tek bir kapasite değeri vermek doğru olmaz.'],
  ['Yağmur ve çamurda kullanılabilir mi?', 'Su, toz ve çamura dayanım ürünün koruma sınıfına ve bakım talimatlarına bağlıdır. Üretici belgesi ve temizlik önerileri kontrol edilmelidir. Su geçirmezlik veya bakım gerektirmeme özellikleri her ürün için geçerli kabul edilmemelidir.'],
  ['Araç garantisini etkiler mi?', 'Etki; montaj yöntemine, elektrik bağlantısına ve araç üreticisinin garanti koşullarına bağlıdır. Uygulama öncesinde yetkili servis ve montaj sağlayıcısından yazılı bilgi alın. Tüm araçlar için garantiyi etkilemez sözü verilemez.'],
  ['Sabit basamak mı, elektrikli basamak mı?', 'Sabit basamak sürekli dışarıda durur. Elektrikli basamak kullanılmadığında gövde altına çekilir; bunun karşılığında motor, kontrol ünitesi ve hareketli parçalar içerir. Seçimi bütçeniz, kullanım şekliniz ve bakım beklentiniz üzerinden yapın.'],
];

export { quoteMessage } from '../public/message.js';

export const vehiclePath = v => v.path;
