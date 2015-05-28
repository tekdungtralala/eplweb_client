(function() {
	"use strict";
	
	angular
		.module("app.matchday")
		.controller("Edit-Score", EditScore);

	function EditScore(initData, matchdayhelper, dataservice, $scope, 
			$rootScope, $modal) {

		$rootScope.$broadcast("state-btn", "edit-score");
		$rootScope.$broadcast("show-phase-nav", true);

		var mh = matchdayhelper;
		var vm = this;
		var weekNumber = initData.matchdayModelView.week.weekNumber;

		vm.datas = [];
		vm.modalInstance = null;
		vm.score = []; // index 0 for home, 1 for away

		// Show edit score form in a modal
		vm.preEditScore = preEditScore;
		// Cancel the modal / dismis
		vm.cancelEditScore = cancelEditScore;
		// Send edit score
		vm.doEditScore = doEditScore;

		$scope.$on("vm.model", modelChangeListener);

		activate();
		function activate() {
			$rootScope.$broadcast("load-matchday", weekNumber);
		}

		function modelChangeListener(event, modelViews) {
			convertModel(modelViews);
		}

		function doEditScore() {
			vm.modalInstance.dismiss("cancel");

			var matchdayId = vm.currMatch.id;
			var updatescore = {
				homeGoal: vm.score[0],
				awayGoal: vm.score[1]
			}
			
			dataservice.updateScore(matchdayId, updatescore)
				.then(afterSubmit);
		}

		function afterSubmit() {
			$rootScope.$broadcast("load-matchday", weekNumber);
		}

		function cancelEditScore() {
			vm.modalInstance.dismiss("cancel");
		}

		function preEditScore(m) {
			vm.currMatch = m;

			vm.score[0] = m.homeGoal;
			vm.score[0] = vm.score[0] < 0 ? 0 : vm.score[0];
			vm.score[1] = m.awayGoal;
			vm.score[1] = vm.score[1] < 0 ? 0 : vm.score[1];

			vm.modalInstance = $modal.open({
				templateUrl: "editScore.html",
				size: "lg",
				scope: $scope
			});     
		}

		function convertModel(modelViews){
			vm.datas = mh.convertModelViewToModel(modelViews);
		}
	}
	
})();
