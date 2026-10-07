import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {site,vehicles,quoteMessage,faqs} from '../src/config.mjs';
import {pages} from '../src/pages.mjs';
import {escapeHtml,render} from '../src/render.mjs';

test('Every page has a unique route, title, canonical and one H1', async()=>{
 assert.equal(new Set(pages.map(p=>p.path)).size,pages.length);
 assert.equal(new Set(pages.map(p=>p.title)).size,pages.length);
 for(const page of pages) {
  const html=await readFile(join('dist',page.path,'index.html'),'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,page.path);
  assert.ok(html.includes(`href="${site.url+page.path}"`),page.path);
  assert.ok(html.includes('<html lang="tr">'),page.path);
 }
});

test('All internal links, script imports and page assets resolve', async()=>{
 for(const page of pages) {
  const html=await readFile(join('dist',page.path,'index.html'),'utf8');
  for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
   const url=match[1];
   assert.ok((await stat(join('dist',url.endsWith('/')?url+'index.html':url))).isFile(),`${page.path} -> ${url}`);
  }
 }
 await stat('dist/message.js');
});

test('Unverified vehicle pages have noindex and no Product or Offer claims',()=>{
 for(const page of pages.filter(p=>p.type==='model')) {
  const html=render(page);
  assert.ok(html.includes('noindex, follow'));
  assert.ok(html.includes('Uyumluluk teyidi gerekli'));
  const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.ok(!data['@graph'].some(n=>['Product','Offer','LocalBusiness','Review'].includes(n['@type'])));
 }
});

test('Preview indexing stays off and sitemap excludes unverified routes', async()=>{
 if(!site.allowIndexing) {
  for(const page of pages) assert.ok(render(page).includes('noindex, follow'));
  const sitemap=await readFile('dist/sitemap.xml','utf8');
  assert.ok(!sitemap.includes('<url>'));
 } else {
  const sitemap=await readFile('dist/sitemap.xml','utf8');
  for(const page of pages.filter(p=>p.noindex)) assert.ok(!sitemap.includes(`<loc>${site.url+page.path}</loc>`));
 }
});

test('Structured data parses and FAQ entries match visible content',()=>{
 for(const page of pages) {
  const html=render(page);
  const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(data['@context'],'https://schema.org');
  for(const node of data['@graph'].filter(n=>n['@type']==='FAQPage')) {
   for(const question of node.mainEntity) {
    assert.ok(html.includes(escapeHtml(question.name)));
    assert.ok(html.includes(escapeHtml(question.acceptedAnswer.text)));
    assert.ok(faqs.some(([q,a])=>q===question.name&&a===question.acceptedAnswer.text));
   }
  }
 }
});

test('Quote message preserves exact vehicle, optional city and scope',()=>{
 const message=quoteMessage({brand:'Chery',model:'Tiggo 8 Pro Max',year:'2025',city:'Antalya',detail:'Üst donanım'});
 assert.ok(message.includes('2025 Chery Tiggo 8 Pro Max'));
 assert.ok(message.includes('Montaj şehri: Antalya.'));
 assert.ok(message.includes('Ek bilgi: Üst donanım.'));
 for(const word of ['KDV','stok','garanti','montaj süresi']) assert.ok(message.includes(word));
 const minimal=quoteMessage({brand:'Toyota',model:'Hilux',year:'2022'});
 assert.ok(!minimal.includes('Montaj şehri:'));
 assert.ok(!minimal.includes('undefined'));
 const unknown=quoteMessage({model:'Toyota Hilux çift kabin',year:'2019'});
 assert.ok(unknown.includes('2019 Toyota Hilux çift kabin'));
});

test('HTML escapes all user/config text delimiters',()=>{
 assert.equal(escapeHtml('<img src="x" onerror=\'alert(1)\'> &'), '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt; &amp;');
 const html=render({path:'/test/',type:'about',title:'<script>alert(1)</script>',description:'" onload="bad'});
 assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
 assert.ok(!html.includes('<title><script>'));
});

test('Vehicle paths and data are consistent',()=>{
 assert.equal(new Set(vehicles.map(v=>v.path)).size,vehicles.length);
 for(const vehicle of vehicles) assert.ok(pages.some(p=>p.path===vehicle.path));
});
