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
});
