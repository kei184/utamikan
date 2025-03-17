require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.get('/api/sheets', async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/sheets`); // リクエストログ

    try {
        const spreadsheetId = process.env.SPREADSHEET_ID;
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!spreadsheetId || !apiKey) {
            console.error('環境変数 SPREADSHEET_ID または GOOGLE_API_KEY が設定されていません。');
            return res.status(500).json({ error: '環境変数 SPREADSHEET_ID または GOOGLE_API_KEY が設定されていません。' });
        }

        console.log('環境変数 SPREADSHEET_ID と GOOGLE_API_KEY が設定されています。'); // 環境変数確認ログ

        const sheets = google.sheets({ version: 'v4', auth: apiKey });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A1:C500',
        });

        res.json(response.data);
    } catch (error) {
        console.error('APIエラー:', error);
        res.status(500).json({ error: error.message, stack: error.stack }); // エラー詳細を返す
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
