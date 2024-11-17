const CLIENT_ID = '1055087349247-nrekoe5ju1kitahjvmthqu6gbnop2io1.apps.googleusercontent.com1055087349247-4pll7vck0e1toe77qkq9tsrtimogjke9.apps.googleusercontent.com';  // クライアントIDを設定
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
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please select a file.");
        return;
    }

    gapi.auth2.getAuthInstance().signIn().then(() => {
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify({
            'name': file.name,
            'mimeType': file.type,
            'parents': ['15-PrCE4CQRTijNH5pxyKCDBBv3Z1LACN']  // アップロード先のフォルダIDを設定
        })], {type: 'application/json'}));
        form.append('file', file);

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }),
            body: form
        }).then((response) => response.json()).then((data) => {
            console.log("File uploaded successfully:", data);
            alert("File uploaded successfully!");
        }).catch((error) => {
            console.error("Error uploading file:", error);
            alert("Error uploading file");
        });
    });
}

document.addEventListener("DOMContentLoaded", handleClientLoad);