(function() {
	"use strict";

	angular
		.module("app.dashboard")
		.controller("Dashboard", Dashboard);

	// Dashboard.$inject = ["dataservice", "datautil","$state"];
	function Dashboard(dataservice, datautil, $state) {
		var vm = this;
		vm.ranks = [];
		vm.model = [];
		vm.chartData = {};
		vm.currWeek = null;

		activate();
		function activate() {
			// There are two way to call service, 
			// First one using two or more service, 
			//  and the other one using one service

			// var promises = [getInitData()];
			// vm.promises =  dataservice.ready(promises).then(function(result){

			// vm.promises =  getInitData().then(function(result){
			//     result = result[0]

			return getInitData().then(function(result){
				vm.ranks = result.highestRank;
				vm.model = result.matchday.model;

				vm.chartData.categories = result.fiveBigTeam.categories;
				vm.chartData.series = result.fiveBigTeam.series;

				vm.currWeek = getFormattedWeek(result.currentWeek);

				initChart();
			});
		}

		// Set up the chart
		function initChart(){
			$("#epl-chart-container").highcharts({
				series: vm.chartData.series,
				title: {
					text: "Five Biggest Teams",
					style: {
						display: "none"
					}
				},
				xAxis: {
					title: {
						text: "Week"
					},
					categories: vm.chartData.categories
				},
				yAxis: {
					title: {
						text: "Point"
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: "#808080"
					}]
				},
				tooltip: {
					valueSuffix: " Pts"
				},
				legend: {
					layout: "horizontal",
					
					verticalAlign: "top",
					borderWidth: 0
				},
				exporting: { enabled: false }
			});
		}

		function getFormattedWeek(w){
			return datautil.getFormattedWeek(w.startDay, w.weekNumber);
		}

		function getInitData() {
			return dataservice.getInitData("dashboard").then(function(data) {
				return data;
			});
		}
	}
})();
