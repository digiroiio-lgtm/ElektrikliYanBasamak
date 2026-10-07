export function quoteMessage({brand = '', model = '', year = '', city = '', detail = ''} = {}) {
  const vehicle = [year, brand, model].filter(Boolean).join(' ') || 'Aracım';
  return `Merhaba, ${vehicle} için elektrikli yan basamak uyumluluğu, güncel fiyatı ve montaj bilgisi almak istiyorum.${city ? ` Montaj şehri: ${city}.` : ''}${detail ? ` Ek bilgi: ${detail}.` : ''} Ürün, montaj, KDV, stok, garanti ve montaj süresini belirtir misiniz?`;
}
