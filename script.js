document.addEventListener('DOMContentLoaded', () => {
    const loadButton = document.getElementById('load-button');
    const tableBody = document.getElementById('songTable').querySelector('tbody');
    const searchInput = document.getElementById('searchInput');
    const filterArtist = document.getElementById('filterArtist');
    const filterGenre = document.getElementById('filterGenre');
    const errorMessage = document.getElementById('error-message');

    let fetchedData = []; // 取得したデータを格納する変数

    // ドキュメントロード時にデータを取得
    loadData();

    // ボタンクリックでデータを再ロード
    if (loadButton) {
        loadButton.addEventListener('click', loadData);
    }

    function loadData() {
        displayError('データ読み込み中...');
        fetch('/.netlify/functions/sheets', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
            }
            return response.text(); // レスポンスをテキストとして取得
        })
        .then(text => {
            try {
                const data = JSON.parse(text); // JSONパースを試みる
                processData(data);
            } catch (e) {
                console.error('パースエラー:', e);
                console.error('レスポンステキスト:', text); // 問題のあるレスポンスをログに出力
                throw new Error("レスポンスは有効なJSONではありません");
            }
        })
        .catch(handleError);
    }

    function processData(data) {
        if (!data || !Array.isArray(data.values) || data.values.length <= 1) {
            throw new Error("データが不正または空です");
        }

        tableBody.innerHTML = '';
        fetchedData = data.values;

        const artistSet = new Set();
        const genreCount = {};

        data.values.slice(1).forEach(row => {
            if (row.length >= 3) {
                const [artist, songTitle, genre] = row;
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${songTitle} ${artist} 歌詞`)}`;
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

        displayError('');
    }

    function handleError(error) {
        console.error('データ取得エラー:', error);
        displayError(`データの取得に失敗しました: ${error.message}`);
        if (navigator.onLine) {
            setTimeout(loadData, 3000);
        }
    }

    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = message ? 'block' : 'none';
    }

    function updateGenreOptions(selectElement, genreCount) {
        selectElement.innerHTML = '<option value="">All</option>';
        Object.keys(genreCount).forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = `${genre} (${genreCount[genre]})`;
            selectElement.appendChild(option);
        });
    }

    function updateFilterOptions(selectElement, dataSet) {
        selectElement.innerHTML = '<option value="">All</option>';
        dataSet.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
    }

    function filterTable() {
        // フィルター処理のロジックをここに追加
    }

    function toHiragana(str) {
        // 文字列をひらがなに変換するロジックをここに追加
    }

    searchInput?.addEventListener('input', filterTable);
    filterArtist?.addEventListener('change', filterTable);
    filterGenre?.addEventListener('change', filterTable);
});

document.addEventListener("DOMContentLoaded", function() {
    const backgroundEl = document.querySelector(".background");
    if (backgroundEl) {
        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement("div");
            bubble.className = "bubble";
            bubble.style.left = `${Math.random() * 100}vw`;
            bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
            bubble.style.width = bubble.style.height = `${Math.random() * 50 + 20}px`;
            backgroundEl.appendChild(bubble);
        }
    }
});

document.querySelectorAll('a[data-ga-category]').forEach(link => {
    link.addEventListener('click', () => {
        const { gaCategory: category, gaAction: action, gaLabel: label } = link.dataset;
        if (typeof gtag === 'function') {
            gtag('event', 'link_click', { event_category: category, event_action: action, event_label: label });
        } else if (typeof ga === 'function') {
            ga('send', 'event', category, action, label);
        }
    });
});
