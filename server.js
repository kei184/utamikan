require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const app = express();
const port = process.env.PORT || 8080;

app.get('/api/sheets', async (req, res) => {
    try {
        const spreadsheetId = process.env.SPREADSHEET_ID;
        const range = 'Sheet1!A1:C500';
        const apiKey = process.env.GOOGLE_API_KEY;

        const sheets = google.sheets({ version: 'v4', auth: apiKey });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        res.json(response.data);
    } catch (error) {
        console.error('APIエラー:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
