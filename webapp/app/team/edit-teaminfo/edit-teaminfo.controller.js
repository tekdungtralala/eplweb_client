(function() {
	"use strict";

	angular
		.module("app.team")
		.controller("Edit-TeamInfo", EditTeamInfo);

	function EditTeamInfo(xhrTeams, dataservice, $rootScope, $scope, $modal, 
		$state, $stateParams) {

		$rootScope.$broadcast("edit-team-btn-menu", "teaminfo");
		var vm = this;

		vm.currTeam = null;
		vm.modalInstance = null;

		// Reset team info
		vm.resetTeamInfo = resetTeamInfo;
		// Show saving confirmation
		vm.preSave = preSave;
		// Cancel save
		vm.dismisModal = dismisModal;
		// User click save button on saving confirmation
		vm.doSave = doSave;

		activate();
		function activate() {
			// Find current team
			vm.currTeam = _.find(xhrTeams.result, function(t) {
					return t.id === parseInt($stateParams.id);
			});
			vm.savedTeam = angular.copy(vm.currTeam);
		}


		var formValidateOpt = { 
			rules: {
				name: { required: true },
				simpleName: { required: true },
				established: { required: true, number: true},
				manager: { required: true },
				nickname: { required: true },
				stadium: { required: true }
			},
			showErrors: showErrors,
			onkeyup: false
		};

		function showErrors(errorMap, errors) {
			var formElmt = $("#teamInfoForm");
			formElmt.find(".input-group").removeClass("has-error");
			for (var i in errors) {
				var parent = $(errors[i].element).parent();
				parent.addClass("has-error");
			}
		}

		function doSave() {
			vm.modalInstance.dismiss();

			delete vm.currTeam["$$hashKey"];
			dataservice.editTeam(vm.currTeam)
				.then(afterSave);
		}

		function afterSave() {
			var id = vm.currTeam.id;
			var sn = vm.currTeam.simpleName;
			$state.go("team.show-team", {id: id, simpleName: sn});
		}

		function dismisModal() {
			vm.modalInstance.dismiss();
		}

		function preSave() {
			var formElmt = $("#teamInfoForm");
			formElmt.validate(formValidateOpt);
			if (formElmt.valid()) {
				vm.modalInstance = $modal.open({
					templateUrl: "saveModal.html",
					scope: $scope,
					size: "sm"
				});
			}
		}

		function resetTeamInfo() {
			vm.currTeam = angular.copy(vm.savedTeam);
		}

		function getSlideShows() {
			return dataservice.getSlideShows($stateParams.id)
				.then(function(data) {
					return data;
				});
		}
	}

})();