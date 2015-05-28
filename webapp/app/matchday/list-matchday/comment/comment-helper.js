(function() {
	"use strict";

	/*
	 * This controller only can be used on List-Matchday Controller
	 */
	angular
		.module("app.matchday")
		.controller("commentctrl", CommentCtrl);

	function CommentCtrl(dataservice, commenthelper, $modal, $scope) {
		var matchdayId = null; // Selected matchdayId
		var MAC_COMMENT_LENGTH = 500; // Max comment length
		var remainingChars = null; // Will be change when user start typing
		var deferred = null; // Variable of deferred object
		var allComments = []; // List all comment except user comment, when user
													//  already logged
		var myComments = []; // List all user comment
		var myPoints = []; // List all point which user submit
		var modalInstance = null; // Popup dialog
		var totalComment = 0; // Total comment available to be loaded on matchday
		var commentLoaded = 0;  // Total comment already loaded

		// Modal dialog paramter for post comment {new comment / reply}
		var titleDialog = null;
		var postTextBtn = null;
		var placeHolder = null;

		var actualParentId = null; // temp var for the real parentCommentId
		var parentComment = null; // temp variable for parentComment

		// Asc button indicator
		var textInfoComment = "Load More Comment... ";
		var stillDoAsc = false;

		var latestPointValue = null; // Temporary of latest point value

		var service = {
			userTypeNewComment: userTypeNewComment,
			getRemainingChars: getRemainingChars,
			fetchComments: fetchComments,
			afterFetchComments: afterFetchComments,
			loadMoreComment: loadMoreComment,
			afterLoadComment: afterLoadComment,
			getAllComments: getAllComments,
			getMyComments: getMyComments,
			getTitleDialog: getTitleDialog,
			getPostTextBtn: getPostTextBtn,
			getPlaceHolder: getPlaceHolder,
			getParentComment: getParentComment,
			openCommentDialog: openCommentDialog,
			closeCommentDialog: closeCommentDialog,
			postNewComment: postNewComment,
			loadMoreReplies: loadMoreReplies, 
			afterLoadReplies: afterLoadReplies,
			getTotalComment: getTotalComment,
			getCommentLoaded: getCommentLoaded,
			getTextInfoComment: getTextInfoComment,
			isStillDoAsc: isStillDoAsc,
			updatePoint: updatePoint
		}
		angular.extend(this, service);
		this.newComment = "";

		// User click up/down buttom to send update point request
		function updatePoint(commentId, isUp) {
			// Save latest point if available
			latestPointValue = null;
			var point = _.find(myPoints, function(p) {
				return p.commentId === commentId;
			});
			if (point)
				latestPointValue = point.isUp;
			
			// Do send update request
			dataservice.updatePoint(commentId, isUp)
				.then(afterUpdatePoint);
		}

		function afterUpdatePoint(resp) {
			if (200 === resp.status) {
				// Retrive newPoint obj
				var newPoint = resp.data;
				var oldPoint = null;

				// Change oldPoint value base on newPoint value
				_.each(myPoints, function(p) {
					if (p.id === newPoint.id) {
						oldPoint = {};
						oldPoint.commentId = p.commentId
						oldPoint.isUp = p.isUp;

						p.isUp = newPoint.isUp;
					}
				});
				// If oldPoint is null, it means that is the first time the user send
				//  updatePoint request, and just newPoint to the myPoints list
				if (oldPoint === null) {
					myPoints.push(newPoint);
				} 
				
				// Iterate through myComment list
				iterateCommentList(myComments, newPoint, oldPoint);

				// Iterate through allComments list
				iterateCommentList(allComments, newPoint, oldPoint);
			}
		}

		function iterateCommentList(commentList, newPoint, oldPoint) {
			_.each(commentList, function(c) {
				// Update parent comment attribute, if posible
				commenthelper.updateCommentAttr(c, myPoints);
				// Update parent comment point, if posible
				updateCommentPoints(c, newPoint, oldPoint);

				// Iterate parent subComment
				_.each(c.subComment, function(s) {
					// Update sub comment attribute, if posible
					commenthelper.updateCommentAttr(s, myPoints);
					// Update sub comment point, if posible
					updateCommentPoints(s, newPoint, oldPoint);
				});
			});
		}

		// Need to change the point value, whatever increases or decreases,
		//  when the latestPointValue is null or different
		function updateCommentPoints(comment, newPoint, oldPoint) {
			if (oldPoint == null) {
				if (newPoint.commentId === comment.id) {
					var latestPoint = comment.points;
					newPoint.isUp ? latestPoint++ : latestPoint--;
					comment.points = latestPoint;
					comment.points = comment.points < 0 ? 0 : comment.points;
				}
			} else if (oldPoint.commentId === comment.id) {
				if (oldPoint.isUp && !comment.isUp) {
					comment.points--;
					comment.points = comment.points < 0 ? 0 : comment.points;
				} else if (!oldPoint.isUp && comment.isUp) {
					comment.points++;
				}				
			}
		}

		function isStillDoAsc() {
			return stillDoAsc;
		}

		function getTextInfoComment() {
			return textInfoComment;
		}

		function getCommentLoaded() {
			return commentLoaded;
		}

		function getTotalComment() {
			return totalComment;
		}

		// User click "Load More Replies" button
		function loadMoreReplies(c) {
			// Set indicator, still doing asc
			stillDoAsc = true;
			c.textInfoSubCmt = "Loading...";
			// Send request
			dataservice.fetchSubComments(c.id, c.subCommentLoaded)
				.then(afterLoadReplies);
		}

		// call back loadMoreReplies
		function afterLoadReplies(resp) {
			if (200 === resp.status) {
				// Retrive more subComment
				var comments = resp.data.comments;

				_.each(comments, function(c) {
					// Initialization every comment
					commenthelper.initCommentObj(c, myPoints);

					// Find parent
					var parent = commenthelper.findParentById(c.parentId, myComments);
					if (!parent)
						parent = commenthelper.findParentById(c.parentId, allComments);

					// Push/append to subComment
					if (parent) {
							parent.subComment.push(c);
							parent.offset++;
							parent.subCommentLoaded++;
							parent.textInfoSubCmt = "Load More Replies...";
					}
				});
			}
			// Set indicator, not doing asc
			stillDoAsc = false;
		}

		function closeCommentDialog() {
			modalInstance.dismiss();
		}

		// User click "Reply" / "Post New Comment" button
		function openCommentDialog(parentComment, parentId) {
			this.newComment = "";
			// If its "Reply" comment, then fill the begining comment with with 
			//  the username who owned the parentComment
			if (parentComment) {
				this.newComment = "@" + parentComment.username + " ";
			}

			// Initialize new comment
			initNewComment(parentComment, parentId);

			// Open modal dialog
			modalInstance = $modal.open({
				templateUrl: "newComment.html",
				size: "lg",
				scope: $scope
			});
		}

		function getParentComment() {
			return parentComment;
		}

		function getPlaceHolder() {
			return placeHolder;
		}

		function getPostTextBtn() {
			return postTextBtn;
		}

		function getTitleDialog() {
			return titleDialog;
		}

		function getAllComments() {
			return allComments;
		}

		function getMyComments() {
			return myComments;
		}

		// User click "Load More Comment" utton
		function loadMoreComment() {		
			// Set indicator, still doing asc
			stillDoAsc = true;
			textInfoComment = "Loading...";

			// Create instance deffered object
			deferred = $.Deferred();
			// Send request
			dataservice.fetchComments(matchdayId, commentLoaded, false)
				.then(afterLoadComment);
			return deferred;			
		}

		// loadMoreComment callback
		function afterLoadComment(resp) {
			textInfoComment = "Load More Comment... ";
			
			if (200 === resp.status) {
				// Retrive more comment
				var allC = resp.data.comments;
				totalComment = resp.data.totalComment;

				_.each(allC, function(c) {
					// Increase total comment loaded
					commentLoaded++;
					// Initialize each new comment
					commenthelper.initCommentObj(c, myPoints);

					// Chek the new comment, if it is a user comment or not
					var myComment = _.find(myComments, function(mc) {
						return c.id === mc.id;
					});
					if (myComment) {
						// If it is user comment, then set hide paramter and the view/html
						//  for this comment will not appear
						c.hideThis = true;
					} else {
						// Otherwise just push to allComment
						allComments.push(c);
					}
				});
			}
			
			deferred.resolve(resp);
			stillDoAsc = false;
		}

		// User clicks one of the comments button on matchday table
		function fetchComments(mID) {
			allComments = [];
			myComments = [];
			myPoints = [];
			myComments = [];

			// Save matchdayId
			matchdayId = mID;

			deferred = $.Deferred();
			// Send request
			dataservice.fetchComments(matchdayId, 0, true)
				.then(afterFetchComments);
			return deferred;
		}

		function afterFetchComments(resp) {
			if (200 === resp.status) {
				// Retrive all values, such as: all comment, user comments, 
				//   total comment, user points
				allComments = resp.data.comments;
				totalComment = resp.data.totalComment;
				myComments = resp.data.myComments;
				myPoints = resp.data.myPoints;

				// Initialize each user comment
				_.each(myComments, function(c) {
					c.myReplies = [];
					commenthelper.initCommentObj(c, myPoints);
				});				

				commentLoaded = 0;
				_.each(allComments, function(c) {
					commentLoaded++;
					c.myReplies = [];

					// Initialize every comment
					commenthelper.initCommentObj(c, myPoints);

					// Chek the new comment, if it is a user comment or not
					var myComment = _.find(myComments, function(mc) {
						return c.id === mc.id;
					});
					if (myComment) {
						// If it is user comment, then set hide paramter and the view/html
						//  for this comment will not appear
						c.hideThis = true;
					}
				});
			}
			deferred.resolve(resp);
		}

		function getRemainingChars() {
			return remainingChars;
		}

		// User click "Send button" to post new comment
		function postNewComment() {
			// Close comment form dialog
			closeCommentDialog();

			// Send request
			dataservice.createNewComment(matchdayId ,this.newComment, actualParentId)
				.then(afterPostComment);
		}

		// callback of postNewComment
		function afterPostComment(resp) {
			if (200 === resp.status) {
				// Retrive new comment and initalize it
				var newComment = resp.data;
				console.log("newComment : ", newComment);
				commenthelper.initCommentObj(newComment);

				if (actualParentId) {
					// The new comment come from "Reply" button

					// Find the parent
					var parent = commenthelper.findParentById(actualParentId, myComments);
					if (!parent)
						parent = commenthelper.findParentById(actualParentId, allComments);

					// Push/append the new comment to the parent subComment
					if (!parent.myReplies) 
						parent.myReplies = [];
					parent.myReplies.push(newComment);
				} else {
					newComment.myReplies = [];
					allComments.unshift(newComment);
				}
			}
		}

		// Listener when user keep type on new comment form and keep update
		//  the remaining characters available left
		function userTypeNewComment() {
			
			var newComment = this.newComment;
			if (newComment) {
				var newComment = newComment;
				var length = (newComment && newComment.length) 
					? newComment.length
					: 0;
				remainingChars = MAC_COMMENT_LENGTH - length;
			}
		}

		function initNewComment(pc, parentId) {
			// Set require param to default value
			parentComment = null;
			actualParentId = null;
			remainingChars = MAC_COMMENT_LENGTH;

			parentComment = pc;
			if (parentId)
				actualParentId = parentId;

			// !pc is new comment, and comment is reply a comment it self
			titleDialog = !pc ? "New Comment" : "Reply Comment";
			postTextBtn = !pc ? "Post" : "Reply";
			placeHolder = !pc ? "Write comments...": "Reply comments...";
		}
	}
})();