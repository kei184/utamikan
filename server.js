const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// 環境変数の検証
if (!process.env.SPREADSHEET_ID || !process.env.GOOGLE_CREDENTIALS) {
    console.error('環境変数 SPREADSHEET_ID または GOOGLE_CREDENTIALS が設定されていません。');
    process.exit(1); // サーバーを停止
}

// CORS設定（必要に応じてオリジンを制限）
app.use(cors({
    origin: '*', // 必要に応じて特定のオリジンに制限
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/sheets', async (req, res) => {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Sheet1!A1:C500';

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });

        res.json(response.data);
    } catch (error) {
        console.error('データ取得エラー:', error);

        let errorMessage = 'データ取得に失敗しました。';
        let errorType = 'unknown_error';

        if (error.code === 'ERR_INVALID_CREDENTIALS') {
            errorMessage = '認証エラー: Google Sheets APIの認証に失敗しました。';
            errorType = 'authentication_error';
        } else if (error.code === 'APIError') {
            errorMessage = 'APIエラー: Google Sheets APIからのレスポンスが不正です。';
            errorType = 'api_error';
        }

        res.status(500).json({
            error: errorMessage,
            details: error.message,
            status: 500,
            type: errorType, // エラーの種類を追加
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
