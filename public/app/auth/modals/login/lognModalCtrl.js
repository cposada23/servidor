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
            $uibModalInstance.close('cancelado el login');
        };

        $scope.cerrar = function () {
            $uibModalInstance.close('olvido contraseña');
        };

        $rootScope.$on('userLoggedIn', function(){
            usSpinnerService.stop('loginSpinner');
            $uibModalInstance.close('close modal');
        });



        $rootScope.$on('userFailedLogin', function (event , data) {

            if(data.error){
                $scope.messages = {
                    error: Array.isArray(data.error)?data.error:[data.error]
                }
            }
            notificationService.error('Error!!');
            usSpinnerService.stop('loginSpinner');
        });
    }
}());