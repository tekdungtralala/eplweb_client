(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("playerservice", PlayerService);

	// Note: Please read dataservice.js factory before using any factory
	function PlayerService($http, $rootScope, adminauth, apipathhelper) {
		var aph = apipathhelper;
		var service = {
			// Get all players in a team
			getPlayersByTeamId: getPlayersByTeamId,
			// Edit, delete and save palyer
			editPlayer: editPlayer,
			savePlayer: savePlayer,
			deletePlayer: deletePlayer
		};

		return service;

		function getPlayersByTeamId(teamId) {
			$rootScope.promise = $http.get(aph.generateUrl("api/players/team/") + teamId)
					.then(getData)
					.catch(function(message) {
					});

			return $rootScope.promise;
		}

		function deletePlayer(playerId) {
			var req = adminauth.getConf(null, "DELETE", "api/players/" + playerId);

			$rootScope.promise = $http(req)
					.then(process)
					.catch(process);
			return $rootScope.promise;
		}

		function savePlayer(player) {
			var req = adminauth.getConf(player, "POST", "api/players");

			$rootScope.promise = $http(req)
					.then(process)
					.catch(process);
			return $rootScope.promise;
		}

		function editPlayer(player) {
			var req = adminauth.getConf(player, "PUT", "api/players/" + player.id);

			$rootScope.promise = $http(req)
					.then(process)
					.catch(process);
			return $rootScope.promise;
		}

		function process(result) {
			return result;
		}

		function getData(result) {
			return result.data;
		}
	}
})();