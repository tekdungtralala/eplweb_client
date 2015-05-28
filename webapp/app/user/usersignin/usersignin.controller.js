(function() {

	"use strict";

	angular.module("app.user")
		.controller("UserSignin", UserSignin);

	function UserSignin(dataservice, userauth, $stateParams, $modal, $scope) {
		var vm = this;
		vm.userModel = null;
		vm.username = null;
		vm.errorMsg = null;

		vm.modalInstance = null;

		// Validate the username
		vm.presave = presave;
		// Cancel signup
		vm.dismisModal = dismisModal;
		// Submit signup data
		vm.doSave = doSave;

		activate();
		function activate() {
			var param = $stateParams.userModel;
			var str = decodeURIComponent(param);
			vm.userModel = JSON.parse(str);
		}

		function doSave() {
			vm.modalInstance.dismiss();
			vm.userModel.username = vm.username;
			dataservice.userSignIn(vm.userModel).then(userauth.processSignIn);
		}

		function checkusername(result) {
			if (200 === result.status) {
				vm.modalInstance = $modal.open({
					templateUrl: "saveModal.html",
					scope: $scope,
					size: "sm",
					backdrop: "static"
				});
			} else {
				vm.errorMsg = "username is not available, please choose another one.";
			}
		}
		function dismisModal() {
			vm.modalInstance.dismiss();
		}

		function presave() {
			vm.errorMsg = null;

			var username = vm.username;
			if (username) {
				if (username.length >= 5 && username.length <= 16) {
					var regex = /^[a-zA-Z0-9_]+$/;
					var isValid = regex.test(username);

					if (isValid) {
						// Need to check whatever the username exist or not
						dataservice.isUsernameAvailable(username)
							.then(checkusername);
					} else {
						vm.errorMsg = 
							"Please, use only alphabetic characters or underscore.";
					}
				} else {
					vm.errorMsg = "username length is between 5 - 16"
				}
			} else {
				vm.errorMsg = "Please fill the input text."
			}
		}
	}

})();