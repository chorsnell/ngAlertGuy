/**
 @fileOverview

 @toc

 todo
 make modal a template
 types, eg error, success, info, etc
 make buttons goto a particular path? eg back to start of vehicle section
 */

'use strict';

function AlertGuy(defaultOpts, $q, $sce, $translate) {
	var self = this;
	self.defaultOpts = defaultOpts;

	self.alert = function (opts) {
		self.toggle();
		self.title = opts.title;
		self.allowHtmlText = !!opts.allowHtmlText || self.defaultOpts.allowHtmlText;

		self.confirmButton = opts.confirmButton !== undefined?
			!!opts.confirmButton :
			self.defaultOpts.confirmButton;
		self.dismissButton = opts.dismissButton !== undefined?
			!!opts.dismissButton :
			self.defaultOpts.confirmButton;

		self.confirmText = opts.confirmText !== undefined?
			opts.confirmText :
			self.defaultOpts.confirmText;
		self.dismissText = opts.dismissText !== undefined?
			opts.dismissText :
			self.defaultOpts.dismissText;

		self.translateUI = opts.translateUI !== undefined?
			opts.translateUI :
			self.defaultOpts.translateUI;

		var allowHtmlText = self.allowHtmlText !== undefined?
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
			self.alertClass = 'mod-'+opts.alertClass;
			self.icon = '<div class="icon-huge icon-dialog-'+opts.alertClass+'"></div>';
		}
	};

	self.alertPromise = function (opts) {
		return $q(function(resolve, reject) {
			opts.confirmCallback = function() {
				resolve(self);
			};

			opts.dismissCallback = function() {
				reject('modalDismissed');
			};

			self.alert(opts);
		});
	};

	self.localizedAlert = function (opts) {
		var transKeys = [opts.title];
		if (opts.text) {
			transKeys.push(opts.text);
		}

		return $translate(transKeys).then(function (translations) {
			console.log(translations);
			opts.title = translations[opts.title];

			if(opts.text) {
				opts.text = translations[opts.text];
			}

			return self.alertPromise(opts);
		}).catch(function () {
			return self.alertPromise(opts);
		});
	};

	self.toggle = function () {
		self.show = !self.show;
	};

	self.confirm = function() {
		self.toggle();
		self.confirmCallback();
	};



	self.dismiss = function() {
		self.toggle();
		self.dismissCallback();
	};
}

angular.module('ngAlertGuy', ['ngSanitize', 'pascalprecht.translate'])
	.provider('alertGuy', function() {
		var provider = this;
		provider.defaultOpts = {
			confirmButton: true,
			dismissButton: false,
			confirmText: 'OK',
			dismissText: 'Cancel',
			allowHtmlText: false,
			translateUI: false,
			confirmCallback: function() {
				console.log('default confirm');
			},
			dismissCallback: function() {
				console.log('default dismiss');
			}
		};

		this.$get = ['$q', '$sce', '$translate', function ($q, $sce, $translate) {
			return new AlertGuy(provider.defaultOpts, $q, $sce, $translate);
		}];
	})
	.directive('alertGuy', ['alertGuy', function (alertGuy) {
		return {
			restrict: 'E',
			template:
			'<section class="section-modal modal-alert" ng-class="alertGuy.alertClass" ng-show="alertGuy.show">' +
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
