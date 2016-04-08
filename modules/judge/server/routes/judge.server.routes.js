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
        .delete(problems.delete);

    app.route('/api/problems/clone:problemId').all(problemsPolicy.isAllowed)
        .get(problems.read)
        .delete(problems.delete);
    // Finish by binding the problem middleware
    app.param('problemId', problems.problemByID);

};
