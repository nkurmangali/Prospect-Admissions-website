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
      slidesPerView: el.id === 'gallery-reviews' ? 1.25 : 1.08,
      spaceBetween: 16,
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
