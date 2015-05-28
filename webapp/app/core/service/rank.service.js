(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("rankservice", RankService);

		// Note: Please read dataservice.js factory before using any factory
		function RankService(adminauth, $http, $rootScope, apipathhelper) {
			var aph = apipathhelper;
			var service = {
				// Get list or ranks on one week
				getRanksByWeekNmr: getRanksByWeekNmr,
				// Update ranks, just need to send weekNumber, server will process 
				//  automatically base on matchday data
				updateRank: updateRank
			};

			return service;

			function getRanksByWeekNmr(weekNumber) {
				var query = "";
				if (weekNumber) 
					query = "/" + weekNumber;
				$rootScope.promise = $http.get(aph.generateUrl("api/ranks") + query)
					.then(processRankData)
					.catch(function(message) {
					});
				return $rootScope.promise;
			}

			function processRankData(result) {
				if (200 == result.status) {
					return result.data;
				} else {

				}
			}

			function updateRank(updateRank) {
				var req = adminauth.getConf(updateRank, "POST", "api/updateRanks");

				$rootScope.promise = $http(req)
						.then(process)
						.catch(process);
				return $rootScope.promise;
			}

			function process(result) {
				return result;
			}			
		}

})();