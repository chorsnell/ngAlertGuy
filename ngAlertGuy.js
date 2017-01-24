/**
 @fileOverview

 @toc

 todo
 make modal a template
 types, eg error, success, info, etc
 make buttons goto a particular path? eg back to start of vehicle section
 */

'use strict';

angular.module('ngAlertGuy', ['ngSanitize'])
	.service('alertGuy', ['$q', '$sce', function ($q, $sce) {

		//public methods
		var self = {
			alert: function (opts) {
				self.toggle();
				self.title = opts.title;
				self.allowHtmlText = !!opts.allowHtmlText;

				self.confirmButton = opts.confirmButton !== undefined? !!opts.confirmButton : true;
				self.dismissButton = opts.dismissButton !== undefined? !!opts.dismissButton : false;

				self.confirmText = opts.confirmText !== undefined? opts.confirmText : 'Ok';
				self.dismissText = opts.dismissText !== undefined? opts.dismissText : 'Cancel';

				if (self.allowHtmlText) {
					self.text = $sce.trustAsHtml(opts.text);
				} else {
					self.text = opts.text;
				}
				// optional
				if (opts.confirmCallback) {
					self.confirmCallback = opts.confirmCallback;
				}
				if (opts.dismissCallback) {
					self.dismissCallback = opts.dismissCallback;
				}
			},

			alertPromise: function (opts) {
				return $q(function(resolve, reject) {
					opts.confirmCallback = function() {
						resolve(self);
					};

					opts.dismissCallback = function() {
						reject('modalDismissed');
					};

					self.alert(opts);
				});
			},

			show: false,
			toggle: function () {
				self.show = !self.show;
			},
			title: '',
			text: '',

			confirm: function() {
				self.toggle();
				self.confirmCallback();
			},
			confirmButton: true,
			confirmText: 'Ok',
			confirmCallback: function() {
				console.log('default confirm');
			},

			dismiss: function() {
				self.toggle();
				self.dismissCallback();
			},
			dismissButton: false,
			dismissText: 'Cancel',
			dismissCallback: function() {
				console.log('default dismiss');
			}
		};

		return self;
	}])
	.directive('alertGuy', ['alertGuy', function (alertGuy) {
		return {
			restrict: 'E',
			template:
			'<section class="section-modal modal-alert" ng-show="alertGuy.show">' +
			'<div class="sub-overlay" ng-click="alertGuy.toggle()"><!-- --></div>' +
			'<div class="sub-inner mod-mid">' +
			'<header class="header-modal">' +
			'<div class="sub-controls">' +
			'<button class="btn btn-med btn-inline btn-back mod-light icon-close" ng-click="alertGuy.dismiss()"></button>' +
			'</div>' +
			'</header>' +
			'<div class="container mod-mid">' +
			'<h1>{{alertGuy.title}}</h1>' +
			'<div ng-if="alertGuy.allowHtmlText" ng-bind-html="alertGuy.text"></div>' +
			'<div ng-if="!alertGuy.allowHtmlText">{{alertGuy.text}}</div>' +

			'<br>' +
			'<button class="btn btn-primary btn-text btn-inline" ng-show="alertGuy.confirmButton" ng-click="alertGuy.confirm()">{{alertGuy.confirmText}}</button>' +
			'<button class="btn btn-primary btn-text btn-inline" ng-show="alertGuy.dismissButton" ng-click="alertGuy.dismiss()">{{alertGuy.dismissText}}</button>' +
			'</div>' +
			'</div>' +
			'</section>',
			link: function ($scope, elem, attrs) {

				$scope.alertGuy = alertGuy;
			}
		};
	}]);
