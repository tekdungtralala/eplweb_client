(function() {
	"use strict";

	angular
		.module("app.team")
		.controller("Edit-Video", EditVideo);

	function EditVideo(xhrTeams, youtubeUrl, dataservice, $upload, $rootScope, $stateParams, $sce, $timeout) {

		$rootScope.$broadcast("edit-team-btn-menu", "video");

		var vm = this;
		vm.currTeam = null;
		vm.videoUrl = null;
		vm.imageFile = null;
		vm.videoFile = null;
		vm.imageData = null;
		vm.uploadVideoBtn = false;

		// Generate thumbnail after user selecting image file
		vm.generateThumb = generateThumb;
		// Check the Video file, it is video or not
		vm.verifyVideo = verifyVideo;
		// Submit a new thumbnail
		vm.changeThumbnail = changeThumbnail;
		// Conver video size
		vm.bytesToSize = bytesToSize;
		// Submit the new video
		vm.uploadVideo = uploadVideo;

		var uploadState = null; // "video" or "videothumbnail"

		activate();
		function activate() {
			vm.currTeam = _.find(xhrTeams.result, function(t) {
					return t.id === parseInt($stateParams.id);
			});
			vm.videoUrl = $sce.trustAsResourceUrl(youtubeUrl + vm.currTeam.videoId);
		}

		function bytesToSize(bytes) {
			if(bytes == 0) return '0 Byte';
			var k = 1000;
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			var i = Math.floor(Math.log(bytes) / Math.log(k));
			return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
		}

		function verifyVideo() {
			vm.uploadVideoBtn = false;
			if (vm.videoFile && vm.videoFile[0]) {
				var file = vm.videoFile[0];
				if (file.type.indexOf('video') > -1) {
					vm.uploadVideoBtn = true;
				}
			}
		}

		function uploadVideo() {
			if (vm.videoFile && vm.videoFile[0]) {
				doUpload(vm.videoFile[0], "video");
			}			
		}

		function changeThumbnail() {
			if (vm.imageFile && vm.imageFile[0]) {
				doUpload(vm.imageFile[0], "videothumbnail");
			}
		}

		function doUpload(file, state) {
			uploadState = state;

			file.upload = $upload.upload({
				url: dataservice.getUploadURL(uploadState, vm.currTeam.id),
				method: "POST",
				file: file
			});

			file.upload
				.success(processDataUpload)
				.error(processDataUpload);

			$rootScope.promise = file.upload.then();
		}

		function processDataUpload(data, status, headers, config) {
			if (200 != status) {
				var url = 
					dataservice.getUploadURL(uploadState, {teamId: vm.currTeam.id}, true);
				messagedialog.showErrorDialog(status, config.method, url);
			}

			vm.imageData = null;
		}

		function generateThumb() {
			if (vm.imageFile != null && vm.imageFile.length > 0) {
				if (vm.imageFile[0].type.indexOf('image') > -1) {
					var fileReader = new FileReader();
					fileReader.readAsDataURL(vm.imageFile[0]);
					fileReader.onload = function(e) {
						$timeout(function() {
							vm.imageData = e.target.result;
						});
					}
				}
			}
		}
	}

})();