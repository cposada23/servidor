(function () {
    angular
        .module("passalo")
        .controller("singupCtrl", singupCtrl);

    singupCtrl.$inject = ['$rootScope', 'UserService', 'usSpinnerService','notificationService','$state'];
    function singupCtrl($rootScope, UserService,usSpinnerService,notificationService, $state) {


        var vm = this;

        vm.signup = function () {
            usSpinnerService.spin('singupsppiner');
            UserService.signup(vm.user);
            console.log("doing singup");

        };

        $rootScope.$on('userSingUp', function(){
            usSpinnerService.stop('singupsppiner');
            notificationService.success('Autenticado');
        });

        $rootScope.$on('userFailedSingUp', function(){
            usSpinnerService.stop('singupsppiner');
            notificationService.error('Fallo el registro');

        });
    }
}());