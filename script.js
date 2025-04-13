document.addEventListener('DOMContentLoaded', function () {
    const loadButton = document.getElementById('load-button');
    const tableBody = document.getElementById('songTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInput');
    const filterArtist = document.getElementById('filterArtist');
    const filterGenre = document.getElementById('filterGenre');
    const errorMessage = document.getElementById('error-message');

    // API URL
    const API_URL = '/.netlify/functions/sheets';

    // ボタンクリック時のハンドラー
    loadButton.addEventListener('click', loadData);

    function loadData() {
        errorMessage.textContent = 'データ読み込み中...';

        fetch(API_URL)
            .then(async response => {
                const contentType = response.headers.get("Content-Type");

                if (!response.ok) {
                    throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
                }

                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    throw new Error("サーバーがJSONではないレスポンスを返しました:\n" + text);
                }

                return response.json();
            })
            .then(data => {
                console.log("取得したデータ:", data);
                tableBody.innerHTML = '';

                // データが正しく取得されているか確認
                if (data && data.values && Array.isArray(data.values) && data.values.length > 1) {
                    const fetchedData = data.values;
                    const artistSet = new Set();
                    const genreCount = {};

                    fetchedData.slice(1).forEach(row => {
                        if (row.length >= 3) {
                            const artist = row[0];
                            const songTitle = row[1];
                            const genre = row[2];

                            const searchQuery = `${songTitle} ${artist} 歌詞`;
                            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                            const songLink = `<a href="${searchUrl}" target="_blank" rel="noopener noreferrer">${songTitle}</a>`;

                            const tr = document.createElement("tr");
                            tr.innerHTML = `<td>${artist}</td><td>${songLink}</td><td>${genre}</td>`;
                            tableBody.appendChild(tr);

                            artistSet.add(artist);
                            genreCount[genre] = (genreCount[genre] || 0) + 1;
                        }
                    });

                    updateFilterOptions(filterArtist, artistSet);
                    updateGenreOptions(filterGenre, genreCount);
                    errorMessage.textContent = "";
                    setupSearchAndFilters(fetchedData);
                } else {
                    console.warn("データが正しく取得されませんでした:", data);
                    errorMessage.textContent = "データが空または不正です。";
                }
            })
            .catch(error => {
                console.error('データ取得エラー:', error);
                if (error instanceof SyntaxError) {
                    errorMessage.textContent = 'サーバーからのレスポンスがJSON形式ではありません。';
                } else {
                    errorMessage.textContent = `データの取得に失敗しました: ${error.message}`;
                }
            });
    }

    // フィルタリング機能
    function setupSearchAndFilters(fetchedData) {
        const filterFunction = () => filterTable(fetchedData); // フィルタリング関数の定義
        searchInput.addEventListener('input', filterFunction);
        filterArtist.addEventListener('change', filterFunction);
        filterGenre.addEventListener('change', filterFunction);
    }

    function filterTable(fetchedData) {
        const searchQuery = searchInput.value.toLowerCase();
        const artistFilter = filterArtist.value.toLowerCase();
        const genreFilter = filterGenre.value.toLowerCase();

        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach((row, index) => {
            const data = fetchedData[index + 1];
            if (!data) return;

            const artist = data[0].toLowerCase();
            const song = data[1].toLowerCase();
            const genre = data[2].toLowerCase();

            const matchesSearch = song.includes(searchQuery) || artist.includes(searchQuery);
            const matchesArtist = artistFilter === "" || artist.includes(artistFilter);
            const matchesGenre = genreFilter === "" || genre.includes(genreFilter);

            row.style.display = (matchesSearch && matchesArtist && matchesGenre) ? "" : "none";
        });
    }

    // アーティストフィルタの更新
    function updateFilterOptions(selectElement, dataSet) {
        selectElement.innerHTML = '<option value="">すべて</option>';
        [...dataSet].sort().forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }

    // ジャンルフィルタの更新
    function updateGenreOptions(selectElement, genreCount) {
        const fixedOrder = ["令和", "平成", "昭和"];
        let sortedGenres = Object.entries(genreCount)
            .filter(([genre]) => !fixedOrder.includes(genre))
            .sort((a, b) => b[1] - a[1])
            .map(([genre]) => genre);

        const orderedGenres = [...fixedOrder, ...sortedGenres];

        selectElement.innerHTML = '<option value="">すべて</option>';
        orderedGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = `${genre} (${genreCount[genre] || 0})`;
            selectElement.appendChild(option);
        });
    }

    // バブルアニメーション
    const backgroundEl = document.querySelector(".background");
    if (backgroundEl) {
        for (let i = 0; i < 20; i++) {
            let bubble = document.createElement("div");
            bubble.className = "bubble";
            bubble.style.left = Math.random() * 100 + "vw";
            bubble.style.animationDuration = Math.random() * 10 + 5 + "s";
            bubble.style.width = bubble.style.height = Math.random() * 50 + 20 + "px";
            backgroundEl.appendChild(bubble);
        }
    }
});
