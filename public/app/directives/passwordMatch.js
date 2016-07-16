(function () {
    angular
        .module('passalo')
        .directive('passwordMatch', passwordMatch);

    function passwordMatch() {
        return {
            require: 'ngModel',
            scope:{
                otherModelValue: '=passwordMatch'
            },
            link: function (scope, element, attribues, ngModel) {
                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue === scope.otherModelValue;
                };
                scope.$watch('otherModelValue', function () {
                    ngModel.$validate();
                });
            }
        };
    }
}());