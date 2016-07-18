(function () {
    angular
        .module('passalo')
        .controller('resetCtrl', resetCtrl);
    resetCtrl.$inject = ['$http','$stateParams'];
    function resetCtrl($http, $stateParams) {
        var vm = this;
        vm.user={
            token:  $stateParams.token
        };

        vm.resetPassword = function () {
            $http.post('/auth/reset', vm.user).success(function (response) {
                vm.messages={
                    success:Array.isArray(response)?response:[response]
                }
            }).error(function (error) {
                vm.messages = {
                    error: Array.isArray(error)?error:[error]
                }
            });
        };
    }
}());