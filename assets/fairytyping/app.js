'use strict';

// The exercise, seven-error limit, 126-point letter spacing and chase speed
// come from TypingSession.swift / GardenScene.swift. No network or saved input.
const exercise = 'fjf jfj fj jf fj';
const game = document.querySelector('.game');
const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const panel = document.querySelector('#game-panel');
const panelTitle = document.querySelector('#panel-title');
const panelText = document.querySelector('#panel-text');
const panelLabel = document.querySelector('#panel-label');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const hint = document.querySelector('#hint');
const status = document.querySelector('#game-status');
const music = document.querySelector('#lesson-music');
music.volume = 0.35;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const assets = {};
let state = 'idle', previousState = 'ready', completed = 0, mistakes = 0;
let elapsed = 0, travel = 0, exitDistance = 0, lastTime = 0, animationFrame = 0;
let ready = false, soundEnabled = false, audioContext, reactionUntil = 0, reaction = 0;
let wrongTimeout, visible = true;
let capture = null;

const frames = (prefix, length) => Array.from({length}, (_, i) => `${prefix}-${String(i).padStart(2,'0')}`);
const imageNames = ['garden', 'distant', 'orchard', 'foreground', 'bun', 'face', 'face-0', 'face-2', 'face-3', ...frames('granny',32), ...frames('granny-pickup',55), ...frames('granny-carry',32), ...frames('granny-carry-blink',32)];
const imagePromises = imageNames.map(name => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => { assets[name] = image; resolve(); };
  image.onerror = () => reject(new Error(`Could not load ${name}`));
  image.src = `/assets/fairytyping/assets/${name}.webp`;
}));
startButton.disabled = true;
startButton.textContent = 'Loading a little adventure…';
Promise.all(imagePromises).then(() => {
  ready = true;
  startButton.disabled = false;
  startButton.textContent = 'Start the adventure →';
  draw();
}).catch(() => {
  panelText.textContent = 'The illustrations could not load. Please refresh the page to try again.';
  startButton.textContent = 'Refresh page';
  startButton.disabled = false;
});

const keyboard = document.querySelector('#keyboard');
const keyButtons = new Map();
for (const row of ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', ' ']) {
  const container = document.createElement('div');
  container.className = 'key-row';
  for (const letter of row) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `key${'fj'.includes(letter) ? ' home' : ''}${letter === ' ' ? ' space' : ''}`;
    button.textContent = letter === ' ' ? 'SPACE' : letter.toUpperCase();
    button.setAttribute('aria-label', letter === ' ' ? 'Space' : letter.toUpperCase());
    button.dataset.key = letter;
    button.addEventListener('click', () => { submit(letter); game.focus({preventScroll:true}); });
    container.append(button);
    keyButtons.set(letter, button);
  }
  keyboard.append(container);
}
const dots = document.querySelector('.mistakes');
for (let i = 0; i < 7; i++) dots.append(document.createElement('i'));

function updateUI() {
  for (const [letter, button] of keyButtons) {
    button.classList.toggle('target', (state === 'ready' || state === 'playing') && letter === exercise[completed]);
    button.disabled = !['ready', 'playing'].includes(state);
  }
  [...dots.children].forEach((dot,i) => dot.classList.toggle('used', i < mistakes));
  dots.setAttribute('aria-label', `Mistakes: ${mistakes} of 7`);
  pauseButton.disabled = !['ready', 'playing', 'capturing', 'paused'].includes(state);
  pauseButton.textContent = state === 'paused' ? '▷' : 'Ⅱ';
  pauseButton.setAttribute('aria-label', state === 'paused' ? 'Continue' : 'Pause');
  if (state === 'ready' || state === 'playing') {
    const next = exercise[completed] === ' ' ? 'space' : exercise[completed].toUpperCase();
    status.textContent = `${completed} of ${exercise.length} · Mistakes: ${mistakes}/7 · Next: ${next}`;
    hint.hidden = completed > 0 && exercise[completed] !== ' ';
    hint.textContent = exercise[completed] === ' ' ? 'The long key at the bottom is Space' : 'Press F. The chase starts with your first correct letter.';
  } else {
    hint.hidden = true;
    if (state === 'capturing') status.textContent = 'Grandmother caught up · Taking Kolobok home';
  }
}

