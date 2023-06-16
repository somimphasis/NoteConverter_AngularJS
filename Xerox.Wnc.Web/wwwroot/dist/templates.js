angular.module("templates-main", ["Scripts/App/Components/alertBanner.html", "Scripts/App/Components/basicAlert.html", "Scripts/App/Components/featurePopover.html", "Scripts/App/Components/fileFormatModal.html", "Scripts/App/Components/generalAlert.html", "Scripts/App/Components/keypad.html", "Scripts/App/Components/privacyPolicy.html", "Scripts/App/Components/progressAlert.html", "Scripts/App/Components/progressBanner.html", "Scripts/App/Components/scanScreen.html", "Scripts/App/Components/spinBox.html", "Scripts/App/Components/toggleSwitch.html"]);

angular.module("Scripts/App/Components/alertBanner.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/alertBanner.html",
    "<div class=\"banner\">\n" +
    "    <table>\n" +
    "        <tr>\n" +
    "            <td style=\"width:100%;\">\n" +
    "                <div class=\"banner-text-container\">\n" +
    "                    <span class=\"banner-text\" xas-string=\"{{$ctrl.resolve.message}}\"></span>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <div class=\"banner-button-container\">\n" +
    "                    <button class=\"btn btn-medium btn-secondary-alert banner-button xrx-navigate_down\" ng-click=\"$ctrl.close()\"></button>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("Scripts/App/Components/basicAlert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/basicAlert.html",
    "<div class=\"alert-popup alert-background alert-opacity\" role=\"alertdialog\" aria-labelledby=\"myAlertPopupDialogTitle\" tabindex=\"-1\" style=\"display: block;\">\n" +
    "    <div class=\"alert-container\">\n" +
    "        <div class=\"alert-content\">\n" +
    "            <h3 ng-if=\"$ctrl.resolve.title\" class=\"alert-title\" xas-string=\"{{$ctrl.resolve.title}}\">{{$ctrl.resolve.title}}</h3>\n" +
    "            <p ng-if=\"$ctrl.resolve.body\">\n" +
    "                <span class=\"alert-additional-info\" xas-string=\"{{$ctrl.resolve.body}}\">{{$ctrl.resolve.body}}</span>\n" +
    "            </p>\n" +
    "            <div class=\"alert-button-container\">\n" +
    "                <button type=\"button\" class=\"btn btn-medium glyph-button btn-secondary-alert xrx-close\" xas-string=\"{{$ctrl.resolve.buttonText}}\" ng-click=\"$ctrl.close()\">{{$ctrl.resolve.buttonText}}</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("Scripts/App/Components/featurePopover.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/featurePopover.html",
    "<div class=\"popover\" id=\"{{$ctrl.feature.name}}\" style=\"visibility:hidden\" ng-style=\"{'visibility': $ctrl.show ? 'visible':'hidden'}\">\n" +
    "    <div class=\"contents\">\n" +
    "        <div class=\"popover-scroll-content\" ng-scrollable='{\"watchHeight\": true}'>\n" +
    "            <ul class=\"action-list button-group\">\n" +
    "                <li ng-repeat=\"option in ::$ctrl.feature.options track by option.value\">\n" +
    "\n" +
    "                    <button class=\"btn btn-medium btn-image\"\n" +
    "                            ng-tap-click=\"$ctrl.selectOption(option);\"\n" +
    "                            ng-class=\"::{'selected': option === $ctrl.feature.selectedOption,\n" +
    "                                             'disabled': option.disabled}\">\n" +
    "\n" +
    "                        <!-- Option icon -->\n" +
    "                        <div class=\"image-container\" ng-if=\"option.icon\">\n" +
    "                            <img class=\"image\" ng-src=\"Content/images/{{option.icon}}\">\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!-- Option text -->\n" +
    "                        <div class=\"text-container\">\n" +
    "                            <span class=\"left-text\" xas-string=\"{{option.title}}\"></span>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!-- Option glyph -->\n" +
    "                        <div class=\"glyph-container\" ng-if=\"option.glyph\">\n" +
    "                            &nbsp;&nbsp;<span ng-class=\"option.glyph\"></span>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </button>\n" +
    "\n" +
    "                </li>\n" +
    "                <li ng-if=\"$ctrl.feature.moreOptionsModal\">\n" +
    "\n" +
    "                    <button class=\"btn btn-medium btn-image\" ng-tap-click=\"$ctrl.openMoreOptionsModal();\">\n" +
    "                        <!-- More options icon -->\n" +
    "                        <div class=\"image-container\">\n" +
    "                            <img class=\"image\" ng-src=\"Content/Images/file_format_more_48.png\">\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!-- More options text -->\n" +
    "                        <div class=\"text-container\">\n" +
    "                            <span class=\"left-text\" xas-string=\"SDE_MORE\"></span>\n" +
    "                        </div>\n" +
    "                    </button>\n" +
    "\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <arrow>\n" +
    "        <div style=\"width:1px; height:25px;\"></div>\n" +
    "        <div style=\"width:1px; height:23px;margin-top:1px;\"></div>\n" +
    "        <div style=\"width:1px; height:21px;margin-top:2px;\"></div>\n" +
    "        <div style=\"width:1px; height:19px;margin-top:3px;\"></div>\n" +
    "        <div style=\"width:1px; height:17px;margin-top:4px;\"></div>\n" +
    "        <div style=\"width:1px; height:15px;margin-top:5px;\"></div>\n" +
    "        <div style=\"width:1px; height:13px;margin-top:6px;\"></div>\n" +
    "        <div style=\"width:1px; height:11px;margin-top:7px;\"></div>\n" +
    "        <div style=\"width:1px; height:9px;margin-top:8px;\"></div>\n" +
    "        <div style=\"width:1px; height:7px;margin-top:9px;\"></div>\n" +
    "        <div style=\"width:1px; height:5px;margin-top:10px;\"></div>\n" +
    "        <div style=\"width:1px; height:3px;margin-top:11px;\"></div>\n" +
    "        <div style=\"width:1px; height:1px;margin-top:12px;\"></div>\n" +
    "    </arrow>\n" +
    "</div>");
}]);

