const spreadsheetId = '1VfJK5dFMW03slpZhhVMKpyR00Nb0X4XHoidBRXRutq4'; // スプレッドシートID
const apiKey = 'YOUR_API_KEY'; // APIキー
const range = 'Sheet1!A1:C500'; // 取得する範囲

const loadButton = document.getElementById('load-button');
const tableBody = document.getElementById('songTable').querySelector('tbody');
const errorMessage = document.getElementById('error-message');

loadButton.addEventListener('click', loadData);

function loadData() {
    errorMessage.textContent = 'データ読み込み中...';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    fetch('https://utamikan.fly.dev/getSheetData')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.values) {
                renderTable(data.values);
            } else {
                console.warn("データが空です！");
                errorMessage.textContent = "データが空です。";
            }
        })
        .catch(error => {
            console.error('データ取得エラー:', error);
            errorMessage.textContent = "データの取得に失敗しました。コンソールを確認してください。";
        })
        .finally(() => {
            errorMessage.textContent = ""; // ローディングメッセージを消す
        });
}

function renderTable(values) {
    tableBody.innerHTML = '';
    values.slice(1).forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td>`;
        tableBody.appendChild(tr);
    });
}
