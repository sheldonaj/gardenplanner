'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Garden = mongoose.model('Garden'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, garden;

/**
 * Garden routes tests
 */
describe('Garden CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new garden
		user.save(function() {
			garden = {
				title: 'Garden Title',
				width: 1,
				length: 1
			};

			done();
		});
	});

	it('should be able to save an garden if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new garden
				agent.post('/gardens')
					.send(garden)
					.expect(200)
					.end(function(gardenSaveErr, gardenSaveRes) {
						// Handle garden save error
						if (gardenSaveErr) done(gardenSaveErr);

						// Get a list of gardens
						agent.get('/gardens')
							.end(function(gardensGetErr, gardensGetRes) {
								// Handle garden save error
								if (gardensGetErr) done(gardensGetErr);

								// Get gardens list
								var gardens = gardensGetRes.body;

								// Set assertions
								(gardens[0].user._id).should.equal(userId);
								(gardens[0].title).should.match('Garden Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an garden if not logged in', function(done) {
		agent.post('/gardens')
			.send(garden)
			.expect(401)
			.end(function(gardenSaveErr, gardenSaveRes) {
				// Call the assertion callback
				done(gardenSaveErr);
			});
	});

	it('should not be able to save an garden if no title is provided', function(done) {
		// Invalidate title field
		garden.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new garden
				agent.post('/gardens')
					.send(garden)
					.expect(400)
					.end(function(gardenSaveErr, gardenSaveRes) {
						// Set message assertion
						(gardenSaveRes.body.message).should.match('Title cannot be blank');
						
						// Handle garden save error
						done(gardenSaveErr);
					});
			});
	});

	it('should be able to update an garden if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new garden
				agent.post('/gardens')
					.send(garden)
					.expect(200)
					.end(function(gardenSaveErr, gardenSaveRes) {
						// Handle garden save error
						if (gardenSaveErr) done(gardenSaveErr);

						// Update garden title
						garden.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing garden
						agent.put('/gardens/' + gardenSaveRes.body._id)
							.send(garden)
							.expect(200)
							.end(function(gardenUpdateErr, gardenUpdateRes) {
								// Handle garden update error
								if (gardenUpdateErr) done(gardenUpdateErr);

								// Set assertions
								(gardenUpdateRes.body._id).should.equal(gardenSaveRes.body._id);
								(gardenUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of gardens if not signed in', function(done) {
		// Create new garden model instance
		var gardenObj = new Garden(garden);

		// Save the garden
		gardenObj.save(function() {
			// Request gardens
			request(app).get('/gardens')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single garden if not signed in', function(done) {
		// Create new garden model instance
		var gardenObj = new Garden(garden);

		// Save the garden
		gardenObj.save(function() {
			request(app).get('/gardens/' + gardenObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', garden.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an garden if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new garden
				agent.post('/gardens')
					.send(garden)
					.expect(200)
					.end(function(gardenSaveErr, gardenSaveRes) {
						// Handle garden save error
						if (gardenSaveErr) done(gardenSaveErr);

						// Delete an existing garden
						agent.delete('/gardens/' + gardenSaveRes.body._id)
							.send(garden)
							.expect(200)
							.end(function(gardenDeleteErr, gardenDeleteRes) {
								// Handle garden error error
								if (gardenDeleteErr) done(gardenDeleteErr);

								// Set assertions
								(gardenDeleteRes.body._id).should.equal(gardenSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an garden if not signed in', function(done) {
		// Set garden user 
		garden.user = user;

		// Create new garden model instance
		var gardenObj = new Garden(garden);

		// Save the garden
		gardenObj.save(function() {
			// Try deleting garden
			request(app).delete('/gardens/' + gardenObj._id)
			.expect(401)
			.end(function(gardenDeleteErr, gardenDeleteRes) {
				// Set message assertion
				(gardenDeleteRes.body.message).should.match('User is not logged in');

				// Handle garden error error
				done(gardenDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Garden.remove().exec();
		done();
	});
});