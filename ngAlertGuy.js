/**
@fileOverview

@toc

todo
make modal a template
types, eg error, success, info, etc
make buttons goto a particular path? eg back to start of vehicle section
*/

'use strict';

angular.module('ngAlertGuy', [])
	.service('alertGuy', [function () {

		//public methods
		var self = {
			alert: function (opts) {
				self.toggle();
				self.title = opts.title;
				self.text = opts.text;
				// optional
				if (opts.confirmCallback) {
					self.confirmCallback = opts.confirmCallback;
				}
				if (opts.dismissCallback) {
					self.dismissCallback = opts.dismissCallback;
				}
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
				'<button class="btn btn-med btn-inline btn-back mod-light icon-close" ng-click="alertGuy.toggle()"></button>' +
			'</div>' +
		'</header>' +
		'<div class="container mod-mid">' +
			'<h1>{{alertGuy.title}}</h1>' +
			'<div>{{alertGuy.text}}</div>' +
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
