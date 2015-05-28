(function() {
	"use strict";

		angular
			.module("app.team")
			.controller("Edit-TeamMenu", EditTeamMenu);

		function EditTeamMenu($state, $stateParams, $scope) {
			var vm = this;
			vm.currentState = null;

			$scope.$on("edit-team-btn-menu", btnStateListener);

			// Back to team state
			vm.backToViewTeam = backToViewTeam;
			// Change state/view
			vm.changeState = changeState;

			function changeState(state) {
				$state.go("team.show-team.edit-team.edit-" + state);
			}

			function btnStateListener(event, args) {
				vm.currentState = args;
			}

			function backToViewTeam() {
				var id = $stateParams.id;
				var sn = $stateParams.simpleName;
				$state.go("team.show-team", {id: id, simpleName: sn});
			}
		}
})();