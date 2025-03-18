<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080; // Fly.io では 8080 を使用

app.use(cors({
    origin: '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
    res.send('Fly.io サーバーが動作しています！');
});

// ✅ 修正: 0.0.0.0 にバインド！
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
=======
document.getElementById('load-button').addEventListener('click', function() {
    fetch('https://utamikanlist.fly.dev/getSheetData') // ✅ Fly.io の API にリクエスト！
        .then(response => response.json())
        .then(data => {
            console.log("取得したデータ:", data);
            const tableBody = document.getElementById('songTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';

            if (data.values && data.values.length > 1) {
                data.values.slice(1).forEach(row => {
                    if (row.length >= 3) {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td>`;
                        tableBody.appendChild(tr);
                    }
                });
            } else {
                console.warn("データが空です！");
            }
        })
        .catch(error => {
            console.error('データ取得エラー:', error);
            alert("データの取得に失敗しました。エラー詳細: " + error.message);
        });
>>>>>>> 0e6c53273a7c349e10b5656bbe34da25bba91f37
});
