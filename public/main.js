"use strict";
const $ = require('jquery');
$.getJSON('../config.json', config => {
		firebase.initializeApp(config);
		mainReady();
});

function mainReady() {
	const db = firebase.firestore();
	db.settings({ timestampsInSnapshots: true});
	firebase.auth().onAuthStateChanged(user => {
		if (user) {
			document.getElementById('activeUser').innerHTML = '<div class="profileThumb" style="background-image: url('+user.photoURL+');"></div><span>'+user.displayName+'</span><i class="fas fa-fw fa-caret-down"></i>';
			// console.log(user);
			if(window.location.toString().includes('index.html')){
				getOrgs(user);
			}
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

	$('#poEdtTgle').click(toggleProfileSettingsEdit);
	$('#cnclPflEdt').click(() => {
		toggleProfileSettingsEdit();
		resetProfileEditFields();
	});
	//$('#updtprfl').click(updateProfileSettings);
	$('#chngpswd').click(() => {
		$('#chngpswd').toggle();
		$('#pswdchngr').toggle();
	});

	function toggleProfileSettingsEdit() {
		$('.profile-settings').toggle();
	}

	function resetProfileEditFields() {
		let cU = firebase.auth().currentUser;
		document.getElementById('poi-usnm').value = cU.displayName;
		document.getElementById('poi-emil').value = cU.email;
		document.getElementById('poi-pswd').value = '';
		document.getElementById('poi-nwpswd').value = '';
		if($('#chngpswd').attr('style') != undefined && $('#chngpswd').attr('style').toString().includes('display: none;')){
			$('#pswdchngr').toggle();
			$('#chngpswd').toggle();
		}
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
		let e, p, n, u;
		let currentUser = firebase.auth().currentUser;
		let cred = firebase.auth.EmailAuthProvider.credential(currentUser.email, document.getElementById('poi-pswd').value);
		e = document.getElementById('poi-emil').value;
		p = document.getElementById('poi-pswd').value;
		n = document.getElementById('poi-usnm').value;
		if (document.getElementById('po-ppic-input').value != '') {
			let bloop = document.getElementById('po-ppic-input').files[0];
			let storRef = firebase.storage().ref('user/'+currentUser.uid+'/'+bloop.name);
			storRef.put(bloop).then(() => {
				storRef.getDownloadURL().then(url => {
					currentUser.reauthenticateAndRetrieveDataWithCredential(cred).then(data => {
						oopdateProofile(e, p, n, url, data.user);
					});
				});
			});
		} else {
			currentUser.reauthenticateAndRetrieveDataWithCredential(cred).then(data => {
				oopdateProofile(e, p, n, u, data.user);
			});
		}
	}

	function oopdateProofile(e, p, n, u, cu){
		if(e != cu.email && e != undefined){cu.updateEmail(e);}
		if(p != '' && p != undefined){cu.updatePassword(p)}
		let ur = u ? u : cu.photoURL;
		cu.updateProfile({
			displayName: n,
			photoURL: ur
		}).then(() => {
			window.location.reload();
		});
	}

	function getOrgs(u) {
		const groupsArray = [];
		const orgRef = db.collection('organizations');
		orgRef.get().then(orgSnap => {
			orgSnap.forEach(orgDoc => {
				if(orgDoc.get('members').includes(u.uid)){
					// console.log(orgDoc.get('name'));
					groupsArray.push(orgDoc.get('groups'));
				}
			});
			getGroups(groupsArray);
		});
	}

	function getGroups(groups){
		groups.forEach(e => {
			if(e != undefined){
				// console.log(e);
				e.forEach(ee => {
					ee.get().then(groupSnap => {
						let group = document.createElement('div');
						group.innerText = groupSnap.data().name;
						group.setAttribute('class', 'group');
						document.getElementById('groups').appendChild(group);
						group.addEventListener('click', () => {
							if(!group.getAttribute('class').includes('active')){
								let groupElement = document.querySelectorAll('.group');
								groupElement.forEach(c => {c.classList.remove('active')});
								group.classList.add('active');
								getMeetings(groupSnap.data().meetings);
							}
						});
					})
				});
			}
		})
	}

	function getMeetings(meetings) {
		document.getElementById('meetings').innerHTML = '';
		document.getElementById('posts').innerHTML = '';
		meetings.forEach(e => {
			e.get().then(meetingSnap => {
				let meeting = document.createElement('div');
				meeting.innerText = meetingSnap.data().name;
				meeting.setAttribute('class', 'meeting');
				meeting.addEventListener('click', () => {
					if(!meeting.getAttribute('class').includes('active')){
						let meetingElement = document.querySelectorAll('.meeting');
						meetingElement.forEach(c => {c.classList.remove('active')});
						meeting.classList.add('active');
						getPosts(meetingSnap.data().posts);
					}
				});
				document.getElementById('meetings').appendChild(meeting);
			})
		})
	}

	function getPosts(posts) {
		document.getElementById('posts').innerHTML = '';
		posts.forEach(e => {
			e.get().then(postSnap => {
				let post = document.createElement('div');
				post.innerText = postSnap.data().title;
				post.setAttribute('class', 'post');
				post.addEventListener('click', () => {
					if(!post.getAttribute('class').includes('active')){
						let postElement = document.querySelectorAll('.post');
						postElement.forEach(c => {c.classList.remove('active')});
						post.classList.add('active');
						showPost(postSnap.data());
					}
				});
				document.getElementById('posts').appendChild(post);
			})
		})
	}

	function showPost(post) {
		let postTitle = post.title;
		let postDate = post.metadata.creationDate;
		let postBody = post.body;
		let postAttcLen = post.metadata.attachments.length;
		let postAuthor = post.author;
		console.log(postTitle, postDate, postBody, postAttcLen);
		document.getElementById('post-title').innerText = postTitle;
		document.getElementById('post-body').innerHTML = postBody;
		document.getElementById('post-date').innerText = `By ${postAuthor.displayName} on ${new Date(postDate.seconds*1000)}`;
		document.getElementById('post-edit').style.display = 'block';
		document.getElementById('post-atch').innerText = `${postAttcLen} File(s) Attached`;
	}
}
