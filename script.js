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

    function loadData() {
        errorMessage.textContent = ''; // エラーメッセージをクリア
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
                tableBody.innerHTML = '';

                if (data.values && data.values.length > 1) {
                    data.values.slice(1).forEach(row => {
                        if (row.length >= 3) {
                            const tr = document.createElement("tr");
                            tr.innerHTML = `<td><span class="math-inline">\{row\[0\]\}</td\><td\></span>{row[1]}</td><td>${row[2]}</td>`;
                            tableBody.appendChild(tr);
                        }
                    });
                    updateFilters(data);
                    filterTable();
                } else {
                    console.warn("データが空です！");
                    errorMessage.textContent = "データが空です。";
                }
            })
            .catch(error => {
                console.error('データ取得エラー:', error);
                errorMessage.textContent = "データの取得に失敗しました。コンソールを確認してください。";
            });
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
            const isTitleMatch = !searchText || titleText
