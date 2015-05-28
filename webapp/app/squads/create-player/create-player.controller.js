(function() {
	"use strict";

	angular
		.module("app.squads")
		.controller("Create-Player", CreatePlayer);

	function CreatePlayer(xhrTeams, dataservice, $state, $rootScope) {
		var vm = this;
		$rootScope.$broadcast("squad-new-btn", false);

		vm.teams = xhrTeams.result;
		vm.showError = false;
		vm.errorMsg = null;

		vm.position = null;
		vm.team = null;
		vm.name = null;
		vm.playerNumber = null;

		vm.backToSquads = backToSquads;
		vm.save = save;

		// static view variable
		vm.positions = [
			{ label: "Goalkeeper", value: "GOALKEEPER"}, 
			{ label: "Defender", value: "DEFENDER"},
			{ label: "Midfielder", value: "MIDFIELDER"},
			{ label: "Forward", value: "FORWARD"}
		];

		var formValidateOpt = { 
			rules: {
				playerName: {
					required: true
				},
				team: {
					required: true
				},
				position: {
					required: true
				},
				playerNumber: {
					required: true,
					number: true
				}
			},
			messages: {
				playerName: getErrorFormat(),
				team: getErrorFormat(),
				position: getErrorFormat(),
				playerNumber: getErrorFormat()
			},
			showErrors: showErrors,
			onkeyup: false
		};

		function getErrorFormat() {
			return "<i class='fa fa-times-circle-o'></i> Please fill fieald above.";
		}

		function showErrors(errorMap, errors) {
			var formElmt = $("#createplayer");
			formElmt.children(".form-group").removeClass("has-error");

			for (var i in errors) {
				var parent = $(errors[i].element).parent();
				parent.addClass("has-error");
			}
		}

		// User click save button
		function save() {
			var formElmt = $("#createplayer");
			
			// validate the form 
			formElmt.validate(formValidateOpt);
			if(formElmt.valid()) {
				var data = {
					name: vm.name,
					team: {id: vm.team.id},
					position: vm.position.value,
					playerNumber: vm.playerNumber
				}

				// Send new player request
				dataservice.savePlayer(data).then(processResponse);
			}
		}

		function processResponse(r) {
			if (200 === r.status) {
				$state.go("squads.show-team", {teamId: vm.team.id});
			} else if (409 === r.status) {
				vm.showError = true;
				vm.errorMsg = r.data.result.message;
			} else {

			}
		}

		function backToSquads() {
			$rootScope.$broadcast("squad-new-btn", true);
			$state.go("squads");
		}
	}
	
})();