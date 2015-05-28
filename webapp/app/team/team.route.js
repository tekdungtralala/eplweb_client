(function() {
	"use strict";

	angular
		.module("app.team")
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state("team", {
				url: "/team",
				templateUrl: "app/team/team.html",
				controller: "Team",
				controllerAs: "vm",
				resolve: {
					xhrTeams: getallTeam
				}
			})
			.state("team.show-team", {
				url: "/{id}/{simpleName}",
				templateUrl: "app/team/show-team/show-team.html",
				controller: "ShowTeam",
				controllerAs: "vm"
			})
			.state("team.show-team.overview", {
				templateUrl: "app/team/show-team/overview.html"
			})
			.state("team.show-team.squad", {
				templateUrl: "app/team/show-team/squad.html"
			})
			.state("team.show-team.statistic", {
				templateUrl: "app/team/show-team/statistic.html"
			})
			.state("team.show-team.map", {
				templateUrl: "app/team/show-team/map.html"
			})
			.state("team.show-team.video", {
				templateUrl: "app/team/show-team/video.html"
			})

			// Admin pages
			.state("team.show-team.edit-team", {
				url:"/edit-team",
				views: {
					"@team": {
						templateUrl: "app/team/edit-teammenu/edit-teammenu.html",
						controller: "Edit-TeamMenu",
						controllerAs: "vm"
					}
				},
				roles: ["admin"]
			})
			.state("team.show-team.edit-team.edit-teaminfo", {
				url:"/edit-teaminfo",
				templateUrl: "app/team/edit-teaminfo/edit-teaminfo.html",
				controller: "Edit-TeamInfo",
				controllerAs: "vm"
			})
			.state("team.show-team.edit-team.edit-image", {
				url:"/edit-image",
				templateUrl: "app/team/edit-image/edit-image.html",
				controller: "Edit-Image",
				controllerAs: "vm"
			})
			.state("team.show-team.edit-team.edit-map", {
				url:"/edit-map",
				templateUrl: "app/team/edit-map/edit-map.html",
				controller: "Edit-Map",
				controllerAs: "vm"
			})
			.state("team.show-team.edit-team.edit-video", {
				url:"/edit-video",
				templateUrl: "app/team/edit-video/edit-video.html",
				controller: "Edit-Video",
				controllerAs: "vm"
			});

		function getallTeam(dataservice) {
			return dataservice.getAllTeam();
		}
	}

})();
