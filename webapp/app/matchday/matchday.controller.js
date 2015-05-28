(function() {
	"use strict";
	
	angular
		.module("app.matchday")
		.controller("Matchday", Matchday);

	function Matchday(initData, matchdayhelper, dataservice, $scope, $rootScope, 
		$state) {
		
		var mh = matchdayhelper;
		var vm = this;

		vm.weeks = [];
		vm.model = [];
		vm.selectedWeek = null;
		vm.currWeek = null;
		vm.defaultWeek = null;
		vm.nextRankDisable = false;
		vm.prevRankDisable = false;

		vm.isLoggedAdmin = false;
		vm.activeState = "list-matchday";
		vm.showPhaseNav = false;

		// Chagne matchday week
		vm.changeWeek = changeWeek;
		// Move from one state to another
		vm.changeState = changeState;

		var sliderElmt = $("#epl-slider");

		$scope.$on("state-btn", btnChngListener);
		$scope.$on("show-phase-nav", phaseNavListener);
		$scope.$on("load-matchday", loadMatchdayListener);

		activate();
		function activate(){
			vm.weeks = mh.processWeekData(initData.weeks);
			processMatchData(initData.matchdayModelView);

			initSlideOpt();
			vm.defaultWeek = vm.currWeek;

			// check is login admin 
			checkLoggedAdmin();
		}

		function loadMatchdayListener(e, value) {
			changeWeek(value);
		}

		function phaseNavListener(e, value) {
			vm.showPhaseNav = value;
		}

		function btnChngListener(e, value){
			vm.activeState = value;
		}

		function changeState(state) {
			vm.activeState = state;
			$state.go("matchday." + state);
		}

		function checkLoggedAdmin() {
			dataservice.hasAdminRole().then(processAdmnRole);
		}

		function processAdmnRole(result) {
			if (result && result.status === 200) {
				vm.isLoggedAdmin = true;
			}
		}

		function initSlideOpt() {
			sliderElmt.slider({
					value: vm.currWeek,
					min: 1,
					max: vm.weeks.length,
					step: 1,
					stop: sliderStop
			})
			.each(function() {
				var opt = $(this).data()["ui-slider"].options;
				var vals = opt.max - opt.min;
				for (var i = 0; i <= vals; i++) {
					var el = $("<label>"+(i+1)+"</label>").css("left",(i/vals*100)+"%");
					sliderElmt.append(el);
				}
			});
		}

		function sliderStop() {
			var sliderValue = sliderElmt.slider("value");

			changeWeek(sliderValue);
		}

		function processMatchData(data) {
			vm.model = data.model;
			vm.currWeek = parseInt(data.week.weekNumber);
			vm.selectedWeek = mh.getFormattedWeek(data.week);

			updatePrevNexBtn();

			$rootScope.$broadcast("vm.model", vm.model, data.votings);
		}

		function changeWeek(otherWeek) {
			// Change slider value
			sliderElmt.slider({value: otherWeek});

			otherWeek = parseInt(otherWeek);
			mh.getMatchdayByWeekNmr(otherWeek).then(function(data) {
				processMatchData(data);
			});
		}

		function updatePrevNexBtn() {
			vm.nextRankDisable = false;
			vm.prevRankDisable = false;

			if (vm.currWeek == 1) {
				vm.prevRankDisable = true;

			} else if (vm.currWeek  == vm.weeks.length) {
				vm.nextRankDisable = true;
			}
		}

	}
})();
