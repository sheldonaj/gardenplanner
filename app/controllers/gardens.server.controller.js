'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Garden = mongoose.model('Garden'),
	_ = require('lodash');

/**
 * Create a garden
 */
exports.create = function(req, res) {
	var garden = new Garden(req.body);
	garden.user = req.user;

	garden.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(garden);
		}
	});
};

/**
 * Show the current garden
 */
exports.read = function(req, res) {
	res.json(req.garden);
};

/**
 * Update a garden
 */
exports.update = function(req, res) {
	var garden = req.garden;

	garden = _.extend(garden, req.body);

	garden.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(garden);
		}
	});
};

/**
 * Delete an garden
 */
exports.delete = function(req, res) {
	var garden = req.garden;

	garden.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(garden);
		}
	});
};

/**
 * List of Gardens
 */
exports.list = function(req, res) {
	Garden.find().sort('-created').populate('user', 'displayName').exec(function(err, gardens) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(gardens);
		}
	});
};

/**
 * Garden middleware
 */
exports.gardenByID = function(req, res, next, id) {
	Garden.findById(id).populate('user', 'displayName').exec(function(err, garden) {
		if (err) return next(err);
		if (!garden) return next(new Error('Failed to load garden ' + id));
		req.garden = garden;
		next();
	});
};

/**
 * Garden authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.garden.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

/**
 * Get Plants
 */
exports.getPlants = function(req, res) {
	var plants = require('../../app/plants/plants.json');
	res.send(plants);
};