const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// CORSの設定
app.use(cors());

// ルートエンドポイント
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// スプレッドシートからデータを取得するAPIエンドポイント
app.get('/api/sheets', async (req, res) => {
    const spreadsheetId = process.env.SPREADSHEET_ID; // 環境変数からスプレッドシートIDを取得
    const apiKey = process.env.GOOGLE_API_KEY; // 環境変数からAPIキーを取得

    try {
        const sheets = google.sheets({ version: 'v4', auth: apiKey });
        const range = 'Sheet1!A1:C500'; // シート名と範囲を指定

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });

        console.log(response.data); // レスポンスのデータを確認
        res.json(response.data);
    } catch (error) {
        console.error('データ取得エラー:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'データ取得に失敗しました。', details: error.message });
    }
});

// サーバー起動
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});