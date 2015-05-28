(function() {

	"use strict";

	angular
		.module("app.user")
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state("user", {
				url: "/user",
				template: "<span ui-view><span>"
			})
			.state("user.logout", {
				url: "/logout",
				controller: "UserLogout"
			})
			.state("user.signin", {
				url: "/signin?userModel",
				templateUrl: "app/user/usersignin/usersignin.html",
				controller: "UserSignin",
				controllerAs: "vm"
			});
	}

})();