const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080; // Fly.io は 8080 が推奨

app.use(cors({
    origin: '*', // 必要なら 'https://kei184.github.io' などに制限
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.static('public'));

// Google Sheets API からデータを取得
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
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
