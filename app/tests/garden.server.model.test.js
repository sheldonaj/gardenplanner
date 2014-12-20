'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Garden = mongoose.model('Garden');

/**
 * Globals
 */
var user, garden;

/**
 * Unit tests
 */
describe('Garden Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			garden = new Garden({
				title: 'Garden Title',
				width: 1,
				length: 1, 
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return garden.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			garden.title = '';

			return garden.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save if width invalid', function(done) {
			garden.width = 0;

			return garden.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save if length invalid', function(done) {
			garden.length = 0;

			return garden.save(function(err) {
				should.exist(err);
				done();
			});
		});


	});

	afterEach(function(done) {
		Garden.remove().exec();
		User.remove().exec();
		done();
	});
});