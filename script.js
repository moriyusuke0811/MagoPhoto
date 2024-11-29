// 必要な設定
const CLIENT_ID='1055087349247-oq43fdsi17et65o0vj21c15c2acc5hps.apps.googleusercontent.com';
const API_KEY='AIzaSyAynlZZ3NPud2M0yYocsKIf7PXM2xUsQns';
const FOLDER_ID='1Re2Li9tMvtCmbJ64OLmul5kmWPnuHYHs';
const SCOPES='https://www.googleapis.com/auth/drive.file';

let isApiInitialized = false; // 初期化状態のフラグ

/**
 * Google APIをロードする
 */
function handleClientLoad() {
    gapi.load('client:auth2', initApiClient);
}

/**
 * Google APIクライアントを初期化
 */
function initApiClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: SCOPES,
    }).then(() => {
        console.log('Google API initialized successfully.');
        isApiInitialized = true; // 初期化完了
    }).catch((error) => {
        console.error('Error initializing API client:', error);
        alert('Google APIの初期化に失敗しました。');
    });
}

/**
 * 認証ボタンのクリックイベント
 */
function handleAuthClick() {
    if (!isApiInitialized) {
        alert('Google APIがまだ初期化されていません。しばらくしてから再試行してください。');
        console.error('Google API is not initialized.');
        return;
    }

    try {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signIn().then(() => {
            console.log('User signed in.');
            uploadFile(); // サインイン成功後にファイルをアップロード
        }).catch((error) => {
            console.error('Error during sign-in:', error);
            alert('サインイン中にエラーが発生しました。');
        });
    } catch (error) {
        console.error('Unexpected error in handleAuthClick:', error);
        alert('予期しないエラーが発生しました。');
    }
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
        name: file.name,
        parents: [FOLDER_ID],
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