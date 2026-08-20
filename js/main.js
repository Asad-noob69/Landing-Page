/* PilotSDR, shared interactions
   1. Sticky nav: transparent on hero, solid on scroll
   2. Mobile hamburger menu
   3. Calm scroll-reveal (fade + slide up)
   4. FAQ accordion
*/
(function () {
  'use strict';

  /* ---------- 1. Sticky nav solid-on-scroll ---------- */
  var nav = document.querySelector('.nav');
  // Pages without a transparent hero start solid immediately.
  var startSolid = nav && nav.dataset.solid === 'true';

  function onScroll() {
    if (!nav) return;
    if (startSolid || window.scrollY > 24) {
      nav.classList.add('solid');
    } else {
      nav.classList.remove('solid');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close when a link is tapped
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 4. FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');
      // close all (single-open accordion)
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = null;
        openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- 5. Scroll-progress bar (site-wide) ---------- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? (window.scrollY / max) : 0;
    bar.style.width = (Math.min(1, Math.max(0, p)) * 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- 6. ScrollStack (pinned stacking cards) ---------- */
  var stack = document.querySelector('.scroll-stack');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (stack && !reduceMotion) {
    var cards = Array.prototype.slice.call(stack.querySelectorAll('.scroll-stack-card'));
    var tops = [];
    var itemScale = 0.04;   // each deeper card shrinks by 4%
    var baseScale = 0.88;   // floor for the deepest card
    var ticking = false;

    function measure() {
      tops = cards.map(function (c) { return parseFloat(getComputedStyle(c).top) || 0; });
    }
    function render() {
      ticking = false;
      for (var i = 0; i < cards.length; i++) {
        var depth = 0; // how many later cards have pinned on top of this one
        for (var j = i + 1; j < cards.length; j++) {
          if (cards[j].getBoundingClientRect().top <= tops[j] + 1) depth++;
        }
        var scale = Math.max(baseScale, 1 - depth * itemScale);
        cards[i].style.transform = 'scale(' + scale.toFixed(4) + ')';
        cards[i].style.opacity = (1 - depth * 0.05).toFixed(3);
      }
    }
    function onStackScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(render); }
    }
    measure();
    render();
    window.addEventListener('scroll', onStackScroll, { passive: true });
    window.addEventListener('resize', function () { measure(); render(); });
  }

  /* ---------- 7. Scroll timeline (How it works) ---------- */
  var timeline = document.querySelector('.timeline');
  if (timeline && !reduceMotion) {
    var tlFill = timeline.querySelector('.tl-fill');
    var tlTrack = timeline.querySelector('.tl-track');
    var tlBeam = document.createElement('div');   // glowing dot that rides the line
    tlBeam.className = 'tl-beam';
    timeline.appendChild(tlBeam);
    var tlTicking = false;
    function tlRender() {
      tlTicking = false;
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var H = timeline.offsetHeight;
      var denom = H - vh * 0.4;             // Aceternity offset: start 10% -> end 50%
      if (denom < 1) denom = H;
      var p = (vh * 0.1 - rect.top) / denom;
      p = Math.min(1, Math.max(0, p));
      var fh = p * tlTrack.offsetHeight;
      tlFill.style.height = fh + 'px';
      tlFill.style.opacity = Math.min(1, p / 0.08).toFixed(3);   // fade in over first slice
      tlBeam.style.transform = 'translateY(' + fh + 'px)';
      tlBeam.style.opacity = (p > 0.01 && p < 0.994) ? '1' : '0';
    }
    function onTimeline() {
      if (!tlTicking) { tlTicking = true; requestAnimationFrame(tlRender); }
    }
    window.addEventListener('scroll', onTimeline, { passive: true });
    window.addEventListener('resize', onTimeline);
    tlRender();
  }

  /* ---------- 8. Contact form (submits to Formspree; delivered to earnest@ via Formspree config) ---------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.querySelector('#form-status');
      var btn = form.querySelector('button[type="submit"]');
      var action = form.getAttribute('action') || '';

      function show(msg) {
        if (!note) return;
        note.hidden = false;
        note.textContent = msg;
      }

      // Guard: form not connected yet.
      if (action.indexOf('YOUR_FORM_ID') !== -1 || action.indexOf('formspree.io/f/') === -1) {
        show('This form is not connected yet. Add your Formspree form ID in contact.html to start receiving messages.');
        return;
      }

      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
      show('Sending your message…');

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          show('Thanks! Your message has been sent. We will get back to you shortly.');
          form.reset();
        } else {
          res.json().then(function (data) {
            var msg = (data && data.errors) ? data.errors.map(function (er) { return er.message; }).join(', ')
                                            : 'Something went wrong. Please email sales@pilotsdr.com directly.';
            show(msg);
          }).catch(function () {
            show('Something went wrong. Please email sales@pilotsdr.com directly.');
          });
        }
      }).catch(function () {
        show('Network error. Please email sales@pilotsdr.com directly.');
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Send Message'; }
      });
    });
  }
})();
