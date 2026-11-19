/* Trust, Will or Company? decision finder (Tanzania mainland) */
(function () {
  var Q = [
    { k: 'goal', t: 'What is your main goal?', h: 'Pick the one that matters most right now.',
      o: [['Keep the business running and separate its risk from my family’s assets', 'biz'], ['Pass wealth to my family smoothly', 'pass'], ['Look after children or dependants who cannot manage money themselves', 'care'], ['Hold property or investments across several ventures', 'hold'], ['Set aside assets for a charity, school, mosque, church or community purpose', 'char']] },
    { k: 'assets', t: 'What are your main assets?', h: '',
      o: [['Shares in one or more companies', 'shares'], ['Land and buildings', 'land'], ['Cash and investments', 'cash'], ['A mix of all of these', 'mix']] },
    { k: 'fam', t: 'Who depends on you?', h: '',
      o: [['Only me', 'self'], ['Spouse and adult children', 'adult'], ['Minor children', 'minor'], ['A dependant with special needs', 'special'], ['Extended family', 'ext']] },
    { k: 'will', t: 'Do you have a valid, up-to-date will?', h: '',
      o: [['Yes, recently reviewed', 'yes'], ['Yes, but it is old', 'old'], ['No', 'no']] },
    { k: 'partners', t: 'Do you own your business with partners or co-founders?', h: '',
      o: [['Yes', 'yes'], ['No', 'no']] },
    { k: 'x', t: 'Do you have family members or assets outside Tanzania, or non-citizen heirs?', h: 'This affects land in particular.',
      o: [['Yes', 'yes'], ['No', 'no']] }
  ];
  var A = {}, i = 0, $ = function (id) { return document.getElementById(id); };

  function render() {
    var q = Q[i];
    $('qmeta').innerHTML = '<span>Question ' + (i + 1) + ' of ' + Q.length + '</span><span>About 90 seconds</span>';
    $('bar').style.width = (i / Q.length * 100) + '%';
    $('qtext').textContent = q.t; $('qhelp').textContent = q.h;
    var box = $('opts'); box.innerHTML = '';
    q.o.forEach(function (o) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'opt' + (A[q.k] === o[1] ? ' sel' : '');
      b.innerHTML = '<span class="dot"></span><span>' + o[0] + '</span>';
      b.onclick = function () { A[q.k] = o[1]; render(); setTimeout(function () { if (i < Q.length - 1) { i++; render(); } else finish(); }, 180); };
      box.appendChild(b);
    });
    $('back').style.visibility = i === 0 ? 'hidden' : 'visible';
  }

  function finish() {
    var main, why, also = [], acts = [], ask = [];
    if (A.goal === 'char') {
      main = 'Registered Trustees'; why = 'For religious, educational, literary, scientific, social or charitable purposes, the Trustees’ Incorporation Act (Cap 318) lets trustees apply to the Administrator-General for incorporation as a body corporate. The name must include “Registered Trustees”.';
      acts.push('Write down the purpose and who the trustees will be.');
    } else if (A.goal === 'care' || A.fam === 'minor' || A.fam === 'special') {
      main = 'A trust, set up by an advocate'; why = 'When the people you want to protect cannot manage money themselves, a trust lets someone you choose hold and manage assets for them. Tanzania has no dedicated private-trust statute, so a family trust relies on the trust deed and general trust law. Quality of drafting matters a lot.';
      also.push('A will, so the trust is funded and your wishes are clear.');
      acts.push('Choose two trustees you trust, and a successor for each.', 'Write a letter of wishes describing how you want the trust used.');
      ask.push('How should the trust deed be drafted and stamped, and who holds legal title to shares or land?');
    } else if (A.goal === 'hold' || A.goal === 'biz' || A.assets === 'shares' || A.assets === 'mix') {
      main = 'A holding company'; why = 'A holding company that owns your operating company (and other assets) lets you ring-fence risk and reinvest surplus profit with a lower dividend withholding rate (5% when it holds 25% or more of the shares and votes, against 10% to you directly). It works best when you reinvest, not when you plan to sell soon.';
      also.push('A will, because the holding company shares themselves still pass on your death.');
      acts.push('Model it in the dividend calculator, including an exit scenario.', 'Check what moving shares costs: stamp duty is 1% of share value on a transfer.');
      ask.push('Would moving my existing shares into a holding company trigger tax, or does any reorganisation relief apply?');
    } else {
      main = 'A will'; why = 'For most families the first and most valuable step is a clear, valid will. It names who inherits, who looks after minors, and who administers the estate. Without one, succession is decided by default rules that may not match your wishes.';
      acts.push('List your assets and who should get what.', 'Choose an executor and a back-up executor.');
      ask.push('Which succession law applies to my estate given my faith and way of life, and how should my will deal with it?');
    }
    if (A.will === 'no') acts.unshift('Write a will first. Everything else sits on top of it.');
    if (A.will === 'old') acts.unshift('Review your will. It should match your current assets and family.');
    if (A.goal !== 'char' && also.indexOf('A will, so the trust is funded and your wishes are clear.') < 0 && main !== 'A will' && A.will !== 'yes') also.push('A will');
    if (A.partners === 'yes') { also.push('A shareholders’ agreement with a buy-sell and succession clause, so a partner is not left owning a stranger’s shares.'); }
    if (A.x === 'yes' || A.assets === 'land' || A.assets === 'mix') { acts.push('Check the Land Act: companies with majority non-citizen shareholders are treated as foreign for land, and may only hold a derivative right. Also confirm whether non-citizen heirs can take land rights.'); ask.push('Can the land or the company we plan to use be held and inherited by my family as intended, given nationality rules?'); }
    if (A.fam === 'adult' || A.fam === 'ext' || A.fam === 'minor') acts.push('Ask your advocate how succession law applies to your estate. It can depend on your faith and way of life, and the rules differ between customary, Islamic and general law.');
    if (A.goal !== 'char' && (A.assets === 'shares' || A.assets === 'mix' || A.goal === 'hold' || A.goal === 'biz')) acts.push('File your company’s beneficial ownership information with BRELA if you have not (anyone above 25% of shares or votes).');

    $('quiz').style.display = 'none'; $('result').style.display = 'block';
    $('main').textContent = main; $('why').textContent = why;
    $('also').innerHTML = also.length ? also.map(function (x) { return '<li>' + x + '</li>'; }).join('') : '<li>Nothing else needed right now.</li>';
    $('acts').innerHTML = acts.slice(0, 5).map(function (x) { return '<li>' + x + '</li>'; }).join('');
    $('ask').innerHTML = (ask.length ? ask : ['What is the simplest structure that meets my goal?']).map(function (x) { return '<li>' + x + '</li>'; }).join('');
    window.scrollTo({ top: $('result').offsetTop - 100, behavior: 'smooth' });
    var seen = false; try { seen = localStorage.getItem('as-email-given') === '1'; } catch (e) {}
    if (seen) openAll();
  }
  function openAll() { $('lock').classList.remove('blur'); $('gate').style.display = 'none'; $('after').style.display = 'block'; }
  window.onGateOpen = openAll;
  window.gateSource = function (s) { return s + ':' + (A.goal || '') + ',' + (A.will || ''); };
  $('back').onclick = function () { if (i > 0) { i--; render(); } };
  $('restart').onclick = function () { A = {}; i = 0; $('result').style.display = 'none'; $('quiz').style.display = 'block'; render(); };
  render(); window.wireGates();
})();
