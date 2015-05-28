(function() {
	"use strict";
	angular
		.module("app.squads")
		.controller("Show-Player", ShowPlayer);


	function ShowPlayer(xhrSquads, $stateParams, $state, $rootScope) {
		var vm = this;
		$rootScope.$broadcast("squad-new-btn", false);

		// view variable
		vm.curr = null;

		// Back to list squad state
		vm.backToSquads = backToSquads;
		
		activate();
		function activate() {
			var squads = xhrSquads.result;

			vm.curr = _.find(squads, function(s){
				return s.id == $stateParams.playerId;
			});
		}

		function backToSquads() {
			$state.go("^", $stateParams, {reload: true});
		}
	}
	
})();