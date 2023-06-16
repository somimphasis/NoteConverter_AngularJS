// Copyright © 2019 Xerox Corporation. All Rights Reserved.

angular
    .module('app')
    .directive("editableField", editableField);



function editableField($rootScope, $parse, $document, $timeout, strings) {
    //Credit to: https://stackoverflow.com/questions/20047489/how-to-define-a-function-inside-angular-js-directive
    //Credit to: https://jsfiddle.net/Mazzu/MHSk3/ -- better
    function link(scope, element, attrs) {

        scope.doGetCaretPosition = function (oField) {

            // Initialize
            var iCaretPos = 0;

            // IE Support
            if (document.selection) {

                // Set focus on the element
                oField.focus();

                // To get cursor position, get empty selection range
                var oSel = document.selection.createRange();

                // Move selection start to 0 position
                oSel.moveStart('character', -oField.value.length);

                // The caret position is selection length
                iCaretPos = oSel.text.length;
            }

            // Firefox support
            else if (oField.selectionStart || oField.selectionStart == '0')
                iCaretPos = oField.selectionStart;

            // Return results
            return (iCaretPos);
        };

        scope.getCursorPos = function ($event) {

            var myEl = $event.target;
            var cursorPosValscope = scope.doGetCaretPosition(myEl);
            scope.doSetCaretPosition(myEl, cursorPosValscope);
        };

        /*
        **  Sets the caret (cursor) position of the specified text field.
        **  Valid positions are 0-oField.length.
        */

        scope.doSetCaretPosition = function (oField, iCaretPos) {

            if (document.selection) {

                // Set focus on the element
                oField.focus();

                // Create empty selection range
                var oSel = document.selection.createRange();

                // Move selection start and end to 0 position
                oSel.moveStart('character', -oField.value.length);

                // Move selection start and end to desired position
                oSel.moveStart('character', iCaretPos - 1);
                oSel.moveEnd('character', iCaretPos);
                oSel.select();
            }

            // Firefox support
            else if (oField.selectionStart || oField.selectionStart == '0') {
                oField.selectionStart = iCaretPos;
                oField.selectionEnd = iCaretPos;
                oField.focus();
            }

        }

        scope.displayText = function () {
            if (scope.isPassword) {
                return scope.displayTextAsPassword();
            } else if (!scope.displayFormat) {
                return scope.displayTextWithoutFormat();
            } else {
                var text = strings[scope.displayFormat];
                if (!text) { return scope.displayTextWithoutFormat(); }
                text = text.replace('{0}', scope.name);
                text = text.replace('{1}', scope.ext);
                return text;
            }
        };

        scope.displayTextWithoutFormat = function () {
            if (!scope.ext) {
                return scope.name;
            } else {
                return scope.name + scope.ext;
            }
        };

        scope.displayTextAsPassword = function () {
            var text = scope.displayTextWithoutFormat();
            if (!text) { return null; }
            return "•".repeat(text.length);
        };

        scope.fieldType = function () {
            if (scope.isPassword) {
                return "password";
            } else {
                return "text";
            }
        };

        // When the container is clicked set the style to edit mode and add a listener for outside clicks to close the input
        element.closest("button").on("tap click focus", function (event) {

            element.find("input")[0].focus();
            scope.getCursorPos(event);  //XBB-190 and XBB-212  -- try to get rid of double click

            // If we're inside an active iscroll we'll ignore the click event and only respond to taps, since the iscroll will unhelpfully fire both
            if ($(event.target).parents('.wrapper').length > 0 && (event.type == 'click' || event.type == 'focus')) {

                event.stopPropagation();
                event.preventDefault();
                return;
            }

            //var target = $(event.target);
            //The Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
            //var elId = target.getBoundingClientRect();//target.iCaretPos;


            if (!event.isDefaultPrevented() && !scope.locked) {

                var alreadyEditing = scope.editing;

                // This puts the control into edit mode
                $timeout(function () {
                    scope.editing = true;
                    scope.updateCss(true);

                });

                // Give the input a little time to display before we try focusing/selecting it
                $timeout(function () {
                    element.find("input")[0].focus();

                    //XBB-190 -- see if this gets rid of full select
                    //Not sure why this was removed from Blackboard. There is a scan to
                    //audio ticket (MP3-266) that says this IS the desired behavior
                    if (!alreadyEditing)
                        element.find("input")[0].select();

                    scope.getCursorPos(event);  //XBB-190 and XBB-212                      
                }, 300);

                // Make sure we don't have more than one outside click handler
                $document.off('tap click', outsideClick);
                $document.on('tap click', outsideClick);
                element.find("input").off('blur', outsideClick);
                element.find("input").on('blur', outsideClick);

                // Make sure clicking this input doesn't trigger the outside click handler
                event.stopPropagation();
                event.preventDefault();


            }

        });

        //update color fields and button background
        scope.updateCss = function (edit) {
            if (edit) {
                //element.closest("button").css('background', 'white');
                element.find("input").css('box-shadow', 'none');
                element.find("span#_glyph").addClass('option-text');
                element.find("span#_subject").addClass('option-text');
            }
            else {
                // element.closest("button").css('background', '');
                element.find("span#_glyph").removeClass('option-text');
                element.find("span#_subject").removeClass('option-text');
            }
        }

        // When the user hits enter while editing the input set the field back to readonly mode
        scope.handleKeyEnter = function (key) {
            if (key.keyCode == 13) {

                document.activeElement.blur();
                $document.off('tap click', outsideClick);
                scope.editing = false;
                scope.updateCss(false);
                if (typeof EIP_CloseEmbeddedKeyboard == 'function') {
                    EIP_CloseEmbeddedKeyboard(); //dismiss device keyboard
                }

                //Fix for bug XBB-384
                event.stopPropagation();
                event.preventDefault();
                return;
            }

        }

        // Remove the event handler and set the input back to readonly mode
        var outsideClick = function () {
            window.scrollTo(0, -100);
            $('.scroll-container').scrollTop(0);
            $timeout(function () {
                $document.off('tap click', outsideClick);
                $(this).off('blur', outsideClick);
                scope.editing = false;
                scope.updateCss(false);
                if (typeof EIP_CloseEmbeddedKeyboard == 'function') {
                    EIP_CloseEmbeddedKeyboard(); //dismiss device keyboard
                }
            });
        }

        // Make sure the document event listener is removed when the component is destroyed
        element.on('$destroy', function () {
            $document.off('tap click', outsideClick);
            element.find("input").off('blur', outsideClick);
        });
    }

    //The link is a function in which other functions can be defined.  So this invokes link()
    return {

        link: link,
        restrict: 'E',
        scope: {
            name: '=',
            ext: '@',
            locked: '<',
            subject: '@',
            subjectlabel: '@',
            placeholder: '@',
            displayFormat: '@'
        },
        template:
            '<form name="filename">' +
            '<input type="{{fieldType()}}" name="flname" ng-show="editing"  xas-placeholder="{{placeholder}}" ng-readonly="!editing" maxlength="1000" class="editable-field-input option-text" ng-model="name" required ng-keydown="handleKeyEnter($event)" spellCheck="false" tabindex="-1">' +
            '<span id="_glyph" class="xrx-paperclip" style="line-height:100%" ng-if="!subject"></span>' +
            '<span id="_subject" class="emailSubject" xas-string="{{subjectlabel ? subjectlabel : \'SDE_SUBJECT3\'}}" ng-if="subject && !editing && name" style="vertical-align:middle"></span>' +
            '<span ng-hide="editing || name"  class="editable-field-label" xas-string="{{placeholder}}" style="font-weight: 100;"></span>' +
            '<span ng-hide="editing || !name" class="editable-field-label">' +
            '<span ng-bind="displayText()"></span>' +
            '</span>' +
            '</form>'

    }
}

