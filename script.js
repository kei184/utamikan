// script.js
document.addEventListener('DOMContentLoaded', () => {
    const loadButton = document.getElementById('load-button');
    const tableBody = document.getElementById('songTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInput');
    const filterArtist = document.getElementById('filterArtist');
    const filterGenre = document.getElementById('filterGenre');
    const errorMessage = document.getElementById('error-message');

    let fetchedData = []; // 取得したデータを格納するための変数

    // デフォルトでデータをロード
    loadData();

    // オプションでボタンクリックでリロード
    if (loadButton) {
        loadButton.addEventListener('click', loadData);
    }

    function loadData() {
        // エラーメッセージの初期化
        if (errorMessage) {
            errorMessage.textContent = 'データ読み込み中...';
            errorMessage.style.display = 'block';
        }

        // フェッチ処理の強化
        fetch('/.netlify/functions/sheets', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        })
        .then(response => {
            // レスポンスのバリデーション強化
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(processData)
        .catch(handleError);
    }

    function processData(data) {
        console.log("取得したデータ:", data);

        // データの詳細なバリデーション
        if (!data || !data.values || !Array.isArray(data.values) || data.values.length <= 1) {
            throw new Error("データが不正または空です");
        }

        // テーブルをリセット
        if (tableBody) tableBody.innerHTML = '';
        
        fetchedData = data.values;

        const artistSet = new Set();
        const genreCount = {};

        // データ処理
        data.values.slice(1).forEach(row => {
            if (row.length >= 3) {
                const [artist, songTitle, genre] = row;
                
                // Google検索リンク付きの曲名
                const searchQuery = `${songTitle} ${artist} 歌詞`;
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                const songLink = `<a href="${searchUrl}" target="_blank" rel="noopener noreferrer">${songTitle}</a>`;

                // テーブル行の追加
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${artist}</td><td>${songLink}</td><td>${genre}</td>`;
                if (tableBody) tableBody.appendChild(tr);

                artistSet.add(artist);
                genreCount[genre] = (genreCount[genre] || 0) + 1;
            }
        });

        // フィルターオプションの更新
        if (filterArtist) updateFilterOptions(filterArtist, artistSet);
        if (filterGenre) updateGenreOptions(filterGenre, genreCount);

        // エラーメッセージのクリア
        if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.style.display = 'none';
        }
    }

    function handleError(error) {
        console.error('データ取得エラー:', error);
        
        if (errorMessage) {
            errorMessage.textContent = `データの取得に失敗しました: ${error.message}`;
            errorMessage.style.display = 'block';
        }

        // オプション: エラー報告や再試行ロジック
        if (navigator.onLine) {
            // ネットワーク接続がある場合の処理
            setTimeout(loadData, 3000); // 3秒後に再試行
        }
    }

    // 以下、既存の関数は同じ
    function updateGenreOptions(selectElement, genreCount) { /* 既存のコード */ }
    function updateFilterOptions(selectElement, dataSet) { /* 既存のコード */ }
    function filterTable() { /* 既存のコード */ }
    function toHiragana(str) { /* 既存のコード */ }

    // イベントリスナーの追加（既存のまま）
    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (filterArtist) filterArtist.addEventListener('change', filterTable);
    if (filterGenre) filterGenre.addEventListener('change', filterTable);
});

// バックグラウンドバブル
document.addEventListener("DOMContentLoaded", function() {
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

// Google Analytics
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
