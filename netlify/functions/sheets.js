exports.handler = async function(event, context) {
  try {
    console.log("Google Sheets API リクエスト開始");

    const url = `https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A1:C500?key=YOUR_API_KEY`;
    console.log("リクエストURL:", url);

    const response = await fetch(url);
    
    console.log("Google Sheets API 応答:", response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();  // エラーメッセージを取得
      console.error("APIエラーレスポンス:", errorBody);
      throw new Error(`HTTPエラー: ${response.status}, 詳細: ${errorBody}`);
    }

    const data = await response.json();
    console.log("取得データ:", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("データ取得エラー:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "データ取得エラー", details: error.message }),
    };
  }
};
