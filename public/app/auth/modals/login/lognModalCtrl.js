(function () {
    angular
        .module('passalo')
        .controller('loginModalCtrl',loginModalCtrl);

    loginModalCtrl.$inject = ['$rootScope','$uibModalInstance','$scope', 'UserService','usSpinnerService', 'notificationService'];

    function loginModalCtrl($rootScope, $uibModalInstance, $scope, UserService, usSpinnerService, notificationService) {



        $scope.login = function () {
            console.log("doing login en modal ");
            usSpinnerService.spin('loginSpinner');
            UserService.login($scope.user);
        };

        $scope.authenticate = function (provider) {
            console.log("autenticate "+ provider);
            usSpinnerService.spin('loginSpinner');
            UserService.authenticate(provider);

        };

        $scope.cancel = function () {
            console.log("cancel");
            $uibModalInstance.close('cancelado el login');
        };

        $rootScope.$on('userLoggedIn', function(){
            usSpinnerService.stop('loginSpinner');
            notificationService.success('Autenticado on modal');
            $uibModalInstance.close('close modal');
        });



        $rootScope.$on('userFailedLogin', function () {
            console.log("failed login");
            notificationService.error('Error!!');
            usSpinnerService.stop('loginSpinner');
        });
    }
}());