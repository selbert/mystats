var statsApp = angular.module('statsApp', ['n3-line-chart']);

statsApp
    .factory('urlService', function() {
        var service = {};
        var apiBaseUrl = '/api'

        service.avgUrl = apiBaseUrl + '/avg';
        service.avgHourOfDayUrl = service.avgUrl + '/hourOfDay';
        service.avgDayOfWeekUrl = service.avgUrl + '/dayOfWeek';
        service.avgDayUrl = service.avgUrl + '/day';

        return service;
    })
    .factory('loadDataService', ['urlService', '$http', function(urlService, $http){
        var service = {};
        var stringToDate = function(data) {
            data.forEach(function(entry) {
                if (entry.day) entry.day = new Date(entry.day);
            })
        }
        service.avg = function(callback) {
            $http.get(urlService.avgUrl)
                .then(function(resp) {
                    callback(null, resp.data);
                }, function(error) {
                    callback(error, null);
                });
        };

        service.avgHourOfDay = function(callback) {
            $http.get(urlService.avgHourOfDayUrl)
                .then(function(resp) {
                    callback(null, resp.data);
                },function(error) {
                    callback(error, null);
                });
        };

        service.avgDayOfWeek = function(callback) {
            $http.get(urlService.avgDayOfWeekUrl)
                .then(function(resp) {
                    callback(null, resp.data);
                },function(error) {
                    callback(error, null);
                });
        };

        service.avgDay = function(callback) {
            $http.get(urlService.avgDayUrl)
                .then(function(resp) {
                    stringToDate(resp.data);
                    callback(null, resp.data);
                },function(error) {
                    callback(error, null);
                });
        };

        return service;
    }])
    .factory('loadOptionsService', ['urlService', '$http', function(urlService, $http){
        var service = {};

        service.avgHourOfDay = {
               axes: {
                   x: {key: 'hod', type: 'linear'},
                   y: {type: 'linear'}
               },
               margin: {
                   left: 100
               },
               series: [
                   {y: 'avg', color: 'steelblue', thickness: '2px', label: 'Average Watt consumption per day'}
               ],
               lineMode: 'linear'
           };

        service.avgDayOfWeek = {
           axes: {
               x: {key: 'dow', type: 'linear', tick:1},
               y: {type: 'linear'}
           },
           margin: {
               left: 100
           },
           series: [
               {y: 'avg', color: 'steelblue', thickness: '2px', label: 'Average Watt consumption per day'}
           ],
           lineMode: 'columns'
       };

        service.avgDay = {
            axes: {
                x: {key: 'day', type: 'date'},
                y: {type: 'linear'}
            },
            margin: {
                left: 100
            },
            series: [
                {y: 'avg', color: 'steelblue', thickness: '2px', label: 'Average Watt consumption per day'}
            ],
            lineMode: 'linear'
        };

        return service;
    }])
    .controller('avgDayGraphCtrl', ['loadDataService', 'loadOptionsService', '$scope', function(loadDataService,loadOptionsService, $scope) {

        loadDataService.avgDay(function(err, data) {
            if (data) $scope.data = data;
        });

        $scope.options = loadOptionsService.avgDay;

    }])
    .controller('avgDayOfWeekGraphCtrl', ['loadDataService', 'loadOptionsService', '$scope', function(loadDataService,loadOptionsService, $scope) {

        loadDataService.avgDayOfWeek(function(err, data) {
            if (data) $scope.data = data;
        });

        $scope.options = loadOptionsService.avgDayOfWeek;

    }])
    .controller('avgHourOfDayGraphCtrl', ['loadDataService', 'loadOptionsService', '$scope', function(loadDataService,loadOptionsService, $scope) {

        loadDataService.avgHourOfDay(function(err, data) {
            if (data) $scope.data = data;
        });

        $scope.options = loadOptionsService.avgHourOfDay;

    }]);