(function() {
	"use strict";

	angular
		.module("app.rank")
		.controller("Rank", Rank);

	function Rank(dataservice, datautil, $scope) {
		var vm = this;

		vm.ranks = [];
		vm.weeks = [];
		vm.nextRankDisable = true;
		vm.prevRankDisable = false;
		vm.currWeek = null;
		vm.selectedWeek = null;
		vm.currTeam = null;

		// Change week from dropdown list or clicked prev/next button
		vm.changeWeek = changeWeek;
		// Display statistic chart, when user click the mini icon chart
		vm.showChart = showChart;

		var sliderElmt = $("#epl-slider");

		activate();
		function activate() {
			return getInitData().then(function(result){
				processWeekData(result.weeks);
				var lastWeek = parseInt(vm.weeks[0].weekNumber);
				processRankData(result.ranks, lastWeek);

				initSlideOpt();
			});
		}

		// Set up the slider
		function initSlideOpt() {
			sliderElmt.slider({
					value: vm.currWeek,
					min: 1,
					max: vm.currWeek,
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

		// When user stop drag the slider
		function sliderStop() {
			var sliderValue = sliderElmt.slider("value");
			changeWeek(sliderValue);
		}

		function showChart(teamIndex){
			vm.currTeam = vm.ranks[teamIndex];
			getTeamStat(vm.currWeek, vm.currTeam.team.id).then(function(data){
				initChart(data.series, data.categories);
				$("#epl-modal-id").modal("show");
			});
		}

		// Set up the chart
		function initChart(series, categories){
			$("#epl-chart-container").highcharts({
				series: series,
				xAxis: {
					categories: categories
				},
				chart: {
					type: "column"
				},
				title: {
					text: "",
					style: {
						"display": "none"
					}
				},
				yAxis: {
					min: 0,
					title: {
						text: "Rainfall (mm)"
					}
				},
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
					pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true
				},
				plotOptions: {
					column: {
						pointPadding: 0.2,
						borderWidth: 0
					}
				},
				exporting: { enabled: false }
			});
		}

		function processRankData(ranks, currWeek){
			vm.ranks = ranks;
			initCurrPrevNext(currWeek);
		}

		function processWeekData(weeks){
			vm.weeks = weeks;
			_.each(vm.weeks, function(w){
				// Set dateView attribute
				w.dateView = getFormattedWeek(w);
			});
		}

		// The default condition of the prev / next button is enable.
		// But when the user on first week, the prev button must disable, 
		//  same condition on last week, the next button must disable
		function initCurrPrevNext(currWeek){
			vm.currWeek = currWeek;

			vm.nextRankDisable = false;
			vm.prevRankDisable = false;

			var lastWeek = parseInt(vm.weeks[0].weekNumber);
			if (currWeek == 1) {
				vm.prevRankDisable = true;
			} else if (currWeek == lastWeek) {
				vm.nextRankDisable = true;
			}

			var currWeek = _.find(vm.weeks, function(w){
				return parseInt(w.weekNumber) === vm.currWeek;
			});
			vm.selectedWeek = getFormattedWeek(currWeek);
		}

		function changeWeek(otherWeek){
			// Change slider value
			sliderElmt.slider({value: otherWeek});

			// Fetch data from server
			otherWeek = parseInt(otherWeek);
			getRanksByWeekNmr(otherWeek).then(function(data){
				processRankData(data, otherWeek);
			});
		}

		function getFormattedWeek(w){
			return datautil.getFormattedWeek(w.startDay, w.weekNumber);
		}

		function getTeamStat(weekNumber, teamId) {
			return dataservice.getTeamStat(weekNumber, teamId).then(function(data) {
				return data;
			});
		}

		function getRanksByWeekNmr(otherWeek){
			return dataservice.getRanksByWeekNmr(otherWeek).then(function(data) {
				return data.ranks;
			});
		}

		function getInitData(){
			return dataservice.getInitData("rank").then(function(data) {
				return data;
			});
		}
	}
})();
