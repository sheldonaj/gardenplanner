'use strict';

angular.module('gardens').controller('GardensController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Gardens',
	function($scope, $stateParams, $location, $http, Authentication, Gardens) {
		$scope.authentication = Authentication;
		
		$http.get('plants/').success(function(data) {
      		$scope.plants = data;
    	});


		var emptysquare = '/modules/gardens/img/empty.jpg';
		$scope.onlyIntegers = /^\-?\d+$/;
		
		$scope.garden = {width:1, length:1, rows:[]};
		var gardenSquare = {id:1, plant:emptysquare};
		var squares = [];
		squares[0] = gardenSquare;
		$scope.garden.rows[0] = squares;

    	$scope.resize = function() {
    		if(!$scope.garden.length || !$scope.garden.width || $scope.garden.length <= 0 && $scope.garden.width <= 0)
    		{
    			return;
    		}
    		var oldGarden = $scope.garden.rows;
    		var count = 0;
    		$scope.garden.rows = [];
        	for (var i = 0; i < $scope.garden.length; i++) {
				var squares = [];
				for (var j = 0; j < $scope.garden.width; j++) {
					count++;
					var gardenSquare = {id:(count), plant:emptysquare};
					if(oldGarden[i])
					{
						if(oldGarden[i][j])
						{
							gardenSquare.plant = oldGarden[i][j].plant;
						}
					}
					squares[j] = gardenSquare; 
				}
				$scope.garden.rows[i] = squares;
			}
      	};

		$scope.create = function() {
			var garden = new Gardens({
				title: this.title,
				width: $scope.garden.width,
				length: $scope.garden.length,
				rows: $scope.garden.rows
			});
			garden.$save(function(response) {
				$location.path('gardens/' + response._id);

				$scope.title = '';
				$scope.garden.width = '';
				$scope.garden.length = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(garden) {
			if (garden) {
				garden.$remove();

				for (var i in $scope.gardens) {
					if ($scope.gardens[i] === garden) {
						$scope.gardens.splice(i, 1);
					}
				}
			} else {
				$scope.garden.$remove(function() {
					$location.path('gardens');
				});
			}
		};

		$scope.update = function() {
			var garden = $scope.garden;

			garden.$update(function() {
				$location.path('gardens/' + garden._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.gardens = Gardens.query();
		};

		$scope.findOne = function() {
			$scope.garden = Gardens.get({
				gardenId: $stateParams.gardenId
			});
		};

		$scope.dropped = function(dragPlant, dropId) {
			for (var i = 0; i < $scope.garden.length; i++) {
				for (var j = 0; j < $scope.garden.width; j++) {
					if($scope.garden.rows[i][j].id === dropId) {
						$scope.garden.rows[i][j].plant = dragPlant;
						return;
					}
				}
			}
		};

	}
]);
