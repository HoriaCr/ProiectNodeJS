'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    problemEval = require('../judge.eval'),
    mongoose = require('mongoose'),
    Problem = mongoose.model('Problem'),
    Submission = mongoose.model('Submission'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 *  Create a problem
 */

exports.create = function (req, res) {
    var problem = new Problem(req.body);
    problem.user = req.user;
    problem.submissions = [];
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
 * Update a problem.
 */
exports.update = function (req, res) {
    var problem = req.problem;

    problem.title = req.body.title;
    problem.content = req.body.content;
    problem.input = req.body.input;
    problem.output = req.body.output;
    problem.examples = req.body.examples;
    problem.tests = req.body.tests;
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


/*
* List problem submissions.
*/

exports.listProblemSubmissions = function(req, res) {
    var problem = req.problem;
    res.json(problem.submissions.reverse());
};

exports.addSubmission = function(req, res) {
    var problem = req.problem;
    var user = req.user;
    var submission = new Submission(req.body);
    var ans = problemEval.evaluateProblem(problem, submission);
    if (ans[0] !== 'Compilation error') {
        submission.results = ans[1];
    } else {
        submission.results = [];
    }
    submission.evaluationStatus = ans[0];
    submission.user = user;
    submission.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(submission);
        }
    });
    problem.submissions.append(submission);
};

exports.readSubmission = function(req, res) {
    // convert mongoose document to JSON
    var submission = req.submission ? req.submission.toJSON() : {};

    res.json(submission);
};


/**
 * Problem middleware
 */
exports.submissionByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Submission is invalid'
        });
    }

    Problem.findById(id).populate('user').exec(function (err, submission) {
        if (err) {
            return next(err);
        } else if (!submission) {
            return res.status(404).send({
                message: 'No submission with that identifier has been found'
            });
        }
        req.submission = submission;
        next();
    });
};

exports.allSubmissions = function(req, res) {
    Problem.find().select(
        'title submissions').populate('user').exec(
        function(err, problems) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                // Map problem id to each submission and aggregate all
                var ans = problems.map(function(problem) {
                    problem.submissions = problem.submissions.map(function(s){
                        s._problemId = problem._id;
                        s.title = problem.title;
                        console.log(s);
                        return s;
                    });
                    return problem;
                }).reduce( function(total, problem) {
                    return total.concat( problem.submissions );
                }, []);
                res.json(ans);

            }
        }
    );
};
