app.controller('createWorkout', [ "$scope", "Auth", "$state", "$firebaseArray",  function($scope, Auth, $state, $firebaseArray) {

    //controller specific controls

$scope.workout = {};
$scope.workout.created = Date.now();
const clearMovement = [{ movement: '', reps: 0}];
const clearEquipment = [{ "item": ""}];
$scope.workout.movements = clearMovement;
$scope.workout.equipment = clearEquipment;

const movements = [
    "Pull-ups",
    "Push-ups",
    "Sit-ups",
    "Handstand Push-ups",
    "Lunges",
    "Squats",
    "Thrusters",
    "Clean & Jerk",
    "Push Press",
    "Push Jerk",
    "Overhead Squat",
    "Hang Clean",
    "Power Clean",
    "Snatch",
    "Wall Balls",
    "Burpees",
    "Box Jumps",
    "Muscle-ups",
    "Knees to Elbows",
    "Double Unders",
    "Kettlebell Swings",
    "Dumbbell Snatches"
]

const equipment = [
    "Olympic Barbell",
    "Bumper Plates",
    "Pull-Up Bar / Power Rack",
    "Jump Rope / Battle Rope",
    "Gymnastics Rings",
    "Kettlebells",
    "Plyometric Box / Squat Box",
    "Medicine Ball / Slam Ball",
    "Weight Bench", 
    "Glute Ham Developer"
];
$scope.equip = equipment;
$scope.mvmt = movements;

$scope.addMovement = function() {
    var item = {"movement": "", "reps": 0}
    $scope.workout.movements.push(item);
}

$scope.resetMovement = function() {
    $scope.workout.movements = [{ "movement": '', "reps": 0}];
}

$scope.addEquip = function() {
    var item = { "item": ""}
    $scope.workout.equipment.push(item);
}

$scope.resetEquip = function() {
    $scope.workout.equipment = [{ "item": ""}];
}



    // with firebase 
    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
        if(firebaseUser) {


    
        $scope.saveWorkout = function(workout) {
            var workoutRef = firebase.database().ref('workouts');
            var workout = $firebaseArray(workoutRef);

            workout.$add($scope.workout).then(function() {
                $state.go('workouts');
            }, function(error) {
            // An error happened.
            $scope.error = error;
            console.log(error);
            });
            }

        } else { 
            $scope.loggedIn = false;
        }
    }); 

}]);