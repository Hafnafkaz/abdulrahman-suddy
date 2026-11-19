/* Holding Company Readiness Score */
(function () {
  var Q = [
    { t: 'How many separate businesses or major assets do you own, or plan to own in the next 3 years?', h: 'Count operating companies, property, and significant investments.',
      o: [['Just one business', 0], ['One business plus property or investments', 6], ['Two or more businesses, plus other assets', 10]] },
    { t: 'How exposed is your main business to claims?', h: 'Think customers, staff, contracts, suppliers, public liability.',
      o: [['Low exposure', 2], ['Some exposure', 6], ['High exposure', 10]] },
    { t: 'Does the business make profit you do not need to spend personally?', h: 'Surplus you would rather reinvest than withdraw.',
      o: [['No, I live off what it pays', 0], ['Some of it is surplus', 5], ['Most of it is surplus', 10]] },
    { t: 'How much property or savings do you hold in your own name?', h: 'Anything a business creditor could reach if you gave a personal guarantee or were sued.',
      o: [['Not much', 2], ['A fair amount', 6], ['Significant', 10]] },
    { t: 'Do you plan to sell your main business in the next 3 years?', h: 'This matters more than people expect. It changes the tax maths.', key: 'exit',
      o: [['Yes, within 3 years', 0], ['Maybe, I am open to offers', 4], ['No, I plan to hold it long term', 10]] },
    { t: 'Will family or partners co-own other ventures with you?', h: 'A holding company can carry different mixes of owners per venture.',
      o: [['No, it is just me', 2], ['Possibly', 6], ['Yes', 10]] },
    { t: 'Roughly how much profit after tax does the business make per year?', h: 'Structures cost money to set up and run. Small profits rarely justify them.',
      o: [['Under TZS 50 million', 0], ['TZS 50 to 200 million', 5], ['Over TZS 200 million', 10]] },
    { t: 'If something happened to you, could your family keep the business running?', h: 'Think of a documented plan, signing powers, and who would step in.', key: 'succ',
      o: [['No plan at all', 10], ['Partly', 6], ['Yes, it is written down', 2]] },
    { t: 'Do you want your brand, IP or property owned separately from the trading company?', h: 'A common pattern is to hold the asset in one company and license or lease it to the operating company.',
      o: [['No', 0], ['Maybe', 5], ['Yes', 10]] },
    { t: 'Are your records in order?', h: 'Signed shareholders’ agreement, share register, and your beneficial ownership filing at BRELA.', key: 'house',
      o: [['No or not sure', 0], ['Partly', 5], ['Yes', 10]], noScore: true }
  ];
  var ans = [], i = 0, score = 0, fullScore = 0;
  var $ = function (id) { return document.getElementById(id); };

  function render() {
    var q = Q[i];
    $('qmeta').innerHTML = '<span>Question ' + (i + 1) + ' of ' + Q.length + '</span><span>About 2 minutes</span>';
    $('bar').style.width = (i / Q.length * 100) + '%';
    $('qtext').textContent = q.t; $('qhelp').textContent = q.h;
    var box = $('opts'); box.innerHTML = '';
    q.o.forEach(function (o, k) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'opt' + (ans[i] === k ? ' sel' : '');
      b.innerHTML = '<span class="dot"></span><span>' + o[0] + '</span>';
      b.onclick = function () { ans[i] = k; render(); setTimeout(next, 180); };
      box.appendChild(b);
    });
    $('back').style.visibility = i === 0 ? 'hidden' : 'visible';
  }
  function next() { if (ans[i] === undefined) return; if (i < Q.length - 1) { i++; render(); } else finish(); }

  function pick(key) { for (var k = 0; k < Q.length; k++) if (Q[k].key === key) return ans[k]; }
  function finish() {
    var sum = 0, max = 0;
    Q.forEach(function (q, k) { if (q.noScore) return; sum += q.o[ans[k]][1]; max += 10; });
    score = Math.round(sum / max * 100);
    var tier, head, color;
    if (score >= 65) { tier = 'Strong candidate'; head = 'A holding structure is worth a serious look.'; }
    else if (score >= 35) { tier = 'Worth planning'; head = 'You are close. A few things decide whether it pays.'; }
    else { tier = 'Not yet'; head = 'Keep it simple for now. Structure would cost more than it saves.'; }

    var pts = [];
    var exit = pick('exit'), house = pick('house'), succ = pick('succ');
    if (exit === 0 && score >= 35) { tier = 'Check your exit first'; head = 'The structure fits on paper, but your plan to sell changes the tax maths.'; }
    if (exit === 0 || exit === 1) pts.push(['warn', 'You may sell soon. Under the current rules a resident individual pays 10% capital gains tax on a Tanzanian share sale, while a company selling the same shares is taxed at 30%. Model the exit before you move any shares into a holding company.']);
    if (Q[2].o[ans[2]][1] >= 5 && Q[0].o[ans[0]][1] >= 6) pts.push(['', 'You have surplus profit and more than one asset. A holding company can receive dividends from your operating company at 5% withholding tax (if it holds 25% or more of the shares and votes) instead of 10% going to you directly, and reinvest from there. If you will take most of the cash out personally, it works the other way, so run the numbers in the dividend calculator.']);
    if (Q[1].o[ans[1]][1] >= 6 && Q[3].o[ans[3]][1] >= 6) pts.push(['', 'You have real exposure and real personal assets. Keeping property, cash or IP in a separate company from the one that trades (and leasing or licensing it to the trading company) is the classic ring-fence.']);
    if (succ === 0 || succ === 1) pts.push(['warn', 'There is no clear succession plan. Before any structure, write a will and a letter of wishes. A holding company makes succession simpler, but it does not replace a will.']);
    if (house === 0 || house === 1) pts.push(['warn', 'Fix your records first: signed shareholders’ agreement, an accurate share register, and your beneficial ownership filing with BRELA (anyone holding more than 25% of shares or votes, and changes within 30 days).']);
    if (Q[6].o[ans[6]][1] === 0) pts.push(['', 'At this profit level, set-up and annual running costs (advocate, accounts, filings) can eat the benefit. Revisit when profit grows, or when you add a second venture.']);
    if (!pts.length) pts.push(['', 'Your answers point to a simple setup being enough for now. Revisit when you add a second business, take on partners, or plan to reinvest surplus profit.']);

    $('quiz').style.display = 'none'; $('result').style.display = 'block';
    var deg = Math.round(score * 3.6);
    $('ring').style.background = 'conic-gradient(var(--orange) ' + deg + 'deg, var(--navy-tint) 0)';
    $('score').textContent = score; $('tier').textContent = tier; $('head').textContent = head;
    $('p1').innerHTML = '<li class="' + pts[0][0] + '">' + pts[0][1] + '</li>';
    var rest = pts.slice(1);
    $('rest').innerHTML = rest.map(function (p) { return '<li class="' + p[0] + '">' + p[1] + '</li>'; }).join('') || '<li>Your next step is to run your own numbers in the dividend calculator and get a quote from a Tanzanian advocate for the share transfer and shareholders’ agreement.</li>';
    window.scrollTo({ top: $('result').offsetTop - 100, behavior: 'smooth' });
    var seen = false; try { seen = localStorage.getItem('as-email-given') === '1'; } catch (e) {}
    if (seen) openAll();
  }
  function openAll() { $('rest').classList.remove('blur'); $('gate').style.display = 'none'; $('after').style.display = 'block'; }

  window.gateSource = function (s) { return s + ':score=' + score; };
  window.onGateOpen = openAll;
  $('back').onclick = function () { if (i > 0) { i--; render(); } };
  $('restart').onclick = function () { ans = []; i = 0; $('result').style.display = 'none'; $('quiz').style.display = 'block'; render(); };
  render(); window.wireGates();
})();
