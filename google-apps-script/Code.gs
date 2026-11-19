/**
 * Saves website signups into the Google Sheet this script is attached to.
 * Setup steps are in README.md ("Email list on Google").
 */
var SHEET_NAME = 'Subscribers';

function doPost(e) {
  var p = (e && e.parameter) || {};
  var email = (p.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return ContentService.createTextOutput('invalid').setMimeType(ContentService.MimeType.TEXT);
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Email', 'Name', 'Source']);
      sheet.setFrozenRows(1);
    }
    // skip duplicates
    var emails = sheet.getLastRow() > 1
      ? sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]).toLowerCase(); })
      : [];
    if (emails.indexOf(email.toLowerCase()) === -1) {
      sheet.appendRow([new Date(), email, (p.name || '').trim(), p.source || '']);
    }
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}

// Lets you open the /exec link in a browser to confirm it is live.
function doGet() {
  return ContentService.createTextOutput('Subscriber endpoint is live.').setMimeType(ContentService.MimeType.TEXT);
}
