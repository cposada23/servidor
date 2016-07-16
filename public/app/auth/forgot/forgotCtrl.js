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
                console.log("response " + JSON.stringify(response) );
            }).error(function (error) {
                console.log("Error " + JSON.stringify(error));
                vm.messages = {
                    error: Array.isArray(error)?error:[error]
                }
            })
        }
    }
}());