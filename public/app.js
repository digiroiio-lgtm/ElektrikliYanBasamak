import { quoteMessage } from './message.js';
const dialog = document.querySelector('#quote-dialog');
const quoteForm = document.querySelector('#quote-form');
const output = document.querySelector('#quote-output');
let catalog;
let opener;

async function getCatalog() {
  if (!catalog) {
    const response = await fetch('/site-data.json');
    if (!response.ok) throw new Error('Araç bilgileri yüklenemedi. Sayfayı yenileyip tekrar deneyin.');
    catalog = await response.json();
  }
  return catalog;
}

function setModels(form, data, selected = '') {
  const brand = form.elements.brand.value;
  const select = form.elements.model;
  select.replaceChildren(new Option(brand ? 'Model seçin' : 'Önce marka seçin', ''));
  data.vehicles.filter(v => v.brand === brand).forEach(v => select.add(new Option(v.model, v.model)));
  select.add(new Option('Diğer model', 'other'));
  select.disabled = !brand || brand === 'other';
  select.required = !!brand && brand !== 'other';
  select.value = selected;
  updateOther(form);
}

function updateOther(form) {
  const other = form.elements.brand.value === 'other' || form.elements.model.value === 'other';
  form.querySelector('.other-fields').hidden = !other;
  form.elements.otherVehicle.required = other;
  form.elements.otherVehicle.setCustomValidity('');
  if (!other) form.elements.otherVehicle.value = '';
}

function readVehicle(form) {
  const fields = new FormData(form);
  const other = fields.get('brand') === 'other' || fields.get('model') === 'other';
  const otherText = String(fields.get('otherVehicle') || '').trim();
  if (other && !otherText) {
    form.elements.otherVehicle.setCustomValidity('Lütfen aracınızın marka ve modelini yazın.');
    form.elements.otherVehicle.reportValidity();
    return null;
  }
  return {
    brand: other ? (fields.get('brand') === 'other' ? '' : fields.get('brand')) : fields.get('brand'),
    model: other ? otherText : fields.get('model'),
    year: fields.get('year'),
    city: String(fields.get('city') || '').trim(),
    detail: String(fields.get('detail') || '').trim(),
  };
}

function showOutput(vehicle, data) {
  document.querySelector('#quote-message').value = quoteMessage(vehicle);
  document.querySelector('#copy-status').textContent = '';
  const whatsapp = document.querySelector('#whatsapp-send');
  if (whatsapp && data.whatsapp) whatsapp.href = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(quoteMessage(vehicle))}`;
  quoteForm.hidden = true;
  output.hidden = false;
  document.querySelector('#copy-message').focus();
}

async function openQuote(trigger, selection = {}) {
  opener = trigger;
  const data = await getCatalog();
  quoteForm.hidden = false;
  output.hidden = true;
  quoteForm.reset();
  const brand = selection.brand || trigger.dataset.brand || '';
  const model = selection.model || trigger.dataset.model || '';
  const knownBrand = [...quoteForm.elements.brand.options].some(o => o.value === brand);
  quoteForm.elements.brand.value = knownBrand ? brand : 'other';
  setModels(quoteForm, data, model);
  if (model && !data.vehicles.some(v => v.brand === brand && v.model === model)) {
    if (knownBrand && brand) quoteForm.elements.model.value = 'other';
    else quoteForm.elements.brand.value = 'other';
    updateOther(quoteForm);
    quoteForm.elements.otherVehicle.value = model;
  }
  if (selection.year) quoteForm.elements.year.value = selection.year;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
}

function showError(form, error) {
  let node = form.querySelector('.form-error');
  if (!node) { node = document.createElement('p'); node.className = 'form-error'; node.setAttribute('role', 'alert'); form.append(node); }
  node.textContent = error.message;
}

document.querySelectorAll('[data-quote]').forEach(button => button.addEventListener('click', () => {
  openQuote(button).catch(error => { dialog.showModal(); document.body.classList.add('modal-open'); showError(quoteForm, error); });
}));

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener?.focus(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
document.querySelector('#edit-message').addEventListener('click', () => {
  output.hidden = true; quoteForm.hidden = false; quoteForm.elements.brand.focus();
});

document.querySelectorAll('[data-finder], #quote-form').forEach(form => {
  const clearResult = () => {
    const result = form.querySelector('.finder-result');
    if (result) { result.hidden = true; result.replaceChildren(); }
    form.querySelector('.form-error')?.remove();
  };
  form.elements.brand.addEventListener('change', async () => {
    clearResult();
    try { setModels(form, await getCatalog()); } catch (error) { showError(form, error); }
  });
  form.elements.model.addEventListener('change', () => { clearResult(); updateOther(form); });
  form.elements.year.addEventListener('change', clearResult);
  form.elements.otherVehicle.addEventListener('input', () => { clearResult(); form.elements.otherVehicle.setCustomValidity(''); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const vehicle = readVehicle(form);
    if (!vehicle) return;
    try {
      const data = await getCatalog();
      if (form === quoteForm) { showOutput(vehicle, data); return; }
      const result = form.querySelector('.finder-result');
      result.replaceChildren();
      const heading = document.createElement('h3');
      heading.textContent = [vehicle.year, vehicle.brand, vehicle.model].filter(Boolean).join(' ');
      const copy = document.createElement('p');
      copy.textContent = 'Araç bilgileriniz hazır. Uyumlu kit, stok ve montaj koşulları teknik kontrol sonrası teyit edilmelidir.';
      const action = document.createElement('button');
      action.type = 'button'; action.className = 'button'; action.textContent = 'Bu araç için teklif mesajı hazırla ↗';
      action.addEventListener('click', () => openQuote(action, vehicle).catch(error => showError(form, error)));
      result.append(heading, copy, action);
      const match = data.vehicles.find(v => v.brand === vehicle.brand && v.model === vehicle.model);
      if (match) {
        const link = document.createElement('a'); link.className = 'text-link'; link.href = match.path; link.textContent = 'Model sayfasını incele →'; result.append(link);
      }
      result.hidden = false;
    } catch (error) { showError(form, error); }
  });
});

document.querySelector('#copy-message').addEventListener('click', async () => {
  const text = document.querySelector('#quote-message');
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(text.value);
    status.textContent = 'Mesaj kopyalandı. Talebiniz henüz gönderilmedi.';
  } catch {
    text.focus(); text.select();
    status.textContent = 'Mesajı seçtik. Cihazınızın kopyalama komutunu kullanın. Talebiniz henüz gönderilmedi.';
  }
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const closeMenu = () => { menuButton.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen)); nav.classList.toggle('is-open', !isOpen);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
matchMedia('(min-width: 1001px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
