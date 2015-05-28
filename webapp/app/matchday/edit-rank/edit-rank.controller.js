(function() {
	"use strict";
	
	angular
		.module("app.matchday")
		.controller("Edit-Rank", EditRank);

	function EditRank(initData, dataservice, $scope, $rootScope, $modal) {

		$rootScope.$broadcast("state-btn", "edit-rank");
		$rootScope.$broadcast("show-phase-nav", false);

		var vm = this;
		vm.showInfo = false;
		vm.currWeek = null;
		vm.maxWeek =  0;
		vm.currWeek = 0;
		vm.modalInstance = null;

		// Show confirmation
		vm.openModal = openModal;
		// Close confirmation
		vm.closeModal = closeModal;
		// Send update rank request
		vm.doUpdateRank = doUpdateRank;

		activate();
		function activate() {
			vm.maxWeek = initData.matchdayModelView.week.weekNumber - 1;
			vm.maxWeek = parseInt(vm.maxWeek);
			vm.currWeek = vm.maxWeek;
		}

		function doUpdateRank() {
			vm.modalInstance.dismiss();
			vm.showInfo = true;

			var object = {
				weekNumber: vm.currWeek
			}
			dataservice.updateRank(object)
				.then(afterSubmit);

		}

		function afterSubmit() {
			vm.showInfo = true;
		}

		function closeModal() {
			vm.modalInstance.dismiss();
		}

		function openModal() {
			vm.modalInstance = $modal.open({
				templateUrl: "editScore.html",
				size: "sm",
				scope: $scope
			});
		}

	}
})();
