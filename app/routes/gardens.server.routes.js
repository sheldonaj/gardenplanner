'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	gardens = require('../../app/controllers/gardens.server.controller');

module.exports = function(app) {
	// Garden Routes
	app.route('/gardens')
		.get(gardens.list)
		.post(users.requiresLogin, gardens.create);

	app.route('/gardens/:gardenId')
		.get(gardens.read)
		.put(users.requiresLogin, gardens.hasAuthorization, gardens.update)
		.delete(users.requiresLogin, gardens.hasAuthorization, gardens.delete);

	app.route('/plants')
		.get(gardens.getPlants);

	// Finish by binding the garden middleware
	app.param('gardenId', gardens.gardenByID);
};