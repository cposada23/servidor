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
           console.log("reset password");
            console.log("token " + vm.user.token);
            $http.post('/auth/reset', vm.user).success(function (response) {
                console.log("succesas" + JSON.stringify(response));
                vm.messages={
                    success:Array.isArray(response)?response:[response]
                }
            }).error(function (error) {
                console.error(JSON.stringify(error));
                vm.messages = {
                    error: Array.isArray(error)?error:[error]
                }
            });
        };
    }
}());