app.service('workoutServ', function() {

        var selectedWorkout;

        return {
            getWorkout: function () {
                return selectedWorkout;
            },
            setWorkout: function(value) {
                selectedWorkout = value;
            }
        };

});

app.controller('workoutsCtrl', [ "$scope", "Auth", "$state", "$firebaseArray", "workoutServ",  function($scope, Auth, $state, $firebaseArray, workoutServ) {
    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
        if(firebaseUser) {

            var rootRef = firebase.database().ref('workouts');
            var query = rootRef.orderByChild('title');

            var workouts = $firebaseArray(query);
            workouts.$loaded().then(function(x) {
              $scope.workouts = workouts;

                $scope.deleteWorkout = function (id) {
                    rootRef.child(id).remove();
                };
            }).catch(function(error) {
              console.error("Error:", error);
            });


        } else { 
            $scope.loggedIn = false;
        }

        $scope.viewWorkout = function(id) {
            workoutServ.setWorkout(id);
            $state.go('workout');
        }
    }); 

}]);


app.controller('workoutCtrl', [ "$scope", "Auth", "$state", "$firebaseObject", "$firebaseArray", "workoutServ",  function($scope, Auth, $state, $firebaseObject, $firebaseArray, workoutServ) {
    $scope.auth = Auth;
    console.log();
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
        if(firebaseUser) {
            $scope.uid = Auth.$getAuth().uid;
            var wid = workoutServ.getWorkout();
            if(!wid) {
                $state.go('workouts');
            }
            var rootRef = firebase.database().ref('workouts/' + wid);
            var workout = $firebaseObject(rootRef);
            workout.$loaded().then(function(x) {
              $scope.workout = workout;
            }).catch(function(error) {
              console.error("Error:", error);
            });


            $scope.checkRegister = function() {
                var search = rootRef.child('registeredUsers').orderByChild('id').equalTo($scope.uid);
                var result = $firebaseArray(search)
                result.$loaded().then(function(x) {
                    if(result.length) {
                        $scope.registered = true;
                    } else {
                        $scope.registered = false;
                    }
                }).catch(function(error) {
                console.error("Error:", error);
                });
            };
            $scope.checkRegister();

            $scope.register = function (user) {

                var usersRef = rootRef.child('registeredUsers');
                var rUsers = $firebaseArray(usersRef);

                rUsers.$loaded().then(function(x) {
                    rUsers.$add({
                        id: user
                    });
                    $scope.checkRegister();
                }).catch(function(error) {
                console.error("Error:", error);
                });
            };

                $scope.unregister = function (user) {

                    /// Repeated Code
                var usersRef = rootRef.child('registeredUsers');
                var rUsers = $firebaseArray(usersRef);
                rUsers.$loaded().then(function(x) {

                    var search = rootRef.child('registeredUsers').orderByChild('id').equalTo($scope.uid);
                    var searchResult = $firebaseArray(search);
                    searchResult.$loaded().then(function(x) {

                        var key = searchResult[0].$id;
                        usersRef.child(key).remove();
                        $scope.checkRegister();

                    }).catch(function(error) {
                    console.error("Error:", error);
                    });

                }).catch(function(error) {
                console.error("Error:", error);
                });
            }; 


        } else { 
            $scope.loggedIn = false;
        }

        $scope.viewWorkout = function(id) {
            $state.go('workout');
        }
    }); 

}]);