/* Holding company vs direct ownership calculator (Tanzania mainland). Rates are editable defaults. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  // DEFAULT RATES - verified Nov 2026 against PwC Worldwide Tax Summaries (reviewed 9 Sep 2026) and the TRA stamp duty page.
  var DEF = { cit: 30, whtInd: 10, whtHold: 5, cgtInd: 10, cgtCo: 30, stamp: 1 };
  var mode = 'annual';
  var num = function (id) { var v = parseFloat(String($(id).value).replace(/,/g, '')); return isFinite(v) ? v : 0; };
  var pct = function (id) { return num(id) / 100; };

  function fmtInputs() { ['profit', 'gain', 'value'].forEach(function (id) { var el = $(id), v = num(id); el.value = v ? Math.round(v).toLocaleString('en-US') : ''; }); }

  function annual() {
    var P = num('profit'), cit = pct('cit'), payout = pct('payout'), r = pct('reinvest');
    var wi = pct('whtInd'), wh = pct('whtHold');
    var A = P * (1 - cit), D = A * payout;
    var dTax = D * wi;                                // direct: dividend tax on D
    var hTax1 = D * wh, hTax2 = D * (1 - wh) * (1 - r) * wi;  // holdco: 1st layer + 2nd layer on what is paid out
    var directKept = A - dTax, holdKept = A - hTax1 - hTax2;
    var gain = holdKept - directKept;
    var stampCost = num('value') * pct('stamp');
    var payback = gain > 0 ? stampCost / gain : null;

    var h = '';
    h += '<div class="cmp">';
    h += col('Own the company directly', directKept, 'kept after dividend tax', [['Company tax (' + (cit * 100) + '%)', P * cit], ['Dividend tax to you (' + (wi * 100) + '%)', dTax], ['Total tax', P * cit + dTax]], gain < 0);
    h += col('Via a holding company', holdKept, 'kept after dividend tax', [['Company tax (' + (cit * 100) + '%)', P * cit], ['Dividend tax into holdco (' + (wh * 100) + '%)', hTax1], ['Dividend tax holdco to you (' + (wi * 100) + '%)', hTax2], ['Total tax', P * cit + hTax1 + hTax2]], gain > 0);
    h += '</div>';
    var v;
    if (gain > 0) {
      v = 'With these inputs the holding company keeps <b>' + tzs(gain) + '</b> more per year, because the money that stays inside it is only hit by the lower ' + (wh * 100) + '% rate.';
      if (payback !== null && stampCost > 0) v += ' Moving the shares costs about <b>' + tzs(stampCost) + '</b> in stamp duty alone, so it pays back in roughly <b>' + (payback < 1 ? 'under a year' : payback.toFixed(1) + ' years') + '</b>, before advocate, filing and accounting costs.';
    } else if (gain < 0) {
      v = 'With these inputs the holding company <b>costs you ' + tzs(-gain) + '</b> more per year. When most of the cash is paid out to you personally, it is taxed twice (' + (wh * 100) + '% then ' + (wi * 100) + '%). A holding company only helps if you reinvest most of what it receives.';
    } else v = 'No difference with these inputs.';
    h += '<div class="verdict">' + v + '</div>';
    h += '<p class="src">Not modelled: the deemed-dividend rule (from 1 July 2026 the Commissioner General can treat 15% of undistributed profits as paid if no dividend is declared within 12 months after the year end), the 25% shares-and-votes test, and set-up and running costs.</p>';
    $('out').innerHTML = h;
  }

  function exit() {
    var G = num('gain'), ci = pct('cgtInd'), cc = pct('cgtCo'), wi = pct('whtInd');
    var dTax = G * ci, directNet = G - dTax;
    var hTax = G * cc, holdNet = G - hTax, holdToYou = holdNet * (1 - wi);
    var h = '<div class="cmp">';
    h += col('Sell as an individual', directNet, 'in your hands', [['Capital gains tax (' + (ci * 100) + '%)', dTax]], true);
    h += col('Sell through a holding company', holdNet, 'inside the holdco', [['Company tax on the gain (' + (cc * 100) + '%)', hTax], ['If paid out to you (' + (wi * 100) + '% more)', holdNet * wi], ['You receive if paid out', holdToYou]], false);
    h += '</div>';
    h += '<div class="verdict">Selling through the holding company costs about <b>' + tzs(directNet - holdNet) + '</b> more in tax on this gain, and <b>' + tzs(directNet - holdToYou) + '</b> more if you also pay the profit out to yourself. If you plan to sell the operating company within a few years, <b>get advice before moving shares into a holding company.</b></div>';
    h += '<p class="src">Reflects the current rule that a resident individual pays 10% on gains from Tanzanian investments, while a company’s gain is part of its income taxed at 30%. Reorganisation or intra-group relief may apply to the transfer into a holdco itself, so confirm with a tax adviser.</p>';
    $('out').innerHTML = h;
  }

  function col(title, big, sub, rows, win) {
    return '<div class="col' + (win ? ' win' : '') + '"><h4>' + title + '</h4><div class="big">' + tzs(big) + '</div><div class="sub">' + sub + '</div><div class="rows">' +
      rows.map(function (r) { return '<div><span>' + r[0] + '</span><span>' + tzs(r[1]) + '</span></div>'; }).join('') + '</div></div>';
  }

  function run() { $('annualBox').style.display = mode === 'annual' ? 'grid' : 'none'; $('exitBox').style.display = mode === 'exit' ? 'grid' : 'none'; if (mode === 'annual') annual(); else exit(); }

  document.querySelectorAll('.seg button').forEach(function (b) { b.onclick = function () { mode = b.getAttribute('data-m'); document.querySelectorAll('.seg button').forEach(function (x) { x.classList.toggle('on', x === b); }); run(); }; });
  document.querySelectorAll('#calcForm input').forEach(function (el) { el.addEventListener('input', run); el.addEventListener('blur', fmtInputs); });
  $('resetRates').onclick = function () { Object.keys(DEF).forEach(function (k) { $(k).value = DEF[k]; }); run(); };
  fmtInputs(); run();
})();
