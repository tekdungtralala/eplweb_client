(function() {
	"use strict";

	angular
		.module("app.admin")
		.controller("AdminDashboard", AdminDashboard);
	
	function AdminDashboard(dataservice) {
		var vm = this;

		activate();
		function activate() {
		}
	}
})();
