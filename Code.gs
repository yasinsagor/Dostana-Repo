// ─── DOATANA KEBAB - Google Apps Script ───────────────────────────────────
// Paste this in: script.google.com → New Project → replace all code → Deploy
// ───────────────────────────────────────────────────────────────────────────

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // ← Replace this
const SHEET_NAME = 'DailyReports';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
      || SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);

    // Add headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'ID','Date','Branch','Manager','Opening Cash','Closing Cash',
        'POS Cash','POS Card','POS Total',
        'Uber Eats','Bolt Food','Glovo','Other Delivery','Delivery Total',
        'Total Revenue','Staff Cost','Supplies','Rent','Utilities','Other Expenses',
        'Total Expenses','Net Profit','Notes','Submitted At'
      ]);
    }

    sheet.appendRow([
      data.id, data.date, data.branch, data.manager,
      data.openingCash, data.closingCash,
      data.posCash, data.posCard, data.posTotal,
      data.uberEats, data.boltFood, data.glovo, data.otherDelivery, data.delTotal,
      data.totalRevenue,
      data.staffCost, data.supplies, data.rent, data.utilities, data.otherExpenses,
      data.totalExpenses, data.netProfit, data.notes, data.submittedAt
    ]);

    return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:'error', message:err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) return ContentService.createTextOutput(JSON.stringify([]));
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h,i) => obj[h] = row[i]);
    return obj;
  });
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
