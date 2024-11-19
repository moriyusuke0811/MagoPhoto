let fileInput = document.getElementById('fileInput');

function initApiClient() {
    gapi.client.init({
        apiKey: 'AIzaSyAynlZZ3NPud2M0yYocsKIf7PXM2xUsQns', // APIキー
        clientId: '1055087349247-oq43fdsi17et65o0vj21c15c2acc5hps.apps.googleusercontent.com', // クライアントID
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.file',
    }).then(() => {
        console.log('Google API initialized successfully.');
    }).catch((error) => {
        console.error('Error initializing API client:', error);
    });
}
function handleClientLoad() {
    gapi.load('client:auth2', initApiClient);
}

function uploadFile() {
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
        authInstance.signIn().then(() => {
            console.log('User signed in.');
            uploadFileToDrive();
        }).catch((error) => {
            console.error('Sign-in failed:', error);
        });
    } else {
        uploadFileToDrive();
    }
}

function uploadFileToDrive() {
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const metadata = {
            name: file.name,
            mimeType: file.type,
        };

        const request = gapi.client.drive.files.create({
            resource: metadata,
            media: {
                body: file
            }
        });

        request.execute((response) => {
            if (response.id) {
                console.log('File uploaded successfully:', response);
            } else {
                console.error('File upload failed:', response);
            }
        });
    }
}