app.controller("settingsController", ["$scope", "CallServiceFactory", "$rootScope", function ($scope, CallServiceFactory, $rootScope) {


    $scope.SelectedArticle = null;
    log("settingsController loaded.", $rootScope.ENVIRONMENT.WebServiceURL);
    $scope.settings = null;

    let serviceURL = $rootScope.ENVIRONMENT.WebServiceURL + "config/5b47145574d6642da4c98361";
    $scope.jobs = [];
    $scope.global = null;
    CallServiceFactory.get("config/5b47145574d6642da4c98361?token=" + $rootScope.USER.password)
        .then(function (data) {

            if (!data.IsSuccess) {
                app.ToatsErrorResponse(data)
            }
            else {
                $scope.fillJobs(data);
            }

        }).catch(function (err) {
            app.ToatsError("Token not valid. " + err, );
        });

    $scope.fillJobs = function (data) {
        $scope.jobs = [];
        $scope.global = data.Data;
        $scope.jobs.push(data.Data.WebHose);
        $scope.jobs.push(data.Data.GoogleRSS);
        $scope.jobs.push(data.Data.RssSources);
        $scope.jobs.push(data.Data.Mapping);
        $scope.jobs.push(data.Data.Translate);

        
    }

    $scope.update = function (job) {

        CallServiceFactory.put("config/5b47145574d6642da4c98361", { token: $rootScope.USER.password, Data: $scope.global })
            .then(function (data) {

                if (!data.IsSuccess) {
                    app.ToatsErrorResponse(data)
                }
                else {
                    app.ToatsSuccess("Update completed")
                    $scope.fillJobs(data);
                }

            }).catch(function (err) {
                app.ToatsError("Token not valid. " + err, );
            });
    }


    $scope.serviceStatus = function (job, term) {
        CallServiceFactory.post("config/serviceStatus", { token: $rootScope.USER.password, job:job, Term: term })
            .then(function (data) {

                if (!data.IsSuccess) {
                    app.ToatsErrorResponse(data)
                }
                else {

                    app.ToatsSuccess("Update completed")
                }

            }).catch(function (err) {
                app.ToatsError("Token not valid. " + err, );
            });
    }





}]);    