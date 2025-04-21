window.addEventListener("DOMContentLoaded", () => {
  // Firebase 構成
  const firebaseConfig = {
    apiKey: "AIzaSyBWSlI0Cy2sITfnLe7QR16rPsK4ms91X-I",
    authDomain: "magophoto-46b22.firebaseapp.com",
    projectId: "magophoto-46b22",
    storageBucket: "magophoto-46b22.appspot.com",
    messagingSenderId: "840299611201",
    appId: "1:840299611201:web:757c2e61e711998849b2c0",
    measurementId: "G-E25Z33K6LV"
  };

  // Firebase 初期化
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  // Googleログイン
  window.loginWithGoogle = function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        console.log("ログイン成功:", user.displayName);

        // Firestoreにプロフィールがあるか確認
        db.collection("users").doc(user.uid).get().then(doc => {
          if (doc.exists) {
            const data = doc.data();
            document.getElementById("profileText").innerText = 
              `ニックネーム: ${data.nickname}\n年齢: ${data.age}\n備考: ${data.comment}`;
            document.getElementById("profileDisplay").style.display = "block";
          } else {
            // プロフィール未登録
            document.getElementById("signupForm").style.display = "block";
          }
        });
      })
      .catch(error => {
        console.error("ログイン失敗:", error);
      });
  };

// ポップアップを表示する関数
function openSignupForm() {
  document.getElementById("signupModal").style.display = "block";
}

// ポップアップを非表示にする関数
function closeSignupForm() {
  document.getElementById("signupModal").style.display = "none";
}
  // モーダルの外側をクリックしたときに閉じる
window.onclick = function(event) {
  const modal = document.getElementById("signupModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
  // Googleでサインアップ
  window.signupWithGoogle = function () {
    const nickname = document.getElementById("nickname").value;
    const age = parseInt(document.getElementById("age").value, 10);
    const comment = document.getElementById("comment").value;

    if (!nickname || isNaN(age)) {
      alert("ニックネームと年齢を正しく入力してください");
      return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(result => {
        const user = result.user;

        // Firestoreにプロフィールを保存
        return db.collection("users").doc(user.uid).set({
          nickname,
          age,
          comment
        });
      })
      .then(() => {
        alert("サインアップ完了！");
        location.reload();
      })
      .catch(error => {
        console.error("サインアップ失敗:", error);
      });
  };

  // ログイン状態監視
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("ログイン中のUID:", user.uid);
      document.getElementById("uploadButton").disabled = false;
    } else {
      console.log("ユーザー未ログイン");
      document.getElementById("uploadButton").disabled = true;
    }
  });

  // アップロード処理
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
});