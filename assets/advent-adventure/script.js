'use strict';
const screenshotTrack = document.querySelector('#screenshots-track');
if (screenshotTrack) {
  const previous = document.querySelector('.screens-previous');
  const next = document.querySelector('.screens-next');
  document.querySelector('.app-screens-controls').hidden = false;
  function syncScreenshotControls() {
    previous.disabled = screenshotTrack.scrollLeft <= 1;
    next.disabled = screenshotTrack.scrollLeft + screenshotTrack.clientWidth >= screenshotTrack.scrollWidth - 1;
  }
  function scrollScreenshots(direction) {
    const card = screenshotTrack.querySelector('.app-screen');
    const gap = parseFloat(getComputedStyle(screenshotTrack).columnGap);
    screenshotTrack.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  }
  previous.addEventListener('click', () => scrollScreenshots(-1));
  next.addEventListener('click', () => scrollScreenshots(1));
  screenshotTrack.addEventListener('scroll', syncScreenshotControls, {passive: true});
  new ResizeObserver(syncScreenshotControls).observe(screenshotTrack);
  syncScreenshotControls();
}

const dayTitles = {
  1: 'A cup of cozy',
  2: 'Let it snow',
  3: 'A song to share',
  4: 'Little feathered friends'
};
document.querySelectorAll('.magic-window').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.opened === 'true') return;
    const day = button.dataset.day;
    button.dataset.opened = 'true';
    button.classList.add('unwrapped');
    button.setAttribute('aria-label', `December ${day}: ${dayTitles[day]}`);
    button.setAttribute('aria-disabled', 'true');
    button.querySelector('.window-caption').textContent = dayTitles[day];
    document.querySelector('#unwrap-status').textContent = `December ${day} unwrapped: ${dayTitles[day]}.`;
  });
});

// Music starts only after an explicit click.
const music = document.querySelector('#christmas-music');
const musicToggle = document.querySelector('.music-toggle');
if (music && musicToggle) {
  music.volume = 0.35;
  function syncMusicControl() {
    musicToggle.setAttribute('aria-pressed', String(!music.paused));
    musicToggle.querySelector('.music-label').textContent = music.paused ? 'Christmas music' : 'Music playing · pause';
  }
  musicToggle.addEventListener('click', async () => {
    if (!music.paused) { music.pause(); return; }
    try {
      await music.play();
      document.querySelector('#music-status').textContent = 'Playing Jingle Toytime, the music from day 3.';
    } catch {
      document.querySelector('#music-status').textContent = 'Music could not start. Please try again.';
      syncMusicControl();
    }
  });
  music.addEventListener('play', syncMusicControl);
  music.addEventListener('pause', syncMusicControl);
  document.addEventListener('visibilitychange', () => { if (document.hidden) music.pause(); });
}
// Pause ambient animation offscreen; CSS still respects Reduce Motion.
document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-hidden', document.hidden));
