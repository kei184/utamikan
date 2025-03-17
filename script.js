const loadButton = document.getElementById('load-button');
const tableBody = document.getElementById('songTable').querySelector('tbody');
const errorMessage = document.getElementById('error-message');

loadButton.addEventListener('click', loadData);

function loadData() {
    errorMessage.textContent = 'データ読み込み中...';

    fetch('https://utamikan.fly.dev/getSheetData') // Fly.io の API を呼び出す
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
        tr.innerHTML = `<td><span class="math-inline">\{row\[0\]\}</td\><td\></span>{row[1]}</td><td>${row[2]}</td>`;
        tableBody.appendChild(tr);
    });
}
