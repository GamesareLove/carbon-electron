"use strict";
const $ = require('jquery');
$.getJSON('../config.json', config => {
    firebase.initializeApp(config);
    authReady();
});

function authReady() {
    let clicker = 0;
    if (window.location.search.includes('?m=pswdRstSnt')) {
        $('#' + window.location.search.substring(3)).toggle();
    }

    $('#signup').click(su);
    $('#signin').click(lgn);

    $('#scrtlgn').click(() => {
        if (clicker >= 10) {
            firebase.auth().signInWithEmailAndPassword('admin@carbonappp.firebaseapp.com', 'password').then(() => {
                window.location = 'index.html';
            });
        }
        console.log(clicker);
        clicker++;
    });

    $('#sendreset').click(rst);
    $('.container').keypress(e => {
        if (e.keyCode == 13) {
            if (document.getElementById('lgn-emil') != null) {
                let emil = document.getElementById('lgn-emil').value;
                let pswd = document.getElementById('lgn-pswd').value;
                if (emil != '' && pswd != '') {
                    lgn();
                } else if (emil == '') {
                    document.getElementById('lgn-emil').focus();
                } else if (pswd == '') {
                    document.getElementById('lgn-pswd').focus();
                }
            }
            if (document.getElementById('su-emil') != null) {
                let usnm = document.getElementById('su-usnm').value;
                let emil = document.getElementById('su-emil').value;
                let pswd = document.getElementById('su-pswd').value;
                let cnpswd = document.getElementById('su-cnpswd').value;
                if (usnm != '' && emil != '' && pswd != '' && cnpswd != '') {
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
            if (document.getElementById('emil-fr-rst') != null) {
                if (document.getElementById('emil-fr-rst').value != '') {
                    rst();
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
        if (password === confPassword) {
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

    function rst() {
        firebase.auth().sendPasswordResetEmail(document.getElementById('emil-fr-rst').value).then(() => {
            window.location = 'login.html?m=pswdRstSnt';
        })
    }
}

var createTitlebar = function createTitlebar() {
	const $ = require('jquery');
	const remote = require('electron').remote;

	$('body').prepend($('<div></div>', { id: "title-bar" }).load(`titlebar.html`));

	$(`#title-bar`).ready(() => {

		 let window = remote.BrowserWindow.getFocusedWindow();

		 $('#min-btn').click(() => {
			  window = remote.BrowserWindow.getFocusedWindow();
			  window.minimize();
		 });

		 $('#max-btn').click(() => {
			  window = remote.BrowserWindow.getFocusedWindow();
			  window.maximize();
			  toggleMaxRestoreButtons();
		 });

		 $('#restore-btn').click(() => {
			  window = remote.BrowserWindow.getFocusedWindow();
			  window.unmaximize();
			  toggleMaxRestoreButtons();
		 });

		 toggleMaxRestoreButtons();
		 window.on('maximize', toggleMaxRestoreButtons);
		 window.on('unmaximize', toggleMaxRestoreButtons);

		 $('#close-btn').click(() => {
			  window = remote.BrowserWindow.getFocusedWindow();
			  window.close();
		 });

		 function toggleMaxRestoreButtons() {
			  window = remote.BrowserWindow.getFocusedWindow();
			  if (window.isMaximized()) {
				   $('#max-btn').css('display', 'none');
				   $('#restore-btn').css('display', 'flex');
			  } else {
				   $('#max-btn').css('display', 'flex');
				   $('#restore-btn').css('display', 'none');
			  }
		 }
	})
}

createTitlebar();