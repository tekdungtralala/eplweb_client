(function() {
	"use strict";

	angular
		.module("app.admin")
		.controller("AdminLogout", AdminLogout)
		.controller("AdminLogin", AdminLogin);

	function AdminLogout(dataservice, $state) {
		dataservice.adminLogout();
		$state.go("admin.login", {reload: false});
	}

	function AdminLogin(dataservice, adminauth, userauth, $rootScope) {
		var vm = this;
		vm.hideMsg = null;
		vm.hasErr = null; 
		vm.errorMsg = null;
		vm.doLogin = doLogin;

		activate();
		function activate() {
				hideError();
		}

		function doLogin(){
			var adminEmail = $("#eplAdminEmail").val();
			var adminPaswd = $("#eplAdminPaswd").val();

			if (adminEmail && adminPaswd){

				var email = encodeBase64(adminEmail);
				var psswd = encodeBase64(adminPaswd)

				dataservice.adminLogin(email, psswd)
					.then(processData);
			} else {
				showError("Email or Password is empty.")
			}
		}

		function showError(errorMsg){
			vm.hideMsg = "";
			vm.hasErr = "has-error";
			vm.errorMsg = errorMsg;
		}

		function hideError(){
			vm.hideMsg = "hide";
			vm.hasErr = "";
			vm.errorMsg = "";
		}

		function processData(result) {
			if (200 == result.status) {
				hideError();
				// save cookie session
				adminauth.putAdminSession(result.data.result.session);

				// set user profile
				var user = result.data.result.user;
				var userRole = result.data.result.role;
				userauth.setLoggedUser(user, userRole);

				$rootScope.isAdminLogged = true;

				// redirect to admin dashboard
				window.location.href = "#/admin/dashboard";
			} else {
				showError("The email or password you entered is incorrect.");
			}
		}

		function encodeBase64(str) {
			var Base64 = {
					_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

				encode: function(input) {
					var output = "";
					var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
					var i = 0;

					input = Base64._utf8_encode(input);

					while (i < input.length) {
						chr1 = input.charCodeAt(i++);
						chr2 = input.charCodeAt(i++);
						chr3 = input.charCodeAt(i++);

						enc1 = chr1 >> 2;
						enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
						enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
						enc4 = chr3 & 63;

						if (isNaN(chr2)) {
							enc3 = enc4 = 64;
						} else if (isNaN(chr3)) {
							enc4 = 64;
						}
						output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
					}
					return output;
				},

				_utf8_encode: function(string) {
					string = string.replace(/\r\n/g, "\n");
					var utftext = "";

					for (var n = 0; n < string.length; n++) {

						var c = string.charCodeAt(n);

						if (c < 128) {
							utftext += String.fromCharCode(c);
						}
						else if ((c > 127) && (c < 2048)) {
							utftext += String.fromCharCode((c >> 6) | 192);
							utftext += String.fromCharCode((c & 63) | 128);
						}
						else {
							utftext += String.fromCharCode((c >> 12) | 224);
							utftext += String.fromCharCode(((c >> 6) & 63) | 128);
							utftext += String.fromCharCode((c & 63) | 128);
						}
					}
					return utftext;
				}
			}
			return Base64.encode(str);
		}
	}
})();
