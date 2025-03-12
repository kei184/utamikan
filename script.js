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

// データを読み込んだ後に、フィルターの選択肢を更新する関数
function updateFilters(data) {
    const artistSet = new Set();
    const genreSet = new Set();
    
    data.values.slice(1).forEach(row => {
        if (row.length >= 3) {
            artistSet.add(row[0]);
            genreSet.add(row[2]);
        }
    });

    // アーティストの選択肢を更新
    const artistSelect = document.getElementById('filterArtist');
    artistSelect.innerHTML = '<option value="">すべて</option>';
    artistSet.forEach(artist => {
        artistSelect.innerHTML += `<option value="${artist.toLowerCase()}">${artist}</option>`;
    });

    // ジャンルの選択肢を更新
    const genreSelect = document.getElementById('filterGenre');
    genreSelect.innerHTML = '<option value="">すべて</option>';
    genreSet.forEach(genre => {
        genreSelect.innerHTML += `<option value="${genre.toLowerCase()}">${genre}</option>`;
    });
}
