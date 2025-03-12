const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // CORS用ミドルウェア
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 CORS設定（GitHub Pagesのドメインを許可）
app.use(cors({
    origin: 'https://kei184.github.io', // GitHub PagesのURL
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.static('public')); // フロントエンドのファイルを提供

// Google Sheets APIからデータを取得
app.get('/getSheetData', async (req, res) => {
    const sheetId = process.env.SPREADSHEET_ID;
    const range = 'シート1!A1:C500';
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!sheetId || !apiKey) {
        return res.status(500).json({ error: 'Missing API key or Sheet ID' });
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // 🔹 CORS ヘッダーを追加
        res.setHeader('Access-Control-Allow-Origin', 'https://kei184.github.io');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
