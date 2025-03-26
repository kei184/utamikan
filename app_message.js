if (navigator.userAgent.indexOf('TikTok') > -1) {
    // TikTokアプリ内ブラウザで開かれた場合
    var message = document.createElement('div');
    message.textContent = 'TikTokアプリ内で開いています。外部ブラウザで開くには、右上の「…」から「ブラウザで開く」を選択してください。';
    message.style.position = 'fixed';
    message.style.top = '10px'; // 上からのマージン
    message.style.left = '10px'; // 左からのマージン
    message.style.width = 'calc(100% - 20px)'; // 幅を調整
    message.style.backgroundColor = 'white';
    message.style.zIndex = '9999';
    message.style.padding = '10px'; // パディングを追加
    message.style.borderRadius = '5px'; // 角を丸くする
    document.body.appendChild(message);
} else if (navigator.userAgent.indexOf('Twitter') > -1 || navigator.userAgent.indexOf('XApp') > -1) {
    // Xアプリ内ブラウザで開かれた場合
    var message = document.createElement('div');
    message.textContent = 'Xアプリ内で開いています。外部ブラウザで開くには、右上の「…」から「ブラウザで開く」を選択してください。';
    message.style.position = 'fixed';
    message.style.top = '10px'; // 上からのマージン
    message.style.left = '10px'; // 左からのマージン
    message.style.width = 'calc(100% - 20px)'; // 幅を調整
    message.style.backgroundColor = 'white';
    message.style.zIndex = '9999';
    message.style.padding = '10px'; // パディングを追加
    message.style.borderRadius = '5px'; // 角を丸くする
    document.body.appendChild(message);
} else if (navigator.userAgent.indexOf('trill') > -1) {
    // trillアプリ内ブラウザで開かれた場合
    var message = document.createElement('div');
    message.textContent = 'TikTokアプリ内で開いています。外部ブラウザで開くには、右上の「…」から「ブラウザで開く」を選択してください。';
    message.style.position = 'fixed';
    message.style.top = '10px'; // 上からのマージン
    message.style.left = '10px'; // 左からのマージン
    message.style.width = 'calc(100% - 20px)'; // 幅を調整
    message.style.backgroundColor = 'white';
    message.style.zIndex = '9999';
    message.style.padding = '10px'; // パディングを追加
    message.style.borderRadius = '5px'; // 角を丸くする
    document.body.appendChild(message);
}
