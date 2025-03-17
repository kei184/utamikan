const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiUrl = 'https://utamikan.onrender.com/getSheetData';
    const allowedOrigin = 'https://dancing-cocada-ad9354.netlify.app'; // 環境変数から取得することを推奨

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorText = await response.text(); // エラーメッセージを取得
            throw new Error(`HTTPエラー: ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': allowedOrigin
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('プロキシエラー:', error);
        return {
            statusCode: 502, // 502 (Bad Gateway) を返す
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': allowedOrigin
            },
            body: JSON.stringify({ error: error.message }) // エラーメッセージを返す
        };
    }
};