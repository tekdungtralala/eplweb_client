(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("googleapihelper", GoogleApiHelper);

	function GoogleApiHelper(googleClientId, userservice, userauth, $rootScope,
		$state) {
		
		var getResponse = false;
		var deferredObject;
		var userModel;
		var additionalParams = {
			"clientid" : googleClientId,
			"callback" : signinCallback,
			"cookiepolicy": "single_host_origin",
		};

		var service = {
			doSignInGoogle: doSignInGoogle
		};

		return service;

		// Google sign in flow
		// This flow process well conducted in several phases
		// 1. Login into google
		// 2. Load google+ service
		// 3. Fetch google+ profile
		// 4. Sign In into our server
		// 5. Render logged user
		function doSignInGoogle() {
			// Process number #1-a. Login into google
			gapi.auth.signIn(additionalParams);
		}

		function signinCallback(authResult) {
			// Success sign in on google #1-b
			getResponse = false;
			if (authResult['status']['signed_in']) {
				// Process number #2-a. Load google+ service
				gapi.client.load('plus', 'v1', fetchGoogleProfile);
			} else {
				// User not logged on google or revoke our access
				$rootScope.isUserLogged = false;

				// delete current session into cookie
				userauth.delUserSession();

				// render logged user
				userauth.setLoggedUser(null);

				// resolve the promise
				if (deferredObject) deferredObject.resolve();
			}
		}

		function fetchGoogleProfile() {
			// Success load google+ service #2-b

			// Process number #3-a. Fetch google+ profile
			gapi.client.plus.people.get({userId: 'me'})
				.execute(processResponse);
		}

		function processResponse(resp) {
			// Set profile picture
			userauth.setProfilePicture(resp.image.url);

			if (!getResponse) {
				// Success fetch google+ profile #3-b
				var primaryEmail = _.find(resp.emails, function(m) {
					return m.type === "account";
				});
				getResponse = true;

				var email = primaryEmail.value;
				userModel = {
					"firstName" : resp.name.givenName,
					"lastName" : resp.name.familyName,
					"type" : "GOOGLE",
					"userNetworkID" : resp.id,
					"email" : email,
					"imageUrl" : resp.image.url
				}

				if (deferredObject) deferredObject.resolve();

				userservice.isRegisteredUser(email, "GOOGLE")
					.then(checkRegisteredUser)
			}
		}

		function checkRegisteredUser(result) {
			if (404 === result.status) {
				var str = JSON.stringify(userModel);
				var um = encodeURIComponent(str);
				$state.go("user.signin", {userModel: um});
			} else {
				// Process number #4-a. Sign In into our server
				userservice.userSignIn(userModel).then(userauth.processSignIn);
			}
		}
	}
	
})();