angular.module('Tackled', ["ngRoute"])
.controller('WebsiteCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
	console.log("Inside WebsiteCtrl");
	var quizData='';
	var quizDatalength=0;
	$scope.currentMCQ='';
	$scope.selectedChoice ='';
	$scope.questionNumber=1;
	$scope.enableButton=true;
	$scope.points=0;

	var getQuizData=function(){
		var deferred=$q.defer();
		$http.get('json/quiz.json').then(
            function(response) {
                /*console.log("get MCQ data response: ", response);*/
                deferred.resolve(response.data.body);
            },
            function(error) {
                /*console.log("Error: ", error)*/
                deferred.reject("error");
            }
        )
        return deferred.promise;
	}

	var showFirstQuestion=function(){
		quizDatalength=quizData.mcq.length;
		/*console.log("Quiz data length:", quizDatalength);*/
		$scope.currentMCQ=quizData.mcq[0];
		/*console.log("First Question Data:",$scope.currentMCQ);*/
	}

	var initializeAll=function(){
		console.log("Inside initialize method");
		getQuizData().then(function(response){
			quizData=response;
			showFirstQuestion();
		},function(error){
			/*console.log("return error:",error);*/
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
		/*console.log("Element Id:",event.target.attributes.id.value);*/
		var blockId=event.target.attributes.id.value;
		/*console.log("Selected Choice:",$scope.selectedChoice," and Answer:",$scope.currentMCQ.answer);*/
		if($scope.selectedChoice==$scope.currentMCQ.answer){
			/*console.log("Answeris correct");*/
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

.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })
    .when("/kabaddi-stories", {
        templateUrl : "kabaddi-stories.html"
    })
    .when("/prokabaddi-standings", {
        templateUrl : "standings.html"
    })
    .when("/sitemap", {
        templateUrl : "sitemap.html"
    });
    /*$locationProvider.html5Mode(true);*/
});
