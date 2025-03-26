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

    if (isInAppBrowser()) {
        document.body.innerHTML = `
            <div style="
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100%; 
                height: 100vh; 
                background: white; 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center; 
                text-align: center; 
                padding: 20px;
            ">
                <p style="font-size: 1.5em; font-weight: bold; color: #ff0000;">⚠ アプリ内ブラウザでは正しく表示されません</p>
                <p style="font-size: 1.2em;">Safari や Chrome などの外部ブラウザで開いてください</p>
                <p style="font-size: 1.1em;">右上の <strong>「…」や「共有ボタン」</strong> から「外部ブラウザで開く」を選択してください</p>
            </div>
        `;
    }
