(function() {
	"use strict";
	angular
		.module("app.matchday")
		.factory("commenthelper", CommentHelper);

		function CommentHelper() {
			var service = {
				findParentById: findParentById,
				initCommentObj: initCommentObj,
				updateCommentAttr: updateCommentAttr
			};
			return service;

			function initCommentObj(c, myPoints) {
				c.subCommentLoaded = 0;

				// Set timeDiff on all comment
				c.timeDiff = generateTimeDiff(c.created);

				// Chek is this comment has subComment / children
				if (c.subComment && c.subComment.length > 0 ) {

					_.each(c.subComment, function(s) {
						c.subCommentLoaded++;

						// Set timeDIff on all children comment
						s.timeDiff = generateTimeDiff(s.created);

						updateCommentAttr(s, myPoints);
					});
				}

				// Additional attribute of "Load More Replies" button
				c.textInfoSubCmt = "Load More Replies...";
				c.isTextInfoActive = true;
				c.offset = 0;
				updateCommentAttr(c, myPoints);
			}

			function updateCommentAttr(comment, myPoints) {
				comment.isUp = null;
				if (myPoints) {
					// Check, if user has been set point on this comment or not
					var point = _.find(myPoints, function(p) {
						return p.commentId === comment.id;
					});
					if (point) {
						comment.isUp = point.isUp;
					}
				}
			}

			function findParentById(parentId, allComment) {
				return _.find(allComment, function(c) {
					return c.id === parentId;
				});
				return null;
			}

			function generateTimeDiff(createdDate) {
				// Init current date, in Moment.js obj
				var currentDate = new Date();
				var ma = moment(currentDate);

				// Init created date, in Moment.js obj
				var date = new Date(createdDate)
				var mb = moment(date);

				// Find 'days', 'hours' and, 'minute' diff
				var dayDiff = ma.diff(mb, 'days');
				var hourDiff = ma.diff(mb, 'hours');
				var minuteDiff = ma.diff(mb, 'minute');

				// Set timeDiff, and put it on comment
				if (minuteDiff === 0)
					return " - a moment ago"
				else if (minuteDiff < 60)
					return " - " + minuteDiff + " m";
				else if (hourDiff < 24)
					return " - " + hourDiff + " h";
				else
					return " - " + dayDiff + " d";
			}

		}
})();