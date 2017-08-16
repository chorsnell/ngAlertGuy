/**
 @fileOverview

 @toc

 todo
 make modal a template
 types, eg error, success, info, etc
 make buttons goto a particular path? eg back to start of vehicle section
 */

'use strict';

// Optionals
var depTestModule = 'ngAlertGuy.injectionTester';
var optionalModules = ['pascalprecht.translate'];
var deps = ['ngSanitize'];

angular.module('ngAlertGuy.injectionTester', []);

angular.forEach(optionalModules, function (module) {
    try {
        //Check if optionalModule is available
        angular.module(depTestModule).requires.push(module);
        deps.push(module);
    } catch (e) {
        console.log("Warn: module " + module + " not found.");
    }
});

var translateLoaded = deps.indexOf('pascalprecht.translate') !== -1;

function AlertGuy(defaultOpts, $q, $sce, $translate) {
    var self = this;
    self.defaultOpts = defaultOpts;

    self.dismissCallback = self.defaultOpts.dismissCallback;

    self.alert = function (opts) {
        self.title = opts.title;
        self.allowHtmlText = !!opts.allowHtmlText || self.defaultOpts.allowHtmlText;

        self.confirmButton = opts.confirmButton !== undefined ?
            !!opts.confirmButton :
            self.defaultOpts.confirmButton;
        self.dismissButton = opts.dismissButton !== undefined ?
            !!opts.dismissButton :
            self.defaultOpts.confirmButton;

        self.confirmText = opts.confirmText !== undefined ?
            opts.confirmText :
            self.defaultOpts.confirmText;
        self.dismissText = opts.dismissText !== undefined ?
            opts.dismissText :
            self.defaultOpts.dismissText;

        self.translateUI = opts.translateUI !== undefined ?
            opts.translateUI :
            self.defaultOpts.translateUI;

        var allowHtmlText = self.allowHtmlText !== undefined ?
            self.allowHtmlText :
            self.defaultOpts.allowHtmlText;
        if (opts.text && allowHtmlText) {
            self.text = $sce.trustAsHtml(opts.text);
        } else {
            self.text = opts.text;
        }
        // optional
        if (opts.confirmCallback) {
            self.confirmCallback = opts.confirmCallback;
        } else {
            self.confirmCallback = self.defaultOpts.confirmCallback;
        }
        if (opts.dismissCallback) {
            self.dismissCallback = opts.dismissCallback;
        } else {
            self.dismissCallback = self.defaultOpts.dismissCallback;
        }
        if (opts.alertClass) {
            self.alertClass = 'mod-' + opts.alertClass;
            self.icon = '<div class="icon-huge icon-dialog-' + opts.alertClass + '"></div>';
        }

        // Never translate when ngTranslate is not used
        if (!translateLoaded) {
            opts.translateUI = false;
        }

        self.toggle();
    };

    self.alertPromise = function (opts) {
        return $q(function (resolve, reject) {
            opts.confirmCallback = function () {
                resolve(self);
            };

            opts.dismissCallback = function () {
                reject('modalDismissed');
            };

            self.alert(opts);
        });
    };

    self.localizedAlert = function (opts) {
        // Disable if no ngTranslate
        if (!translateLoaded) {
            return self.alertPromise(opts);
        }

        var transKeys = [opts.title];
        if (opts.text) {
            transKeys.push(opts.text);
        }

        return $translate(transKeys).then(function (translations) {
            console.log(translations);
            opts.title = translations[opts.title];

            if (opts.text) {
                opts.text = translations[opts.text];
            }

            return self.alertPromise(opts);
        }).catch(function (reason, maybeSelf) {
            if (reason === 'modalDismissed') {
                return $q.reject(reason, maybeSelf);
            }

            return self.alertPromise(opts);
        });
    };

    self.toggle = function () {
        if ((self.show && self.dismissCallback() !== false) || !self.show) {
            self.show = !self.show;
        }
    };

    self.confirm = function () {
        self.toggle();
        self.confirmCallback();
    };


    self.dismiss = function () {
        if (self.dismissCallback() !== false) {
            self.show = false;
        }
    };
}

angular.module('ngAlertGuy', deps)
    .provider('alertGuy', function () {
        var provider = this;
        provider.defaultOpts = {
            confirmButton: true,
            dismissButton: false,
            confirmText: 'OK',
            dismissText: 'Cancel',
            allowHtmlText: false,
            translateUI: false,
            confirmCallback: function () {
                console.log('default confirm');
            },
            dismissCallback: function () {
                console.log('default dismiss');
            }
        };

        this.$get = ['$q', '$sce', '$injector', function ($q, $sce, $injector) {
            var $translate = translateLoaded ? $injector.get('$translate') : null;

            return new AlertGuy(provider.defaultOpts, $q, $sce, $translate);
        }];
    })
    .directive('alertGuy', ['alertGuy', function (alertGuy) {
        return {
            restrict: 'E',
            template: '<section class="section-modal modal-alert" ng-class="alertGuy.alertClass" ng-if="alertGuy.show">' +
            '<div class="sub-overlay" ng-click="alertGuy.toggle()"><!-- --></div>' +
            '<div class="wrap-inner">' +
            '<div class="sub-inner mod-mid">' +
            '<header class="header-modal">' +
            '<div class="sub-controls">' +
            '<button class="btn btn-med btn-inline btn-back mod-light icon-close" ng-click="alertGuy.dismiss()"></button>' +
            '</div>' +
            '</header>' +
            '<div class="container mod-mid">' +
            '<div ng-bind-html="alertGuy.icon"></div>' +
            '<h1>{{alertGuy.title}}</h1>' +
            '<div ng-if="alertGuy.allowHtmlText" ng-bind-html="alertGuy.text"></div>' +
            '<div ng-if="!alertGuy.allowHtmlText">{{alertGuy.text}}</div>' +
            '<button ng-if="alertGuy.translateUI" class="btn btn-primary btn-text" ng-show="alertGuy.confirmButton" ng-click="alertGuy.confirm()">{{alertGuy.confirmText | translate}}</button>' +
            '<button ng-if="!alertGuy.translateUI" class="btn btn-primary btn-text" ng-show="alertGuy.confirmButton" ng-click="alertGuy.confirm()">{{alertGuy.confirmText}}</button>' +
            '<button ng-if="alertGuy.translateUI" class="btn btn-primary btn-link" ng-show="alertGuy.dismissButton" ng-click="alertGuy.dismiss()">{{alertGuy.dismissText | translate}}</button>' +
            '<button ng-if="!alertGuy.translateUI" class="btn btn-primary btn-link" ng-show="alertGuy.dismissButton" ng-click="alertGuy.dismiss()">{{alertGuy.dismissText}}</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</section>',
            link: function ($scope, elem, attrs) {
                $scope.alertGuy = alertGuy;
            }
        };
    }]);
