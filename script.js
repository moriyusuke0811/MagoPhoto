const auth = firebase.auth();
const db = firebase.firestore();

function loginWithGoogle() {
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
            `ニックネーム: ${data.nickname}\n年齢: ${data.age}\nコメント: ${data.comment}`;
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
}

function showSignupForm() {
  document.getElementById("signupForm").style.display = "block";
}

function signupWithGoogle() {
  const nickname = document.getElementById("nickname").value;
  const age = parseInt(document.getElementById("age").value, 10);
  const comment = document.getElementById("comment").value;

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
