$(document).ready(function() {
  $("#loadSpreadsheet").click(function() {
    // スプレッドシートのデータを取得する
    $.ajax({
      url: "https://docs.google.com/spreadsheets/d/1VfJK5dFMW03slpZhhVMKpyR00Nb0X4XHoidBRXRutq4/edit?gid=0#gid=0",
      dataType: "json", // スプレッドシートデータを JSON 形式で取得
      success: function(data) {
        // スプレッドシートデータからリストを作成
        var songList = $("#songList");
        songList.empty(); // 既存のリスト項目をクリア

        // スプレッドシートのデータからリスト項目を作成
        data.values.forEach(function(row) {
          var songItem = $("<li>").text(row[0]); // スプレッドシートの最初の列の値を使用
          songList.append(songItem);
        });
      },
      error: function() {
        console.error("スプレッドシートを読み込めませんでした");
      }
    });
  });
});
