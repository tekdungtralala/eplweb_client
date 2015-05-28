(function() {
	"use strict";

	angular
		.module("app.team")
		.controller("Edit-Map", EditMap);

	function EditMap(xhrTeams, dataservice, uiGmapIsReady, $stateParams, 
		$state, $rootScope) {

		$rootScope.$broadcast("edit-team-btn-menu", "map");

		var vm = this;
		vm.map = null
		vm.defaultLocation = null;
		vm.marker = null;

		var currTeam = null;

		// User click save button
		vm.saveLocation = saveLocation;

		activate();
		function activate() {
				currTeam = _.find(xhrTeams.result, function(t) {
					return t.id === parseInt($stateParams.id);
				});
				initMapAttr(currTeam);
				$rootScope.promise = uiGmapIsReady.promise();
		}

		function saveLocation() {
			currTeam.longitude = vm.marker.coords.longitude;
			currTeam.latitude = vm.marker.coords.latitude;

			delete currTeam["$$hashKey"];
			dataservice.editTeam(currTeam).then(afterSave);
		}

		function afterSave() {
			var id = currTeam.id;
			var sn = currTeam.simpleName;
			$state.go("team.show-team", {id: id, simpleName: sn});
		}

		function initMapAttr(team) {
			vm.map = {
				center: { latitude: team.latitude, longitude: team.longitude}, 
				zoom: 7,
				options: {scrollwheel: false}
			};
			vm.defaultLocation = {
				id: 0,
				coords: {
					latitude: team.latitude,
					longitude: team.longitude
				},
				options: {
					draggable: false,
					labelContent: "Stadium Location",
					labelClass: "epl-marker-labels"
				}
			};
			vm.marker = {
				id: 1,
				coords: {
					latitude: parseInt(team.latitude) - 0.2,
					longitude: parseInt(team.longitude) + 0.2
				},
				options: {
					draggable: true,
					labelContent: "New Location",
					labelClass: "epl-marker-newlocation"
				}
			};
		}
	}

})();