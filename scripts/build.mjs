import {mkdir,writeFile,cp,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {site,vehicles} from '../src/config.mjs';
import {pages} from '../src/pages.mjs';
import {render,escapeHtml} from '../src/render.mjs';

if(!/^https:\/\/[a-z0-9.-]+$/i.test(site.url)) throw new Error('site.url must be a canonical HTTPS origin without a trailing slash.');
if(site.whatsapp&&!/^[1-9]\d{7,14}$/.test(site.whatsapp)) throw new Error('WhatsApp must be international digits only.');
if(site.allowIndexing&&(!site.company||!site.whatsapp&&!site.email&&!site.phone)) throw new Error('Public indexing requires verified company and contact information.');
const dist=resolve('dist');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await cp(resolve('public'),dist,{recursive:true});
for(const page of pages) {
 const dir=join(dist,page.path);
 await mkdir(dir,{recursive:true});
 await writeFile(join(dir,'index.html'),render(page));
}
await writeFile(join(dist,'site-data.json'),JSON.stringify({vehicles:vehicles.map(({brand,model,path})=>({brand,model,path})),whatsapp:site.whatsapp}));
const indexable=site.allowIndexing?pages.filter(p=>!p.noindex):[];
await writeFile(join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable.map(p=>`\n<url><loc>${escapeHtml(site.url+p.path)}</loc><lastmod>${site.updated}</lastmod></url>`).join('')}\n</urlset>\n`);
await writeFile(join(dist,'robots.txt'),`User-agent: *\nAllow: /\n${site.allowIndexing?`Sitemap: ${site.url}/sitemap.xml\n`:''}`);
await writeFile(join(dist,'llms.txt'),`# ${site.name}\n\nTürkçe elektrikli yan basamak seçim ve montaj rehberi.\n\nÖnemli: Araç seçimi kesin uyumluluk veya stok bilgisi değildir. Fiyat, kapasite, garanti ve montaj bilgileri teknik belgelerle teyit edilir. Ticari bilgiler tamamlanana kadar içerik önizleme niteliğindedir.\n\n## Rehberler\n${pages.filter(p=>['home','prices','installation','guide'].includes(p.type)).map(p=>`- [${p.title}](${site.url+p.path}): ${p.description}`).join('\n')}\n`);
await writeFile(join(dist,'404.html'),render({path:'/404/',type:'guide',title:'Sayfa bulunamadı',description:'Aradığınız sayfa burada yok. Ana sayfadan aracınızı seçebilir veya rehberleri inceleyebilirsiniz.',guide:{sections:[['Doğru adımı birlikte bulalım','Ana menüden araçları, fiyat rehberini veya montaj bilgilerini açabilirsiniz.']]},noindex:true}));
console.log(`Built ${pages.length} pages. Indexable: ${indexable.length}. Output: ${dist}`);
