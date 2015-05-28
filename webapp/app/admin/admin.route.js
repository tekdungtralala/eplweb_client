(function() {

	"use strict";

	angular.module("app.admin")
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state("admin", {
				url: "/admin",
				template: "<span ui-view><span>"
			})
			.state("admin.dashoard", {
				url: "/dashboard",
				templateUrl: "app/admin/dashboard/admindashboard.html",
				controller: "AdminDashboard",
				controllerAs: "vm"
			})
			.state("admin.config", {
				url: "/configuration",
				templateUrl: "app/admin/configuration/adminconfig.html",
				controller: "AdminConfig",
				controllerAs: "vm"
			})
			.state("admin.login", {
				url: "/login",
				templateUrl: "app/admin/login/adminlogin.html",
				controller: "AdminLogin",
				controllerAs: "vm"
			})
			.state("admin.logout", {
				url: "/logout",
				controller: "AdminLogout"
			})
			;
	}

})();