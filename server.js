const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public')); // フロントエンドのHTMLファイルを提供

app.get('/getSheetData', async (req, res) => {
    const sheetId = process.env.SPREADSHEET_ID;
    const range = 'シート1!A1:C500';
    const apiKey = process.env.GOOGLE_API_KEY;

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
    console.log(`Server is running on http://localhost:${PORT}`);
});