function reset() {
  if (!ready) return;
  completed = 0; mistakes = 0; elapsed = 0; travel = 0; exitDistance = 0;
  reaction = 0; reactionUntil = 0; state = 'ready';
  capture = null;
  music.currentTime = 0;
  syncMusic();
  panel.hidden = true;
  game.classList.remove('wrong');
  clearTimeout(wrongTimeout);
  updateUI();
  game.focus({preventScroll:true});
  draw();
  animate();
}

function submit(letter) {
  if (!['ready', 'playing'].includes(state) || !/^[a-z ]$/.test(letter)) return;
  if (letter === exercise[completed]) {
    state = 'playing';
    completed++;
    reaction = 2; reactionUntil = elapsed + 0.55;
    tone('correct');
    if (completed === exercise.length) finish(true);
  } else {
    mistakes++;
    reaction = 3; reactionUntil = elapsed + 0.8;
    tone('wrong');
    game.classList.add('wrong');
    clearTimeout(wrongTimeout);
    wrongTimeout = setTimeout(() => game.classList.remove('wrong'), 220);
    if (mistakes >= 7) finish(false, 'errors');
  }
  updateUI();
  draw();
  animate();
}

function showPanel(label, title, text, button) {
  panelLabel.textContent = label;
  panelTitle.textContent = title;
  panelText.textContent = text;
  startButton.textContent = button;
  panel.hidden = false;
}
function finish(won, reason) {
  state = won ? 'won' : 'lost';
  syncMusic();
  if (won) {
    tone('win');
    showPanel('Your first little victory', 'Hooray! You rolled away.', 'Your first lesson is complete! Two more free trails and new letters are waiting in the app.', 'Play again ↻');
    status.textContent = `Lesson complete · ${exercise.length} of ${exercise.length} · Mistakes: ${mistakes}/7`;
  } else {
    showPanel('Every story has another try', 'Let’s give it another go!', reason === 'errors' ? 'Seven mistakes end this attempt. Follow the golden key and try again. You can do it!' : 'Grandmother caught up! Type the glowing letters to keep Kolobok rolling.', 'Try again ↻');
    status.textContent = `Try again · ${completed} of ${exercise.length} · Mistakes: ${mistakes}/7`;
  }
  updateUI();
  startButton.focus({preventScroll:true});
}
function pause() {
  if (!['ready', 'playing', 'capturing'].includes(state)) return;
  previousState = state;
  state = 'paused';
  syncMusic();
  showPanel('A little moment to rest', 'The story can wait.', 'Kolobok and Grandmother are taking a break too. Continue when you’re ready.', 'Continue →');
  status.textContent = 'Paused · Select Continue or press Esc';
  updateUI();
  draw();
}
function resume() {
  if (state !== 'paused') return;
  state = previousState;
  syncMusic();
  panel.hidden = true;
  lastTime = 0;
  updateUI();
  game.focus({preventScroll:true});
  animate();
}
startButton.addEventListener('click', () => {
  if (!ready) { location.reload(); return; }
  if (state === 'paused') resume(); else reset();
});
pauseButton.addEventListener('click', () => state === 'paused' ? resume() : pause());
document.querySelector('#reset').addEventListener('click', reset);
document.querySelectorAll('[data-play-link]').forEach(link => link.addEventListener('click', () => {
  // Keep the initial click a deliberate scroll; the Start button begins the demo.
  if (panel.hidden) game.focus({preventScroll:true});
  else startButton.focus({preventScroll:true});
}));
game.addEventListener('keydown', event => {
  if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
  if (event.repeat) {
    if (['ready','playing'].includes(state) && /^[a-z ]$/i.test(event.key)) event.preventDefault();
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    if (state === 'paused') resume(); else pause();
    return;
  }
  // Native Enter/Space activation remains available for controls and dialogs.
  if (!['ready', 'playing'].includes(state)) return;
  if (event.target.closest('button') && !event.target.classList.contains('key')) return;
  const letter = event.key.toLowerCase();
  if (/^[a-z ]$/.test(letter)) { event.preventDefault(); submit(letter); }
  else if (/[а-яё]/i.test(letter)) {
    hint.hidden = false;
    hint.textContent = 'Switch your keyboard to an English layout';
  }
});
game.addEventListener('focusout', event => { if (!game.contains(event.relatedTarget)) pause(); });
window.addEventListener('blur', pause);
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;
  if (!visible) pause(); else animate();
}, {threshold:0.15}).observe(game);

