function initApp() {
    // Login with Email/Password
    var txtEmail = document.getElementById('inputEmail');
    var txtPassword = document.getElementById('inputPassword');
    var btnLogin = document.getElementById('btnLogin');
    var btnGoogle = document.getElementById('btngoogle');
    var btnSignUp = document.getElementById('btnSignUp');

    btnLogin.addEventListener('click', function () {
        /// TODO 2: Add email login button event
        ///         1. Get user input email and password to login
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert()" and clean input field
        firebase.auth().signInWithEmailAndPassword(txtEmail.value, txtPassword.value)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;//var user內有email、uid可用
                // ...

                location.replace("./index.html");
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;

                create_alert("error", "Access Denied! Make sure you have your email and password typed correctly!");
                setTimeout(function () {
                    txtEmail.value = "";
                    txtPassword.value = "";
                }, 2000);
            });
    });

    btnGoogle.addEventListener('click', function () {
        /// TODO 3: Add google login button event
        ///         1. Use popup function to login google
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert()"
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;//這是一串人類無法看懂的東西
                // The signed-in user info.
                var user = result.user;//這跟上面的手動填email登入所收到的東西一樣
                /*
                user.displayName: 顯示名稱。ex：望月的犀牛
                user.email: 電子信箱
                user.emailVerified: 這個電子信箱是否有驗證
                user.photoURL: 大頭照的路徑
                user.uid: Firebase Auth 派給這個使用者的 User ID
                */
                

                firebase.database().ref('users/' + user.uid).set({
                    Name : user.displayName ? user.displayName : user.email,
                    Email: user.email,
                    Photo: user.photoURL ? user.photoURL : "NaN",
                    UID: user.uid
                }).then(
                    (sucMsg) => {
                        console.log("SUCCESS!!")
                        console.log(sucMsg);
                        create_alert("success", "You're correctly logged in");
                    },
                    (errMsg) => {
                        console.log("FAIL!!")
                        console.log(errMsg);
                    }
                );

                firebase.database().ref('chatrooms/0/Users/' + user.uid).set({
                    Name : user.displayName ? user.displayName : user.email,
                    Email: user.email,
                    Photo: user.photoURL ? user.photoURL : "NaN",
                    UID: user.uid
                });
                
                setTimeout(
                    () => {
                        location.replace("./index.html");
                    }
                , 2000);
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...

                create_alert("error", "Access Denied! Make sure you have your email and password typed correctly!");
            });
    });

    btnSignUp.addEventListener('click', function () {
        /// TODO 4: Add signup button event
        ///         1. Get user input email and password to signup
        ///         2. Show success message by "create_alert" and clean input field
        ///         3. Show error message by "create_alert" and clean input field
        firebase.auth().createUserWithEmailAndPassword(txtEmail.value, txtPassword.value)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                // ...

                create_alert("success", "Your account: " + txtEmail.value + " has been successfully created!");

                firebase.database().ref('users/' + user.uid).set({
                    Name : user.displayName ? user.displayName : user.email,
                    Email: user.email,
                    Photo: user.photoURL ? user.photoURL : "NaN",
                    UID: user.uid
                }).then(
                    (sucMsg) => {
                        console.log("SUCCESS!!")
                        console.log(sucMsg);
                    },
                    (errMsg) => {
                        console.log("FAIL!!")
                        console.log(errMsg);
                    }
                );
                
                firebase.database().ref('chatrooms/0/Users/' + user.uid).set({
                    Name : user.displayName ? user.displayName : user.email,
                    Email: user.email,
                    Photo: user.photoURL ? user.photoURL : "NaN",
                    UID: user.uid
                });

                txtEmail.value = "";
                txtPassword.value = "";
            }, (error)=> {
                var errorCode = error.code;
                var errorMessage = error.message;
                // ..
                create_alert("error", errorMessage);
                setTimeout(function () {
                    txtEmail.value = "";
                    txtPassword.value = "";
                }, 2000);
            });
            
    });
}

// Custom alert
function create_alert(type, message) {
    var alertarea = document.getElementById('custom-alert');
    if (type == "success") {
        str_html = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    } else if (type == "error") {
        str_html = "<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    }
}

window.onload = function () {
    initApp();
};