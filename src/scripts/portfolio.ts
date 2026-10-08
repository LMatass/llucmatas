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

const elevator = document.querySelector<HTMLElement>('[data-elevator]');
if (elevator) {
  const allStops = Array.from(elevator.querySelectorAll<HTMLAnchorElement>('.elevator-shaft a'));
  // Sections can be absent (e.g. no contribution graph), so drop their stops.
  allStops.filter(stop => !document.querySelector(stop.hash)).forEach(stop => stop.closest('li')?.remove());
  const stops = allStops.filter(stop => stop.isConnected);
  const targets = stops.map(stop => document.querySelector<HTMLElement>(stop.hash)!);
  const car = elevator.querySelector<HTMLElement>('.elevator-car')!;
  const fill = elevator.querySelector<HTMLElement>('.elevator-fill')!;
  const stepButtons = Array.from(elevator.querySelectorAll<HTMLButtonElement>('[data-elevator-step]'));
  const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
  // Scroll position that brings each stop into view; the last ones clamp at the page bottom.
  const positions = () => targets.map(t => Math.min(Math.max(topOf(t) - 42, 0), maxScroll()));
  let index = 0;
  const render = () => {
    const y = window.scrollY;
    const pos = positions();
    const centers = stops.map(s => s.offsetTop + s.offsetHeight / 2);
    let i = 0;
    for (let k = 0; k < pos.length; k++) if (y >= pos[k] - window.innerHeight * .3) i = k;
    if (maxScroll() > 0 && y >= maxScroll() - 4) i = pos.length - 1;
    index = i;
    let carY = centers[i];
    if (i < pos.length - 1 && pos[i + 1] > pos[i]) {
      const frac = Math.min(Math.max((y - pos[i]) / (pos[i + 1] - pos[i]), 0), 1);
      carY = centers[i] + frac * (centers[i + 1] - centers[i]);
    }
    car.style.transform = `translate(-50%, ${carY - 7}px)`;
    fill.style.height = `${carY}px`;
    stops.forEach((s, k) => {
      s.toggleAttribute('data-passed', k <= i);
      if (k === i) s.setAttribute('aria-current', 'location'); else s.removeAttribute('aria-current');
    });
    stepButtons[0].disabled = y <= 2;
    stepButtons[1].disabled = maxScroll() > 0 && y >= maxScroll() - 2;
  };
  const goTo = (k: number) => {
    const pos = positions();
    window.scrollTo({ top: pos[k], behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  stops.forEach((stop, k) => stop.addEventListener('click', event => { event.preventDefault(); goTo(k); history.replaceState(null, '', stop.hash); }));
  stepButtons.forEach(button => button.addEventListener('click', () => goTo(Math.min(Math.max(index + Number(button.dataset.elevatorStep), 0), stops.length - 1))));
  let pending = false;
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; render(); }); } }, { passive: true });
  window.addEventListener('resize', render);
  new ResizeObserver(render).observe(document.body);
  render();
}

export {};

const card = document.querySelector<HTMLElement>('[data-contribution-card]');
const tooltip = card?.querySelector<HTMLElement>('.contribution-tooltip');
if (card && tooltip) {
  let active: HTMLElement | null = null;
  const hide = () => {
    tooltip.hidden = true;
    active?.classList.remove('active');
    active = null;
  };
  const show = (cell: HTMLElement) => {
    if (active === cell) return;
    active?.classList.remove('active');
    active = cell;
    const count = Number(cell.dataset.count);
    tooltip.innerHTML = `<strong>${count === 0 ? 'No contributions' : `${count} contribution${count === 1 ? '' : 's'}`}</strong><br>${cell.dataset.date}`;
    tooltip.hidden = false;
    const cardBox = card.getBoundingClientRect();
    const box = cell.getBoundingClientRect();
    const half = tooltip.offsetWidth / 2;
    const center = box.left - cardBox.left + box.width / 2;
    tooltip.style.left = `${Math.min(Math.max(center, half + 8), cardBox.width - half - 8)}px`;
    tooltip.style.top = `${box.top - cardBox.top}px`;
  };
  const cellAt = (target: EventTarget | null) => (target as HTMLElement | null)?.closest<HTMLElement>('.contribution-graph .cell') ?? null;
  card.addEventListener('pointerover', (event) => {
    const cell = cellAt(event.target);
    if (cell) show(cell);
    else hide();
  });
  card.addEventListener('pointerleave', hide);
  card.addEventListener('pointerdown', (event) => {
    const cell = cellAt(event.target);
    if (cell) show(cell);
  });
  const scroller = card.querySelector<HTMLElement>('.contribution-scroll');
  scroller?.addEventListener('scroll', hide, { passive: true });
  // Narrow screens open on the most recent weeks.
  if (scroller) scroller.scrollLeft = scroller.scrollWidth;
}
