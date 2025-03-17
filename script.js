const { google } = require('googleapis');

// APIキーおよびSpreadsheet IDの設定
const spreadsheetId = process.env.SPREADSHEET_ID; // 環境変数から読み込む
const apiKey = process.env.GOOGLE_API_KEY; // 環境変数から読み込む

// Google Sheets APIの初期化
const sheets = google.sheets({ version: 'v4', auth: apiKey });

// データの取得
async function getData() {
  try {
    const range = 'Sheet1!A1:C500'; // 正しい範囲指定
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    console.log(response.data);
  } catch (error) {
    console.error('データ取得エラー:', error);
  }
}

getData();