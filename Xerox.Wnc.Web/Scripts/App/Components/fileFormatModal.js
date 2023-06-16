angular
    .module('app')
    .component('fileFormatModal',
        {
            templateUrl: 'Scripts/App/Components/fileFormatModal.html',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
            controller: function (modalService) {
                var $ctrl = this;

                $ctrl.$onInit = function () {
                    // Clone the feature so we aren't live editing the original                   
                    $ctrl.feature = _.cloneDeep($ctrl.resolve.data.feature);
                };

                $ctrl.selectOption = function (option) {
                    if (option.disabled) {
                        modalService.showAlertBanner(option.disabledMessage);
                    }
                    else {
                        $ctrl.feature.selectedOption = option;
                    }
                };

                $ctrl.ok = function () {
                    $ctrl.close({ $value: $ctrl.feature });
                };

                $ctrl.openFeaturePopover = function (feature) {
                    modalService.showPopover(feature, event);
                };
            }
        });