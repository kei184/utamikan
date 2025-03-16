document.getElementById('load-button').addEventListener('click', function() {
    console.log("データ読み込みボタンが押されました");

    fetch('https://utamikan.onrender.com/getSheetData')
        .then(response => {
            if (!response.ok) {
                console.error(`HTTPエラー: ${response.status}`);
                throw new Error(`HTTPエラー: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("取得したデータ:", data);
            const tableBody = document.getElementById('songTable').querySelector('tbody');
            tableBody.innerHTML = '';

            if (data.values && data.values.length > 1) {
                data.values.slice(1).forEach(row => {
                    if (row.length >= 3) {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td>`;
                        tableBody.appendChild(tr);
                    }
                });
                updateFilters(data);
                filterTable();
            } else {
                console.warn("データが空です！");
                document.getElementById('error-message').textContent = "データが空です。";
            }
        })
        .catch(error => {
            console.error('データ取得エラー:', error);
            document.getElementById('error-message').textContent = "データの取得に失敗しました。コンソールを確認してください。";
        });
});

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
        const option = document.createElement('option');
        option.value = artist.toLowerCase();
        option.textContent = artist;
        artistSelect.appendChild(option);
    });

    const genreSelect = document.getElementById('filterGenre');
    genreSelect.innerHTML = '<option value="">すべて</option>';
    genreSet.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.toLowerCase();
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

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
