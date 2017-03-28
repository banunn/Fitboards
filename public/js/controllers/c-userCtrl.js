app.filter('ageFilter', function() {
     function calculateAge(birthday) { // birthday is a date
         var ageDifMs = Date.now() - birthday.getTime();
         var ageDate = new Date(ageDifMs); // miliseconds from epoch
         return Math.abs(ageDate.getUTCFullYear() - 1970);
     }

     return function(birthdate) { 
           return calculateAge(birthdate);
     }; 
});

app.service('userSrv', function() {

        var selectedUser;

        return {
            getUid: function () {
                return selectedUser;
            },
            setUid: function(value) {
                selectedUser = value;
            }
        };

});

app.controller('userCtrl', [ "$scope", "$firebaseArray", "Auth", "userSrv", function($scope, $firebaseArray, Auth, userSrv) {
        $scope.auth = Auth;
        $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
        if(firebaseUser) {
            $scope.loggedIn = true;
            var uid = Auth.$getAuth().uid;
            var rootRef = firebase.database().ref('users');
            var query = rootRef.orderByChild('fullName');

            var users = $firebaseArray(query);
            users.$loaded().then(function(x) {
              $scope.users = users;

            }).catch(function(error) {
              console.error("Error:", error);
            });

        } else { 
            $scope.loggedIn = false; 
        }
    }); 

    $scope.setUser = function(uid) {
        userSrv.setUid(uid);
    }


}]);


app.controller('profCtrl', [ "$scope", "$filter", "$state", "$firebaseArray",  "Auth", "userSrv", function($scope, $filter, $state , $firebaseArray, Auth, userSrv) {
        if(Auth) {
            $scope.loading = true;
            var id;
            var uid = userSrv.getUid();
            if(uid) {
                var rootRef = firebase.database().ref('users');
                var search = rootRef.orderByChild('uid').equalTo(uid);
                var user = $firebaseArray(search);
                
                user.$loaded().then(function(x) {
                   $scope.profile = user[0];
                   var age = new Date($scope.profile.birthday);
                   $scope.profile.age = $filter('ageFilter')(age);
                   id = $scope.profile.$id;

                $scope.loading = false;

                $scope.saveProfile = function() {
                    var date = $filter('date')($scope.profile.birthday, 'mediumDate');
                    var userRef = firebase.database().ref('users/' + id);
                    userRef.update({
                        email: $scope.profile.email,
                        fullName: $scope.profile.fullName || '',
                        phone: $scope.profile.phone || '',
                        username: $scope.profile.username || '',
                        phone: $scope.profile.phone || '',
                        birthday: date || Date.now(),
                        country: $scope.profile.country || "USA",
                        affiliate: $scope.profile.affiliate || "",
                        height: $scope.profile.height || "n/a",
                        weight: $scope.profile.weight || "n/a",
                        gender: $scope.profile.gender || "n/a",
                        age: $scope.profile.age || "n/a",
                        accountType: $scope.profile.accountType || "standard",
                        addressStreet: $scope.profile.addressStreet || "",
                        addressCity: $scope.profile.addressCity || "",
                        addressState: $scope.profile.addressState || "",
                        addressZip: $scope.profile.addressZip || ""
                    });
                 }

                $scope.profilePic = function () {
                    var file = document.getElementById('file').files[0],
                        r = new FileReader();
                    var storageRef = firebase.storage().ref('images/' + file.name);
                    var task = storageRef.put(file);
                    task.on('state_changed',
                        function progress(snapshot) {
                            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            $scope.uploadValue = percentage;
                        },
                        function error(err) {

                        },
                        function complete() {
                            var downloadURL = task.snapshot.downloadURL || snapshot.downloadURL;
                            var userRef = firebase.database().ref('users/' + id);
                            userRef.update({
                                profilePic: downloadURL
                            });
                        }
                    );
                }

                    $scope.profileCover = function () {
                    var file = document.getElementById('file2').files[0],
                        r = new FileReader();
                    var storageRef = firebase.storage().ref('images/' + file.name);
                    var task = storageRef.put(file);
                    task.on('state_changed',
                        function progress(snapshot) {
                            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            $scope.uploadValue = percentage;
                        },
                        function error(err) {

                        },
                        function complete() {
                            var downloadURL = task.snapshot.downloadURL || snapshot.downloadURL;
                            var userRef = firebase.database().ref('users/' + id);
                            userRef.update({
                                profileCover: downloadURL
                            });
                        }
                    );
                }
            
            // Get file 

            //var file = document.getElementById('file').files[0],

            // Create a storage ref

           //  var storageRef = firebase.storage.ref('images/' + file.name);

            // Upload File 

          //  var task = storageRef.put(file);

            // Update progress bar

           /* task.on('state_changed',
            
                function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    uploader.value = percentage;
                },

                function error(err) {
                    
                },

                function complete() {

                }

                );
            
            }); */

            }).catch(function(error) {
                
                console.error("Error:", error);
            });

           //     var userRef = firebase.database().ref('users' + $scope.$id);
           //     var users = $firebaseArray(usersRef);
            } else {
                $state.go('users');
            }


            // Save Profile Data 


        } else { 
            $scope.loggedIn = false;
        }

}]);

