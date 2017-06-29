angular.module('Tackled', ["ui.router"])
.controller('WebsiteCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
	console.log("Inside WebsiteCtrl");
	var quizData='';
	var quizDatalength=0;
	$scope.currentMCQ='';
	$scope.selectedChoice={
		response:''
	};
	$scope.questionNumber=1;
	$scope.enableButton=true;
	$scope.points=0;

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

	var showFirstQuestion=function(){
		quizDatalength=quizData.mcq.length;
		console.log("Quiz data length:", quizDatalength);
		$scope.currentMCQ=quizData.mcq[0];
		console.log("First Question Data:",$scope.currentMCQ);
	}

	var initializeAll=function(){
		console.log("Inside initialize method");
		getQuizData().then(function(response){
			quizData=response;
			showFirstQuestion();
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
        .state('web.schedule',{
            url:'/schedule',
            templateUrl:'schedule.html',
            controller:function($scope){
                document.title='Pro Kabaddi League 2017, Season 5 Official Schedule: PKL 5 Time Table & Venue Details';
                var meta=document.getElementsByTagName("meta");
	            for (var i=0; i<meta.length; i++) {
	                if (meta[i].name.toLowerCase()=="description") {
	                    meta[i].content="The official schedule of the Pro Kabaddi League 2017 Season 5 has been revealed.";
	                }
	            }
                window.scrollTo(0, 0);
            }
        })
});