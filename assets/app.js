/* Shared behaviour for tools and articles. Keep SHEET_ENDPOINT in sync with the one in index.html. */
window.SITE_CONFIG = {
  SHEET_ENDPOINT: 'https://script.google.com/macros/s/AKfycbzxdbuHbcXzywo33kp3hzoFAMJcpG1eE38urhcG0cMPkv_8qHa9krSNjgHJZUoDqh1lRQ/exec',
  BOOKING_URL: 'https://calendar.app.google/RzPqm7DdZs1npJMM7'
};

window.sendSignup = function (data) {
  var url = (window.SITE_CONFIG.SHEET_ENDPOINT || '').trim();
  if (!url) return Promise.resolve(true);
  return fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() })
    .then(function () { return true; }).catch(function () { return false; });
};

window.validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()); };
window.tzs = function (n) { return 'TZS ' + Math.round(n).toLocaleString('en-US'); };

/* Wire any <form data-gate="source"> : validates, sends to the Google Sheet, then calls window.onGateOpen(source). */
window.wireGates = function () {
  document.querySelectorAll('form[data-gate]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = f.querySelector('[name=email]'), nm = f.querySelector('[name=name]'), err = f.querySelector('.err-msg');
      if (!window.validEmail(em.value)) { err.textContent = 'Please enter a valid email address.'; em.focus(); return; }
      err.textContent = '';
      var src = f.getAttribute('data-gate');
      if (window.gateSource) src = window.gateSource(src);
      window.sendSignup({ email: em.value.trim(), name: nm ? nm.value.trim() : '', source: src }).then(function (ok) {
        if (!ok) { err.textContent = 'Something went wrong. Please try again.'; return; }
        try { localStorage.setItem('as-email-given', '1'); } catch (x) {}
        if (window.onGateOpen) window.onGateOpen(src);
      });
    });
  });
};

(function () {
  var root = document.documentElement, btn = document.getElementById('themeBtn'), icon = document.getElementById('themeIcon');
  var sun = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>';
  var moon = '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"></path>';
  function dark() { var t = root.getAttribute('data-theme'); if (t) return t === 'dark'; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches; }
  function paint() { if (icon) icon.innerHTML = dark() ? moon : sun; }
  try { var s = localStorage.getItem('as-theme'); if (s) root.setAttribute('data-theme', s); } catch (e) {}
  paint();
  if (btn) btn.addEventListener('click', function () { var n = dark() ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem('as-theme', n); } catch (e) {} paint(); });
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
