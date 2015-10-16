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

        service.avgHourOfDay = {};

        service.avgDayOfWeek = {};

        service.avgDay = {
            axes: {
                x: {key: 'day', type: 'date'},
                y: {type: 'linear', min: 0}
            },
            margin: {
                left: 100
            },
            series: [
                {y: 'avg', color: 'steelblue', thickness: '2px', type: 'area', striped: true, label: 'Average Watt consumption per day'}
            ],
            lineMode: 'linear'
        };

        return service;
    }])
    .controller('firstGraphCtrl', ['loadDataService', 'loadOptionsService', '$scope', function(loadDataService,loadOptionsService, $scope) {
        var graphs = {
            avgDay: {data: [], options: loadOptionsService.avgDay},
            avgHourOfDay: {data: [], options: loadOptionsService.avgHourOfDay},
            avgDayOfWeek: {data: [], options: loadOptionsService.avgDayOfWeek}
        };

        loadDataService.avgDay(function(err, data) {
            if (data)
                $scope.data = data;
        });
        $scope.options = loadOptionsService.avgDay;
        $scope.reloadData = loadData;

        var loadData = function(dataName) {
            loadDataService[dataName](function(err, data) {
                if (data) $scope.graphs[dataName].data = data;
            });
        }
    }]);