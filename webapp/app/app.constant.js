(function() {
	"use strict";

	var youtubeUrl = "http://www.youtube.com/embed/";
	var googleClientId = 
		"443417738207-7mf3g45c6jr8u7md8uiuj93gkgmfnoe4.apps.googleusercontent.com";
	var facebookAppId = "894596570608302";

	angular.module("app")
		.constant("youtubeUrl", youtubeUrl)
		.constant("googleClientId", googleClientId)
		.constant("facebookAppId", facebookAppId);

})();