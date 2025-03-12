    <script>
    document.getElementById('load-button').addEventListener('click', function() {
        fetch('https://utamikan.onrender.com/getSheetData')
            .then(response => response.json())
            .then(data => {
                console.log("取得したデータ:", data);
                const tableBody = document.getElementById('songTable').getElementsByTagName('tbody')[0];
                tableBody.innerHTML = '';
                
                if (data.values && data.values.length > 1) {
                    data.values.slice(1).forEach(row => {
                        if (row.length >= 3) {
                            const tr = document.createElement("tr");
                            tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td>`;
                            tableBody.appendChild(tr);
                        }
                    });
                } else {
                    console.warn("データが空です！");
                }
            })
            .catch(error => {
                console.error('データ取得エラー:', error);
            });
    });
    </script>
