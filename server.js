// 必要なモジュールをインポート
const express = require('express');
const { google } = require('googleapis');
require('dotenv').config(); // 環境変数の読み込み
const cors = require('cors'); // CORSを扱うためのミドルウェア

const app = express();
const port = process.env.PORT || 8080; // ポートの設定（環境変数から取得）

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
    const range = 'Sheet1!A2:C500'; // 取得するデータの範囲

    try {
        const sheets = google.sheets({ version: 'v4', auth: apiKey });
        
        // スプレッドシートのデータを取得
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });

        res.json(response.data); // 取得したデータをJSON形式でクライアントに返す
    } catch (error) {
        console.error('データ取得エラー:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'データ取得に失敗しました。', details: error.message });
    }
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});