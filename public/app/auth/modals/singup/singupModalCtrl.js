(function () {
    angular
        .module('passalo')
        .controller('singupModalCtrl',singupModalCtrl);

    singupModalCtrl.$inject = ['$rootScope','$scope','$uibModalInstance','UserService','usSpinnerService','notificationService'];
    function singupModalCtrl($rootScope, $scope,$uibModalInstance,UserService,usSpinnerService,notificationService) {
        $scope.singup = function () {
            usSpinnerService.spin('singupSpinner');
            UserService.signup($scope.user);
        };

        $scope.authenticate = function (provider) {
            usSpinnerService.spin('singupSpinner');
            UserService.socialSingup(provider);

        };

        $rootScope.$on('userSingUp', function(){
            usSpinnerService.stop('singupSpinner');
            $uibModalInstance.close('singup exitoso');
        });

        $rootScope.$on('userFailedSingUp', function(even, data){
            if(data.error){
                $scope.messages = {
                    error: Array.isArray(data.error)?data.error:[data.error]
                }
            }
            usSpinnerService.stop('singupSpinner');
            notificationService.error('Fallo el registro');
        });
    }
}());