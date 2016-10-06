/**
@fileOverview

@toc

todo
make work without rootscope, dat nasty
make modal a template
specify contents of alert, eg title and text
types, eg error, success, info, etc
attach callbacks to buttons
customise button text
make overlay clickable to close
make buttons goto a particular path? eg back to start of vehicle section

*/

'use strict';

angular.module('ngAlertGuy', [])
.factory('alertGuy', [ '$rootScope', function ( $rootScope ) {

	//public methods
	var self = {

		alert: function (opts) {
			$rootScope.alertGuy.toggle();
			$rootScope.alertGuy.opts = opts;
		}
	};

	return self;
}])
.directive('alertGuy', ['alertGuy', function (alertGuy) {
        return {
        	restrict: 'E',
       		template: '<section class="section-modal modal-alert" ng-show="alertGuy.show" ng-click="alertGuy.toggle()">' +
	'<div class="sub-overlay"><!-- --></div>' +
	'<div class="sub-inner mod-mid">' +
		'<header class="header-modal">' +
			'<div class="sub-controls">' +
				'<button class="btn btn-med btn-inline btn-back mod-light icon-close" ng-click="alertGuy.toggle()"></button>' +
			'</div>' +
		'</header>' +
		'<div class="container mod-mid">' +
			'<h1>{{alertGuy.opts.title}}</h1>' +
			'<div>{{alertGuy.opts.text}}</div>' +
			'<button class="btn btn-primary btn-text btn-inline">OK</button>' +
		'</div>' +
	'</div>' +
'</section>',
            link: function ($scope, elem, attrs) {

				$scope.alertGuy = {};
		    	$scope.alertGuy.show = false;
		    	$scope.alertGuy.toggle = function() {
		    		$scope.alertGuy.show = !$scope.alertGuy.show;
		    	}
            }
        };
    }]);
