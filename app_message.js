window.onload = function() {
  if (navigator.userAgent.toLowerCase().indexOf('tiktok') > -1) {
    // TikTokアプリ内ブラウザで開かれた場合
    var message = document.createElement('div');
    message.textContent = 'TikTokアプリ内で開いています。外部ブラウザで開くには、右上の「…」から「ブラウザで開く」を選択してください。';
    message.style.position = 'fixed';
    message.style.top = '0';
    message.style.left = '0';
    message.style.width = '100%';
    message.style.backgroundColor = 'white';
    message.style.zIndex = '99999'; // z-indexを大きくする
    document.body.appendChild(message);
  }
};
if (navigator.userAgent.indexOf('TikTok') > -1) {
  // TikTokアプリ内ブラウザで開かれた場合
  var message = document.createElement('div');
  message.textContent = 'TikTokアプリ内で開いています。外部ブラウザで開くには、右上の「…」から「ブラウザで開く」を選択してください。';
  message.style.position = 'fixed';
  message.style.top = '0';
  message.style.left = '0';
  message.style.width = '100%';
  message.style.backgroundColor = 'white';
  message.style.zIndex = '9999';
  document.body.appendChild(message);
} else if (navigator.userAgent.indexOf('Twitter') > -1 || navigator.userAgent.indexOf('XApp') > -1) {
  // Xアプリ内ブラウザで開かれた場合
  var message = document.createElement('div');
  message.textContent = 'Xアプリ内で開いています。外部ブラウザで開くには、右上の「…」から「ブラウザで開く」を選択してください。';
  message.style.position = 'fixed';
  message.style.top = '0';
  message.style.left = '0';
  message.style.width = '100%';
  message.style.backgroundColor = 'white';
  message.style.zIndex = '9999';
  document.body.appendChild(message);
}
