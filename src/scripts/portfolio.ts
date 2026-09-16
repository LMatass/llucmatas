const strip = document.querySelector<HTMLElement>('#project-strip');
const controls = document.querySelector<HTMLElement>('.project-controls');
const previous = document.querySelector<HTMLButtonElement>('.previous');
const next = document.querySelector<HTMLButtonElement>('.next');
const projectStatus = document.querySelector<HTMLElement>('[data-project-status]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (strip && controls && previous && next) {
  const projects = Array.from(strip.querySelectorAll<HTMLElement>('.project'));
  const sync = () => {
    const max = strip.scrollWidth - strip.clientWidth;
    controls.hidden = max <= 2;
    previous.disabled = strip.scrollLeft <= 2;
    next.disabled = strip.scrollLeft >= max - 2;
  };
  const browse = (direction: number) => {
    const step = projects[1] ? projects[1].offsetLeft - projects[0].offsetLeft : strip.clientWidth;
    strip.scrollBy({ left: step * direction, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => browse(-1));
  next.addEventListener('click', () => browse(1));
  strip.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const current = projects.findIndex(project => project.contains(document.activeElement));
    let index = current;
    if (event.key === 'ArrowRight') index = Math.min(current + 1, projects.length - 1);
    else if (event.key === 'ArrowLeft') index = Math.max(current - 1, 0);
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = projects.length - 1;
    else return;
    event.preventDefault();
    projects[index]?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
    const max = strip.scrollWidth - strip.clientWidth;
    strip.scrollTo({ left: Math.min(projects[index].offsetLeft, max), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    if (projectStatus) projectStatus.textContent = `${projects[index].querySelector('h3')?.textContent}, project ${index + 1} of ${projects.length}`;
  });
  strip.addEventListener('scroll', sync, { passive: true });
  new ResizeObserver(sync).observe(strip);
  sync();
}

const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.section-nav a'));
const sections = navLinks.map(link => document.querySelector<HTMLElement>(link.hash));
let framePending = false;
let selectedAnchor = navLinks.some(link => link.hash === location.hash) ? location.hash.slice(1) : '';
let selectedHash = location.hash;
const updateNavigation = () => {
  const atBottom = window.scrollY > 20 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  let current = atBottom ? 'contact' : 'me';
  if (!atBottom && sections[1] && sections[1].getBoundingClientRect().top < window.innerHeight * .4) current = 'work';
  // Work and Contact can share the same final scroll position on a short page.
  // Preserve the chosen anchor until the visitor resumes manual scrolling.
  if (selectedAnchor) current = selectedAnchor;
  navLinks.forEach(link => {
    if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  framePending = false;
};
navLinks.forEach(link => link.addEventListener('click', () => {
  selectedAnchor = link.hash.slice(1);
  selectedHash = link.hash;
  updateNavigation();
}));
window.addEventListener('hashchange', () => {
  if (location.hash !== selectedHash) {
    selectedAnchor = navLinks.some(link => link.hash === location.hash) ? location.hash.slice(1) : '';
    selectedHash = location.hash;
  }
  updateNavigation();
});
const resumeScrollTracking = () => { selectedAnchor = ''; };
window.addEventListener('wheel', resumeScrollTracking, { passive: true });
window.addEventListener('touchmove', resumeScrollTracking, { passive: true });
window.addEventListener('keydown', event => {
  if (!event.defaultPrevented && ['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End', ' '].includes(event.key)) resumeScrollTracking();
});
window.addEventListener('pointerdown', event => {
  if (event.clientX >= document.documentElement.clientWidth) resumeScrollTracking();
});
window.addEventListener('scroll', () => {
  if (!framePending) { requestAnimationFrame(updateNavigation); framePending = true; }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();

export {};
