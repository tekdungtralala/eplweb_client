(function() {
	"use strict";

	angular
		.module("app.squads")
		.controller("Squads", Squads);

	function Squads(xhrTeams, $state, $scope) {
		var vm = this;
		vm.teams = xhrTeams.result;
		vm.newBtn = true;
		
		// Move to state of create player 
		vm.gotoCreatePage = gotoCreatePage;
		// Move to state of list player / show players 
		vm.gotoShowTeam = gotoShowTeam;

		$scope.$on("squad-new-btn", function(event, args) {
			vm.newBtn = args;
		});

		function gotoShowTeam(teamId) {
			$state.go("squads.show-team", { teamId: teamId });
		}

		function gotoCreatePage() {
			vm.newBtn = false;
			$state.go("squads.create-player");
		}
	}

})();
