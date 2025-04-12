exports.handler = async () => {
  try {
    const credentials = process.env.GOOGLE_CREDENTIALS;
    if (!credentials) {
      return {
        statusCode: 500,
        body: 'GOOGLE_CREDENTIALS が設定されていません。'
      };
    }

    const parsed = JSON.parse(credentials);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        client_email: parsed.client_email,
        project_id: parsed.project_id
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: `パースエラー: ${e.message}`
    };
  }
};
