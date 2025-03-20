// script.js
const loadButton = document.getElementById('load-button');
const tableBody = document.getElementById('songTable').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('searchInput');
const filterArtist = document.getElementById('filterArtist');
const filterGenre = document.getElementById('filterGenre');
const errorMessage = document.getElementById('error-message');

let fetchedData = []; // 取得したデータを格納するための変数

loadButton.addEventListener('click', loadData);

function loadData() {
    errorMessage.textContent = 'データ読み込み中...';

    fetch('https://utamikanlist.fly.dev/api/sheets') // APIエンドポイントをリクエスト
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("取得したデータ:", data);
            tableBody.innerHTML = ''; // テーブルをリセット
            fetchedData = data.values; // データを格納

            if (data && data.values && Array.isArray(data.values) && data.values.length > 1) {
                // アーティストのオプションを動的に追加
                const artistSet = new Set();
                const genreSet = new Set();

                data.values.slice(1).forEach(row => {
                    if (row.length >= 3) { // 行に曲名、アーティスト、ジャンルがある場合
                        const artist = row[0];
                        const songTitle = row[1];
                        const genre = row[2];

                        // 🎵 Google検索リンク付きの曲名
                        const searchQuery = `${songTitle} ${artist} 歌詞`;
                        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                        const songLink = `<a href="${searchUrl}" target="_blank" rel="noopener noreferrer">${songTitle}</a>`;

                        // 🎤 テーブルに行を追加
                        const tr = document.createElement("tr");
                        tr.innerHTML = `<td>${artist}</td><td>${songLink}</td><td>${genre}</td>`;
                        tableBody.appendChild(tr);

                        // アーティストとジャンルをセットに追加
                        artistSet.add(artist);
                        genreSet.add(genre);
                    }
                });

                // アーティストフィルターを更新
                updateFilterOptions(filterArtist, artistSet);
                // ジャンルフィルターを更新
                updateFilterOptions(filterGenre, genreSet);

                errorMessage.textContent = ""; // エラーメッセージをクリア
            } else {
                console.warn("データが正しく取得されませんでした:", data);
                errorMessage.textContent = "データが空または不正です。";
            }
        })
        .catch(error => {
            console.error('データ取得エラー:', error);
            errorMessage.textContent = `データの取得に失敗しました: ${error.message}`;
        });
}

// 🔹 フィルターオプションを更新する関数
function updateFilterOptions(selectElement, dataSet) {
    selectElement.innerHTML = '<option value="">すべて</option>';
    dataSet.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

// 🔹 検索およびフィルター機能の実装
searchInput.addEventListener('input', filterTable);
filterArtist.addEventListener('change', filterTable);
filterGenre.addEventListener('change', filterTable);

function filterTable() {
    const searchQuery = searchInput.value.toLowerCase();
    const artistFilter = filterArtist.value;
    const genreFilter = filterGenre.value;

    const rows = document.querySelectorAll('#songTable tbody tr');

    rows.forEach(row => {
        const artist = row.cells[0].textContent.toLowerCase(); // 1列目（アーティスト）
        const song = row.cells[1].textContent.toLowerCase();   // 2列目（曲名）
        const genre = row.cells[2].textContent.toLowerCase();  // 3列目（ジャンル）

        const matchesSearch = artist.includes(searchQuery) || song.includes(searchQuery);
        const matchesArtist = artistFilter === "" || artistFilter === artist;
        const matchesGenre = genreFilter === "" || genreFilter === genre;

        // 検索・フィルターの条件を満たす場合、行を表示
        if (matchesSearch && matchesArtist && matchesGenre) {
            row.style.display = ""; // 表示
        } else {
            row.style.display = "none"; // 非表示
        }
    });
}
