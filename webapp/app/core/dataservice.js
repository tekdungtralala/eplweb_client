(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("dataservice", Dataservice);

	/**
	 *	- All http requests and responses have to go through this factory
	 *  - Dataservice must extend all other service, so any module 
	 *    just need to call this factory.
	 *  - Some service that can"t be classified should be placed here
	 *  - All http request must be placed on $rootScope.promise variable, 
	 *    because it will used by cgBusy module (third party module) to show
	 *    the spinner loading until the request finished.
	 */
	function Dataservice($q, $http, $rootScope, playerservice, adminservice, 
		teamservice, matchdayservice, rankservice, adminauth, userauth, socialmedia, 
		userservice, matchdaycommentsrvc, apipathhelper) {

		var isPrimed = false;
		var primePromise;
		var aph = apipathhelper;

		var service = {
			// Some state which has roles attribute will be authentication through
			//  this function
			authentication: authentication,
			// Load json data from server, usually used in state that does not 
			//  required server verification. The idea is Instead of sending 
			//  multiple requests, it's better to send one request at a time.
			getInitData: getInitData,
			// Get chart data
			getTeamStat: getTeamStat,
			// Get all passed week
			getAllPassedWeek: getAllPassedWeek,
			// Used when calling multiple service at once,  will be wait until all
			//  request completed and then return the result
			ready: ready
		};

		// Include all service
		$.extend(service, adminservice);
		$.extend(service, playerservice);
		$.extend(service, teamservice);
		$.extend(service, matchdayservice);
		$.extend(service, rankservice);
		$.extend(service, socialmedia);
		$.extend(service, userservice);
		$.extend(service, matchdaycommentsrvc);

		return service;

		function authentication(role) {
			if ("admin" === role)
				return adminservice.adminCekLogin();
			else 
				return true;
		}

		function getInitData(page) {
			var req = userauth.getConf(null, "GET", "api/page/" + page);

			$rootScope.promise = $http(req)
					.then(getData)
					.catch(function(message) {
						// if (message.status == 404) window.location.href = "404.jsp";
					});
			return $rootScope.promise;
		}

		function getTeamStat(weekNumber, teamId) {
			$rootScope.promise = $http.get(aph.generateUrl("api/chart/week/") + weekNumber + "/team/" + teamId)
				.then(getData)
				.catch(function(message) {
				});
			return $rootScope.promise;
		}

		function getAllPassedWeek() {
			$rootScope.promise = $http.get(aph.generateUrl("api/passedWeeks"))
				.then(getData)
				.catch(function(message) {
				});
			return $rootScope.promise;
		}

		function getData(result) {
			return result.data;
		}

		function ready(nextPromises) {
			var readyPromise = primePromise || prime();

			return readyPromise
				.then(function() { return $q.all(nextPromises); })
				.catch();
		}

		function prime() {
			// This function can only be called once.
			if (primePromise) {
				return primePromise;
			}

			primePromise = $q.when(true).then(success);
			return primePromise;

			function success() {
				isPrimed = true;
			}
		}
	}
})();
