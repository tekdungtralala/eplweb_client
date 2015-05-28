(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("teamservice", TeamService);

	// Note: Please read dataservice.js factory before using any factory
	function TeamService($http, $rootScope, adminauth, apipathhelper) {
		var aph = apipathhelper;
		var service = {
			// Get all team
			getAllTeam: getAllTeam,
			// Edit team information
			editTeam: editTeam,
			// Get uploadURL
			getUploadURL: getUploadURL,
			// Get list slideshow
			getSlideShows: getSlideShows,
			// Get image uri by imageId
			getImageById: getImageById,
			// Delete image by Id
			deleteImage: deleteImage,
			// Saving image order
			saveSlideShowOrder: saveSlideShowOrder,
		}
		return service;

		function saveSlideShowOrder(obj) {
			var url = "api/images/sortedImage";
			var req = adminauth.getConf(obj, "PUT", url);

			$rootScope.promise = $http(req)
					.then(process)
					.catch(process);
			return $rootScope.promise;
		}

		function deleteImage(imageId, imageType) {
			var url = "api/images/" + imageId + "?imageType=" + imageType;
			var req = adminauth.getConf(null, "DELETE", url);

			$rootScope.promise = $http(req)
					.then(process)
					.catch(process);
			return $rootScope.promise;
		}

		function getImageById(imageId) {
			return "api/images/" + imageId;
		}

		function getSlideShows(teamId) {
			$rootScope.promise = $http.get(aph.generateUrl("api/images/slideshow/teamId/") + teamId)
					.then(getData)
					.catch(function(message) {
					});

			return $rootScope.promise;
		}

		function getUploadURL(type, teamId, withoutAuthKey) {
			if (type === "slideshow" ||
					type === "videothumbnail" ||
					type === "video") {

				var authKey = [
						"?", adminauth.getAuthKey(), "=", adminauth.getAdminSession()
					].join('');

				if (withoutAuthKey) authKey = "";

				var result = [
					"api/upload/" + type + "/teamId/",
					teamId,
					authKey
				];
				return result.join('');
			}
		}

		function getAllTeam() {
			$rootScope.promise = $http.get(aph.generateUrl("api/teams"))
					.then(getData)
					.catch(function(message) {
					});

			return $rootScope.promise;
		}

		function editTeam(team) {
			var req = adminauth.getConf(team, "PUT", "api/teams/" + team.id);

			$rootScope.promise = $http(req)
					.then(process)
					.catch(process);
			return $rootScope.promise;
		}

		function getData(result) {
			return result.data;
		}

		function process(result) {
			return result;
		}
	}
})();