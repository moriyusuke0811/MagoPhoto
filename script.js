// Firebase設定と初期化
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID",
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const storage = firebase.storage();
  
  // Googleログイン処理
  function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(result => {
        console.log("ログイン成功:", result.user.displayName);
      })
      .catch(error => {
        console.error("ログイン失敗:", error);
        alert("ログインに失敗しました: " + error.message);
      });
  }
  
  // ログイン状態監視（UID取得）
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("ログイン中のUID:", user.uid);
      document.getElementById("uploadButton").disabled = false;  // ログインしていたらアップロード可能
    } else {
      console.log("ユーザー未ログイン");
      document.getElementById("uploadButton").disabled = true;  // ログインしていない場合はアップロード不可
    }
  });
  
  // 画像アップロード処理
  document.getElementById("uploadButton").addEventListener("click", () => {
    const file = document.getElementById("fileInput").files[0];
    const user = auth.currentUser;
  
    if (!file || !user) {
      alert("画像を選択するか、ログインしてください！");
      return;
    }
  
    const uid = user.uid;
    const storageRef = storage.ref(`images/${uid}/${file.name}`);
  
    storageRef.put(file)
      .then(snapshot => {
        alert("画像をアップロードしました！");
        console.log("アップロード完了:", snapshot);
      })
      .catch(error => {
        console.error("アップロード失敗:", error);
        alert("アップロードに失敗しました: " + error.message);
      });
  });