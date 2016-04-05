'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Problem schema
 */

var ProblemSchema = new Schema({
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
    content: {
        type: String,
        default: '',
        trim: true,
        required: 'Content cannot be blank'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    input: {
        type: String,
        default: '',
        trim: true,
        required: 'Content cannot be blank'
    },
    output: {
        type: String,
        default: '',
        trim: true,
        required: 'Content cannot be blank'
    },
    examples: [{
        output : {
            type: String,
            trim: true,
            required: 'Content cannot be blank'
        },
        input : {
            type: String,
            trim: true,
            required: 'Content cannot be blank'
        }}]
});

mongoose.model('Problem', ProblemSchema);