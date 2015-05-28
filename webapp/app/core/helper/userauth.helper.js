(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("userauth", UserAuth);

	function UserAuth($cookieStore, $rootScope, $state, apipathhelper) {
		var aph = apipathhelper;

		var USER_SESSION_KEY = "epl-user-session";
		var EPL_AUTH_HEADER = "epl-authentication";

		var service = {
			// Save User session into cookie
			putUserSession: putUserSession,
			// Take User session from cookie 
			getUserSession: getUserSession,
			// Remove User session on cookies
			delUserSession: delUserSession,
			// Set logged user
			setLoggedUser: setLoggedUser,
			// Set user profile picture
			setProfilePicture: setProfilePicture,
			// Generate http conf for user
			getConf: getConf,
			// processSignIn
			processSignIn: processSignIn
		};
		return service;

		function processSignIn(result) {
			$rootScope.isUserLogged = false;
			if (200 === result.status) {

				// change userLogged flag
				$rootScope.isUserLogged = true;

				// save current session into cookie
				var session = result.data.session;
				var type = result.data.userNetwork.type;
				putUserSession(session, type);

				// render logged user
				var user = result.data.userNetwork.user;
				var userRole = result.data.role;
				setLoggedUser(user, userRole);

				$state.go("dashboard");
			}
		}

		function getConf(o, method, url) {
			var req = {
				method: method,
				url: aph.generateUrl(url),
				headers: {
					"Content-Type": "application/json"
				}
			}

			if (o) {
				req.data = JSON.stringify(o);
			}

			var userSession = getUserSession();
			if (userSession && userSession.session)
				req.headers[EPL_AUTH_HEADER] = getUserSession().session;

			return req;
		}

		function setProfilePicture(url) {
			$rootScope.profileUrl = url;
		}

		function setLoggedUser(userProfile, userRole) {
			$rootScope.loggedUser = null;
			if (userProfile) {
				$rootScope.loggedUser = userProfile;

				// used on userProfile.html - signout button
				$rootScope.loggedUser["userRole"] = userRole;
			}
		}

		function delUserSession() {
			$cookieStore.remove(USER_SESSION_KEY);
		}

		function getUserSession() {
			return $cookieStore.get(USER_SESSION_KEY);
		}

		function putUserSession(session, signinType) {
			var savedCookie = {
				"session": session,
				"signinType": signinType
			}
			$cookieStore.put(USER_SESSION_KEY, savedCookie);
		}
	}
	
})();