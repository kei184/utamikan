document.addEventListener('DOMContentLoaded', function() {
    const loadButton = document.getElementById('load-button');
    const tableBody = document.getElementById('songTable').querySelector('tbody');
    const searchInput = document.getElementById('searchInput');
    const artistSelect = document.getElementById('filterArtist');
    const genreSelect = document.getElementById('filterGenre');
    const errorMessage = document.getElementById('error-message');

    loadButton.addEventListener('click', loadData);
    searchInput.addEventListener('input', filterTable);
    artistSelect.addEventListener('change', filterTable);
    genreSelect.addEventListener('change', filterTable);

    async function loadData() {
        errorMessage.textContent = 'データ読み込み中...'; // ローディングメッセージを表示
        try {
            const cachedData = localStorage.getItem('songData');
            if (cachedData) {
                const data = JSON.parse(cachedData);
                console.log("キャッシュから取得したデータ:", data);
                renderTable(data);
            } else {
                const response = await fetch('https://utamikan.onrender.com/getSheetData');
                if (!response.ok) {
                    throw new Error(`HTTPエラー: ${response.status}`);
                }
                const data = await response.json();
                localStorage.setItem('songData', JSON.stringify(data));
                renderTable(data);
            }
        } catch (error) {
            console.error('データ取得エラー:', error);
            errorMessage.textContent = "データの取得に失敗しました。コンソールを確認してください。";
        }
    }

    function renderTable(data) {
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
            errorMessage.textContent = "データが空です。";
        }
    }

    function updateFilters(data) {
        const artistSet = new Set();
        const genreSet = new Set();

        data.values.slice(1).forEach(row => {
            if (row.length >= 3) {
                artistSet.add(row[0]);
                genreSet.add(row[2]);
            }
        });

        artistSelect.innerHTML = '<option value="">すべて</option>';
        artistSet.forEach(artist => {
            const option = document.createElement('option');
            option.value = artist.toLowerCase();
            option.textContent = artist;
            artistSelect.appendChild(option);
        });

        genreSelect.innerHTML = '<option value="">すべて</option>';
        genreSet.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.toLowerCase();
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    }

    function filterTable() {
        const searchText = searchInput.value.toLowerCase();
        const artist = artistSelect.value.toLowerCase();
        const genre = genreSelect.value.toLowerCase();
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const artistText = row.cells[0].textContent.toLowerCase();
            const titleText = row.cells[1].textContent.toLowerCase();
            const genreText = row.cells[2].textContent.toLowerCase();

            const isArtistMatch = !artist || artistText.includes(artist);
            const isTitleMatch = !searchText || titleText.includes(searchText);
            const isGenreMatch = !genre || genreText.includes(genre);

            row.style.display = isArtistMatch && isTitleMatch && isGenreMatch ? '' : 'none';
        });
    }
});