document.querySelector('#sound').addEventListener('click', event => {
  soundEnabled = !soundEnabled;
  const button = event.currentTarget;
  button.setAttribute('aria-pressed', String(soundEnabled));
  button.setAttribute('aria-label', soundEnabled ? 'Turn sound off' : 'Turn sound on');
  syncMusic();
  if (soundEnabled) tone('correct');
  if (['ready','playing','capturing'].includes(state)) game.focus({preventScroll:true});
});
function syncMusic() {
  if (soundEnabled && ['ready', 'playing', 'capturing'].includes(state)) {
    if (music.paused) music.play().catch(() => { /* Playback may be blocked; the lesson still works silently. */ });
  } else {
    music.pause();
  }
}
function tone(kind) {
  if (!soundEnabled) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const notes = kind === 'win' ? [523,659,784] : kind === 'wrong' ? [260,220] : [660];
    notes.forEach((frequency, i) => {
      const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
      const now = audioContext.currentTime + i * .11;
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.075, now + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .2);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(now); oscillator.stop(now + .21);
    });
  } catch { /* Audio is optional; silent play remains available. */ }
}

function tile(image, offset, y, height, cropBottom = 0) {
  const width = 1672, base = Math.floor(offset / width), remainder = offset % width;
  for (let i=0; i<2; i++) {
    ctx.save();
    ctx.translate(i * width - remainder, y);
    if ((base+i)%2) { ctx.translate(width,0); ctx.scale(-1,1); }
    ctx.drawImage(image, 0, 0, image.width, image.height * (1-cropBottom), 0, 0, width, height);
    ctx.restore();
  }
}
function shadow(x,y,rx,ry) {
  ctx.fillStyle = '#73512c26'; ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2); ctx.fill();
}
function beginCapture() {
  capture = {time: 0, origin: -190 + elapsed*92 - travel*126};
  state = 'capturing';
  updateUI();
}
function carryDistance() {
  return Math.max(0, capture.time - .25 - 1.8 - .15) * 92;
}
function drawCapture() {
  // Original GardenScene timing, dimensions and 55-frame lift / 32-frame gait.
  const lift = Math.max(0, capture.time - .25);
  const walking = Math.max(0, lift - 1.8);
  const frame = Math.floor(walking*92/(50.18*.88)*32)%32;
  const name = lift < 1.8 ? `granny-pickup-${String(Math.min(54,Math.floor(lift/1.8*54))).padStart(2,'0')}` : `granny-carry-${String(reducedMotion.matches?0:frame).padStart(2,'0')}`;
  const x = capture.origin + 20 + carryDistance(), y = 350;
  ctx.save();
  ctx.globalAlpha = Math.min(1,capture.time/.25);
  ctx.drawImage(assets[name],x-200,y-180,400,360);
  const blinkTime = (walking-1.5)%3.3;
  if (walking>=1.5 && blinkTime<.18 && !reducedMotion.matches) {
    ctx.globalAlpha *= Math.min(1,blinkTime/.045,(.18-blinkTime)/.07);
    ctx.drawImage(assets[`granny-carry-blink-${String(frame).padStart(2,'0')}`],x+15,y-60,110,120);
  }
  ctx.restore();
}
function draw() {
  if (!ready) return;
  ctx.clearRect(0,0,1672,570);
  const camera = travel * 126;
  const sceneryOffset = reducedMotion.matches ? 0 : camera;
  ctx.drawImage(assets.distant,0,0,1672,570);
  // Native scene: fixed hills, orchard at 45%, road at 100%, foreground at 125%.
  ctx.save(); ctx.beginPath(); ctx.rect(0,436,1672,134); ctx.clip();
  tile(assets.distant,sceneryOffset,0,570); ctx.restore();
  tile(assets.orchard,sceneryOffset*.45,0,446,180/732);
  const grannyX = -190 + elapsed*92 - camera;
  if (completed > 0) {
    shadow(grannyX+(capture?carryDistance():0),491,110,10);
    ctx.save();
    if (capture) ctx.globalAlpha = 1-Math.min(1,capture.time/.25);
    const frame = reducedMotion.matches ? 0 : Math.floor(elapsed*92/(5.6*8)*32)%32;
    ctx.drawImage(assets[`granny-${String(frame).padStart(2,'0')}`],grannyX-200,175,400,320);
    ctx.restore();
  }
  for (let i=completed; !capture && i<Math.min(completed+6,exercise.length); i++) {
    const x=660+(i+1-travel)*126, y=435;
    shadow(x,490,42,8);
    ctx.save();
    if (i===completed) {ctx.shadowColor='#fffbe3'; ctx.shadowBlur=15;}
    ctx.beginPath(); ctx.arc(x,y,45,0,Math.PI*2); ctx.fillStyle='#ffda66';ctx.fill();
    ctx.lineWidth=i===completed?7:2;ctx.strokeStyle=i===completed?'#fffbea':'#b6873c';ctx.stroke();
    ctx.restore();ctx.fillStyle='#5b402a';ctx.font='600 54px "Avenir Next", sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(exercise[i]===' '?'━':exercise[i].toUpperCase(),x,y+3);
  }
  const heroX = 660 + exitDistance;
  ctx.save();
  if (capture) ctx.globalAlpha = 1-Math.min(1,capture.time/.25);
  shadow(heroX,490,48,8);
  ctx.save();ctx.translate(heroX,442);
  if (!reducedMotion.matches && !capture) ctx.rotate(travel*Math.PI*2 + exitDistance/48);
  ctx.drawImage(assets.bun,-48,-48,96,96);
  const face = state==='won' ? assets.face : state==='lost'||capture ? assets['face-3'] : assets[`face-${elapsed<reactionUntil?reaction:0}`];
  ctx.drawImage(face,-48,-48,96,96);ctx.restore();
  ctx.restore();
  if (capture) drawCapture();
  tile(assets.foreground,sceneryOffset*1.25,142.5,427.5);
}
function animate() {
  if (animationFrame || !ready || !visible || !['ready','playing','capturing','won'].includes(state)) return;
  lastTime = 0;
  animationFrame = requestAnimationFrame(tick);
}
function tick(time) {
  animationFrame=0;
  const dt=lastTime?Math.min(.06,(time-lastTime)/1000):0;
  lastTime=time;
  if (state==='playing') elapsed+=dt;
  if (state==='playing'||state==='won') {
    travel += (completed-travel)*(1-Math.exp(-dt/.135));
    if (state==='won' && !reducedMotion.matches) exitDistance=Math.min(1120,exitDistance+dt*300);
    if (state==='playing' && -190+elapsed*92-travel*126>=555) beginCapture();
  }
  if (state==='capturing') {
    capture.time += dt;
    if (capture.origin+20+carryDistance()-200>1672) finish(false,'caught');
  }
  draw();
  if (visible && (state==='playing' || state==='capturing' || (state==='won' && !reducedMotion.matches && exitDistance<1120))) animationFrame=requestAnimationFrame(tick);
}
reducedMotion.addEventListener('change',draw);
updateUI();

