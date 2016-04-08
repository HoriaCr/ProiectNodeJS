(function () {
  'use strict';

  angular
    .module('judge')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Problems',
      state: 'problems',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'problems', {
      title: 'List Problems',
      state: 'problems.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'problems', {
      title: 'Create Problem',
      state: 'problems.create',
      roles: ['user']
    });
  }
})();
