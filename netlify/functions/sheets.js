require("dotenv").config(); // ローカル開発用

const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    console.log("✅ [START] Google Sheets API リクエスト開始");

    // 環境変数の取得
    const SHEET_ID = process.env.SHEET_ID;
    const API_KEY = process.env.API_KEY;

    if (!SHEET_ID || !API_KEY) {
      throw new Error("❌ SHEET_ID または API_KEY が設定されていません！");
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:C500?key=${API_KEY}`;
    console.log("🔗 [INFO] APIリクエストURL:", url);

    const response = await fetch(url);
    
    console.log("🟡 [INFO] APIレスポンス:", response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text(); // エラー詳細を取得
      console.error("❌ [ERROR] APIレスポンスエラー:", errorBody);
      throw new Error(`HTTPエラー: ${response.status}, 詳細: ${errorBody}`);
    }

    const data = await response.json();
    console.log("✅ [SUCCESS] 取得データ:", JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("🔥 [ERROR] データ取得エラー:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "データ取得エラー", details: error.message }),
    };
  }
};
