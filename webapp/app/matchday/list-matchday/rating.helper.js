(function() {
	"use strict";

	/*
	 * This factory only can be used on List-Matchday Controller
	 */
	angular
		.module("app.matchday")
		.factory("ratinghelper", RatingHelper);

		function RatingHelper(dataservice) {
			var MAX_RATING = 5;
			var ratings = [];
			var deferred = null;
			var showInfoRating = false;

			var service = {
				getRatings: getRatings,
				initRating: initRating,
				mouseOverRating: mouseOverRating,
				submitRating: submitRating,
				isInfoVisible: isInfoVisible
			};
			return service;

			function isInfoVisible() {
				return showInfoRating;
			}

			function submitRating(matchdayId, rating) {
				showInfoRating = false;
				deferred = $.Deferred();

				var ratingObj = {
					rating: rating
				};

				dataservice
					.updateRating(matchdayId, ratingObj)
					.then(afterSubmitRating);

				return deferred;
			};

			function afterSubmitRating(resp) {
				showInfoRating = true;
				deferred.resolve(resp);
			}

			function mouseOverRating(index) {
				_.each(ratings, function(r) {
					r.isEmpty = true;
					if (r.index <= index) {
						r.isEmpty = false;
					} 
				});
			}

			function initRating() {
				showInfoRating = false;
				for(var i = 0; i < MAX_RATING; i++) {
					ratings[i] = {index:i, isEmpty:true}
				}
			}

			function getRatings() {
				return ratings;
			}
		}

})();