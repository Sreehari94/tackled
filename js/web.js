angular.module('Tackled', ["ui.router"])
.controller('WebsiteCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
	console.log("Inside WebsiteCtrl");
	var quizData={
        mcq:[]
    };
	var quizDatalength=0;
	$scope.currentMCQ='';
	$scope.selectedChoice={
		response:''
	};
	$scope.questionNumber=1;
	$scope.enableButton=true;
	$scope.points=0;
    $scope.thData = {};

	var getQuizData=function(){
		var deferred=$q.defer();
		$http.get('json/quiz.json').then(
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

    var getThData=function(){
        var formData = {
            "header": {
                clientId: "SPARROWZ_WEBSITE",
                apiVersion: "4.7.0"
            },
            body: {
                "cityId": 10001
            }
        }
        console.log('form data to get treasureHunts: ', formData);
        var req = {
            method: 'POST',
            url: "http://prod.app.sparrowzapp.com/o2core/services/guest/getTreasureHunts",
            headers: {
                'Content-Type': 'application/json'
            },
            data: formData
        }
        $http(req).then(
            function(response) {
                $scope.thData = response.data.body;
            },
            function(error) {
                console.log("Error: ", error);
            }
        )
    }    

	var showFirstQuestion=function(){
		quizDatalength=quizData.mcq.length;
		console.log("Quiz data length:", quizDatalength);
		$scope.currentMCQ=quizData.mcq[0];
		console.log("First Question Data:",$scope.currentMCQ);
	}

    var makeQuestionCollection=function(response){
        /*console.log("Get quiz data response:", response);*/
        var limit=3;
        for(var i=0; i<=limit;i++){
            if(i==3){
               showFirstQuestion(); 
            }else{
                quizData.mcq[i]=response.mcq[Math.floor(Math.random()*response.mcq.length)];
                /*console.log(response.mcq[Math.floor(Math.random()*response.mcq.length)]);*/
            }
        }
        /*console.log("Quiz Data:",quizData);*/
    }

    $scope.replayMCQ = function(){
        initializeAll();
        $scope.points=0;
        $scope.currentMCQ='';
        $scope.selectedChoice={
            response:''
        };
        $scope.questionNumber=1;
        $scope.enableButton=true;
        clearBlocksCss();
        enableInputs();
        document.getElementById("questionBox").style.display="block";
        document.getElementById("scoreBox").style.display="none";
        document.getElementById("submitButton").style.display="none";
        document.getElementById("nextButton").style.display="inline-block";
    }
	var initializeAll=function(){
		console.log("Inside initialize method");
        getThData();
		getQuizData().then(function(response){
			/*quizData=response;*/
            console.log("response length:",response.mcq.length)
            makeQuestionCollection(response);
			/*showFirstQuestion();*/
		},function(error){
			console.log("return error:",error);
		});
	}

	var disableInputs=function(){
		document.getElementById("blockA").disabled = true;
		document.getElementById("blockB").disabled = true;
		document.getElementById("blockC").disabled = true;
		document.getElementById("blockD").disabled = true;
		$('label').addClass('disableLabel');
	}

	var enableInputs=function(){
		document.getElementById("blockA").disabled = false;
		document.getElementById("blockB").disabled = false;
		document.getElementById("blockC").disabled = false;
		document.getElementById("blockD").disabled = false;
		$('label').removeClass('disableLabel');
	}

	var clearBlocksCss=function(){
		document.getElementById("blockA").style.backgroundColor="white";
		document.getElementById("blockA").style.color="black";
		document.getElementById("blockB").style.backgroundColor="white";
		document.getElementById("blockB").style.color="black";
		document.getElementById("blockC").style.backgroundColor="white";
		document.getElementById("blockC").style.color="black";
		document.getElementById("blockD").style.backgroundColor="white";
		document.getElementById("blockD").style.color="black";
	}

	$scope.shownextQuestion=function(){
		clearBlocksCss();
		$scope.enableButton=true;
		$scope.questionNumber=$scope.questionNumber+1;
		if($scope.questionNumber<quizDatalength){
			$scope.currentMCQ=quizData.mcq[$scope.questionNumber-1];
		}else if($scope.questionNumber==quizDatalength){
			$scope.currentMCQ=quizData.mcq[$scope.questionNumber-1];
			document.getElementById("nextButton").style.display="none";
			document.getElementById("submitButton").style.display="inline-block";
		}else{
			document.getElementById("nextButton").style.display="none";
		}
		enableInputs();
	}

	$scope.validateAnswer=function(event){
		$scope.enableButton=false;
		disableInputs();
		console.log("Element Id:",event.target.attributes.id.value);
		var blockId=event.target.attributes.id.value;
		console.log("Selected Choice:",$scope.selectedChoice.response," and Answer:",$scope.currentMCQ.answer);
		if($scope.selectedChoice.response==$scope.currentMCQ.answer){
			console.log("Answeris correct");
			$scope.points=$scope.points+10;
			document.getElementById(blockId).style.backgroundColor="green";
			document.getElementById(blockId).style.color="white";
		}else{
			console.log("Wrong answer");
			document.getElementById(blockId).style.backgroundColor="red";
			document.getElementById(blockId).style.color="white";
		}
	}

    $scope.showScoreBoard=function(){
    	document.getElementById("questionBox").style.display="none";
    	document.getElementById("scoreBox").style.display="block";
    }

	initializeAll();
}])

