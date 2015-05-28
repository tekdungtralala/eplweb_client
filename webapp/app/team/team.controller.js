(function() {
	"use strict";

	angular
		.module("app.team")
		.controller("Team", Team);

		function Team(xhrTeams) {
			var vm = this;
			vm.teams = xhrTeams.result;

		}
})();
