document.documentElement.classList.add('js');

// Mobile menu
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  if (!header || !toggle) return;
  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });
  header.querySelectorAll('.nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      header.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
})();

// Reveal on scroll
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();

// FAQ: keep one answer open at a time
document.querySelectorAll('.faq-list').forEach(function (list) {
  list.querySelectorAll('details').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      list.querySelectorAll('details[open]').forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
});

// Offers / reviews gallery
(function () {
  if (typeof Swiper === 'undefined') return;
  var galleries = {};
  document.querySelectorAll('.gallery').forEach(function (el) {
    var wrap = el.closest('[data-gallery-wrap]') || el.parentElement;
    galleries[el.id] = new Swiper(el.querySelector('.swiper'), {
      slidesPerView: 1.12,
      spaceBetween: 20,
      grabCursor: true,
      navigation: {
        nextEl: wrap.querySelector('.gallery-next'),
        prevEl: wrap.querySelector('.gallery-prev'),
      },
      breakpoints: el.id === 'gallery-reviews'
        ? { 560: { slidesPerView: 2.2 }, 900: { slidesPerView: 3.2 }, 1180: { slidesPerView: 4 } }
        : { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    });
  });

  var tabs = document.querySelectorAll('.reviews-tabs button');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
      });
      var g = galleries[tab.getAttribute('aria-controls')];
      if (g) g.update();
    });
  });
})();


// Document viewer (offer letters, test reports, portfolio)
(function () {
  var box, img, title, sub, count, prevBtn, nextBtn, closeBtn, items = [], index = 0, lastFocus = null;

  function build() {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Просмотр документа');
    box.innerHTML =
      '<div class="lb-backdrop"></div>' +
      '<figure class="lb-frame"><div class="lb-scroll"><img alt=""></div>' +
      '<figcaption><b></b><span></span><em></em></figcaption></figure>' +
      '<button class="lb-btn lb-close" type="button" aria-label="Закрыть"><i class="fas fa-times"></i></button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Предыдущий документ"><i class="fas fa-arrow-left"></i></button>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Следующий документ"><i class="fas fa-arrow-right"></i></button>';
    document.body.appendChild(box);
    img = box.querySelector('.lb-scroll img');
    title = box.querySelector('figcaption b');
    sub = box.querySelector('figcaption span');
    count = box.querySelector('figcaption em');
    prevBtn = box.querySelector('.lb-prev');
    nextBtn = box.querySelector('.lb-next');
    closeBtn = box.querySelector('.lb-close');
    box.querySelector('.lb-backdrop').addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(index - 1); });
    nextBtn.addEventListener('click', function () { show(index + 1); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  function describe(link) {
    var fig = link.closest('.doc');
    if (fig && fig.querySelector('figcaption')) {
      return { t: fig.querySelector('figcaption b').textContent, s: fig.querySelector('figcaption span').textContent };
    }
    var card = link.closest('.case');
    if (card) {
      var name = card.querySelector('.post-name');
      var pill = card.querySelector('.pill');
      return { t: (name ? name.textContent : '') + (pill ? ' · ' + pill.textContent : ''), s: 'Письмо о зачислении' };
    }
    return { t: 'Отзыв ученика', s: '' };
  }

  function show(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    var link = items[index];
    var d = describe(link);
    img.src = link.getAttribute('href');
    img.alt = d.t;
    title.textContent = d.t;
    sub.textContent = d.s;
    count.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
    prevBtn.hidden = nextBtn.hidden = items.length < 2;
    box.querySelector('.lb-scroll').scrollTop = 0;
  }

  function open(link) {
    if (!box) build();
    var gallery = link.closest('.gallery');
    items = gallery ? Array.prototype.slice.call(gallery.querySelectorAll('.swiper-slide a')) : [link];
    lastFocus = link;
    box.hidden = false;
    document.body.classList.add('lb-open');
    show(items.indexOf(link));
    closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove('lb-open');
    img.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('.gallery .swiper-slide a, a.case-link');
    if (!link) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    open(link);
  });
})();
