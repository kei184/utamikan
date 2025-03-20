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
                // アーティストとジャンルのオプションを動的に追加
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
                // ジャンルフィルターを特定の順序で並び替えて更新
                updateGenreOptions(filterGenre, genreSet);

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

// 🔹 ひらがな ⇔ カタカナの変換関数
function toHiragana(str) {
    return str.replace(/[\u30A1-\u30FA]/g, match => 
        String.fromCharCode(match.charCodeAt(0) - 0x60)
    );
}

function toKatakana(str) {
    return str.replace(/[\u3041-\u3096]/g, match => 
        String.fromCharCode(match.charCodeAt(0) + 0x60)
    );
}

// 🔹 フィルターオプションを更新する関数
function updateFilterOptions(selectElement, dataSet) {
    selectElement.innerHTML = '<option value="">すべて</option>';
    [...dataSet].sort().forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

// 🔹 ジャンルのフィルターを「令和 → 平成 → 昭和 → その他昇順」に並べる関数
function updateGenreOptions(selectElement, genreSet) {
    const fixedOrder = ["令和", "平成", "昭和"]; // 優先的に表示する順番
    let sortedGenres = [...genreSet].filter(genre => !fixedOrder.includes(genre)).sort(); // それ以外を昇順ソート

    const orderedGenres = [...fixedOrder, ...sortedGenres]; // すべてを結合

    selectElement.innerHTML = '<option value="">すべて</option>';
    orderedGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        selectElement.appendChild(option);
    });
}

// 🔹 検索およびフィルター機能の実装
searchInput.addEventListener('input', filterTable);
filterArtist.addEventListener('change', filterTable);
filterGenre.addEventListener('change', filterTable);

function filterTable() {
    let searchQuery = searchInput.value.toLowerCase();
    searchQuery = toHiragana(searchQuery); // 🔹 ひらがなに統一

    const artistFilter = filterArtist.value;
    const genreFilter = filterGenre.value;

    const rows = document.querySelectorAll('#songTable tbody tr');

    rows.forEach(row => {
        let artist = row.cells[0].textContent.toLowerCase();
        let song = row.cells[1].textContent.toLowerCase();
        let genre = row.cells[2].textContent.toLowerCase();

        // 🔹 アーティストと曲名もひらがなに変換
        artist = toHiragana(artist);
        song = toHiragana(song);

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
