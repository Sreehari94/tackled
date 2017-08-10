angular.module('web.standings',['smart-table-improved'])
	.controller('StandingsCtrl', ['$scope','$state','$filter','$http', '$q', '$stateParams', function($scope, $state, $filter, $http, $q, $stateParams) {
		console.log("Inside Standings Ctrl");

		$scope.standingsData=[];
		$scope.rowCollection=[];

		var getStandingsData=function(){
			var deferred=$q.defer();
			$http.get('json/standings.json').then(
	            function(response) {
	                console.log("get MCQ data response: ", response);
	                deferred.resolve(response.data.body);
	            },
	            function(error) {
	                console.log("Error: ", error)
	                deferred.reject("error");
	            }
	        )
	        return deferred.promise;
		}

		var getDefaultRowCollection=function(){
			$scope.rowCollection=[
				{
		  			"zone":"Zone A",
		  			"teamName":"Dabang Delhi K.C.",
		  			"teamLogo":"img/teams/2.png",
		  			"rank":5,
		  			"play":4,
		  			"win":1,
		  			"loss":3,
		  			"draw":0,
		  			"scoreDifference":-21,
		  			"points":7
		  		},
		  		{
		  			"zone":"Zone A",
		  			"teamName":"Gujarat FortuneGiants",
		  			"teamLogo":"img/teams/12.png",
		  			"rank":4,
		  			"play":3,
		  			"win":1,
		  			"loss":1,
		  			"draw":1,
		  			"scoreDifference":-6,
		  			"points":8
		  		},
		  		{
		  			"zone":"Zone A",
		  			"teamName":"Haryana Steelers",
		  			"teamLogo":"img/teams/9.png",
		  			"rank":3,
		  			"play":3,
		  			"win":1,
		  			"loss":1,
		  			"draw":1,
		  			"scoreDifference":11,
		  			"points":9
		  		},
		  		{
		  			"zone":"Zone A",
		  			"teamName":"Jaipur Pink Panthers",
		  			"teamLogo":"img/teams/3.png",
		  			"rank":6,
		  			"play":2,
		  			"win":1,
		  			"loss":1,
		  			"draw":0,
		  			"scoreDifference":-2,
		  			"points":6
		  		},
		  		{
		  			"zone":"Zone A",
		  			"teamName":"Puneri Paltan",
		  			"teamLogo":"img/teams/7.png",
		  			"rank":1,
		  			"play":3,
		  			"win":2,
		  			"loss":1,
		  			"draw":0,
		  			"scoreDifference":15,
		  			"points":11
		  		},
		  		{
		  			"zone":"Zone A",
		  			"teamName":"U Mumba",
		  			"teamLogo":"img/teams/5.png",
		  			"rank":2,
		  			"play":3,
		  			"win":2,
		  			"loss":1,
		  			"draw":0,
		  			"scoreDifference":3,
		  			"points":10
		  		},
		  		{
		  			"zone":"Zone B",
		  			"teamName":"Bengal Warriors",
		  			"teamLogo":"img/teams/4.png",
		  			"rank":3,
		  			"play":3,
		  			"win":2,
		  			"loss":1,
		  			"draw":0,
		  			"scoreDifference":20,
		  			"points":11
		  		},
		  		{
		  			"zone":"Zone B",
		  			"teamName":"Bengaluru Bulls",
		  			"teamLogo":"img/teams/1.png",
		  			"rank":1,
		  			"play":7,
		  			"win":3,
		  			"loss":3,
		  			"draw":1,
		  			"scoreDifference":-7,
		  			"points":20
		  		},
		  		{
		  			"zone":"Zone B",
		  			"teamName":"Patna Pirates",
		  			"teamLogo":"img/teams/6.png",
		  			"rank":2,
		  			"play":3,
		  			"win":3,
		  			"loss":0,
		  			"draw":0,
		  			"scoreDifference":27,
		  			"points":15
		  		},
		  		{
		  			"zone":"Zone B",
		  			"teamName":"Tamil Thalaivas",
		  			"teamLogo":"img/teams/10.png",
		  			"rank":6,
		  			"play":3,
		  			"win":1,
		  			"loss":2,
		  			"draw":0,
		  			"scoreDifference":-1,
		  			"points":7
		  		},
		  		{
		  			"zone":"Zone B",
		  			"teamName":"Telugu Titans",
		  			"teamLogo":"img/teams/8.png",
		  			"rank":4,
		  			"play":7,
		  			"win":1,
		  			"loss":5,
		  			"draw":1,
		  			"scoreDifference":-37,
		  			"points":11
		  		},
		  		{
		  			"zone":"Zone B",
		  			"teamName":"U.P Yoddha",
		  			"teamLogo":"img/teams/11.png",
		  			"rank":5,
		  			"play":3,
		  			"win":2,
		  			"loss":1,
		  			"draw":0,
		  			"scoreDifference":-2,
		  			"points":10
		  		}
			];
		}

		var init=function(){
			document.title='Pro Kabaddi League 2017, Season 5 Standings';
            var meta=document.getElementsByTagName("meta");
            for (var i=0; i<meta.length; i++) {
                if (meta[i].name.toLowerCase()=="description") {
                    meta[i].content="The League Standings of the Pro Kabaddi League 2017 Season 5 ";
                }
                $("meta[property='og:title']").attr('content', 'Pro Kabaddi League 2017, Season 5 Standings');
                $("meta[property='og:description']").attr('content', 'The League Standings of the Pro Kabaddi League 2017 Season 5');
            }
            window.scrollTo(0, 0);
            getDefaultRowCollection();
			getStandingsData().then(function(response){
				$scope.standingsData=response.standings;
			},function(error){
				console.log("error");
				$state.go('web.home');
			});
		}()
	
	}]);