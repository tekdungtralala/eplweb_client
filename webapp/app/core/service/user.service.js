(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("userservice", UserService);

	// Note: Please read dataservice.js factory before using any factory
	function UserService(userauth, $http, $rootScope, apipathhelper) {
		var aph = apipathhelper;
		var service = {
			// Send signin request of user
			userSignIn: userSignIn,
			// Cek user session
			userCekLogin: userCekLogin,
			// Send signout request
			userSignOut: userSignOut, 
			// Get whose user already login
			me: me,
			// Check is username exist or not
			isUsernameAvailable: isUsernameAvailable,
			// Check is user has been registar
			isRegisteredUser: isRegisteredUser
		}
		return service;

		function isRegisteredUser(email, networkType) {
			var model = {
				networkType: networkType,
				email: email
			}

			var req = userauth.getConf(model, "POST", "api/user/isRegisteredUser");

			$rootScope.promise = $http(req)
				.then(process)
				.catch(process);
			return $rootScope.promise;

			// return result
			function process(result) {
				return result;
			}

		}

		function isUsernameAvailable(username) {
			var model = {username: username}

			var req = userauth.getConf(model, "POST", "api/user/isUsernameAvailable");
			$rootScope.promise = $http(req)
				.then(process)
				.catch(process);

			return $rootScope.promise;

			// return result
			function process(result) {
				return result;
			}
		}

		function me() {
			$rootScope.isUserLogged = false;

			// get saved session from cookie
			var savedSession = userauth.getUserSession();

			if (savedSession) {
				// if session exist then validity that session through our system

				var req = userauth.getConf(null, "GET", "api/usernetwork/me");

				$rootScope.promise = $http(req)
					.then(process)
					.catch(process);

				return $rootScope.promise;
			} else {
				return false;
			}

			// return result
			function process(result) {
				return result;
			}
		}

		function userSignOut() {
			// Get user session
			var savedSession = userauth.getUserSession();

			// If user session exist then send delete request
			if (savedSession && savedSession.session) {
				var session = savedSession.session;
				$rootScope.promise = $http.delete(aph.generateUrl("api/usernetwork/signin/") + session);
			}
		}

		function userCekLogin() {
			$rootScope.isUserLogged = false;

			// get saved session from cookie
			var savedSession = userauth.getUserSession();

			if (savedSession) {
				// if session exist then validity that session through our system
				$rootScope.promise = checkUserSession(savedSession.session)
					.then(process)
					.catch(process);

				return $rootScope.promise;
			} else {
				return false;
			}

			// return result
			function process(result) {
				return result;
			}
		}

		function checkUserSession(session) {
			return $http.get(aph.generateUrl("api/usernetwork/signin/") + session);
		}

		// Send sign in request into system
		function userSignIn(userModel) {

			var req = {
				method: "POST",
				url: aph.generateUrl("api/usernetwork/signin"),
				data: JSON.stringify(userModel),
			}

			$rootScope.promise = $http(req).then(process).catch(process);
			return $rootScope.promise;

			// return result
			function process(result) {
				return result;
			}
		}
	}
})();