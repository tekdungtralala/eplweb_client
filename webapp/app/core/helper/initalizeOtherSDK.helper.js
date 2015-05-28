(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("initothersdk", InitOtherSDK);

	function InitOtherSDK(facebookAppId, userauth, adminauth, dataservice, 
		$rootScope) {

		var isFbsdkAlreadyLoaded = false;
		var deferredObject = $.Deferred();

		var service = {
			start: start
		};
		return service;

		function start() {
			initFacebookSDK(facebookAppId);
			return deferredObject.promise();
		}

		function finishInitalize() {

			// make sure all third party finished load
			if (isFbsdkAlreadyLoaded) {

				// Get admin and user session
				var adminSession = adminauth.getAdminSession();
				var userSession = userauth.getUserSession();

				var promise;
				promise = $.Deferred();

				// Cek session order by high priority (admin first)
				if (adminSession) {
					promise = dataservice.adminCekLogin().then(prcessAdminLogin);
				} else if (userSession) {
					// If has user session then chek the user who loggin in this app
					promise = dataservice.me().then(prcessUserLogin);
				} 

				promise.then(resolve);

				// Dont has any user logged and resolve the promise
				if (!adminSession && !userSession) {
					promise.resolve();
				}
			}
		}

		// Resolve main promise and will return to apprun
		function resolve() {
			deferredObject.resolve();
		}

		function prcessAdminLogin(result) {
			if (200 === result.status) {
				// change userLogged flag
				$rootScope.isUserLogged = true; 

				// render logged user
				var user = result.data.result.user;
				var userRole = user.userRole;
				userauth.setLoggedUser(user, userRole);
			}
		}

		function prcessUserLogin(result) {
			if (200 === result.status) {
				// change userLogged flag
				$rootScope.isUserLogged = true; 

				// render logged user
				var user = result.data;
				var userRole = result.data.userRole;
				userauth.setLoggedUser(user, userRole);
			}
		}

		function initFacebookSDK(facebookAppId) {
			window.fbAsyncInit = function() {
				FB.init({
					appId: facebookAppId,
					cookie: true,  // enable cookies to allow the server to access 
												 // the session
					xfbml : false,  // parse social plugins on this page
					version : 'v2.2' // use version 2.2
				});

				// set flag finish = true
				isFbsdkAlreadyLoaded = true;
				
				// call finish init function
				finishInitalize();
			};

			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		}

	}
})();
