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

    fetch('/.netlify/functions/sheets') // APIエンドポイントをリクエスト
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
                const genreCount = {}; // ジャンルごとの曲数をカウント

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

                        // アーティストをセットに追加
                        artistSet.add(artist);

                        // ジャンルごとの曲数をカウント
                        genreCount[genre] = (genreCount[genre] || 0) + 1;
                    }
                });

                // アーティストフィルターを更新
                updateFilterOptions(filterArtist, artistSet);
                // ジャンルフィルターを「令和 → 平成 → 昭和 → その他の曲数が多い順」に並べて更新
                updateGenreOptions(filterGenre, genreCount);

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

// 🔹 ジャンルのフィルターを「令和 → 平成 → 昭和 → その他の曲数が多い順」に並べる関数
function updateGenreOptions(selectElement, genreCount) {
    const fixedOrder = ["令和", "平成", "昭和"]; // 優先的に表示する順番
    let sortedGenres = Object.entries(genreCount)
        .filter(([genre]) => !fixedOrder.includes(genre)) // 固定ジャンル以外を抽出
        .sort((a, b) => b[1] - a[1]) // 曲数が多い順に並べる
        .map(([genre]) => genre); // ジャンル名のみ取得

    const orderedGenres = [...fixedOrder, ...sortedGenres]; // すべてを結合

    selectElement.innerHTML = '<option value="">すべて</option>';
    orderedGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = `${genre} (${genreCount[genre] || 0})`; // 曲数も表示
        selectElement.appendChild(option);
    });
}

// 🔹 フィルターオプションを更新する関数（アーティスト用）
function updateFilterOptions(selectElement, dataSet) {
    selectElement.innerHTML = '<option value="">すべて</option>';
    [...dataSet].sort().forEach(value => {
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
    let searchQuery = searchInput.value.toLowerCase();
    searchQuery = toHiragana(searchQuery); // 🔹 ひらがなに統一

    const artistFilter = filterArtist.value.toLowerCase();
    const genreFilter = filterGenre.value.toLowerCase();

    const rows = document.querySelectorAll('#songTable tbody tr');

    rows.forEach(row => {
        let artist = row.cells[0].textContent.toLowerCase();
        let song = row.cells[1].textContent.toLowerCase();
        let genre = row.cells[2].textContent.toLowerCase();

        // 🔹 アーティストと曲名もひらがなに変換
        artist = toHiragana(artist);
        song = toHiragana(song);

        const matchesSearch = artist.includes(searchQuery) || song.includes(searchQuery);
        const matchesArtist = artistFilter === "" || artistFilter.toLowerCase() === artist;
        const matchesGenre = genreFilter === "" || genreFilter.toLowerCase() === genre;

        // 検索・フィルターの条件を満たす場合、行を表示
        if (matchesSearch && matchesArtist && matchesGenre) {
            row.style.display = ""; // 表示
        } else {
            row.style.display = "none"; // 非表示
        }
    });
}

// 🔹 ひらがな ⇔ カタカナの変換関数
function toHiragana(str) {
    return str.replace(/[\u30A1-\u30FA]/g, match => 
        String.fromCharCode(match.charCodeAt(0) - 0x60)
    );
}

function isInAppBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return (
        ua.includes("instagram") || 
        ua.includes("line") || 
        ua.includes("fbav") ||  // Facebookアプリ内
        ua.includes("twitter") || 
        ua.includes("micromessenger") // WeChat
    );
}

        document.addEventListener("DOMContentLoaded", function() {
            const backgroundEl = document.querySelector(".background");
            for (let i = 0; i < 20; i++) {
                let bubble = document.createElement("div");
                bubble.className = "bubble";
                bubble.style.left = Math.random() * 100 + "vw";
                bubble.style.animationDuration = Math.random() * 10 + 5 + "s";
                bubble.style.width = bubble.style.height = Math.random() * 50 + 20 + "px";
                backgroundEl.appendChild(bubble);
            }
        });
