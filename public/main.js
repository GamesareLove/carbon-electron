"use strict";
const $ = require('jquery');
$.getJSON('../config.json', config => {
		firebase.initializeApp(config);
		mainReady();
});	

function mainReady() {
	firebase.auth().onAuthStateChanged(user => {
		if (user) {
			document.getElementById('activeUser').innerHTML = '<img src="'+user.photoURL+'" alt=""><span>'+user.displayName+'</span><i class="fas fa-fw fa-caret-down"></i>';
			console.log(user);
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
}