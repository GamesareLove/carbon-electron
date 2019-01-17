"use strict";
const $ = require('jquery');
$.getJSON('../config.json', config => {
		firebase.initializeApp(config);
		mainReady();
});

function mainReady() {
	firebase.auth().onAuthStateChanged(user => {
		if (user) {
			document.getElementById('activeUser').innerHTML = '<div id="thumbWrapper"><div id="profileThumb" style="background-image: url('+user.photoURL+');"></div></div><span>'+user.displayName+'</span><i class="fas fa-fw fa-caret-down"></i>';
			console.log(user);
			if(window.location.toString().includes('profilesettings.html')){
				// console.log(window.location);
				fillProfile(user);
			}
		} else {
			window.location = 'login.html'
		}
	});

	$('#logout').click(() => {
		firebase.auth().signOut();
	});

	function toggleProfileOptions() {
		$('#activeUser svg').toggleClass('fa-caret-down fa-caret-up');
		$('#profileOptions').slideToggle();
		$('body').toggleClass('show-profile');
	}

	$('#activeUser').click(toggleProfileOptions);

	function toggleMenu() {
		$('#menu').toggle();
		$('body').toggleClass('show-menu');
	}

	$('#open-button').click(toggleMenu);
	$('.content-wrap').click(e => {
		if( $('body').hasClass('show-menu') && e.target !== $('#open-button') ) {
			toggleMenu();
			if ($('body').hasClass('show-profile')) {
				toggleProfileOptions();
			}
		}
	});

	/*
	 *   Profile Settings
	 */

	$('#updtPrflStngs').click(updateProfileSettings);
	$('#poEdtTgle').click(toggleProfileSettingsEdit);
	$('#cnclPflEdt').click(toggleProfileSettingsEdit);

	function toggleProfileSettingsEdit() {
		$('.profile-settings').toggle();
	}

	function fillProfile(u) {
		// Text
		$('.po-ppic').attr('style', "background-image: url("+u.photoURL+");");
		document.getElementById('po-usnm').innerText = u.displayName;
		document.getElementById('po-emil').innerText = u.email;


		// Inputs
		document.getElementById('poi-usnm').value = u.displayName;
		document.getElementById('poi-emil').value = u.email;
		// document.getElementById('poi-ppic').value = u.photoURL;
	}

	function updateProfileSettings(){
		let currentUser = firebase.auth().currentUser
		if (document.getElementById('po-emil').value !== currentUser.email){
			currentUser.updateEmail(document.getElementById('po-emil').value);
		}
		if (document.getElementById('po-pswd').value !== '') {
			currentUser.updatePassword(document.getElementById('po-pswd').value);
		}
		if (document.getElementById('po-usnm').value !== currentUser.displayName) {
			currentUser.updateProfile({displayName: document.getElementById('po-usnm').value});
		}
		/*if (document.getElementById('po-ppic').value !== currentUser.photoURL) {
			// TODO Add Storage content adder and URL getter for photoURL
			console.log(currentUser.photoURL)
		}*/
	}
}