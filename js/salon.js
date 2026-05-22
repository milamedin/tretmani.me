// Salon detail page logic: lightbox + phone reveal + view tracking.
(function () {
  // ===== Phone reveal =====
  const phoneBtn = document.getElementById('phone-reveal');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => {
      const phone = phoneBtn.dataset.phone || '+382 ## ### ###';
      phoneBtn.textContent = `📞 ${phone}`;
      phoneBtn.style.cursor = 'default';
      const id = phoneBtn.dataset.salonId;
      if (id && window.Tretmani) window.Tretmani.trackEvent(Number(id), 'phone_click');
    });
  }

  // ===== Track view on page load =====
  const main = document.querySelector('[data-salon-id]');
  if (main && window.Tretmani) {
    const id = Number(main.dataset.salonId);
    if (id) window.Tretmani.trackEvent(id, 'view');
  }

  // ===== Lightbox =====
  const galleryItems = document.querySelectorAll('#gallery [data-gallery-index]');
  const extraItems = document.querySelectorAll('#gallery-extra [data-gallery-index]');
  if (galleryItems.length === 0) return;

  const allSources = [];
  [...galleryItems, ...extraItems].forEach(el => {
    const idx = parseInt(el.dataset.galleryIndex, 10);
    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
    if (img) allSources[idx] = { src: img.src, alt: img.alt || '' };
  });

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCounter = document.getElementById('lightbox-counter');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');
  const btnClose = document.getElementById('lightbox-close');
  if (!lb || !lbImg) return;

  let current = 0;

  function show(idx) {
    if (idx < 0 || idx >= allSources.length) return;
    current = idx;
    const item = allSources[idx];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCounter.textContent = `${idx + 1} / ${allSources.length}`;
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === allSources.length - 1;
  }

  function open(idx) {
    show(idx);
    lb.classList.add('lightbox--open');
    document.body.classList.add('lightbox-open');
  }

  function close() {
    lb.classList.remove('lightbox--open');
    document.body.classList.remove('lightbox-open');
  }

  galleryItems.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open(parseInt(el.dataset.galleryIndex, 10));
    });
  });

  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  btnClose.addEventListener('click', (e) => { e.stopPropagation(); close(); });

  // Click image advances (loops back at end).
  lbImg.addEventListener('click', (e) => {
    e.stopPropagation();
    show((current + 1) % allSources.length);
  });
  lbImg.style.cursor = 'pointer';

  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox__inner') || e.target.classList.contains('lightbox__image-wrap')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('lightbox--open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