.controller('ContestCtrl', ['$scope', '$http', '$q', '$stateParams','$state', function($scope, $http, $q, $stateParams, $state) {
	console.log("stateParams: ",$stateParams.pageId);
	$scope.contestData='';
	window.scrollTo(0, 0);
	var getContestData=function(){
            var deferred= $q.defer();
            if(!$scope.contestData){
                console.log("Inside contestData if part");
                $http.get('json/contest.json').then(
                    function(response) {
                        console.log("Contest response: ", response);
                        $scope.contestData=response.data.body;
                        for(var i=0;i<$scope.contestData.contest.length;i++){
                            if($scope.contestData.contest[i].pageId==$stateParams.pageId){
                                document.title ='DailyPanga Facebook Contest - Kabaddi Pro Quiz Game';
                                deferred.resolve($scope.contestData.contest[i]);
                                break;
                            }else{
                                if(i==$scope.contestData.contest.length-1){
                                    $state.go('web.home');
                                }  
                            }
                        }
                    },
                    function(error) {
                        console.log("Error: ", error);
                        deferred.reject();
                    }
                )
            }else{
                console.log("Inside contestData else part");
                for(var i=0;i<$scope.contestData.contest.length;i++){
                    if($scope.contestData.contest[i].pageId==$stateParams.pageId){
                        document.title ='DailyPanga Facebook Contest - Kabaddi Pro Quiz Game';
                        deferred.resolve($scope.contestData.contest[i]);
                        break;
                    }else{
                        if(i==$scope.contestData.contest.length-1){
                            $state.go('web.home');
                        }   
                    }
                }
            } 
            return deferred.promise;  
        }

        $scope.showPrevious=function(pageId){
        	/*console.log("Page ID: ",pageId);*/
        	var newPageId= pageId-1;
        	$state.go('web.contest',{'pageId':newPageId});
        }

        $scope.showNext=function(pageId){
        	/*console.log("Page ID: ",pageId);*/
        	var newPageId= pageId+1;
        	$state.go('web.contest',{'pageId':newPageId});
        }

        var showContestData=function(){
            getContestData().then(function(response){
                $scope.contestDetails=response;
                var pageUrl="http://www.prokabaddiquiz.com/daily-panga-facebook-kabaddi-contest/"+$scope.contestDetails.pageId;
                document.title=$scope.contestDetails.metaTitle;
                var meta=document.getElementsByTagName("meta");
                for (var i=0; i<meta.length; i++) {
                    if (meta[i].name.toLowerCase()=="description") {
                        meta[i].content=$scope.contestDetails.metaDescription;
                    }
                }
                $("meta[property='og:title']").attr('content', $scope.contestDetails.metaTitle);
	            $("meta[property='og:description']").attr('content', $scope.contestDetails.metaDescription);
                $("meta[property='og:url']").attr('content', pageUrl);
                $("meta[property='og:image ']").attr('content', $scope.contestDetails.picture);

            },function(error){
                $state.go('web.home');
            });
        }
		
        showContestData();

}])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('web',{
            url:'',
            templateUrl:'app.html',
            abstract:true,
            controller: 'WebsiteCtrl'
        })
        .state('web.home', {
            url: '/home',
            templateUrl: 'home.html'
        })
        .state('web.stories', {
            url: '/kabaddi-stories',
            templateUrl: 'kabaddi-stories.html',
            controller:function($scope){
                document.title='Kabaddi Stories - Know more about Kabaddi';
                var meta=document.getElementsByTagName("meta");
	            for (var i=0; i<meta.length; i++) {
	                if (meta[i].name.toLowerCase()=="description") {
	                    meta[i].content="Latest News on Kabaddi. Read breaking stories and opinion articles on Kabaddi";
	                }
	                $("meta[property='og:title']").attr('content', 'Kabaddi Stories - Know more about Kabaddi');
	                $("meta[property='og:description']").attr('content', 'Latest News on Kabaddi. Read breaking stories and opinion articles on Kabaddi');
	            }
                window.scrollTo(0, 0);

            }
        })
        .state('web.sitemap',{
            url:'/sitemap',
            templateUrl:'sitemap.html',
            controller:function($scope){
                document.title='Sitemap of ProKabaddiQuiz.com - HTML Version';
                window.scrollTo(0, 0);
            }
        })
        .state('web.standings',{
            url:'/pro-kabaddi-league-2017-season-5-standings',
            templateUrl:'standings.html',
            controller:function($scope){
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
            }
        })
        .state('web.schedule',{
            url:'/prokabaddi-2017-season-5-schedule',
            templateUrl:'schedule.html',
            controller:function($scope){
                document.title='Pro Kabaddi League 2017, Season 5 Official Schedule: PKL 5 Time Table & Venue Details';
                var meta=document.getElementsByTagName("meta");
	            for (var i=0; i<meta.length; i++) {
	                if (meta[i].name.toLowerCase()=="description") {
	                    meta[i].content="The official schedule of the Pro Kabaddi League 2017 Season 5 has been revealed.";
	                }
	                $("meta[property='og:title']").attr('content', 'Pro Kabaddi League 2017, Season 5 Official Schedule: PKL 5 Time Table & Venue Details');
	                $("meta[property='og:description']").attr('content', 'The official schedule of the Pro Kabaddi League 2017 Season 5 has been revealed.');
	            }
                window.scrollTo(0, 0);
            }
        })
        .state('web.rules',{
            url:'/prokabaddi-facebook-contest-rules',
            templateUrl:'rules.html',
            controller:function($scope){
                document.title='Kabaddi Pro Quiz Game - FB Contest Rules';
                var meta=document.getElementsByTagName("meta");
	            for (var i=0; i<meta.length; i++) {
	                if (meta[i].name.toLowerCase()=="description") {
	                    meta[i].content="Kabaddi Pro Quiz Game App is organising the contest for Kabaddi lovers and followers. Participate in the facebook contest and win exciting prizes.";
	                }
	                $("meta[property='og:title']").attr('content', 'Pro Kabaddi League 2017 Season 5 - Facebook Contest');
	                $("meta[property='og:description']").attr('content', 'Kabaddi Pro Quiz Game App is organising the contest for Kabaddi lovers and followers. Participate in the facebook contest and win exciting prizes.');
	            }
                window.scrollTo(0, 0);
            }
        })
		.state('web.contest',{
            url:'/daily-panga-facebook-kabaddi-contest/:pageId',
            templateUrl:'contest.html',
            controller:'ContestCtrl'
        })
        .state('web.privacy',{
            url:'/privacy-policy',
            templateUrl:'privacy.html',
            controller:function($scope){
                document.title='Terms & Privacy Policy - Kabaddi Pro Quiz Game';
                var meta=document.getElementsByTagName("meta");
                for (var i=0; i<meta.length; i++) {
                    if (meta[i].name.toLowerCase()=="description") {
                        meta[i].content="Terms and privacy policy for the website and Kabaddi Pro Quiz Game.";
                    }
                    $("meta[property='og:title']").attr('content', 'Terms & Privacy Policy - Kabaddi Pro Quiz Game');
                    $("meta[property='og:description']").attr('content', 'Terms and privacy policy for the website and Kabaddi Pro Quiz Game.');
                }
                window.scrollTo(0, 0);
            }
        })
        .state('web.poster',{
            url:'/simple-rules-of-kabaddi',
            templateUrl:'kabaddi-rules.html',
            controller:function($scope){
                document.title='Rules of Kabaddi - Kabaddi Pro Quiz Game';
                var meta=document.getElementsByTagName("meta");
                for (var i=0; i<meta.length; i++) {
                    if (meta[i].name.toLowerCase()=="description") {
                        meta[i].content="An article post illustrating the simple rules of Kabaddi in both Hindi and English version.";
                    }
                    $("meta[property='og:title']").attr('content', 'Rules of Kabaddi - Kabaddi Pro Quiz Game');
                    $("meta[property='og:description']").attr('content', 'An article post illustrating the simple rules of Kabaddi in both Hindi and English version.');
                }
                window.scrollTo(0, 0);
            }
        })
        .state('web.game',{
            url:'/app-game-rules',
            templateUrl:'game-rules.html',
            controller:function($scope){
                document.title='App Game Rules - Kabaddi Pro Quiz Game';
                var meta=document.getElementsByTagName("meta");
                for (var i=0; i<meta.length; i++) {
                    if (meta[i].name.toLowerCase()=="description") {
                        meta[i].content="The rules you have to follow to win Merchandise and gifts through playing the games in Kabaddi Pro Quiz Game app.";
                    }
                    $("meta[property='og:title']").attr('content', 'App Game Rules - Kabaddi Pro Quiz Game');
                    $("meta[property='og:description']").attr('content', 'The rules you have to follow to win Merchandise and gifts through playing the games in Kabaddi Pro Quiz Game app.');
                }
                window.scrollTo(0, 0);
            }
        })

        .state('web.download',{
            url:'/download',
            templateUrl:'download.html',
            controller:function($scope){
                document.title='Download - Kabaddi Pro Quiz Game';
                var meta=document.getElementsByTagName("meta");
                for (var i=0; i<meta.length; i++) {
                    if (meta[i].name.toLowerCase()=="description") {
                        meta[i].content="Kabaddi Pro Quiz Game is an unique Quiz Game app themed on Indian and foreign players playing for their franchisees in ProKabaddi. If you think you know Kabaddi and everything there is to know of leading raiders like Anup Kumar, Pardeep Narwal, Manjeet Chillar, Rahul Chaudhary - here is your chance to win some cool merchandise and money daily.";
                    }
                    $("meta[property='og:title']").attr('content', 'Download - Kabaddi Pro Quiz Game');
                    $("meta[property='og:description']").attr('content', 'Kabaddi Pro Quiz Game is an unique Quiz Game app themed on Indian and foreign players playing for their franchisees in ProKabaddi. If you think you know Kabaddi and everything there is to know of leading raiders like Anup Kumar, Pardeep Narwal, Manjeet Chillar, Rahul Chaudhary - here is your chance to win some cool merchandise and money daily.');
                }
                window.scrollTo(0, 0);
            }
        })
});