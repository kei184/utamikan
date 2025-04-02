const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// CORSの設定: 全てのオリジンを許可（必要に応じて制限してください）
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/sheets', async (req, res) => {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const apiKey = process.env.API_KEY;
    const range = 'Sheet1!A1:C500';

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './credentials.json', // サービスアカウントキーファイルを指定
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // スコープを指定
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
        res.status(500).json({
            error: 'データ取得に失敗しました。',
            details: error.message, // エラーメッセージを返す
        });
    }
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
