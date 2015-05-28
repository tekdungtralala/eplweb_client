(function() {

	"use strict";

	angular.module("app.user")
		.controller("UserLogout", UserLogout);

	function UserLogout(userauth, dataservice, $state, $rootScope) {
			// send sign out request
			dataservice.userSignOut();

			// change userLogged flag
			$rootScope.isUserLogged = false;

			// delete session
			userauth.delUserSession();

			// Render user profile to be null
			userauth.setLoggedUser(null);

			// Redirect to dashboard
			$state.go("dashboard", {reload: true});
	}

})();