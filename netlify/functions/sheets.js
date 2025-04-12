const { google } = require('googleapis');

exports.handler = async function (event, context) {
    try {
        const credentials = process.env.GOOGLE_CREDENTIALS;
        const spreadsheetId = process.env.SPREADSHEET_ID;

        if (!credentials || !spreadsheetId) {
            console.error('環境変数 GOOGLE_CREDENTIALS または SPREADSHEET_ID が設定されていません。');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: '環境変数が設定されていません。' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            };
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

        const values = response.data.values;

        return {
            statusCode: 200,
            body: JSON.stringify({ values }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  // 必要なら Netlify ドメインを指定
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };

    } catch (error) {
        console.error('Google Sheets API エラー:', error);

        let errorMessage = 'データの取得に失敗しました。';
        let errorType = 'unknown_error';

        if (error.code === 'ERR_INVALID_CREDENTIALS') {
            errorMessage = '認証エラー: Google Sheets APIの認証に失敗しました。';
            errorType = 'authentication_error';
        } else if (error.code === 'APIError') {
            errorMessage = 'APIエラー: Google Sheets APIからのレスポンスが不正です。';
            errorType = 'api_error';
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: errorMessage,
                details: error.message,
                type: errorType
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }
};
