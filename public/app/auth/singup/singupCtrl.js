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


        function loadUserData() {
            vm.usuario   = UserService.getUser();
            console.log("user: passalo " +  JSON.stringify(vm.usuario) );

        }

        $rootScope.$on('userSingUp', function(){
            usSpinnerService.stop('singupsppiner');
            notificationService.success('Autenticado');
            console.log("user singup en sigup ");
        });

        $rootScope.$on('userFailedSingUp', function(){
            usSpinnerService.stop('singupsppiner');
            console.log("user singup");
            notificationService.error('Fallo el registro');

        });
    }
}());