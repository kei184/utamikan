document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    link.onload = function() {
        this.onload = null;  // 防止: 擬似的に何度も実行されるのを防ぐ
        this.rel = 'stylesheet';
    };
    document.head.appendChild(link);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap">';
    document.head.appendChild(noscript);
});
