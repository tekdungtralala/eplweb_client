(function() {
	"use strict";

	angular
		.module("app.dashboard")
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state("dashboard", {
				url: "/",
				templateUrl: "app/dashboard/dashboard.html",
				controller: "Dashboard",
				controllerAs: "vm"
			});
	}

})();
