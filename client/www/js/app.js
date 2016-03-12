// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('photon-client', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('mainController', function ($scope, $http, $ionicLoading) {

  $scope.username = 'USERNAME HERE';
  $scope.password = 'PASSWORD HERE';
  $scope.devices = [];

  $scope.callFunction = function (deviceId, functionName, argument) {
    var req = {
       method: 'POST',
       url: 'https://api.particle.io/v1/devices/' + deviceId + '/' + functionName,
       headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
       },
       data: 'arg=' + argument + '&access_token=' + $scope.accessToken
    }
    $http(req).then(function (response) {
      if(response.data.return_value === 1) {
        $ionicLoading.show({
          template: functionName + ' ' + argument + ' success',
          duration: '2000',
          noBackdrop: 'true'
        });
      } else {
        $ionicLoading.show({
          template: functionName + ' ' + argument + ' failure',
          duration: '2000'
        });
      }
    }, function (error) {
      $ionicLoading.show({
          template: functionName + ' ' + argument + ' failure',
          duration: '2000'
        });
    });
  };

  var getDevices = function () {
    var req = {
       method: 'GET',
       url: 'https://api.particle.io/v1/devices',
       headers: {
         'Authorization': 'Bearer ' + $scope.accessToken
       },
    }
    $http(req).then(function (response) {
      $scope.devices = response.data;
    }, function (error) {
      $ionicLoading.show({
        template: 'Failed to get devices',
        duration: '1000'
      });
    });
  };

  $scope.login = function () {
    var req = {
      method: 'POST',
      url: 'https://api.particle.io/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'grant_type=password&username=' + $scope.username + '&password=' + $scope.password + '&client_id=photon-motor-client-8916&client_secret=54f37c654c83ea68550bf0e72d2861134c232327'
    }
    $http(req).then(function (response) {
      $scope.accessToken = response.data.access_token;
      getDevices();
    }, function (error) {
      $ionicLoading.show({
        template: 'Failed to login',
        duration: '2000'
      });
    });
  }

})
