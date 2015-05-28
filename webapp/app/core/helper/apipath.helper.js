(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("apipathhelper", ApipathHelper);

	function ApipathHelper() {
		// Github repo for java server (100% finished)
		//  https://github.com/tekdungtralala/eplweb_java_server
		var JAVA_SERVER_URL = "http://localhost:8080/eplweb/";

		// Github repo for php server (not finished yet)
		//  https://github.com/tekdungtralala/eplweb_php_server
		var PHP_SERVER_URL = "http://localhost/ci/index.php/";

		var service = {
			generateUrl: generateUrl
		};
		return service;

		function generateUrl(url) {
			return getServer() + url;
		}

		// Choose one
		function getServer() {
			return JAVA_SERVER_URL;
			// return PHP_SERVER_URL;
		}
	}

})();