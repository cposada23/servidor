(function () {
    angular
        .module("passalo")
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$rootScope','UserService', 'notificationService', 'usSpinnerService','$uibModal'];
    function loginCtrl($rootScope, UserService, notificationService ,usSpinnerService , $uibModal) {
        var vm = this;

        vm.loginData = {};
        vm.user = {};
        vm.logged = false;
        vm.login = function (provider) {
            usSpinnerService.spin('spinner-1');
            console.log("haciendo login");
            UserService.authenticate(provider);
        };

        vm.logOut = function () {
            console.log("loggin out");
            UserService.logOut();
        };

        vm.showProfile = function () {
            console.log("show profile");
            var modalInstance = $uibModal.open({
                templateUrl: '/public/app/modal/profile/profileModal.html',
                controller: 'profileModal',
                resolve: {
                    user: function () {
                        return vm.user;
                    }
                },

                backdrop: 'static'
            });

            modalInstance.result.then(function(data) {
                //resolved
                console.log('resolved' +data);
            }, function() {
                //rejected
                console.log("rejected");
            })
        };

        vm.closeProfile = function () {
            console.log("Close profile");

        };


        $rootScope.$on('userLoggedIn', function(){
            loadUserData();
            console.log("user logged in");
            usSpinnerService.stop('spinner-1');
            notificationService.success('Autenticado');
        });

        $rootScope.$on('userLoggedOut', function(){
            loadUserData();
            console.log("user loggedOut ");

        });

        $rootScope.$on('userFailedLogin', function () {
            console.log("failed login");
            notificationService.error('Error!!');
            usSpinnerService.stop('spinner-1');
        });

        // activate function on controller load,
        // so we can load stored token data
        activate();

        function activate() {
            console.log("se activo activate");
            loadUserData();
        }

        function loadUserData() {
            vm.user   = UserService.getUser();
            console.log("user: passalo " +  JSON.stringify(vm.user) );
            vm.logged = UserService.isAuthenticated();
            console.log("scppe.logged"+ vm.logged);
        }
    }
}());