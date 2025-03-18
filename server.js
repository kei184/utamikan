const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// CORSの設定: 特定のオリジンを許可
app.use(cors({
    origin: 'https://kei184.github.io', // 自分のサイトを指定してください
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/sheets', async (req, res) => {
    const spreadsheetId = process.env.SPREADSHEET_ID; // 環境変数からスプレッドシートIDを取得
    const apiKey = process.env.GOOGLE_API_KEY; // 環境変数からAPIキーを取得
    const range = 'Sheet1!A1:C500'; // 取得するデータの範囲を指定

    try {
        const sheets = google.sheets({ version: 'v4', auth: apiKey });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });

        res.json(response.data); // 取得したデータを返す
    } catch (error) {
        console.error('データ取得エラー:', error);
        res.status(500).json({
            error: 'データ取得に失敗しました。',
            details: error.response ? error.response.data : error.message // より具体的なエラーメッセージを表示
        });
    }
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});