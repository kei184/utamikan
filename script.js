const loadButton = document.getElementById('load-button');
const tableBody = document.getElementById('songTable').querySelector('tbody');
const errorMessage = document.getElementById('error-message');

loadButton.addEventListener('click', loadData);

function loadData() {
    errorMessage.textContent = 'データ読み込み中...';

    fetch('https://utamikan2.fly.dev/api/sheets') // 例: 正しいURL
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.values) { // data 自体もチェック
                renderTable(data.values);
            } else {
                console.warn("データが空です！");
                errorMessage.textContent = "データが空です。";
            }
        })
        .catch(error => {
            console.error('データ取得エラー:', error);
            errorMessage.textContent = `データの取得に失敗しました: ${error.message}`;
        })
        .finally(() => {
            // エラーが発生していない場合のみメッセージをクリア
            if (!errorMessage.textContent.startsWith("データの取得に失敗しました")) {
                errorMessage.textContent = "";
            }
        });
}

function renderTable(values) {
    tableBody.innerHTML = '';
    values.slice(1).forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell; // textContent を使用して安全に設定
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}
