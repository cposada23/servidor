(function () {
    angular
        .module('passalo')
        .controller('profileModal',profileModal);
        profileModal.$inject = ['$uibModalInstance','$scope','user'];

        function profileModal($uibModalInstance, $scope, user) {
            $scope.user = user;
            $scope.helloMessage = "Hello, world!";

            $scope.cancel = function() {
                $uibModalInstance.close('hola');
            }

        }
}());