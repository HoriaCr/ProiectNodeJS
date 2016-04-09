(function () {
  'use strict';

  angular
    .module('judge.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('problems', {
        abstract: true,
        url: '/problems',
        template: '<ui-view/>'
      })
      .state('problems.list', {
        url: '',
        templateUrl: 'modules/judge/client/views/list-problems.client.view.html',
        controller: 'JudgeListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Problems List'
        }
      })
      .state('problems.create', {
        url: '/create',
        templateUrl: 'modules/judge/client/views/form-problem.client.view.html',
        controller: 'JudgeController',
        controllerAs: 'vm',
        resolve: {
          problemResolve: newProblem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Problems Create'
        }
      })
      .state('problems.edit', {
        url: '/:problemId/edit',
        templateUrl: 'modules/judge/client/views/form-problem.client.view.html',
        controller: 'JudgeController',
        controllerAs: 'vm',
        resolve: {
          problemResolve: getProblem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Problem {{ problemResolve.title }}'
        }
      })
      .state('problems.view', {
        url: '/:problemId',
        templateUrl: 'modules/judge/client/views/view-problem.client.view.html',
        controller: 'JudgeController',
        controllerAs: 'vm',
        resolve: {
          problemResolve: getProblem
        },
        data:{
          pageTitle: 'Problem {{ problemResolve.title }}'
        }
      })
      .state('submissions',{
        url: '/submissions',
        templateUrl: 'modules/judge/client/views/list-submissions.client.view.html',
        controller: 'JudgeSubmissionListController',
        controllerAs: 'vm',
        data:{
          pageTitle: 'Submissions'
        }
    });
  }

  getProblem.$inject = ['$stateParams', 'JudgeService'];

  function getProblem($stateParams, JudgeService) {
    return JudgeService.get({
      problemId: $stateParams.problemId
    }).$promise;
  }

  newProblem.$inject = ['JudgeService'];

  function newProblem(JudgeService) {
    return new JudgeService();
  }
})();
