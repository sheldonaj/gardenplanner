'use strict';

(function() {
	// Gardens Controller Spec
	describe('GardensController', function() {
		// Initialize global variables
		var GardensController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Gardens controller.
			GardensController = $controller('GardensController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one garden object fetched from XHR', inject(function(Gardens) {
			// Create sample garden using the Gardens service
			var sampleGarden = new Gardens({
				title: 'An Garden about MEAN',
				width: 1,
				length: 1
			});

			var samplePlants = [
				{
					"imageUrl":"/modules/gardens/img/empty.jpg",
					"name":"Empty"
				},
				{
					"imageUrl":"/modules/gardens/img/carrot.jpg",
					"name":"Carrot"
				},
				{
					"imageUrl":"/modules/gardens/img/tomato.jpg",
					"name":"Tomato"
				},
				{
					"imageUrl":"/modules/gardens/img/pepper.jpg",
					"name":"Pepper"
				}
			];

			// Create a sample gardens array that includes the new garden
			var sampleGardens = [sampleGarden];

			// Set GET response
			$httpBackend.expectGET('plants/').respond(samplePlants);
			$httpBackend.expectGET('gardens').respond(sampleGardens);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gardens).toEqualData(sampleGardens);
		}));

		it('$scope.findOne() should create an array with one garden object fetched from XHR using a gardenId URL parameter', inject(function(Gardens) {
			// Define a sample garden object
			var sampleGarden = new Gardens({
				title: 'An Garden about MEAN',
				width: 1,
				length: 1
			});

			var samplePlants = [
				{
					"imageUrl":"/modules/gardens/img/empty.jpg",
					"name":"Empty"
				},
				{
					"imageUrl":"/modules/gardens/img/carrot.jpg",
					"name":"Carrot"
				},
				{
					"imageUrl":"/modules/gardens/img/tomato.jpg",
					"name":"Tomato"
				},
				{
					"imageUrl":"/modules/gardens/img/pepper.jpg",
					"name":"Pepper"
				}
			];

			// Set the URL parameter
			$stateParams.gardenId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET('plants/').respond(samplePlants);
			$httpBackend.expectGET(/gardens\/([0-9a-fA-F]{24})$/).respond(sampleGarden);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.garden).toEqualData(sampleGarden);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Gardens) {
			// Create a sample garden object
			var sampleGardenPostData = new Gardens({
				title: 'An Garden about MEAN',
				width: 1,
				length: 1,
				rows:[[{"id":1,"plant":"/modules/gardens/img/empty.jpg"}]]
			});

			var samplePlants = [
				{
					"imageUrl":"/modules/gardens/img/empty.jpg",
					"name":"Empty"
				},
				{
					"imageUrl":"/modules/gardens/img/carrot.jpg",
					"name":"Carrot"
				},
				{
					"imageUrl":"/modules/gardens/img/tomato.jpg",
					"name":"Tomato"
				},
				{
					"imageUrl":"/modules/gardens/img/pepper.jpg",
					"name":"Pepper"
				}
			];

			// Create a sample garden response
			var sampleGardenResponse = new Gardens({
				_id: '525cf20451979dea2c000001',
				title: 'An Garden about MEAN',
				width: 1,
				length: 1,
				rows:[[{"id":1,"plant":"/modules/gardens/img/empty.jpg"}]]
			});

			// Fixture mock form input values
			scope.title = 'An Garden about MEAN';
			scope.width = 1;
			scope.length = 1;

			// Set POST response
			$httpBackend.expectGET('plants/').respond(samplePlants);
			$httpBackend.expectPOST('gardens', sampleGardenPostData).respond(sampleGardenResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.width).toEqual(1);
			expect(scope.length).toEqual(1);

			// Test URL redirection after the garden was created
			expect($location.path()).toBe('/gardens/' + sampleGardenResponse._id);
		}));

		it('$scope.update() should update a valid garden', inject(function(Gardens) {
			// Define a sample garden put data
			var sampleGardenPutData = new Gardens({
				_id: '525cf20451979dea2c000001',
				title: 'An Garden about MEAN',
				width: 1,
				length: 1
			});

			var samplePlants = [
				{
					"imageUrl":"/modules/gardens/img/empty.jpg",
					"name":"Empty"
				},
				{
					"imageUrl":"/modules/gardens/img/carrot.jpg",
					"name":"Carrot"
				},
				{
					"imageUrl":"/modules/gardens/img/tomato.jpg",
					"name":"Tomato"
				},
				{
					"imageUrl":"/modules/gardens/img/pepper.jpg",
					"name":"Pepper"
				}
			];

			// Mock garden in scope
			scope.garden = sampleGardenPutData;

			// Set PUT response
			$httpBackend.expectGET('plants/').respond(samplePlants);
			$httpBackend.expectPUT(/gardens\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gardens/' + sampleGardenPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gardenId and remove the garden from the scope', inject(function(Gardens) {
			// Create new garden object
			var sampleGarden = new Gardens({
				_id: '525a8422f6d0f87f0e407a33'
			});

			var samplePlants = [
				{
					"imageUrl":"/modules/gardens/img/empty.jpg",
					"name":"Empty"
				},
				{
					"imageUrl":"/modules/gardens/img/carrot.jpg",
					"name":"Carrot"
				},
				{
					"imageUrl":"/modules/gardens/img/tomato.jpg",
					"name":"Tomato"
				},
				{
					"imageUrl":"/modules/gardens/img/pepper.jpg",
					"name":"Pepper"
				}
			];

			// Create new gardens array and include the garden
			scope.gardens = [sampleGarden];

			// Set expected DELETE response
			$httpBackend.expectGET('plants/').respond(samplePlants);
			$httpBackend.expectDELETE(/gardens\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGarden);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gardens.length).toBe(0);
		}));
	});
}());