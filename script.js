// クライアントID
const CLIENT_ID = '1055087349247-oq43fdsi17et65o0vj21c15c2acc5hps.apps.googleusercontent.com'; 
//APIきー
const API_KEY = 'AIzaSyAynlZZ3NPud2M0yYocsKIf7PXM2xUsQns'; 

// Google DriveのフォルダID
const FOLDER_ID = '1Re2Li9tMvtCmbJ64OLmul5kmWPnuHYHs'; 

// スコープ設定（Drive APIの読み書き権限）
const SCOPES = 'https://www.googleapis.com/auth/drive.file';


function initApiClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: SCOPES,
    }).then(() => {
        console.log('API client initialized.');
    }).catch((error) => {
        console.error('Error initializing API client:', error);
    });
}

/**
 * Google API ライブラリの読み込み完了時に実行
 */
function handleClientLoad() {
    gapi.load('client:auth2', initApiClient); 
}

/**
 * Google アカウントで認証
 */
function handleAuthClick() {
    const authInstance = gapi.auth2?.getAuthInstance();
    if (!authInstance) {
        alert('APIが正しく初期化されていません。ページを再読み込みしてください。');
        return;
    }

    authInstance.signIn().then(() => {
        console.log('User signed in.');
        uploadFile();
    }).catch((error) => {
        console.error('Error during sign-in:', error);
    });
}

/**
 * ファイルをGoogle Driveにアップロード
 */
function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert('ファイルを選択してください。');
        return;
    }

    const metadata = {
        name: file.name,        // ファイル名
        parents: [FOLDER_ID],  // アップロード先フォルダID
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart");
    xhr.setRequestHeader("Authorization", `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`);

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("アップロード成功！");
        } else {
            console.error('Upload failed:', xhr.responseText);
            alert("アップロードに失敗しました。");
        }
    };

    xhr.onerror = function () {
        alert("アップロード中にエラーが発生しました。");
    };

    xhr.send(formData);
}

/**
 * ファイル選択時にプレビューを表示
 */
document.getElementById("fileInput").addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = "none";
    }
});

/**
 * アップロードボタンのクリックイベント
 */
document.getElementById("uploadButton").addEventListener("click", handleAuthClick);