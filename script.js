// 必要な設定
const CLIENT_ID='1055087349247-oq43fdsi17et65o0vj21c15c2acc5hps.apps.googleusercontent.com';
const FOLDER_ID='1Re2Li9tMvtCmbJ64OLmul5kmWPnuHYHs';

let tokenClient;
let accessToken = null;

/**
 * Google Identity Servicesを初期化
 */
function initializeGIS() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (response) => {
            if (response.error) {
                console.error('Error during token request:', response);
                alert('トークン取得中にエラーが発生しました。');
            } else {
                console.log('Access token acquired.');
                accessToken = response.access_token;
                uploadFile();
            }
        },
    });
}

/**
 * 認証を処理する
 */
function handleAuthClick() {
    if (!tokenClient) {
        alert('GISが初期化されていません。');
        return;
    }

    tokenClient.requestAccessToken();
}

/**
 * ファイルをGoogle Driveにアップロード
 */
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
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
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
        }),
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.error('Upload failed:', data.error);
                alert('アップロードに失敗しました。');
            } else {
                console.log('Upload successful:', data);
                alert('アップロード成功！');
            }
        })
        .catch((error) => {
            console.error('Error during upload:', error);
            alert('アップロード中にエラーが発生しました。');
        });
}

/**
 * ファイル選択時のプレビュー
 */
document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    const preview = document.getElementById('preview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
});

/**
 * アップロードボタンのクリックイベント
 */
document.getElementById('uploadButton').addEventListener('click', handleAuthClick);

/**
 * ページロード時にGoogle Identity Servicesを初期化
 */
document.addEventListener('DOMContentLoaded', initializeGIS);