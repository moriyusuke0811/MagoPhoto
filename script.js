// クライアントID
const CLIENT_ID = '1055087349247-oq43fdsi17et65o0vj21c15c2acc5hps.apps.googleusercontent.com'; 
//APIきー
const API_KEY = 'AIzaSyAynlZZ3NPud2M0yYocsKIf7PXM2xUsQns'; 

// Google DriveのフォルダID
const FOLDER_ID = '1Re2Li9tMvtCmbJ64OLmul5kmWPnuHYHs'; 

// スコープ設定（Drive APIの読み書き権限）
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Google APIクライアントライブラリを初期化
function initApiClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: SCOPES,
    })
        .then(() => {
            console.log('Google API client initialized.');
        })
        .catch((error) => {
            console.error('Error during API client initialization:', error);
        });
}

// Google APIライブラリの読み込みと初期化
function handleClientLoad() {
    gapi.load('client:auth2', () => {
        console.log('Google API libraries loaded.');
        initApiClient(); // 初期化を呼び出し
    });
}

// 認証状態を確認
function checkAuth() {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance && authInstance.isSignedIn.get()) {
        console.log('認証済み');
    } else {
        console.log('未認証');
    }
}

// APIを使ってファイルをGoogle Driveにアップロード
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('ファイルを選択してください');
        return;
    }

    const metadata = {
        'name': file.name,  // ファイル名
        'parents': [FOLDER_ID]  // アップロード先のフォルダID
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    formData.append('file', file);

    // Google Drive APIにファイルをアップロード
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
    xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('ファイルのアップロードが成功しました');
                alert('アップロード成功: ' + file.name);
            } else {
                console.log('ファイルのアップロードに失敗しました');
                alert('アップロード失敗');
            }
        }
    };
    xhr.send(formData);
}

// Google APIライブラリの読み込みと初期化
function handleClientLoad() {
    gapi.load('client:auth2', initApiClient); // Google APIの初期化が完了したら、次に進む
}

// 画像プレビューを表示する
document.getElementById("fileInput").addEventListener("change", function () {
    const fileInput = this;
    const file = fileInput.files[0];
    const preview = document.getElementById("preview");

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;  // Base64エンコードされた画像データを設定
            preview.style.display = "block"; // プレビュー画像を表示
        };

        // ファイルを読み込んでBase64データとして取得
        reader.readAsDataURL(file);
    } else {
        preview.style.display = "none"; // 画像が選択されていない場合は非表示
    }
});

// アップロードボタンにイベントを追加
document.getElementById("uploadButton").addEventListener("click", function () {
    // ユーザーが認証していなければ、認証を促す
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance || !authInstance.isSignedIn.get()) {
        handleAuthClick();  // 認証が必要な場合は認証を促す
    } else {
        uploadFile();  // 既に認証済みなら、アップロードを実行
    }
});