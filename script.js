const range = 'Sheet1!A1:C500'; // 取得する範囲

const loadButton = document.getElementById('load-button');
const tableBody = document.getElementById('songTable').querySelector('tbody');
const errorMessage = document.getElementById('error-message');

loadButton.addEventListener('click', loadData);

function loadData() {
    errorMessage.textContent = 'データ読み込み中...';

    // 環境変数からAPIキーとスプレッドシートIDを取得
    const apiKey = process.env.GOOGLE_API_KEY;
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!apiKey || !spreadsheetId) {
        console.error('APIキーまたはスプレッドシートIDが設定されていません。');
        errorMessage.textContent = 'APIキーまたはスプレッドシートIDが設定されていません。';
        return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
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
            errorMessage.textContent = `データの取得に失敗しました: ${error.message}`;
        })
        .finally(() => {
            errorMessage.textContent = "";
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
