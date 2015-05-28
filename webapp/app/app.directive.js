(function() {
	"use strict";

	angular.module("app")
		.directive("eplwebScrollPosition", eplwebScrollPosition);

	angular.module("app")
		.directive('eplwebCommentSection', eplwebCommentSection);

	function eplwebCommentSection() {
	  return {
			scope: {
				comment: '=comment',
				actualId: '=actualId',
				isUserLogged: '=isUserLogged',
				openDialog: '&openDialog',
				updatePoint: '&updatePoint'
			},
	    templateUrl: 'app/commentAction.html'
	  };
	}

	function eplwebScrollPosition($window) {
		return {
			scope: {
				value: '='
			},
			link: function(scope, element, attrs) {
				var windowEl = angular.element($window);
				var handler = function() {
					scope.value = windowEl.scrollTop();
				}
				windowEl.on('scroll', scope.$apply.bind(scope, handler));
				handler();
			}
		};
	}
	
})();