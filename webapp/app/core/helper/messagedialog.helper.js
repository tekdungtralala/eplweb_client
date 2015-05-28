(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("messagedialog", MessageDialog);

	function MessageDialog($modal) {
		var service = {
			showErrorDialog: showErrorDialog
		};
		return service;

		function showErrorDialog(errorCode, method, api) {
			$modal.open({
				templateUrl: "errorModal.html",
				size: "sm",
				controller: function($scope, $modalInstance) {
					$scope.close = function() {
						$modalInstance.dismiss();
					};
					$scope.message = errorCode + " " + method + " " + api;
				}
			});
		}

	}
	
})();