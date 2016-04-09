'use strict';

/**
 * Module dependencies
 */
var problemsPolicy = require('../policies/judge.server.policy'),
    problems = require('../controllers/judge.server.controller');

module.exports = function (app) {
    // Problems collection routes
    app.route('/api/problems').all(problemsPolicy.isAllowed)
        .get(problems.list)
        .post(problems.create);

    // Single problem routes
    app.route('/api/problems/:problemId').all(problemsPolicy.isAllowed)
        .get(problems.read)
        .put(problems.update)
        .delete(problems.delete);

    app.route('/api/problems/clone:problemId').all(problemsPolicy.isAllowed)
        .get(problems.read)
        .delete(problems.delete);

    // Problem submission routes.
    app.route('/api/problems/submissions/:problemId').all(problemsPolicy.isAllowed)
        .get(problems.listProblemSubmissions)
        .post(problems.addSubmission);


    app.route('/api/problems/submissions:problemId/:submissionId').all(problemsPolicy.isAllowed)
        .get(problems.readSubmission);


    // Finish by binding the problem middleware
    app.param('problemId', problems.problemByID);

    app.param('submissionId', problems.submissionByID);
};
