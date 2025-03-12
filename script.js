const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/getSheetData', async (req, res) => {
    const sheetId = '1VfJK5dFMW03slpZhhVMKpyR00Nb0X4XHoidBRXRutq4';
    const range = 'シート1!A1:C500';
    const apiKey = process.env.GOOGLE_API_KEY; // 環境変数で管理

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
