(function() {
	"use strict";

	var youtubeUrl = "http://www.youtube.com/embed/";
	var googleClientId = 
		"882702102207-s24ht598ci4dhc7mhafp1f4vu25mhfuh.apps.googleusercontent.com";
	var facebookAppId = "1615396538705155";

	angular.module("app")
		.constant("youtubeUrl", youtubeUrl)
		.constant("googleClientId", googleClientId)
		.constant("facebookAppId", facebookAppId);

})();