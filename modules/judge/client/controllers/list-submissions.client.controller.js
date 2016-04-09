(function () {
    'use strict';

    angular
        .module('judge')
        .controller('JudgeSubmissionListController', JudgeSubmissionListController);

    JudgeSubmissionListController.$inject = ['$http'];

    function JudgeSubmissionListController($http) {
        var vm = this;
        $http({
            method: 'GET',
            url: '/api/submissions'
        }).then(function successCallback(res) {
            vm.submission = res;
        }, function errorCallback(res) {
            vm.error = res.data.message;
        });
    }
})();
