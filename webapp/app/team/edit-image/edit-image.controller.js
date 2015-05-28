(function() {
	"use strict";

		angular
			.module("app.team")
			.controller("Edit-Image", EditImage);

		function EditImage(xhrTeams, dataservice, messagedialog, $rootScope, 
			$scope, $modal, $state, $stateParams, $upload, $timeout, $document) {

			$rootScope.$broadcast("edit-team-btn-menu", "image");

			var vm = this;

			vm.currTeam = null;
			vm.imagesTeam = [];
			vm.modalInstance = null;
			vm.disableBtn = true;
			vm.selectedImage = null;
			vm.imageFile = null;
			vm.dataUrl = null;
			vm.scrollValue = null;
			vm.slideShowMode = "editable"; // editable/sorting mode
			var selectedImageId = null;
			var baseImages = null;

			// Show delete confirmation
			vm.preDeleteImage = preDeleteImage;
			// User click ok on delete confirmation
			vm.doDelete = doDelete;
			// After seelcted image file, need to generate and show
			//  the tumbnail
			vm.generateThumb = generateThumb;
			// Upload a new slideshow
			vm.uploadImage = uploadImage;
			// Toggle image mode, editable/sorting mode
			vm.toggleImageMode = toggleImageMode;
			// Change position image on sorting mode
			vm.changePosition = changePosition;
			// Reset slideshow order
			vm.resetOrder = resetOrder;
			// Save slideshow order
			vm.saveOrder = saveOrder;

			activate();
			function activate() {
				// Find current team
				vm.currTeam = _.find(xhrTeams.result, function(t) {
						return t.id === parseInt($stateParams.id);
				});

				getSlideShows().then(processDataImages);
			}

			function unbindScrollEvent() {
				$document.unbind('scroll');
			}

			function saveOrder() {
				var savedObj = [];

				var sortedId = _.pluck(vm.imagesTeam, "id");
				_.each(sortedId, function(id, index) {
					savedObj.push({id:id, position: index});
				});

				dataservice.saveSlideShowOrder(savedObj)
					.then(afterSaveOrder);
			}

			function afterSaveOrder() {
				getSlideShows().then(processDataImages);
			}

			function resetOrder() {
				vm.imagesTeam  = angular.copy(baseImages);
			}

			function changePosition(newIndex, image) {
				if (newIndex >= 0 && vm.imagesTeam.length > newIndex) {
					var newArray = [];
					var totalIndex = 0;
					_.each(vm.imagesTeam, function(im) {
						if (totalIndex === newIndex) newArray.push(image);
						if (im.id !== image.id) {
							newArray.push(im);
							totalIndex++;
						}
					});
					if (totalIndex === newIndex) newArray.push(image);

					vm.imagesTeam = angular.copy(newArray);
				}
			}

			function toggleImageMode() {
				vm.imagesTeam  = angular.copy(baseImages);
				if ("editable" === vm.slideShowMode) {
					vm.slideShowMode = "sorting";
				} else if ("sorting" === vm.slideShowMode) {
					vm.slideShowMode = "editable";
				}
			}

			function uploadImage() {
				var file = vm.imageFile[0];

				file.upload = $upload.upload({
					url: dataservice.getUploadURL("slideshow", vm.currTeam.id),
					method: "POST",
					file: file
				});

				file.upload
					.success(processDataUpload)
					.error(processDataUpload)
					.progress(function(evt) {
						var percent = parseInt(100.0 * evt.loaded / evt.total);
						$(".epl-progress .progress-bar").css("width", percent+"%");
					});

				$rootScope.promise = file.upload.then();
			}

			function processDataUpload(data, status, headers, config) {
				
				getSlideShows().then(processDataImages);

				if (200 != status) {
					var url = 
						dataservice.getUploadURL("slideshow", {teamId: vm.currTeam.id}, true);
					messagedialog.showErrorDialog(status, config.method, url);
				}

				vm.dataUrl = null;
			}

			function generateThumb() {
				if (vm.imageFile != null && vm.imageFile.length > 0) {
					if (vm.imageFile[0].type.indexOf('image') > -1) {
						var fileReader = new FileReader();
						fileReader.readAsDataURL(vm.imageFile[0]);
						fileReader.onload = function(e) {
							$timeout(function() {
								vm.dataUrl = e.target.result;
							});
							$(".epl-progress .progress-bar").css("width", "0%");
						}
					}
				}
			}

			function processDataImages(data) {
				// Set team images
				baseImages = data.result;

				_.each(baseImages, function(m) {
					m.src = dataservice.getImageById(m.id);
				});

				vm.imagesTeam  = angular.copy(baseImages);
			}

			function preDeleteImage(imageId) {
				vm.selectedImage = dataservice.getImageById(imageId);
				selectedImageId = imageId;

				vm.modalInstance = $modal.open({
					templateUrl: "delImageModal.html",
					scope: $scope,
					size: "sm"
				});
			}

			function doDelete() {
				vm.modalInstance.dismiss();

				dataservice.deleteImage(selectedImageId, "SLIDESHOW")
					.then(afterDelete);
			}

			function afterDelete() {
				getSlideShows().then(processDataImages);
				$(".epl-progress .progress-bar").css("width", "0%");
			}

			function getSlideShows() {
				return dataservice.getSlideShows($stateParams.id)
					.then(function(data) {
						return data;
					});
			}
		}

})();