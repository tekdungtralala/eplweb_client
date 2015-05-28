(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("adminauth", AdminAuth);

	function AdminAuth($cookieStore, $rootScope, $state, apipathhelper) {
		var ADMIN_SESSION_KEY = "epl-admin-session";
		var EPL_AUTH_HEADER = "epl-authentication";
		var aph = apipathhelper;

		var service = {
			// Save admin session into cookie
			putAdminSession: putAdminSession,
			// Take admin session from cookie 
			getAdminSession: getAdminSession,
			// Remove admin session on cookies
			delAdminSession: delAdminSession,
			// Generate http conf for admin
			getConf: getConf,
			// Get authentication key
			getAuthKey: getAuthKey
		};

		return service;

		function getAuthKey() {
			return EPL_AUTH_HEADER;
		}

		function getConf(o, method, url) {
			var req = {
				method: method,
				url: aph.generateUrl(url),
				headers: {
					"Content-Type": "application/json"
				}
			}

			if (o) {
				req.data = JSON.stringify(o);
			}

			req.headers[EPL_AUTH_HEADER] = getAdminSession();

			return req;
		}

		function delAdminSession() {
			$cookieStore.remove(ADMIN_SESSION_KEY);
		}

		function getAdminSession() {
			return $cookieStore.get(ADMIN_SESSION_KEY);
		}

		function putAdminSession(session) {
			$cookieStore.put(ADMIN_SESSION_KEY, session);
		}
	}
	
})();