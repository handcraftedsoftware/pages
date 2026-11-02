const embeddedScenes = {"pattern": "/assets/isometric-drawing/pattern.webp", "bracket": "/assets/isometric-drawing/bracket.webp", "app-icon": "/assets/isometric-drawing/app-icon.png", "penrose": "/assets/isometric-drawing/penrose.webp", "house": "/assets/isometric-drawing/house.webp", "orbit": "/assets/isometric-drawing/orbit.webp"};
'use strict';
const artwork = document.querySelector('.hero-art');
const palettes = {
  lavender: ['#e0d6fa', '#ac97d6', '#73619d'],
  mint: ['#b7e5de', '#5ab9b0', '#347b89'],
  peach: ['#f9c9a9', '#e68e70', '#aa5260']
};
document.querySelectorAll('[data-palette]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-palette]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    ['--face-light', '--face-mid', '--face-dark'].forEach((property, index) => artwork.style.setProperty(property, palettes[button.dataset.palette][index]));
  });
});
const scenes = {
  house: ['A little house. A whole world of ideas.', 'Isometric Drawing on iPad showing a colorful isometric house and drawing tools'],
  pattern: ['Find your rhythm. Then break the pattern.', 'Isometric Drawing on iPad showing a colorful repeating geometric pattern'],
  penrose: ['Looks impossible. Feels like play.', 'Isometric Drawing on iPad showing an impossible Penrose triangle']
};
document.querySelectorAll('[data-scene]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-scene]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    const scene = button.dataset.scene;
    const image = document.querySelector('#scene-image');
    image.src = embeddedScenes[scene];
    image.alt = scenes[scene][1];
    document.querySelector('#scene-caption').textContent = scenes[scene][0];
  });
});
if (matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  const shape = document.querySelector('#penrose');
  artwork.addEventListener('pointermove', event => {
    const bounds = artwork.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    shape.style.transform = `perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) rotate(-8deg)`;
  });
  artwork.addEventListener('pointerleave', () => { shape.style.transform = ''; });
}

