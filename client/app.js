var statsApp = angular.module('statsApp', ['n3-line-chart']);

statsApp
    .service('urlService', function() {
        var apiBaseUrl = '/api'


        this.loadBaseUrl = apiBaseUrl + '/loads';
        this.loadUrl = this.loadBaseUrl + '/25';

        this.avgUrl = apiBaseUrl + '/avg';
        this.avgHourOfDayUrl = this.avgUrl + '/hourOfDay';
        this.avgDayOfWeekUrl = this.avgUrl + '/dayOfWeek';
        this.avgDayUrl = this.avgUrl + '/day';
    })
    .service('loadDataService', ['urlService', '$http', '$q', function(urlService, $http, $q){

        var getPromise = function(url, parseFn) {
            var deferred = $q.defer();
            $http.get(url)
                .then(
                   function(resp) {
                      var data = resp.data.map(parseFn);
                      console.log(data);
                      deferred.resolve(data);
                    },
                   function(resp) { deferred.reject(resp); });
            return deferred.promise;
        };

       this.load = function() {
            var parseObject = function(element,i) {
                var newel = {
                    date: parseInt(i-25),
                    avg: parseFloat(element.avg),
                    min: parseFloat(element.min),
                    max: parseFloat(element.max)
                };
                return newel;
            };
            return getPromise(urlService.loadUrl, parseObject);
        };

        this.avgHourOfDay = function(callback) {
            var parseObject = function(element) {
                    return {
                        hod: parseInt(element.hod),
                        avg: parseFloat(element.avg)
                    }
                };
            return getPromise(urlService.avgHourOfDayUrl, parseObject);
        };
        this.avg = function(callback) {
            var parseObject = function(element) {
                    return element;
                };
            return getPromise(urlService.avgUrl, parseObject);
        };

        this.avgDayOfWeek = function(callback) {
            var parseObject = function(element) {
                    return {
                        dow: parseInt(element.dow),
                        avg: parseFloat(element.avg)
                    }
                };
            return getPromise(urlService.avgDayOfWeekUrl, parseObject);
        };

        this.avgDay = function(callback) {
            var parseObject = function(element) {
                    return {
                        date: new Date(element.date),
                        avg: parseFloat(element.avg)
                    }
                };
            return getPromise(urlService.avgDayUrl, parseObject);
        };
    }])
    .service('loadOptionsService', function(){
        this.avgHourOfDay = {
               axes: {
                   x: { key: 'hod' }
               },
               series: [
                   { y: 'avg', color: 'steelblue', thickness: '2px', label: 'Avg Watt per hour of day', type: "column" }
               ]
           };

        this.avgDayOfWeek = {
           axes: {
                 x: { key: 'dow', type: 'linear' }
               },
           series: [
               { y: 'avg', color: 'steelblue', thickness: '2px', label: 'Avg Watt per day of week', type: "column" }
           ]
       };

        this.avgDay = {
            axes: {
                x: { key: 'date', type: 'date' }
            },
            series: [
                { y: 'avg', color: 'steelblue', thickness: '2px', label: 'Avg Watt per day', type: "column" }
            ]
        };

        this.load = {
            axes: {
                x: { key: 'date', type: 'linear' }
            },
            series: [
                { y: 'avg', color: 'blue', thickness: '2px', label: 'Min Watt' },
                { y: 'max', color: 'red', thickness: '1px', label: 'Min Watt' },
                { y: 'min', color: 'green', thickness: '1px', label: 'Min Watt' }
            ]
        };
    })
    .controller('loadGraphCtrl', ['loadDataService', 'loadOptionsService', '$scope', function(loadDataService,loadOptionsService, $scope) {
            $scope.options = loadOptionsService.load;
            $scope.data = [];
            loadDataService.load()
                .then(function(data) {
                    $scope.data = data;
                });

        }])
    .controller('avgHourOfDayGraphCtrl', ['loadDataService', 'loadOptionsService', '$scope', function(loadDataService,loadOptionsService, $scope) {
           $scope.options = loadOptionsService.avgHourOfDay;
           $scope.data = [];
           loadDataService.avgHourOfDay()
                .then(function(data) {
                    if (data) $scope.data = data;
                 });


       }])
    .controller('avgDayGraphCtrl', ['loadDataService', 'loadOptionsService', '$scope', function(loadDataService,loadOptionsService, $scope) {
        $scope.options = loadOptionsService.avgDay;
        $scope.data = [];
        loadDataService.avgDay()
           .then(function(data) {
                if (data) $scope.data = data;
            });
    }])
    .controller('avgDayOfWeekGraphCtrl', ['loadDataService', 'loadOptionsService', '$scope', function(loadDataService,loadOptionsService, $scope) {
        $scope.options = loadOptionsService.avgDayOfWeek;
        $scope.data = [];
        loadDataService.avgDayOfWeek()
            .then(function(data) {
               if (data) $scope.data = data;
            });
        }]);