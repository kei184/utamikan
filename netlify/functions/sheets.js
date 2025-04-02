require("dotenv").config(); // 環境変数を読み込む（ローカル開発用）

const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    console.log("✅ Google Sheets API リクエスト開始");

    // 環境変数から SHEET_ID と API_KEY を取得
    const SHEET_ID = process.env.SHEET_ID;
    const API_KEY = process.env.API_KEY;

    if (!SHEET_ID || !API_KEY) {
      throw new Error("❌ SHEET_ID または API_KEY が設定されていません！");
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:C500?key=${API_KEY}`;
    console.log("🔗 リクエストURL:", url);

    const response = await fetch(url);
    
    console.log("🟡 Google Sheets API 応答:", response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text(); // エラーメッセージを取得
      console.error("❌ APIエラーレスポンス:", errorBody);
      throw new Error(`HTTPエラー: ${response.status}, 詳細: ${errorBody}`);
    }

    const data = await response.json();
    console.log("✅ 取得データ:", JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("🔥 データ取得エラー:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "データ取得エラー", details: error.message }),
    };
  }
};
