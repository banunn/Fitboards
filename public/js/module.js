'use strict';


var app = angular.module('hustle', ['ui.router', "firebase", "air-datePicker"]);

app.config(function(){
  var config = {
    apiKey: "AIzaSyAFCeqAYfxnj0WUmetMNtzOHAM3tP8ns7E",
    authDomain: "fitboards-68902.firebaseapp.com",
    databaseURL: "https://fitboards-68902.firebaseio.com",
    storageBucket: "fitboards-68902.appspot.com",
    messagingSenderId: "453112348314"
  };
  firebase.initializeApp(config);
})


  app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'js/templates/pages/login.html',
    controller: 'login',
    activeTab: "login"
  })
  .state('users', {
    url: '/users',
    templateUrl: 'js/templates/pages/users.html',
    controller: 'userCtrl',
    data : { 
      pageTitle: 'Users',
      pageUtility: 'View Users',
      activeTab: "users"
    },
  })
    .state('workouts', {
    url: '/workouts',
    templateUrl: 'js/templates/pages/workouts.html',
    controller: 'workoutsCtrl',
    data : { 
      pageTitle: 'Workouts',
      pageUtility: 'View Workouts',
      activeTab: "workouts"
    },
  })
    .state('workout', {
    url: '/workout',
    templateUrl: 'js/templates/pages/workout.html',
    controller: 'workoutCtrl',
    data : { 
      pageTitle: 'Workout',
      pageUtility: 'View Workout',
      activeTab: "workouts"
    },
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'js/templates/pages/profile.html',
    controller: 'profCtrl',
    data : { 
      pageTitle: 'Profile',
      pageUtility: 'Manage',
      activeTab: "users"
    },
  })
  .state('createWorkout', {
    url: '/create-workout',
    templateUrl: 'js/templates/pages/create-workout.html',
    controller: 'createWorkout',
    data : { 
      pageTitle: 'Workouts',
      pageUtility: 'Create',
      activeTab: "createWorkout"
    },
  })
  // configure html5 to get links working on jsfiddle
}); 

app.run([ '$rootScope', '$state', '$stateParams',
function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}])

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.controller('login', [ "$scope", "Auth", "$state", "$firebaseArray",  function($scope, Auth, $state, $firebaseArray) {

  $scope.auth = Auth;
  $scope.firebaseUser = null;
  $scope.error = null;
  $scope.formState = 'login';
  $scope.signIn = function(email, password) {
    Auth.$signInWithEmailAndPassword(email, password).then(function (firebaseUser) {
        $scope.email = $scope.pass = '';
        $state.go("users");
        
    }).catch(function(error) {
        $scope.error = error;
    });
  }

$scope.signOut = function() {
    Auth.$signOut().then(function() {
    // Sign-out successful.
    console.log('Successfully Signed Out');
    $scope.loggedIn = false;
    $scope.email = $scope.pass = '';
    }, function(error) {
      // An error happened.
      $scope.error = error;
      console.log(error);
    });
  }

  $scope.signUp = function(email, password) {
    Auth.$createUserWithEmailAndPassword(email, password).then(function (firebaseUser) {
        $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
        if(firebaseUser) {
            var usersRef = firebase.database().ref('users');
            var users = $firebaseArray(usersRef);
            var uid = Auth.$getAuth().uid;
            users.$add({
              uid: uid,
              fullName: $scope.fullName,
              email: $scope.email,
            }); 
            $scope.email = $scope.fullName = $scope.pass = '';
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
    });
        $state.go("users");
    }).catch(function(error) {
        $scope.error = error;
    });
  };
  
 

}]);


app.controller('navCtrl', [ "$scope", "Auth", "$state", "$firebaseArray",  function($scope, Auth, $state, $firebaseArray) {
    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
        if(firebaseUser) {
            $scope.loggedIn = true;
            var uid = Auth.$getAuth().uid;
            var rootRef = firebase.database().ref('users');
            var search = rootRef.orderByChild('uid').equalTo(uid);

            var user = $firebaseArray(search);
            user.$loaded().then(function(x) {
              $scope.UserName = user[0].fullName;
            }).catch(function(error) {
              console.error("Error:", error);
            });


        } else { 
            $scope.loggedIn = false;
        }
    }); 

    $scope.signOut = function() {
      Auth.$signOut().then(function() {
      // Sign-out successful.
      console.log('Successfully Signed Out');
      $state.go("login");
      }, function(error) {
        // An error happened.
        $scope.error = error;
        console.log(error);
      });
  }

}]);





app.controller('navCtrl', [ "$scope", "Auth", "$state", "$firebaseArray",  function($scope, Auth, $state, $firebaseArray) {
    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
        if(firebaseUser) {
            $scope.loggedIn = true;
            var uid = Auth.$getAuth().uid;
            var rootRef = firebase.database().ref('users');
            var search = rootRef.orderByChild('uid').equalTo(uid);

            var user = $firebaseArray(search);
            user.$loaded().then(function(x) {
              $scope.UserName = user[0].fullName;
            }).catch(function(error) {
              console.error("Error:", error);
            });


        } else { 
            $scope.loggedIn = false;
        }
    }); 

    $scope.signOut = function() {
      Auth.$signOut().then(function() {
      // Sign-out successful.
      console.log('Successfully Signed Out');
      $state.go("login");
      }, function(error) {
        // An error happened.
        $scope.error = error;
        console.log(error);
      });
  }

}]);