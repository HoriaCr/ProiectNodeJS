'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Problem = mongoose.model('Problem'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 *  Create a problem
 */


exports.create = function (req, res) {
    var problem = new Problem(req.body);
    problem.user = req.user;
    problem.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(problem);
        }

    });
};

exports.read = function (req, res) {
    // convert mongoose document to JSON
    var problem = req.problem ? req.problem.toJSON() : {};
    problem.isCurrentUserOwner = req.user && problem.user && problem.user._id.toString() === req.user._id.toString() ? true : false;

    res.json(problem);
};

exports.list = function (req, res) {

    Problem.find().sort('-created').select(
        'title user created').populate('user').exec(
        function(err, problems) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(problems);
            }

        });
};

/**
 * Update an article
 */
exports.update = function (req, res) {
    var problem = req.problem;

    problem.title = req.body.title;
    problem.content = req.body.content;
    problem.input = req.body.input;
    problem.output = req.body.output
    problem.example = req.body.example;
    problem.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(problem);
        }
    });
};

exports.delete = function(req, res) {
    var problem = req.problem;
    problem.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(problem);
        }
    });
};

/**
 * Problem middleware
 */
exports.problemByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Problem is invalid'
        });
    }

    Problem.findById(id).populate('user', 'displayName').exec(function (err, problem) {
        if (err) {
            return next(err);
        } else if (!problem) {
            return res.status(404).send({
                message: 'No problem with that identifier has been found'
            });
        }
        req.problem = problem;
        next();
    });
};
