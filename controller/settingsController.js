app.controller("settingsController", ["$scope", "CallServiceFactory", "$rootScope", function ($scope, CallServiceFactory, $rootScope) {


    $scope.SelectedArticle = null;
    log("settingsController loaded.", $rootScope.ENVIRONMENT.WebServiceURL);
    $scope.settings = null;

    let serviceURL = $rootScope.ENVIRONMENT.WebServiceURL + "config/5b47145574d6642da4c98361";


    CallServiceFactory.get("config/5b47145574d6642da4c98361", { token: $rootScope.USER.password })
        .then(function (data) {

            if (!data.IsSuccess) {
                app.ToatsErrorResponse(data)
            }
            else {


                $scope.settings = data.Data;
            }

        }).catch(function (err) {
            app.ToatsError("Token not valid. " + err, );
        });



    $scope.update = function () {
        CallServiceFactory.put("config/5b47145574d6642da4c98361", { token: $rootScope.USER.password, Data: $scope.settings  })
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