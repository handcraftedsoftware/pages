'use strict';
const assetBase = new URL('assets/', document.currentScript.src);
// A gentle browser sample, independent of the native game's levels and scoring.
const seasons = ['winter', 'spring', 'summer', 'autumn'];
const descriptions = ['in a snowy forest', 'among spring blossoms', 'in a summer forest', 'among autumn trees'];
const scene = document.querySelector('.scene');
const windowLayer = document.querySelector('#windows');
const hint = document.querySelector('#scene-hint');
const pauseButton = document.querySelector('.motion-toggle');
const dialog = document.querySelector('#coming-dialog');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const soundtrack = new Audio();
soundtrack.hidden = true;
document.body.append(soundtrack);
soundtrack.loop = true;
soundtrack.volume = 0.3;
soundtrack.preload = 'none';
const soundButton = document.querySelector('.sound-toggle');
let soundEnabled = false, audioSeason = -1, audioRequest = 0;
let season = 0, active = 1, catches = 0, caught = -1, paused = false, timer;
let visible = true;
function canRun() { return visible && !paused && !document.hidden && !dialog.open; }
function queueNext(delay = 3200) {
  clearTimeout(timer);
  if (!canRun()) return;
  // Keep the lit target still for visitors who request reduced motion.
  if (reducedMotion.matches && caught < 0) return;
  timer = setTimeout(() => {
    caught = -1;
    active = (active + 1 + Math.floor(Math.random() * 5)) % 6;
    paintWindows();
    queueNext();
  }, delay);
}
function paintWindows() {
  windowLayer.querySelectorAll('button').forEach((button, index) => {
    button.classList.toggle('lit', active === index && caught < 0);
    button.classList.toggle('caught', caught === index);
    button.setAttribute('aria-label', `Window ${index + 1}: ${caught === index ? 'gnome found' : active === index && caught < 0 ? 'light on, catch the gnome' : 'dark'}`);
    button.setAttribute('aria-disabled', String(paused || caught >= 0));
  });
}
function catchGnome(index) {
  if (!canRun() || caught >= 0) return;
  if (index !== active) {
    hint.textContent = 'Follow the warm glow to find your gnome.';
    return;
  }
  caught = index;
  catches += 1;
  document.querySelector('#count').textContent = catches;
  document.querySelector('.catch-counter').setAttribute('aria-label', `Gnomes found: ${catches}`);
  hint.textContent = catches === 3 ? 'A little wreath. A little more like home.' : catches > 3 ? 'There you are. Welcome home, little friend!' : ['Hello, little friend! Two more for a surprise.', 'One more friend. One little surprise.'][catches - 1];
  document.querySelector('.reward-wreath').hidden = catches < 3;
  paintWindows();
  queueNext(1400);
}
function setSeason(index) {
  clearTimeout(timer);
  season = index;
  document.querySelector('.night-section').dataset.season = seasons[season];
  syncAudio();
  caught = -1;
  const art = document.querySelector('.house-art');
  art.src = `${assetBase}cottage-${seasons[season]}.webp`;
  art.alt = `A six-window felt cottage ${descriptions[season]}`;
  document.querySelectorAll('[data-season]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.season) === season)));
  document.querySelector('.snow').hidden = season !== 0;
  windowLayer.replaceChildren();
  WINDOW_BOUNDS[season].forEach(([x,y,w,h], i) => {
    const button = document.createElement('button');
    button.className = 'window';
    button.style.cssText = `left:${x/836*100}%;top:${y/470*100}%;width:${w/836*100}%;height:${h/470*100}%`;
    button.innerHTML = `<img class="gnome" src="${assetBase}gnome.webp" alt=""><img class="frame" src="${assetBase}frame-${season}-${i}.png" alt="">`;
    button.addEventListener('click', () => catchGnome(i));
    windowLayer.append(button);
  });
  hint.textContent = paused ? 'Tea break. Your little world can wait.' : 'Psst… tap the glowing window';
  paintWindows();
  queueNext();
}
document.querySelectorAll('[data-season]').forEach(button => button.addEventListener('click', () => setSeason(Number(button.dataset.season))));
pauseButton.addEventListener('click', () => {
  paused = !paused;
  scene.classList.toggle('paused', paused);
  pauseButton.setAttribute('aria-pressed', String(paused));
  pauseButton.setAttribute('aria-label', paused ? 'Resume preview' : 'Pause preview');
  pauseButton.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
  hint.textContent = paused ? 'Tea break. Your little world can wait.' : 'Psst… tap the glowing window';
  paintWindows();
  queueNext(caught >= 0 ? 1400 : 3200);
  syncAudio();
});
for (let i = 0; i < 14; i++) {
  const flake = document.createElement('i');
  flake.style.cssText = `--x:${(i * 37) % 100}%;--duration:${7+i%5}s;--delay:-${i*.83}s`;
  document.querySelector('.snow').append(flake);
}
document.querySelectorAll('[data-coming]').forEach(button => button.addEventListener('click', () => { dialog.showModal(); clearTimeout(timer); syncAudio(); }));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.dialog-return').addEventListener('click', () => {
  dialog.close();
  document.querySelector('#preview').scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth', block:'center'});
  windowLayer.querySelectorAll('button')[active].focus({preventScroll:true});
});
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});
dialog.addEventListener('close', () => { queueNext(caught >= 0 ? 1400 : 3200); syncAudio(); });
document.addEventListener('visibilitychange', () => { queueNext(caught >= 0 ? 1400 : 3200); syncAudio(); });
reducedMotion.addEventListener('change', () => queueNext());
new IntersectionObserver(entries => { visible = entries[0].isIntersecting; queueNext(caught >= 0 ? 1400 : 3200); }, {threshold:.15}).observe(scene);
async function syncAudio() {
  const request = ++audioRequest;
  soundButton.setAttribute('aria-pressed', String(soundEnabled));
  soundButton.setAttribute('aria-label', soundEnabled ? 'Turn seasonal music off' : 'Turn seasonal music on');
  soundButton.querySelector('span').textContent = soundEnabled ? 'A soundtrack for small wonders' : 'Sound on. World off.';
  if (!soundEnabled || paused || document.hidden || dialog.open) { soundtrack.pause(); return; }
  if (audioSeason !== season) {
    soundtrack.src = `${assetBase}audio/${seasons[season]}.m4a`;
    audioSeason = season;
  }
  try { await soundtrack.play(); }
  catch (error) {
    if (request !== audioRequest) return;
    soundEnabled = false;
    soundButton.setAttribute('aria-pressed', 'false');
    soundButton.setAttribute('aria-label', 'Try seasonal music again');
    soundButton.querySelector('span').textContent = 'Tap to try the music again';
  }
}
soundButton.addEventListener('click', () => { soundEnabled = !soundEnabled; syncAudio(); });
// The frame tilts as a single piece, so the artwork and window targets stay aligned.
const shell = document.querySelector('.scene-shell');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
scene.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !finePointer.matches || paused) return;
  const bounds = scene.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  shell.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) rotate(1deg)`;
});
scene.addEventListener('pointerleave', () => { shell.style.transform = ''; });
setSeason(0);
