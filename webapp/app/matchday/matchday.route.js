(function() {
	"use strict";

	angular
		.module("app.matchday")
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state("matchday", {
				url: "/matchday",
				templateUrl: "app/matchday/matchday.html",
				controller: "Matchday",
				controllerAs: "vm",
				resolve: {
					initData: getInitData,
					xhrTeams: getallTeam
				}
			})
			.state("matchday.list-matchday", {
				url: "/list-matchday",
				templateUrl: "app/matchday/list-matchday/list-matchday.html",
				controllerAs: "vm",
				controller: "List-Matchday"
			})
			.state("matchday.edit-score", {
				url: "/edit-score",
				templateUrl: "app/matchday/edit-score/edit-score.html",
				controllerAs: "vm",
				controller: "Edit-Score",
				roles: ["admin"]
			})
			.state("matchday.edit-rank", {
				url: "/edit-rank",
				templateUrl: "app/matchday/edit-rank/edit-rank.html",
				controllerAs: "vm",
				controller: "Edit-Rank",
				roles: ["admin"]
			})
			.state("matchday.edit-matchday", {
				url: "/edit-matchday",
				templateUrl: "app/matchday/edit-matchday/edit-matchday.html",
				controllerAs: "vm",
				controller: "Edit-Matchday",
				roles: ["admin"]
			})
			;

		function getInitData(dataservice) {
			return dataservice.getInitData("matchday").then(function(data) {
				return data;
			});
		}

		function getallTeam(dataservice) {
			return dataservice.getAllTeam();
		}
	}
	
})();
