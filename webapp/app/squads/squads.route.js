(function() {
	"use strict";

	angular
		.module("app.squads")
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state("squads", {
				url: "/squads",
				templateUrl: "app/squads/squads.html",
				controller: "Squads",
				controllerAs: "vm",
				roles: ["admin"],
				resolve: {
					xhrTeams: getallTeam
				}
			})
			.state("squads.create-player", {
				url: "/create-player",
				templateUrl: "app/squads/create-player/create-player.html",
				controller: "Create-Player",
				controllerAs: "vm"
			})
			.state("squads.show-team", {
				url: "/show-teams/{teamId}",
				templateUrl: "app/squads/list-player/list-player.html",
				controller: "List-Player",
				controllerAs: "vm",
				resolve: {
					xhrSquads: getAllSquadByTeam
				}
			})
			.state("squads.show-team.edit-player", {
				url: "/edit-player/{playerId}",
				views: {
					"@squads": {
						templateUrl: "app/squads/edit-player/edit-player.html",
						controller: "Edit-Player",
						controllerAs: "vm"
					}
				}
			})
			.state("squads.show-team.show-player", {
				url: "/player/show-player/{playerId}",
				views: {
					"@squads": {
						templateUrl: "app/squads/show-player/show-player.html",
						controller: "Show-Player",
						controllerAs: "vm"
					}
				}
			});

		function getallTeam(dataservice) {
			return dataservice.getAllTeam();
		}

		function getAllSquadByTeam(dataservice, $stateParams) {
			return dataservice.getPlayersByTeamId($stateParams.teamId);
		}
	}
	
})();
