const { google } = require('googleapis');

exports.handler = async function (event, context) {
    try {
        // 環境変数の検証
        const credentials = process.env.GOOGLE_CREDENTIALS;
        const spreadsheetId = process.env.SPREADSHEET_ID;

        if (!credentials || !spreadsheetId) {
            throw new Error('GOOGLE_CREDENTIALS または SPREADSHEET_ID が設定されていません。');
        }

        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(credentials),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'Sheet1!A1:C500'
        });

        // 必要なデータのみを返す
        const values = response.data.values;

        return {
            statusCode: 200,
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Failed to fetch data' }) // より具体的なエラーメッセージ
        };
    }
};
