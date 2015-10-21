var statsApp = angular.module('statsApp', ['n3-line-chart']);

statsApp
    .service('urlService', function() {
        var apiBaseUrl = '/api'


        this.totalBaseUrl = apiBaseUrl + '/total';

        this.loadBaseUrl = apiBaseUrl + '/loads';
        this.loadUrl = this.loadBaseUrl + '/60';

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
                      var data = parseFn(resp.data);
                      deferred.resolve(data);
                    },
                   function(resp) { deferred.reject(resp); });
            return deferred.promise;
        };

       this.load = function() {
            var parseObject = function(data) {
                return data.map(function(element,i) {
                    var newel = {
                        date: parseInt(i-59),
                        avg: parseFloat(element.avg),
                        min: parseFloat(element.min),
                        max: parseFloat(element.max)
                    };
                    return newel;
                });
            };
            return getPromise(urlService.loadUrl, parseObject);
        };

        this.avgHourOfDay = function(callback) {
            var parseObject = function(data) {
                return data.map(function(element) {
                    return {
                        hod: parseInt(element.hod),
                        avg: parseFloat(element.avg)
                    };
                });
            };
            return getPromise(urlService.avgHourOfDayUrl, parseObject);
        };
        this.avg = function(callback) {
            var parseObject = function(data) {
                return data.avg;
            };
            return getPromise(urlService.avgUrl, parseObject);
        };

        this.total = function(callback) {
            var parseObject = function(data) {
                return data;
            };
            return getPromise(urlService.totalBaseUrl, parseObject);
        };

        this.avgDayOfWeek = function(callback) {
            var parseObject = function(data) {
                return data.map(function(element) {
                    return {
                        dow: parseInt(element.dow),
                        avg: parseFloat(element.avg)
                    };
                });
            };
            return getPromise(urlService.avgDayOfWeekUrl, parseObject);
        };

        this.avgDay = function(callback) {
            var parseObject = function(data) {
                return data.map(function(element) {
                    return {
                        date: new Date(element.date),
                        avg: parseFloat(element.avg)
                    };
               });
            };
            return getPromise(urlService.avgDayUrl, parseObject);
        };
    }])
    .service('loadOptionsService', function(){
        this.avgHourOfDay = {
               axes: {
                   x: { key: 'hod' }
               },
            margin: {
                left: 100
            },
               series: [
                   { y: 'avg', color: 'steelblue', thickness: '2px', label: 'Avg Watt per hour of day', type: "column" }
               ]
           };
        var daysOfWeek = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var dayOfWeek = function(number) {
            var i = parseInt(number);
            if (isNaN(i) || i < 0 || i > 6) return "";
            else return daysOfWeek[i];
        };
        this.avgDayOfWeek = {
           axes: {
                 x: { key: 'dow', type: 'linear', ticksFormatter: dayOfWeek }
               },
            margin: {
                left: 100
            },
           series: [
               { y: 'avg', color: 'steelblue', thickness: '2px', label: 'Avg Watt per day of week', type: "column" }
           ]
       };

        this.avgDay = {
            axes: {
                x: { key: 'date', type: 'date' }
            },
            margin: {
                left: 100
            },
            drawDots: false,
            tension: 1,
            lineMode: 'basis',
            series: [
                { y: 'avg', color: 'steelblue', thickness: '2px', label: 'Avg Watt per day' }
            ]
        };

        this.load = {
            axes: {
                x: { key: 'date', type: 'linear' }
            },
            margin: {
                left: 100
            },
            drawDots: false,
            tension: 1,
            lineMode: 'basis',
            series: [
                { y: 'avg', color: 'blue', thickness: '2px', label: 'Min Watt', tension: 1 },
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
        }])
    .controller('mainCtrl', ['loadDataService', '$scope', function(loadDataService, $scope) {
        $scope.totalAverage = 'loading...';
        $scope.totalConsumption = 'loading...';
        $scope.firstMeasure = 'loading...';
        $scope.yearConsumption = 'loading...';

        var convertConsumption = function(consumption) {
            var value = parseFloat(consumption);
            var unit = "Wh";
            if (isNaN(value)) value = 0.0;

            if (value >= 1000) {
                value = value/1000.0;
                unit = "kWh";
            }
            if (value >= 1000) {
                 value = value/1000.0;
                 unit = "MWh";
             }
             return value.toFixed(3) + " " + unit;
        }

        loadDataService.avg()
            .then(function(data) {
                $scope.totalAverage = data;
            });
        loadDataService.total()
            .then(function(data) {
                $scope.totalConsumption = convertConsumption(data.totalConsumption);
                $scope.yearConsumption = convertConsumption(data.yearConsumption);
                $scope.monthConsumption = convertConsumption(data.monthConsumption);
                $scope.weekConsumption = convertConsumption(data.weekConsumption);
                $scope.dayConsumption = convertConsumption(data.dayConsumption);
                $scope.firstMeasure = parseFloat(data.firstMeasure).toFixed(3);
            });
    }]);