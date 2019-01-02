const $ = require('jquery');

(function() {
	"use strict";

	navigator.serviceWorker.register('../sw.js').then(function(registration) {
		// Registration was successful
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
	  }, function(err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
	  });
  

	function toggleMenu() {
		$('#menu').toggle();
		$('body').toggleClass('show-menu');
	}

	$('#open-button').click(toggleMenu);
	$('.content-wrap').click((e) => {
		if( $('body').hasClass('show-menu') && e.target !== $('#open-button') ) {
			toggleMenu();
		}
	});
})();