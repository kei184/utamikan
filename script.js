const loadButton = document.getElementById('load-button');
const tableBody = document.getElementById('songTable').querySelector('tbody');
const errorMessage = document.getElementById('error-message');
const range = 'Sheet1!A1:C500'; // これが正しい形式

loadButton.addEventListener('click', loadData);

function loadData() {
    errorMessage.textContent = 'データ読み込み中...';

    fetch('https://utamikan2.fly.dev/api/sheets') // ここに実際のAPIエンドポイントを指定
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // データの検証
            if (data && data.values && Array.isArray(data.values) && data.values.length > 1) { 
                renderTable(data.values);
                errorMessage.textContent = ""; // 正常データの場合はエラーメッセージをクリア
            } else {
                console.warn("データが不正です！");
                errorMessage.textContent = "データが空または不正です。";
            }
        })
        .catch(error => {
            console.error('データ取得エラー:', error);
            errorMessage.textContent = `データの取得に失敗しました: ${error.message}`;
        })
        .finally(() => {
            // エラーメッセージがクリアされない場合は空のメッセージにする
            if (!errorMessage.textContent.startsWith("データの取得に失敗しました")) {
                errorMessage.textContent = "";
            }
        });
}

function renderTable(values) {
    tableBody.innerHTML = ''; // テーブルをリセット
    values.slice(1).forEach(row => { // 1行目を見出しとして扱う場合
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell; // テキストを設定
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// 初期化時にテーブルをクリア
tableBody.innerHTML = '';