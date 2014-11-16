'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Garden Schema
 */
var GardenSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	width: {
		type: Number,
		default: '',
		required: 'Width cannot be blank',
		min: [1, 'Width ({VALUE}) is below the limit ({MIN}).']

	},
	length: {
		type: Number,
		default: '1',
		required: 'Length must be a postive, whole number'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	rows: {
		type: Object
	}
});

mongoose.model('Garden', GardenSchema);