angular.module("Scripts/App/Components/fileFormatModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/fileFormatModal.html",
    "<div class=\"modal-body\" style=\"height: 500px;\">\n" +
    "    <div class=\"header\" action-bar>\n" +
    "        <div class=\"header-left\">\n" +
    "            <button class=\"btn btn-medium btn-glyph xrx-close\" ng-click=\"$ctrl.dismiss()\"></button>\n" +
    "        </div>\n" +
    "        <div class=\"header-right\">\n" +
    "            <button class=\"btn btn-medium btn-glyph-label xrx-OK\" xas-string=\"SDE_OK\" ng-click=\"$ctrl.ok()\"></button>\n" +
    "        </div>\n" +
    "        <div class=\"header-middle\">\n" +
    "            <div class=\"header-title-container\">\n" +
    "                <div class=\"header-title\" xas-string=\"SDE_FILE_FORMAT\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"file-format-modal-body\">\n" +
    "        <div class=\"grid-container\">\n" +
    "            <div class=\"grid-row\">\n" +
    "                <!-- sidebar -->\n" +
    "                <div class=\"column-10-12 column-5-c-13\">\n" +
    "                    <ul class=\"action-list\">\n" +
    "                        <li ng-repeat=\"option in $ctrl.feature.options track by option.value\">\n" +
    "                            <button class=\"btn btn-medium btn-image\"\n" +
    "                                    ng-click=\"$ctrl.selectOption(option)\"\n" +
    "                                    ng-class=\"::{'selected': option === $ctrl.feature.selectedOption,\n" +
    "                                                  'disabled': option.disabled}\">\n" +
    "                                <div class=\"image-container\">\n" +
    "                                    <img class=\"image\" ng-src=\"Content/Images/{{option.icon}}\">\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"text-container\">\n" +
    "                                    <span class=\"left-text\" xas-string=\"{{option.title}}\"></span>\n" +
    "                                </div>\n" +
    "                            </button>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <!-- options -->\n" +
    "                <div class=\"column-10-50 column-offset-10-1 column-5-c-49 column-offset-5-g-1\">\n" +
    "                    <div style=\"margin-bottom:10px\"\n" +
    "                         ng-if=\"$ctrl.feature.selectedOption.value == subFeature.enabledIf\"\n" +
    "                         ng-repeat=\"subFeature in $ctrl.feature.subFeatures track by subFeature.name\">\n" +
    "\n" +
    "                        <ul class=\"action-list\">\n" +
    "                            <li>\n" +
    "                                <button class=\"btn btn-medium\" style=\"text-align:left\">\n" +
    "                                    <span style=\"vertical-align:middle;\" xas-string=\"{{subFeature.title}}\"></span>\n" +
    "\n" +
    "                                    <!-- We'll make the assumption that for toggle type features false is the first option and true the second -->\n" +
    "                                    <toggle-switch ng-if=\"subFeature.type=='toggle'\" ng-model=\"subFeature.selectedOption\" style=\"float:right;\"\n" +
    "                                                   false-value=\"subFeature.options[0]\"\n" +
    "                                                   true-value=\"subFeature.options[1]\">\n" +
    "                                    </toggle-switch>\n" +
    "                                </button>\n" +
    "                            </li>\n" +
    "                            <li ng-if=\"subFeature.selectedOption.value == subSubFeature.enabledIf\"\n" +
    "                                ng-repeat=\"subSubFeature in subFeature.subFeatures track by subSubFeature.name\"\n" +
    "                                ng-click=\"$ctrl.openFeaturePopover(subSubFeature)\">\n" +
    "                                <button class=\"btn btn-medium\" style=\"text-align:left;\">\n" +
    "                                    <span xas-string=\"{{subSubFeature.title}}\"></span>\n" +
    "                                    <span class=\"pull-right\" xas-string=\"{{subSubFeature.selectedOption.title}}\"></span>\n" +
    "                                </button>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "\n" +
    "                        <!-- Description of the subfeature chosen option -->\n" +
    "                        <div ng-if=\"subFeature.selectedOption.desc\" style=\"font-size:18px;margin-left:10px;margin-top:5px\">\n" +
    "                            <span xas-string=\"{{subFeature.selectedOption.desc}}\"> </span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("Scripts/App/Components/generalAlert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/generalAlert.html",
    "<!-- Copyright © 2019 Xerox Corporation. All Rights Reserved. -->\n" +
    "\n" +
    "<div class=\"alert\">\n" +
    "\n" +
    "    <div class=\"alert-container\">\n" +
    "\n" +
    "        <div class=\"alert-content\">\n" +
    "\n" +
    "            <h3 class=\"alert-title\" xas-string=\"{{$ctrl.title}}\"></h3>\n" +
    "            <div class=\"alert-additional-info\" xas-string=\"{{$ctrl.additionalInfo}}\"></div>\n" +
    "            <div ng-if=\"$ctrl.additionalInfo2\" class=\"alert-additional-info\" xas-string=\"{{$ctrl.additionalInfo2}}\"></div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"alert-button-container\">\n" +
    "                <button type=\"button\" class=\"{{$ctrl.button1Classes}}\" xas-string=\"{{$ctrl.button1Text}}\" ng-click=\"$ctrl.button1()\" tabindex=\"-1\"></button>\n" +
    "                <button type=\"button\" class=\"{{$ctrl.button2Classes}}\"\n" +
    "                        ng-if=\"$ctrl.resolve.data.button2Callback!=null\" xas-string=\"{{$ctrl.button2Text}}\" ng-click=\"$ctrl.button2()\" tabindex=\"-1\"></button>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("Scripts/App/Components/keypad.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/keypad.html",
    "<div id=\"Keypad\" class=\"modal-body full-screen\">\n" +
    "    <div class=\"header\" action-bar>\n" +
    "        <div class=\"header-left\">\n" +
    "            <button class=\"btn btn-medium btn-glyph xrx-close\" ng-click=\"$ctrl.dismiss()\"></button>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"header-right\">\n" +
    "            <button class=\"btn btn-medium btn-glyph-label xrx-OK\" xas-string=\"SDE_OK\" ng-click=\"$ctrl.update()\"></button>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"header-middle\">\n" +
    "            <div class=\"header-title-container\">\n" +
    "                <div class=\"header-title\" xas-string=\"SDE_QUANTITY\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row padddingTop\">\n" +
    "        <div class=\"column-5-c-25 text-center\">\n" +
    "            <input id=\"valueBox\" name=\"result_EIP_DoNotShowEmbeddedKeyboard\" class=\"text-center keypadTextBox textField gray\" type=\"text\" maxlength=\"4\" ng-keypress=\"$ctrl.keypadPressed($event.target.value)\" ng-bind=\"$ctrl.value\" ng-model=\"$ctrl.value\">\n" +
    "        </div>\n" +
    "        <div class=\"column-5-c-38 text-center\" ng-scrollable use-transform=\"false\">\n" +
    "            <div class=\"row keypadRow\">\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(1)\" class=\"text-center btn normal gray text-large large edg one\">1</button>\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(2)\" class=\"text-center btn normal gray text-large large centr\">2</button>\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(3)\" class=\"text-center btn normal gray text-large large edg three\">3</button>\n" +
    "            </div>\n" +
    "            <div class=\"row keypadRow\">\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(4)\" class=\"text-center btn normal gray text-large large edg\">4</button>\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(5)\" class=\"text-center btn normal gray text-large large centr\">5</button>\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(6)\" class=\"text-center btn normal gray text-large large edg\">6</button>\n" +
    "            </div>\n" +
    "            <div class=\"row keypadRow\">\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(7)\" class=\"text-center btn normal gray text-large large edg\">7</button>\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(8)\" class=\"text-center btn normal gray text-large large centr\">8</button>\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(9)\" class=\"text-center btn normal gray text-large large edg\">9</button>\n" +
    "            </div>\n" +
    "            <div class=\"row keypadRow\">\n" +
    "                <button ng-tap-click=\"$ctrl.keypadPressed(0)\" class=\"text-center btn normal gray text-large large keypadZero\">0</button>\n" +
    "                <button ng-tap-click=\"$ctrl.clear()\" class=\"btn normal gray text-large large xrx-close_square\"></button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("Scripts/App/Components/privacyPolicy.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/privacyPolicy.html",
    "<!-- Copyright © 2020 Xerox Corporation. All Rights Reserved. Copyright protection claimed includes all forms and -->\n" +
    "<!-- matters of copyrightable material and information now allowed by statutory or judicial law or hereinafter granted, -->\n" +
    "<!-- including without limitation, material generated from the software programs which are displayed on the screen such -->\n" +
    "<!-- as icons, screen display looks, etc. -->\n" +
    "\n" +
    "<div class=\"modal-body full-screen\">\n" +
    "    <div class=\"header\" action-bar>\n" +
    "        <div class=\"header-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-medium btn-glyph xrx-close\" ng-click=\"$ctrl.dismiss()\"></button>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"header-middle\">\n" +
    "            <div class=\"header-title-container\">\n" +
    "                <div class=\"header-title\"><span xas-string=\"SDE_PRIVACY_STATEMENT\"></span><span ng-if=\"$ctrl.showVersion\" class=\"version\" xas-string=\"VERSION\"></span></div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"popup-content\">\n" +
    "        <div class=\"scroll-container\" style=\"overflow:hidden\" ng-scrollable='{\"autoHeight\": true, \"watchHeight\": true}'>\n" +
    "            <div class=\"privacy-policy-content\" ng-bind-html=\"$ctrl.privacyPolicy\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("Scripts/App/Components/progressAlert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/progressAlert.html",
    "<div class=\"alert-popup alert-background alert-opacity\" role=\"alertdialog\" aria-labelledby=\"myAlertPopupDialogTitle\" tabindex=\"-1\" style=\"display: block;\">\n" +
    "    <div class=\"alert-container\">\n" +
    "        <div class=\"alert-content\">\n" +
    "            <div class=\"progress-spinner\"></div>\n" +
    "            <h3 ng-if=\"$ctrl.resolve.title\" class=\"alert-title\" xas-string=\"{{$ctrl.resolve.title}}\">{{$ctrl.resolve.title}}</h3>\n" +
    "            <p ng-if=\"$ctrl.resolve.body\">\n" +
    "                <span class=\"alert-additional-info\" xas-string=\"{{$ctrl.resolve.body}}\">{{$ctrl.resolve.body}}</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("Scripts/App/Components/progressBanner.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/progressBanner.html",
    "<div class=\"banner\">\n" +
    "    <table>\n" +
    "        <tr>\n" +
    "            <td>\n" +
    "                <div class=\"banner-image-container\">\n" +
    "                    <img class=\"banner-image\" ng-src=\"{{$ctrl.complete ? 'Content/Images/ProgressBarCheck.png' : 'Content/Images/ProgressBarSpin.gif'}}\">\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td style=\"width:100%;\">\n" +
    "                <div class=\"banner-text-container\">\n" +
    "                    <span class=\"banner-text\" xas-string=\"{{$ctrl.status}}\"></span>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <div class=\"banner-button-container\">\n" +
    "                    <button class=\"btn btn-medium btn-secondary-alert banner-button xrx-navigate_down\" ng-click=\"$ctrl.close()\"></button>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("Scripts/App/Components/scanScreen.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/scanScreen.html",
    "<!-- Copyright © 2019 Xerox Corporation. All Rights Reserved. -->\n" +
    "<div class=\"loading-spinner\" id=\"spinnerIcon\" style=\"display:none\"></div>\n" +
    "\n" +
    "<privacy-dialog></privacy-dialog>\n" +
    "\n" +
    "<form name=\"$ctrl.mainForm\" id=\"$ctrl.mainForm\" class=\"scanScreen mainForm\">\n" +
    "    <div class=\"xrx-close\" style=\"max-width:0; max-height:0;\"></div> <!-- Preloads the glyph font -->\n" +
    "\n" +
    "    <div class=\"header themed\" action-bar>\n" +
    "\n" +
    "        <div class=\"header-right\">\n" +
    "            <!-- XBB-422 Look for undefined, null, or length < 1 -->\n" +
    "            <button type=\"button\" class=\"btn btn-medium btn-glyph-label xrx-scan\" ng-click=\"$ctrl.scan()\"\n" +
    "                    ng-disabled=\"!$ctrl.validationStatus\">\n" +
    "                <span xas-string=\"SDE_SCAN\"></span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"header-middle text-large\">\n" +
    "            <div class=\"header-title-container text-large\">\n" +
    "                <div class=\"header-title text-large\" xas-string=\"SDE_WRITTEN_NOTE_CONVERSION4\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <!-- Scroll container -->\n" +
    "    <div class=\"scroll-container\" style=\"position:relative;overflow:hidden;\" ng-scrollable='{\"autoHeight\": true, \"watchHeight\": true}'>\n" +
    "        <div class=\"grid-container\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <!-- Email Textbox-->\n" +
    "            <div class=\"grid-row themed\" ng-class=\"{'has-warning': $ctrl.hasError('email') }\">\n" +
    "                <div class=\"column-10-59 column-offset-10-2 column-5-g-61 column-offset-5-c-1\">\n" +
    "                    <text-field name=\"$ctrl.scanOptionsService.email\" placeholder=\"{{'SDE_ENTER_EMAIL_RECEIVE1' | translate}}\" type=\"email\" class=\"ad-themed\">\n" +
    "                        <input ng-blur=\"$ctrl.fieldBlur('email');\" type=\"email\" name=\"email\" class=\"form-control textField text-medium login\" xas-placeholder=\"SDE_ENTER_EMAIL_RECEIVE1\"\n" +
    "                               ng-model=\"$ctrl.scanOptionsService.email\" required ng-model-options=\"{allowInvalid: true}\" ng-change=\"$ctrl.fieldChange('email');\" tabindex=\"-1\">\n" +
    "                    </text-field>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"grid-row themed\" id=\"emailHasErrors\" style=\"display:none\">\n" +
    "                <div class=\"validation-error\" id=\"emailHasErrorRequired\">\n" +
    "                    <span class=\"xrx-glyph xrx-alert\"></span><span class=\"error-message\" xas-string=\"SDE_REQUIRED_FIELD1\"></span>\n" +
    "                </div>\n" +
    "                <div class=\"validation-error\" id=\"emailHasErrorNotValid\">\n" +
    "                    <span class=\"xrx-glyph xrx-alert\"></span><span class=\"error-message\" xas-string=\"SDE_EMAIL_NOT_VALID\"></span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- File Name-->\n" +
    "            <div class=\"grid-row themed themed-header\">\n" +
    "                <div class=\"column-10-50 column-offset-10-2 column-5-g-48 column-offset-5-c-1\">\n" +
    "                    <button type=\"button\" class=\"btn btn-medium subjectButton\" style=\"text-align:left;\" tabindex=\"-1\">\n" +
    "                        <editable-field id=\"scanOptionsServiceFileName\" placeholder=\"SDE_ENTER_FILE_NAME1\" name=\"$ctrl.scanOptionsService.fileName\" ng-disabled=\"$ctrl.scanService.isScanning\"\n" +
    "                                        defaultfilename=\"Xerox Scan\"\n" +
    "                                        typedfilename=\"{{$ctrl.scanOptionsService.fileName}}\"\n" +
    "                                        ext=\"{{$ctrl.scanOptionsService.fileFormat.selectedOption.value}}\"\n" +
    "                                        display-format=\"SDE_FMTSTR_DATE_TIMEFMTSTR\">\n" +
    "                        </editable-field>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"column-10-8 column-offset-10-1 column-5-c-12 column-offset-5-g-1\">\n" +
    "                    <button type=\"button\" class=\"btn btn-medium\"\n" +
    "                            ng-bind=\"$ctrl.scanOptionsService.fileFormat.selectedOption.title\"\n" +
    "                            ng-tap-click=\"$ctrl.openFeaturePopover($ctrl.scanOptionsService.fileFormat)\" ></button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- End of File Name-->\n" +
    "\n" +
    "            <div class=\"separator\"></div>\n" +
    "\n" +
    "            <!-- List of all the scan features/options  -->\n" +
    "            <div class=\"grid-row option-content\">\n" +
    "                <div class=\"column-10-59 column-offset-10-2 column-5-g-61 column-offset-5-c-1\">\n" +
    "\n" +
    "                    <ul class=\"action-list\">\n" +
    "                        <!--//XBB-168 - Present and Order by: 2-Sided Scanning, Resolution, Output Color, Original Orientation  -->\n" +
    "                        <li ng-repeat=\"feature in $ctrl.scanOptionsService.scanFeatures track by feature.name\"\n" +
    "                            ng-class-odd=\"'featureOddRow'\" ng-class-even=\"'featureEvenRow'\">\n" +
    "\n" +
    "                            <button type=\"button\" class=\"btn btn-medium btn-image\" ng-tap-click=\"$ctrl.openFeaturePopover(feature)\" tabindex=\"-1\">\n" +
    "                                <div class=\"image-container rounded\">\n" +
    "                                    <img class=\"image\" ng-src=\"Content/Images/{{feature.icon}}\">\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"text-container\">\n" +
    "                                    <span class=\"left-text\" xas-string=\"{{feature.title}}\"></span>\n" +
    "                                    <span ng-if=\"feature.name=='originalSize'\" class=\"glyph-container wnc-app\">\n" +
    "                                        <span ng-class=\"feature.selectedOption.glyph\"></span>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"right-text\" xas-string=\"{{feature.selectedOption.title}}\"></span>\n" +
    "                                </div>\n" +
    "                            </button>\n" +
    "\n" +
    "                        </li>\n" +
    "\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Reset button-->\n" +
    "            <div class=\"grid-row footer\">\n" +
    "                <div class=\"grid-row\">\n" +
    "                    <div class=\"column-10-29 column-offset-10-2 column-5-g-30 column-offset-5-c-1\">\n" +
    "                        <button type=\"button\" class=\"btn btn-medium\" ng-tap-click=\"$ctrl.resetSettings(true)\" tabindex=\"-1\" type=\"button\">\n" +
    "                            <span xas-string=\"SDE_RESET\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                    <div class=\"column-10-29 column-offset-10-1 column-5-g-30 column-offset-5-g-1\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary btn-medium\" ng-click=\"$ctrl.openPrivacy()\" xas-string=\"SDE_PRIVACY_STATEMENT\"></button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("Scripts/App/Components/spinBox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/spinBox.html",
    "<div class=\"alignSpinbox\">\n" +
    "    <div class=\"xrx-spinbox\" style=\"margin:0px\">\n" +
    "        <div style=\"display:inline-block;\">\n" +
    "            <input type=\"text\" numbers-only class=\"xrx-spinbox-button option-text\" ng-focus=\"$ctrl.inputFocused=true\" ng-blur=\"$ctrl.inputFocused=false\" ng-class=\"{'xrx-spinbox-first-button': $ctrl.interactive}\" ng-model=\"$ctrl.ngModel\" maxlength=\"4\" ng-trim=\"false\" disabled>\n" +
    "        </div><div class=\"xrx-spinbox-button-container\" ng-mousedown=\"$ctrl.mouseDown(-1)\" ng-mouseup=\"$ctrl.mouseUp()\" ng-mouseleave=\"$ctrl.mouseUp()\" ng-disabled=\"$ctrl.ngModel == $ctrl.min\">\n" +
    "            <button class=\"xrx-spinbox-button xrx-spinbox-border\" ng-class=\"{'xrx-spinbox-first-button': !$ctrl.interactive && !$ctrl.inputFocused}\" ng-click=\"$event.stopPropagation();\">\n" +
    "                <span class=\"xrx-glyphicon xrx-minus\"></span>\n" +
    "            </button>\n" +
    "        </div><div class=\"xrx-spinbox-button-container\" ng-mousedown=\"$ctrl.mouseDown(1)\" ng-mouseup=\"$ctrl.mouseUp()\" ng-mouseleave=\"$ctrl.mouseUp()\" ng-disabled=\"$ctrl.ngModel == $ctrl.max\">\n" +
    "            <button class=\"xrx-spinbox-button xrx-spinbox-last-button\" ng-click=\"$event.stopPropagation();\">\n" +
    "                <span class=\"xrx-glyphicon xrx-plus\"></span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("Scripts/App/Components/toggleSwitch.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("Scripts/App/Components/toggleSwitch.html",
    "<div class=\"xrxToggleSwitch\" ng-tap-click=\"$ctrl.toggle(); $event.stopPropagation();\">\n" +
    "    <span class=\"xrxOn\"></span>\n" +
    "    <span class=\"xrxOff\"></span>\n" +
    "    <span draggable class=\"xrxSwitch\">\n" +
    "        <span class=\"line\"></span>\n" +
    "        <span class=\"line\"></span>\n" +
    "        <span class=\"line\"></span>\n" +
    "    </span>\n" +
    "</div>");
}]);
