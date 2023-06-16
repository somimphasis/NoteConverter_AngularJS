// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .directive('xrxShowRemoteAlert', function ($rootScope, $parse, $document, $timeout, $window, $http, $uibModal) {
        function link(scope, element, attrs) {
            scope.buttonTitle = attrs.buttontitle;
            scope.modalUrl = attrs.modalurl;
            var alertHtml = '';
            var modalObj = null;
            function showModal() {
                $("#divPrivacyMessage").html(alertHtml);
                $("#mainForm,.mainForm").hide();
                $("#divPrivacyNotes").show();
            }

            function ctrlObj($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            function closeModal() {
                modalObj.close();
            }

            $http.get(scope.modalUrl).then(function (result) {
                if (result != null && result != undefined && result.data != null && result.data != undefined) {
                    var html = result.data;
                    if (html.replace(/\s/g, "").startsWith('<xrxShowRemoteAlertContent/>')) {
                        html = html.replace('<xrxShowRemoteAlertContent />', '')
                            .replace('<xrxShowRemoteAlertContent/>', '')
                            .replace('<xrxShowRemoteAlertContent/ >', '')
                            .replace('<xrxShowRemoteAlertContent / >', '');
                        alertHtml = html;
                        $(".xrxShowRemoteAlertClss").show();
                        $("#xrxShowRemoteAlertButton").click(function () {
                            showModal();
                        });
                    }
                }
            }).catch(function (s) {
            });
        }
        return {
            link: link,
            restrict: 'E',
            scope: {
                buttonTitle: '@',
                modalUrl: '@'
            },
            template: "<button class='btn btn-medium xrxShowRemoteAlertClss' id='xrxShowRemoteAlertButton' xas-string='{{buttonTitle}}' tabindex='-1' type='button'></button>"
        }
    });
