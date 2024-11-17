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


function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const metadata = {
        name: file.name, // ファイル名
        parents: ["1Re2Li9tMvtCmbJ64OLmul5kmWPnuHYHs"], // フォルダID
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
}