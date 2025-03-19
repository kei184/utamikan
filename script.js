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
                        const tr = document.createElement("tr");
                        tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td>`;
                        tableBody.appendChild(tr);

                        // アーティストとジャンルをセットに追加
                        artistSet.add(row[0]);
                        genreSet.add(row[2]);
                    }
                });

                // アーティストフィルターを更新
                artistSet.forEach(artist => {
                    const option = document.createElement('option');
                    option.value = artist;
                    option.textContent = artist;
                    filterArtist.appendChild(option);
                });

                // ジャンルフィルターを更新
                genreSet.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre;
                    option.textContent = genre;
                    filterGenre.appendChild(option);
                });

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

// 検索およびフィルター機能の実装
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
