(function() {
	"use strict";
	
	angular
		.module("app.matchday")
		.factory("matchdayhelper", Matchdayhelper);

	function Matchdayhelper(dataservice, datautil) {

		var service = {
			processWeekData: processWeekData,
			getFormattedWeek: getFormattedWeek,
			getMatchdayByWeekNmr: getMatchdayByWeekNmr,
			convertModelViewToModel: convertModelViewToModel
		};

		return service;

		function convertModelViewToModel(modelviews) {
			var result = [];
			_.each(modelviews, function(datas) {
				_.each(datas, function(d) {
					result.push(d);
					var m1 = moment(d.date);
					d.dateStr = m1.format("ddd, DD MMM");

					var m2 = moment(d.time, "HH:mm:ss");
					d.timeStr = m2.format("HH:mm");
				})
			});
			return result;
		}

		function processWeekData(weeks) {
			
			var result = weeks;
			_.each(weeks, function(w) {
				// Set dateView attribute
				w.dateView = getFormattedWeek(w);
			});

			return result;
		}

		function getFormattedWeek(w) {
			return datautil.getFormattedWeek(w.startDay, w.weekNumber);
		}

		function getMatchdayByWeekNmr(weekNumber) {
			return dataservice.getMatchdayByWeekNmr(weekNumber).then(function(data) {
				return data;
			});
		}
	}
})();
