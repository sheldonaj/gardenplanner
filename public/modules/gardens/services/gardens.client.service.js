'use strict';

//Gardens service used for communicating with the gardens REST endpoints
angular.module('gardens').factory('Gardens', ['$resource',
	function($resource) {
		return $resource('gardens/:gardenId', {
			gardenId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);