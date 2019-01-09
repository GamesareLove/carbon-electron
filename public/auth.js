"use strict";

(function(){
    $('#signup').click(() => {
        let email = document.getElementById('su-emil').value;
        let password = document.getElementById('su-pswd').value;
        let displayName = document.getElementById('su-usnm').value;
        let confPassword = document.getElementById('su-cnpswd').value;
        if(password === confPassword){
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                let newUser = firebase.auth().currentUser;

                newUser.updateProfile({
                    displayName: displayName,
                    photoURL: 'https://source.unsplash.com/random/42x42'
                }).then(() => {
                    window.location = 'index.html';
                }).catch(error => {
                    console.log(error);
                })
            })
            .catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                console.log('The password is too weak.');
            } else {
                console.log(errorMessage);
            }
            console.log(error);
            });
        } else {
            // document.getElementById('errorMsg').innerText = 'Your passwords do not match.';
            console.log('Passwords do not match');
        }
    });

    $('#signin').click(() => {
        let email = document.getElementById('lgn-emil').value;
        let password = document.getElementById('lgn-pswd').value;

        firebase.auth().signInWithEmailAndPassword(email, password).then(success => {
            window.location = 'index.html';
        })
        .catch(error => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(error, errorCode, errorMessage);
        })
    });
})();