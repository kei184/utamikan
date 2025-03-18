const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/sheets', async (req, res) => {
    const spreadsheetId = process.env.SPREADSHEET_ID; // スプレッドシートIDを取得
    const apiKey = process.env.GOOGLE_API_KEY; // APIキーを取得
    const range = 'Sheet1!A1:C500'; // 取得する範囲を指定

    try {
        const sheets = google.sheets({ version: 'v4', auth: apiKey });
        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });

        res.json(response.data); // データをJSON形式で返す
    } catch (error) {
        console.error('データ取得エラー:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'データ取得に失敗しました。',
            details: error.response ? error.response.data : error.message,
        });
    }

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});