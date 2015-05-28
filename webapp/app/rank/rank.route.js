(function() {
	"use strict";

	angular
		.module("app.rank")
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state("rank", {
				url: "/rank",
				templateUrl: "app/rank/rank.html",
				controller: "Rank",
				controllerAs: "vm",
			});
	}

})();
