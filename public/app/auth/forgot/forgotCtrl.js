(function () {
    angular
        .module('passalo')
        .controller('forgotCtrl',forgotCtrl);

    forgotCtrl.$inject = ['$http'];
    function forgotCtrl($http) {
        var vm = this;
        vm.user = {};
        vm.forgotPassword = function () {
            console.log("forgot pass");
            $http.post('/auth/forgot', vm.user).success(function (response) {
                vm.messages={
                    success:Array.isArray(response)?response:[response]
                }
            }).error(function (error) {
                vm.messages = {
                    error: Array.isArray(error)?error:[error]
                }
            });
        }
    }
}());