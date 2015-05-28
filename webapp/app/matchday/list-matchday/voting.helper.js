(function() {
	"use strict";

	/*
	 * This factory only can be used on List-Matchday Controller
	 */
	angular
		.module("app.matchday")
		.factory("votinghelper", VotingHelper);

		function VotingHelper(dataservice) {
			var allVoting = [];
			var currVoting = null;
			var deferred = null;

			var service = {
				initChart: initChart,
				getAllVoting: getAllVoting,
				setAllVoting: setAllVoting,
				initCurrVoting: initCurrVoting,
				getCurrVoting: getCurrVoting,
				setCurrVoting: setCurrVoting,
				submitVoting: submitVoting
			}
			return service;

			function submitVoting(matchdayId, vote, currVoting) {
				setCurrVoting(currVoting);
				deferred = $.Deferred();

				var votingObj = {
					vote: vote
				}

				dataservice
					.updateVoting(matchdayId, votingObj)
					.then(afterSubmitVoting);

				return deferred;
			}

			function afterSubmitVoting(resp) {
				if (200 === resp.status) {
					initChart(resp.data);
				}
				deferred.resolve(resp);
			}

			function initCurrVoting(match) {
				var voting = _.find(allVoting, function(v) {
					return v.matchdayId === match.id;
				});

				currVoting = null;
				if (voting) currVoting = voting.vote;

				initChart(match);
			}

			function getCurrVoting() {
				return currVoting;
			}

			function setCurrVoting(value) {
				currVoting = value;
			}

			function setAllVoting(value) {
				allVoting = value;
			}

			function getAllVoting() {
				return allVoting;
			}

			function initChart(match) {
				var totalVoting = match.votingHomeWin + match.votingAwayWin 
					+ match.votingTie;

				var text =  match.homeTeam.shortName + " VS " + match.awayTeam.shortName 
					+ ", total = " + totalVoting + " vote.";

				var categories = [
					match.homeTeam.shortName + " win",
					"TIE",
					match.awayTeam.shortName + " win"];
				var data = [
					parseFloat((match.votingHomeWin / totalVoting * 100).toFixed(2)), 
					parseFloat((match.votingTie / totalVoting * 100).toFixed(2)), 
					parseFloat((match.votingAwayWin / totalVoting * 100).toFixed(2))
				];

				$('.voting-' + match.id).highcharts({
					exporting: {enabled: false},
					chart: {type: 'column'},
					title: {text: ''},
					subtitle: { text: text},
					xAxis: {categories: categories},
					yAxis: {min: 0, max: 100, title: { text: 'Percent (%)'}},
					series: [{showInLegend: false,name: 'Vote',data: data}],
					tooltip: {
						formatter: function() {
							return "Total Vote : " + this.y + " %";
						}
					}
				});
			}
		}

})();