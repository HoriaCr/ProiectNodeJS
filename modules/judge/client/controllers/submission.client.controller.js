(function () {
    'use strict';

    angular
        .module('judge')
        .controller('SubmissionController', SubmissionController);

    SubmissionController.$inject = ['$http', 'problem', 'submission'];

    function SubmissionController($http, problem, submission) {
        var vm = this;
        $http({
            method: 'GET',
            url: '/api/submissions/' + problem._id + '/' + submission._id
        }).then(function successCallback(res) {
            vm.submission = res;
        }, function errorCallback(res) {
            vm.error = res.data.message;
        });
    }
})();