const chapters = [
  ['A Little Bun’s Adventure','F J D K','Start with F, J, D and K in the garden. Grandmother follows behind.'],
  ['Rolling Away','S L A G H','Practise more home-row keys through golden wheat fields, with Grandfather on your trail.'],
  ['Hello, Hare!','E I R U','Try E, I, R and U as Hare follows you through the meadow.'],
  ['Into the Woods','T O W Y','Meet Wolf and four new keys in the daylight, rain and moonlit forest.'],
  ['Bear on the Trail','Q P Z X','Reach for Q, P, Z and X on the mountain trails with Bear.'],
  ['The Clever Fox','C V B N M','Try C, V, B, N and M by the pond, completing the set of 26 letters.']
];
const chapterList=document.querySelector('#chapter-list');
chapters.forEach(([title,keys,description],index)=>{
  const button=document.createElement('button');button.type='button';button.className='chapter';
  button.setAttribute('aria-pressed',String(index===0));
  const number=document.createElement('span');number.className='chapter-number';number.textContent=index+1;
  const name=document.createElement('span');name.className='chapter-name';name.textContent=title;
  const keyText=document.createElement('span');keyText.className='chapter-keys';keyText.textContent=keys;
  button.append(number,name,keyText);chapterList.append(button);
  button.addEventListener('click',()=>{
    chapterList.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    document.querySelector('#chapter-detail').textContent=description;
  });
});
document.querySelector('#chapter-detail').textContent=chapters[0][2];
