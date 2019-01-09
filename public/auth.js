"use strict";

(function(){
    $('#signup').click(su);
    $('#signin').click(lgn);
    $('.container').keypress(e => {
        if(e.keyCode == 13){
            if(document.getElementById('lgn-emil') !== null){
                let emil = document.getElementById('lgn-emil').value;
                let pswd = document.getElementById('lgn-pswd').value;
                if(emil !== '' && pswd !== ''){
                    lgn();
                } else if (emil == '') {
                    document.getElementById('lgn-emil').focus();
                } else if (pswd == '') {
                    document.getElementById('lgn-pswd').focus();
                }
            }
            if(document.getElementById('su-emil') !== null){
                let usnm = document.getElementById('su-usnm').value;
                let emil = document.getElementById('su-emil').value;
                let pswd = document.getElementById('su-pswd').value;
                let cnpswd = document.getElementById('su-cnpswd').value;
                if(usnm !== '' && emil !== '' && pswd !== '' && cnpswd !== ''){
                    su();
                } else if (usnm == '') {
                    document.getElementById('su-usnm').focus();
                } else if (emil == '') {
                    document.getElementById('su-emil').focus();
                } else if (pswd == '') {
                    document.getElementById('su-pswd').focus();
                } else if (cnpswd == '') {
                    document.getElementById('su-cnpswd').focus();
                }
            }
        }
    });


    function lgn() {
        let email = document.getElementById('lgn-emil').value;
        let password = document.getElementById('lgn-pswd').value;

        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            window.location = 'index.html';
        })
        .catch(error => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(error, errorCode, errorMessage);
        })
    }

    function su() {
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
                    newUser.sendEmailVerification().then(() => {
                        window.location = 'index.html';
                    });
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
    }
})();