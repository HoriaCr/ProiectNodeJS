(function () {
    'use strict';

    angular
        .module('judge')
        .controller('JudgeController', JudgeController);

    JudgeController.$inject = ['$scope', '$state', 'problemResolve', 'Authentication'];

    function JudgeController($scope, $state, problem, Authentication) {
        var vm = this;

        vm.problem = problem;
        if (!vm.problem.examples) {
            vm.problem.examples = [];
        }
        if (!vm.problem.tests) {
            vm.problem.tests = [];
        }
        vm.authentication = Authentication;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

        vm.addExample = addExample;
        vm.removeExample = removeExample;

        vm.addTest = addTest;
        vm.removeTest = removeTest;
        // Remove existing Problem
        function remove() {
            if (confirm('Are you sure you want to delete?')) {
                vm.problem.$remove($state.go('problems.list'));
            }
        }

        // Save Problem
        function save(isValid) {
            console.log('this is bad' + isValid);
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.problemForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.problem._id) {
                vm.problem.$update(successCallback, errorCallback);
            } else {
                vm.problem.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('problems.view', {
                    problemId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        // Add new example input
        function addExample() {
            console.log('Should add example');
            vm.problem.examples.push({
                input: "",
                output: ""
            });
            console.log('Should be here');
        }

        // Remove one example input
        function removeExample() {
            if (vm.problem.examples.length) {
                vm.problem.examples.pop();
            }
        }

        // Add new test input
        function addTest() {
            vm.problem.tests.push({
                input: "",
                output: ""
            });
        }

        // Remove one test input
        function removeTest() {
            if (vm.problem.tests.length) {
                vm.problem.tests.pop();
            }
        }
    }
})();
