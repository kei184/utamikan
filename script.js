const loadButton = document.getElementById('load-button');
const tableBody = document.getElementById('songTable').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('searchInput');
const filterArtist = document.getElementById('filterArtist');
const filterGenre = document.getElementById('filterGenre');
const errorMessage = document.getElementById('error-message');

// API URL
const API_URL = '/.netlify/functions/sheets';

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

function updateFilterOptions(selectElement, dataSet) {
    selectElement.innerHTML = '<option value="">すべて</option>';
    [...dataSet].sort().forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

function setupSearchAndFilters(fetchedData) {
    searchInput.addEventListener('input', () => filterTable(fetchedData));
    filterArtist.addEventListener('change', () => filterTable(fetchedData));
    filterGenre.addEventListener('change', () => filterTable(fetchedData));
}

function filterTable(fetchedData) {
    let searchQuery = searchInput.value;
    const artistFilter = filterArtist.value;
    const genreFilter = filterGenre.value;

    const rows = document.querySelectorAll('#songTable tbody tr');

    rows.forEach((row, index) => {
        const data = fetchedData[index + 1];
        if (!data) return;

        let artist = data[0];
        let song = data[1];
        let genre = data[2];

        const hiraganaArtist = toHiragana(artist.toLowerCase());
        const hiraganaSong = toHiragana(song.toLowerCase());
        const hiraganaSearchQuery = toHiragana(searchQuery.toLowerCase());

        const matchesSearch = hiraganaSong.includes(hiraganaSearchQuery) || hiraganaArtist.includes(hiraganaSearchQuery);
        const matchesArtist = artistFilter === "" || toHiragana(artist.toLowerCase()) === toHiragana(artistFilter.toLowerCase());
        const matchesGenre = genreFilter === "" || toHiragana(genre.toLowerCase()) === toHiragana(genreFilter.toLowerCase());

        row.style.display = matchesSearch && matchesArtist && matchesGenre ? "" : "none";
    });
}

const hiraganaCache = {};
function toHiragana(str) {
    if (hiraganaCache[str]) return hiraganaCache[str];
    const result = str.replace(/[\u30A1-\u30FA]/g, match => String.fromCharCode(match.charCodeAt(0) - 0x60));
    hiraganaCache[str] = result;
    return result;
}

// バブルアニメーション
document.addEventListener("DOMContentLoaded", function () {
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

// Google Analytics 用のリンク追跡
const links = document.querySelectorAll('a[data-ga-category]');
links.forEach(link => {
    link.addEventListener('click', () => {
        const category = link.dataset.gaCategory;
        const action = link.dataset.gaAction;
        const label = link.dataset.gaLabel;
        if (typeof gtag === 'function') {
            gtag('event', 'link_click', {
                event_category: category,
                event_action: action,
                event_label: label
            });
        } else if (typeof ga === 'function') {
            ga('send', 'event', category, action, label);
        }
    });
});
