/**
 * Hanifa Textiles - Drape Intro Animation Controller
 * Source: drape-intro-animation.html
 * 
 * Features:
 * - Physics-based cloth letters drop with elastic rebound
 * - Rising lower swoosh curve
 * - Dynamic fabric gather & lift via requestAnimationFrame polygon clip-path
 * - Full theme compatibility (Light & Dark)
 * - Accessible prefers-reduced-motion fallback
 */

(function () {
  const el = document.getElementById('drape-intro');
  if (!el) return;

  const btn = document.getElementById('replay');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Timeline (ms): letters land ≈1900, hold, cloth lifts HOLD → HOLD+LIFT
  const HOLD = 2100, LIFT = 1000, N = 28, SPREAD = 0.4, AMP = 14;
  let raf, timer;

  function ease(x) { 
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; 
  }
  
  function clamp(x) { 
    return Math.max(0, Math.min(1, x)); 
  }

  // Bottom edge of the cream cloth: gathers up from the centre, edges lag behind.
  function clip(p) {
    const pts = ['0% 0%', '100% 0%'];
    for (let i = N; i >= 0; i--) {
      const x = i / N, d = Math.abs(x - 0.5) * 2;
      const e = ease(clamp(p * (1 + SPREAD) - SPREAD * d));
      const y = (100 + AMP) * (1 - e) - AMP;
      pts.push((x * 100).toFixed(2) + '% ' + y.toFixed(2) + '%');
    }
    el.style.clipPath = 'polygon(' + pts.join(',') + ')';
  }

  function finish() {
    el.hidden = true;
    el.style.clipPath = '';
    el.classList.remove('play', 'lift');
    document.dispatchEvent(new CustomEvent('drape:intro-done'));
  }

  function play() {
    cancelAnimationFrame(raf); 
    clearTimeout(timer);
    el.hidden = false;
    el.classList.remove('play', 'lift');
    el.style.clipPath = '';
    void el.offsetWidth; // restart CSS animations
    el.classList.add('play');

    if (reduce) { 
      timer = setTimeout(function () { 
        el.style.transition = 'opacity .4s'; 
        el.style.opacity = '0';
        setTimeout(function () { 
          el.style.opacity = ''; 
          el.style.transition = ''; 
          finish(); 
        }, 420); 
      }, 700); 
      return; 
    }

    timer = setTimeout(function () {
      el.classList.add('lift');
      const t0 = performance.now();
      (function step(now) {
        const p = clamp((now - t0) / LIFT);
        clip(p);
        if (p < 1) {
          raf = requestAnimationFrame(step); 
        } else {
          finish();
        }
      })(t0);
    }, HOLD);
  }

  if (btn) {
    btn.addEventListener('click', play);
  }
  // Delegated fallback for any dynamically added or later-rendered #replay button
  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('#replay')) {
      play();
    }
  });

  window.drapeIntro = { play: play, finish: finish };

  // Trigger intro on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', play);
  } else {
    play();
  }
})();
