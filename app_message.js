if (navigator.userAgent.indexOf('TikTok') > -1) {
    // TikTokアプリ内ブラウザで開かれた場合
    var message = document.createElement('div');
    message.textContent = 'TikTokアプリ内で開いています。LINEのリンクが正しく飛ぶように外部ブラウザで開くには、右上の「…」から「ブラウザで開く」を選択してください。';
    message.style.position = 'fixed';
    message.style.top = '10px';
    message.style.left = '10px';
    message.style.right = '10px'; // 右側にもマージンを指定
    message.style.backgroundColor = 'white';
    message.style.zIndex = '9999';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    document.body.appendChild(message);
} else if (navigator.userAgent.indexOf('Twitter') > -1 || navigator.userAgent.indexOf('XApp') > -1) {
    // Xアプリ内ブラウザで開かれた場合
    var message = document.createElement('div');
    message.textContent = 'Xアプリ内で開いています。LINEのリンクが正しく飛ぶように外部ブラウザで開くには、右上の「…」から「ブラウザで開く」を選択してください。';
    message.style.position = 'fixed';
    message.style.top = '10px';
    message.style.left = '10px';
    message.style.right = '10px'; // 右側にもマージンを指定
    message.style.backgroundColor = 'white';
    message.style.zIndex = '9999';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    document.body.appendChild(message);
} else if (navigator.userAgent.indexOf('trill') > -1) {
    // trillアプリ内ブラウザで開かれた場合
    var message = document.createElement('div');
    message.textContent = 'TikTokアプリ内で開いています。LINEのリンクが正しく飛ぶように外部ブラウザで開くには、右上の「…」から「ブラウザで開く」を選択してください。';
    message.style.position = 'fixed';
    message.style.top = '10px';
    message.style.left = '10px';
    message.style.right = '10px'; // 右側にもマージンを指定
    message.style.backgroundColor = 'white';
    message.style.zIndex = '9999';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    document.body.appendChild(message);
}
