document.getElementById('load-button').addEventListener('click', function() {
    console.log("データ読み込みボタンが押されました"); // デバッグ用

    fetch('https://utamikan.onrender.com/getSheetData')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status}`);
            }
            return response.json();
        })
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
                updateFilters(data); // 🔹 フィルターの選択肢を更新
                filterTable(); // 🔹 フィルターを適用
            } else {
                console.warn("データが空です！");
            }
        })
        .catch(error => {
            console.error('データ取得エラー:', error);
            alert("データの取得に失敗しました。コンソールを確認してください。");
        });
});

// 🔹 フィルターの選択肢を更新する関数
function updateFilters(data) {
    const artistSet = new Set();
    const genreSet = new Set();

    data.values.slice(1).forEach(row => {
        if (row.length >= 3) {
            artistSet.add(row[0]);
            genreSet.add(row[2]);
        }
    });

    const artistSelect = document.getElementById('filterArtist');
    artistSelect.innerHTML = '<option value="">すべて</option>';
    artistSet.forEach(artist => {
        artistSelect.innerHTML += `<option value="${artist.toLowerCase()}">${artist}</option>`;
    });

    const genreSelect = document.getElementById('filterGenre');
    genreSelect.innerHTML = '<option value="">すべて</option>';
    genreSet.forEach(genre => {
        genreSelect.innerHTML += `<option value="${genre.toLowerCase()}">${genre}</option>`;
    });
}

// 🔹 フィルター適用関数
function filterTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const artistInput = document.getElementById('filterArtist').value.toLowerCase();
    const genreInput = document.getElementById('filterGenre').value.toLowerCase();
    const tableRows = document.querySelectorAll('#songTable tbody tr');

    tableRows.forEach(row => {
        const artist = row.cells[0].textContent.toLowerCase();
        const title = row.cells[1].textContent.toLowerCase();
        const genre = row.cells[2].textContent.toLowerCase();

        const matchesSearch = !searchInput || artist.includes(searchInput) || title.includes(searchInput);
        const matchesArtist = !artistInput || artist.includes(artistInput);
        const matchesGenre = !genreInput || genre.includes(genreInput);

        row.style.display = matchesSearch && matchesArtist && matchesGenre ? '' : 'none';
    });
}
