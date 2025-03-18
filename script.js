// script.js
document.getElementById('load-button').addEventListener('click', function() {
    fetch('https://utamikanlist.fly.dev/api/sheets') // サーバーのAPIエンドポイントをリクエスト
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("取得したデータ:", data);
            const tableBody = document.getElementById('songTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // テーブルをリセット

            // データが渡されたときの処理
            if (data && data.values && Array.isArray(data.values) && data.values.length > 1) {
                data.values.slice(1).forEach(row => { // 最初の行を見出しとしてスキップ
                    if (row.length >= 3) { // 行に少なくとも3つのデータがあるか
                        const tr = document.createElement("tr");
                        tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td>`;
                        tableBody.appendChild(tr);
                    }
                });
            } else {
                console.warn("データが正しく取得されませんでした:", data);
                document.getElementById('error-message').textContent = "データが空または不正です。";
            }
        })
        .catch(error => {
            console.error('データ取得エラー:', error);
            alert(`データの取得に失敗しました。エラー詳細: ${error.message}`);
        });
});