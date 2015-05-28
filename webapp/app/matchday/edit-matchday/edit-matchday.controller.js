(function() {
	"use strict";
	
	angular
		.module("app.matchday")
		.controller("Edit-Matchday", EditMatchday);

	function EditMatchday(initData, xhrTeams, matchdayhelper, dataservice, 
		datautil, $rootScope, $scope, $modal) {
		
		$rootScope.$broadcast("state-btn", "edit-matchday");
		$rootScope.$broadcast("show-phase-nav", false);

		var mh = matchdayhelper;
		var vm = this;

		vm.currWeek = null;
		vm.weekStr = null;
		var maxWeek = 38;
		var minWeek = null;

		vm.matchdayState = "saved";
		vm.models = null; // the models which will be showed on view
		vm.savedModels = null; // saved models
		vm.unSavedModels = null; // editable models

		vm.allTeams = null; // all teams from db
		vm.showDatepicker = false;
		vm.matchdayTime = null;
		vm.matchdayDate = null;
		vm.homeTeam = null; 
		vm.awayTeam = null;
		vm.isNewData = false;
		vm.updateMatchdayId = null
		vm.modalInstance = null;

		// Hide or show the buttons on top table, only show on re-arrange state
		vm.hideAction = hideAction;
		// Change state from/to saved matchdays or re-arrange matchdays
		vm.changeState = changeState;
		// Delete a match
		vm.removeRow = removeRow;
		// Change matchday by reduce/increase weeknumber
		vm.changeMatchdays = changeMatchdays;
		// Show new matchday form on modal
		vm.preAdd = preAdd;
		// Add new matchday on a list re-arrange matchday
		vm.doSave = doSave;
		// Show reset confirmation
		vm.preReset = preReset;
		// Reset matchday list
		vm.doReset = doReset;
		// Show saving confirmation
		vm.preSave = preSave;
		// Send list matchdays to server
		vm.doUpdate = doUpdate;
		// Dismis modal
		vm.dismisModal = dismisModal;
		// Show form matchday with selected data on modal
		vm.preEdit = preEdit;
		// Sorting model
		vm.sortingModels = sortingModels;

		activate();
		function activate() {
			processMatchData(initData.matchdayModelView);
			minWeek = vm.currWeek;

			vm.allTeams = xhrTeams.result;
		}

		function processMatchData(data) {
			var week = data.week
			vm.currWeek = parseInt(week.weekNumber);
			vm.weekStr = datautil.getWeek(week.startDay, "YYYY, DD MMM");
			
			vm.savedModels =  mh.convertModelViewToModel(data.model);

			vm.savedModels = sortedModels(vm.savedModels);

			vm.models = angular.copy(vm.savedModels);
			vm.unSavedModels = angular.copy(vm.savedModels);
		}

		function sortingModels() {
			vm.models = sortedModels(vm.models);
			vm.unSavedModels = angular.copy(vm.models);
		}

		function sortedModels(models) {
			return _.sortBy(models, function(m) {
					return m.date;
				});
		}

		function changeMatchdays(otherWeek) {
			var newWeek = vm.currWeek + otherWeek;
			if (newWeek >= minWeek && newWeek <= maxWeek) {
				getMatchdayByWeekNmr(newWeek).then(function(data){
					processMatchData(data);
				});
			}
		}

		function preEdit(m) {
			vm.updateMatchdayId = m.id;
			vm.isNewData = false;
			vm.matchdayDate = new Date(m.date);
			vm.matchdayTime = moment(m.time, "HH:mm:ss");
			vm.homeTeam = m.homeTeam;
			vm.awayTeam = m.awayTeam;

			openModal("addModal.html");
		}

		function preAdd() {
			vm.isNewData = true;
			vm.matchdayTime = moment("03:15", "HH:mm")._d;
			vm.matchdayDate =  new Date();
			vm.homeTeam = null;
			vm.awayTeam = null;
			
			openModal("addModal.html");
		}

		var formValidateOpt = { 
			rules: {
				awayTeam: { required: true },
				homeTeam: { required: true }
			},
			ignore: [],
			onkeyup: false,
			showErrors: showErrors
		};

		function showErrors(errorMap, errors) {
			var formElmt = $("#matchdayForm");
			formElmt.find(".form-control").removeClass("has-error");
			for (var i in errors) {
				var parent = $(errors[i].element).parent();
				parent.addClass("has-error");
			}
		}

		function doUpdate() {
			var formElmt = $("#matchdayForm");
			formElmt.validate(formValidateOpt);

			var isValid = false;
			if(formElmt.valid()) {
				isValid = vm.homeTeam.id !== vm.awayTeam.id;
				if (!isValid) $(".epl-update-matchday-form").addClass("has-error");
			}

			if (isValid) {
				var m1 = moment(vm.matchdayDate);
				var m2 = moment(vm.matchdayTime);
				if (vm.isNewData) {
					var newData = {
						homeTeam: vm.homeTeam,
						awayTeam: vm.awayTeam,
						date: m1.unix() * 1000,
						dateStr: m1.format("ddd, DD MMM"),
						time: m2.format("HH:mm:ss"),
						timeStr: m2.format("HH:mm")
					}
					vm.models.unshift(newData);
				} else {
					_.find(vm.models, function(m) {
						if (m.id === vm.updateMatchdayId) {
							m.homeTeam = vm.homeTeam;
							m.awayTeam = vm.awayTeam;

							m.date = m1.unix() * 1000;
							m.dateStr = m1.format("ddd, DD MMM");
							
							m.time = m2.format("HH:mm:ss");
							m.timeStr = m2.format("HH:mm");

							return true;
						}
					});
				}
				vm.unSavedModels = angular.copy(vm.models);
				dismisModal();
			}
		}

		function doSave() {
			var json = JSON.stringify(vm.unSavedModels);

			_.each(vm.unSavedModels, function(m) {
				m.homeTeamId = m.homeTeam.id;
				m.awayTeamId = m.awayTeam.id;

				// Remove unused attribute
				delete m["awayTeam"];
				delete m["homeTeam"];
				delete m["awayGoal"];
				delete m["awayPoint"];
				delete m["homeGoal"];
				delete m["homePoint"];
				delete m["timeStr"];
				delete m["dateStr"];
				delete m["id"];
				delete m["week"];
				delete m["votingAwayWin"];
				delete m["votingHomeWin"];
				delete m["votingTie"];
				delete m["ratingPoint"];
			});

			dismisModal();

			dataservice.updateMatchdays(vm.currWeek, vm.unSavedModels)
				.then(reLoadData);
		}

		function reLoadData() {
			getMatchdayByWeekNmr(vm.currWeek).then(function(data){
				processMatchData(data);
			});
		}

		function preSave() {
			openModal("saveModal.html", "sm");
		}


		function openModal(templateUrl, size) {
			vm.modalInstance = $modal.open({
				templateUrl: templateUrl,
				scope: $scope,
				size: size,
				backdrop: "static"
			});			
		}

		function preReset() {
			openModal("resetModal.html", "sm");
		}

		function dismisModal() {
			vm.modalInstance.dismiss();
		}

		function doReset() {
			vm.unSavedModels = angular.copy(vm.savedModels);
			vm.models = angular.copy(vm.unSavedModels);
			dismisModal();
		}

		function removeRow(index) {
			vm.models.splice(index, 1);
			vm.unSavedModels = angular.copy(vm.models);
		}

		function changeState(state) {
			vm.matchdayState = state;
			var baseModels = ("saved" === state ? vm.savedModels : vm.unSavedModels);

			vm.models = angular.copy(baseModels);
		}

		function hideAction() {
			return vm.matchdayState !== "saved";
		}

		function getMatchdayByWeekNmr(weekNumber) {
			return dataservice.getMatchdayByWeekNmr(weekNumber).then(function(data) {
				return data;
			});
		}
	}
})();
