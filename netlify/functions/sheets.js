const { google } = require('googleapis');

exports.handler = async function (event, context) {
  try {
    const credentials = process.env.GOOGLE_CREDENTIALS;
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!credentials || !spreadsheetId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing environment variables' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A1:C500'
    });

    const values = response.data.values;

    return {
      statusCode: 200,
      body: JSON.stringify({ values }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };

  } catch (error) {
    console.error('Google Sheets API エラー:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
