const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-nav]');

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  navigation.classList.toggle('open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

let previousScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const isMobile = window.matchMedia('(max-width: 599px)').matches;
  const menuIsOpen = menuButton.getAttribute('aria-expanded') === 'true';

  header.classList.toggle('scrolled', currentScrollY > 12);

  if (!isMobile || menuIsOpen || currentScrollY < 70) {
    header.classList.remove('mobile-hidden');
  } else if (currentScrollY > previousScrollY + 5) {
    header.classList.add('mobile-hidden');
  } else if (currentScrollY < previousScrollY - 5) {
    header.classList.remove('mobile-hidden');
  }

  previousScrollY = currentScrollY;
}, { passive: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

const aboutSlider = document.querySelector('[data-about-slider]');

if (aboutSlider) {
  const slides = [...aboutSlider.querySelectorAll('[data-about-slide]')];
  const counter = aboutSlider.querySelector('[data-about-counter]');
  let activeSlide = 0;

  const showSlide = (nextIndex) => {
    activeSlide = (nextIndex + slides.length) % slides.length;

    slides.forEach((video, index) => {
      const isActive = index === activeSlide;
      video.classList.toggle('active', isActive);
      video.setAttribute('aria-hidden', String(!isActive));

      if (isActive) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    counter.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  aboutSlider.querySelector('[data-about-prev]').addEventListener('click', () => showSlide(activeSlide - 1));
  aboutSlider.querySelector('[data-about-next]').addEventListener('click', () => showSlide(activeSlide + 1));
  showSlide(0);
}
