angular
    .module('app')
    .component('toggleSwitch',
        {
            bindings: {
                ngModel: '=',
                trueValue: '<',
                falseValue: '<'
            },
            templateUrl: 'Scripts/App/Components/toggleSwitch.html',
            controller: function () {
                var $ctrl = this;

                $ctrl.toggle = function () {
                    if (($ctrl.trueValue && _.isEqual($ctrl.trueValue, $ctrl.ngModel)) || (!$ctrl.trueValue && $ctrl.ngModel))
                        $ctrl.ngModel = $ctrl.falseValue || false;
                    else {
                        $ctrl.ngModel = $ctrl.trueValue || true;
                    }
                };
            }
        });