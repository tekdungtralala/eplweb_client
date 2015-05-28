(function() {
	"use strict";

	angular
		.module("app.core")
		.factory("socialmedia", SocialMedia);

	// Note: Please read dataservice.js factory before using any factory
	function SocialMedia(googleapihelper, fbapihelper, $rootScope) {

		var service = {
			// Sign in using user network profile
			socialMediaSignin: socialMediaSignin,
		}
		return service;

		function socialMediaSignin(netowrkType) {
			// Do sign in base on netowrkType
			if ("GOOGLE" === netowrkType.toUpperCase()) {
				googleapihelper.doSignInGoogle();
			} else if ("FACEBOOK" === netowrkType.toUpperCase()) {
				fbapihelper.doSignInFacebook();
			}
		}
	}
})();