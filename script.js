document.addEventListener('DOMContentLoaded', function () {
    const loadButton = document.getElementById('load-button');
    const tableBody = document.getElementById('songTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInput');
    const filterArtist = document.getElementById('filterArtist');
    const filterGenre = document.getElementById('filterGenre');
    const errorMessage = document.getElementById('error-message');

    // API URL
    const API_URL = '/.netlify/functions/sheets';
    let songTableData = []; // データ全体を保持する変数

    // データを読み込む
    loadData(); // ページを開いたときに自動でデータを読み込む

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
                    songTableData = data.values.slice(1); // 先頭行はヘッダーと仮定

                    const artistSet = new Set();
                    const genreCount = {};

                    songTableData.forEach(row => {
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

    // フィルタリング機能の実装
    setupSearchAndFilters();

    function setupSearchAndFilters() {
        searchInput.addEventListener('input', () => filterTable());
        filterArtist.addEventListener('change', () => filterTable());
        filterGenre.addEventListener('change', () => filterTable());
    }

    function filterTable() {
        const searchQuery = searchInput.value.toLowerCase();
        const artistFilter = filterArtist.value.toLowerCase();
        const genreFilter = filterGenre.value.toLowerCase();

        tableBody.innerHTML = ''; // テーブルのリセット

        songTableData.forEach(row => {
            if (row.length >= 3) {
                const artist = row[0].toLowerCase();
                const songTitle = row[1].toLowerCase();
                const genre = row[2].toLowerCase();

                const matchesSearch = songTitle.includes(searchQuery) || artist.includes(searchQuery);
                const matchesArtist = artistFilter === "" || artist.includes(artistFilter);
                const matchesGenre = genreFilter === "" || genre.includes(genreFilter);

                if (matchesSearch && matchesArtist && matchesGenre) {
                    const searchQuery = `${row[1]} ${row[0]} 歌詞`;
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                    const songLink = `<a href="${searchUrl}" target="_blank" rel="noopener noreferrer">${row[1]}</a>`;

                    const tr = document.createElement("tr");
                    tr.innerHTML = `<td>${row[0]}</td><td>${songLink}</td><td>${row[2]}</td>`;
                    tableBody.appendChild(tr);
                }
            }
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
