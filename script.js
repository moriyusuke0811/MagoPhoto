const CLIENT_ID = '1055087349247-4pll7vck0e1toe77qkq9tsrtimogjke9.apps.googleusercontent.com';  // クライアントIDを設定
const API_KEY = 'AIzaSyAneFyaDoFnLqcwI5YyvOWGKRuqBDw6ju8';      // APIキーを設定
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        console.log("Google API initialized");
    }, (error) => {
        console.error(JSON.stringify(error, null, 2));
    });
}
document.getElementById("fileInput").addEventListener("change", function () {
    const fileInput = this;
    const file = fileInput.files[0];
    const preview = document.getElementById("preview");

    if (file) {
        const reader = new FileReader();
        
        // ファイル読み込み後の処理
        reader.onload = function (e) {
            preview.src = e.target.result; // Base64エンコードされた画像を表示
            preview.style.display = "block"; // 画像を表示
        };

        reader.readAsDataURL(file); // ファイルをBase64エンコード
    } else {
        preview.style.display = "none"; // ファイルが選択されていない場合は非表示
    }
});

function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const metadata = {
        name: file.name, // ファイル名
        parents: ["15-PrCE4CQRTijNH5pxyKCDBBv3Z1LACN"], // フォルダID
    };

    const formData = new FormData();
    formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    formData.append("file", file);

    gapi.client
        .request({
            path: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            method: "POST",
            body: formData,
        })
        .then((response) => {
            console.log("File uploaded successfully:", response);
            alert("File uploaded successfully!");
        })
        .catch((error) => {
            console.error("Error uploading file:", error);
            alert("Failed to upload file. Check the console for details.");
        });
    alert("File ready for upload: " + file.name);
}