(function() {
	"use strict";
	
	angular
		.module("app.matchday")
		.controller("List-Matchday", ListMatchday);

	function ListMatchday(initData, dataservice, votinghelper,
		ratinghelper, $scope, $rootScope, $modal, $controller) {

		$rootScope.$broadcast("state-btn", "list-matchday");
		$rootScope.$broadcast("show-phase-nav", true);

		var vm = this;
		vm.comment = {};
		angular.extend(vm.comment, $controller('commentctrl', {$scope: $scope}));

		var modalInstance = null;

		vm.voting = votinghelper;
		vm.rating = ratinghelper;

		var allMatch = [];
		vm.model = null;

		vm.subaAtionDiv = [];
		var selectedMatchdayId = null;
		var latestActionDiv = null;

		$scope.$on("vm.model", modelChangeListener);
		
		// Expand one matchday with comment, rating or voting container
		vm.selectActionDiv = selectActionDiv;
		// Send rating value
		vm.submitRating = submitRating;
		// Send voting value
		vm.submitVoting = submitVoting;

		activate();
		function activate() {
			vm.model = initData.matchdayModelView.model;
			vm.voting.setAllVoting(initData.matchdayModelView.votings);
			modifyEachMatch();
		}

		function submitVoting(vote, currVoting) {
			vm.voting.submitVoting(selectedMatchdayId, vote, currVoting)
				.done(afterSubmitVoting)
		}

		function afterSubmitVoting(resp) {
			if (200 === resp.status) {
				var match = resp.data;
				updateNewMatch(match);
			}
		}

		function submitRating(rating) {
			vm.rating.submitRating(selectedMatchdayId, rating)
				.done(afterSubmitRating)
		}

		function afterSubmitRating(resp) {
			if (200 === resp.status) {
				var match = resp.data;
				updateNewMatch(match);
			}
		}

		function updateNewMatch(newMatch) {
			_.each(allMatch, function(m) {
				if (m.id === newMatch.id) {
					m.votingAwayWin = newMatch.votingAwayWin;
					m.votingHomeWin = newMatch.votingHomeWin;
					m.votingTie = newMatch.votingTie;
					m.vote = vm.voting.getCurrVoting();
					m.ratingPoint = newMatch.ratingPoint.toFixed(2);
				}
			});
		}

		function selectActionDiv(match, subActionIndex) {
			var subAction = "";
			if (0 === subActionIndex) {
				subAction = "rating";
				vm.rating.initRating();
			} else if (1 === subActionIndex) {
				subAction = "comment";
			} else if (2 === subActionIndex) {
				subAction = "voting";
				vm.voting.initCurrVoting(match);
			}

			var currentActionDiv = subAction + match.id;
			if (latestActionDiv === currentActionDiv && match.showActionDiv) {
				match.showActionDiv = false;
			} else {
				toggleActionDiv(match, subActionIndex);
				latestActionDiv = currentActionDiv;

				// In comment section, we need to fetch comments from server
				if (1 === subActionIndex) {
					vm.comment.fetchComments(match.id);
				}
			}
		}

		function toggleActionDiv(match, activeIndex) {
			// Set selected matchday
			selectedMatchdayId = match.id;
			// Hide actionDiv in allMatch
			_.each(allMatch, function(m) {
				m.showActionDiv = false;
			});
			// Show actionDiv on selected match
			match.showActionDiv = true;

			// Hide subActionDiv in a match
			for(var i in vm.subaAtionDiv) {
				vm.subaAtionDiv[i] = false;
			}
			// Show selected subActionDiv
			vm.subaAtionDiv[activeIndex] = true;
		}

		function modelChangeListener(event, model, votings) {
			vm.model = model;
			vm.voting.setAllVoting(votings);
			modifyEachMatch();
		}

		function modifyEachMatch() {
			var i = 0;
			allMatch = [];
			_.each(vm.model, function(m) {
				_.each(m, function(match) {
					match.ratingPoint = parseFloat(match.ratingPoint).toFixed(2);

					var voting = _.find(vm.voting.getAllVoting(), function(v) {
						return v.matchdayId === match.id;
					});

					if (voting && voting.vote) {
						match.vote = voting.vote;
					}

					allMatch[i] = match;
					i++;
				});
			});
		}

	}
})();
