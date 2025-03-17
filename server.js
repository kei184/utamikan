const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080; // Fly.io では 8080 を使用！

app.use(cors({
    origin: '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
    res.send('Fly.io サーバーが動作しています！');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
