const { google } = require('googleapis');

exports.handler = async function (event, context) {
    const spreadsheetId = process.env.SPREADSHEET_ID; // 環境変数からスプレッドシートIDを取得
    const apiKey = process.env.API_KEY; // 環境変数からAPIキーを取得
    const range = 'Sheet1!A1:C500'; // 取得するデータの範囲を指定

    try {
        const sheets = google.sheets({ version: 'v4', auth: apiKey });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // 必要に応じてオリジンを制限
            },
        };
    } catch (error) {
        console.error('データ取得エラー:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'データ取得に失敗しました。', details: error.message }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // 必要に応じてオリジンを制限
            },
        };
    }
};
exports.handler = async function(event, context) {
  try {
    console.log("Google Sheets API リクエスト開始");

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A1:C500?key=YOUR_API_KEY`);
    
    console.log("Google Sheets API 応答:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("データ取得エラー:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "データ取得エラー", details: error.message }),
    };
  }
};
