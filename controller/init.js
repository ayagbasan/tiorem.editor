const app = angular.module("app", ["kendo.directives", "ngRoute"]);
const log = console.log.bind(console);


toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};


app.config(function ($routeProvider, $locationProvider) {
    $routeProvider

        .when("/webhose", {
            templateUrl: "pages/webhose.html",
            controller: "webhoseController",
            requireLogin: true

        })
        .when("/googleRSS", {
            templateUrl: "pages/googleRSS.html",
            controller: "googleRSSController",
            requireLogin: false

        })
        .when("/login", {

            controller: "loginController",
            requireLogin: false,
            redirectTo: function (routeParams) {
                window.location = '/login.html';
            }

        })
        .otherwise({
            redirectTo: function (routeParams) {
                window.location = '/login.html';
            }
        });

    $locationProvider.html5Mode(false);
});




app.controller("appController", ["$location", "$scope", "$rootScope", "CallServiceFactory", "$window",
    function ($location, $scope, $rootScope, CallServiceFactory, $window) {

        console.log("appController loaded");

        $rootScope.ENVIRONMENT = CurrentENV;
        $rootScope.USER = JSON.parse(localStorage.getItem("Account"));

        if (!$rootScope.USER)
            $window.location.href = '/login.html';
        else {

            CallServiceFactory.post("global/tokenCheck", { token: $rootScope.USER.password })
                .then(function (data) {

                    if (!data.IsSuccess) {
                        app.ToatsErrorResponse(data);
                        $window.location.href = '/login.html';
                    }
                    else {
                        $rootScope.USER.Logged = true;
                        localStorage.setItem("Account", JSON.stringify($rootScope.USER));
                        $scope.UserExist();
                    }

                }).catch(function (err) {
                    app.ToatsError("Token not valid. " + err, );
                });
        }



        $scope.UserExist = () => {

            log("Current user", $rootScope.USER);
        }

        $scope.signOut = () => {
            $rootScope.USER.Logged = false;
            $rootScope.USER.password = "";
            localStorage.setItem("Account", JSON.stringify($rootScope.USER));
        }



    }]);

app.controller("loginController", ["$location", "$scope", "$rootScope", "$window", "CallServiceFactory",
    function ($location, $scope, $rootScope, $window, CallServiceFactory) {

        log("loginController loaded.");
        $rootScope.ENVIRONMENT = CurrentENV;

        $scope.email = "ahmetyagibasan@gmail.com";
        $scope.password = "123456";
        $scope.Logged = false;
        $scope.ShowSignUpPanel = false;
        $rootScope.USER = JSON.parse(localStorage.getItem("Account"));
        if ($rootScope.USER) {
            CallServiceFactory.post("global/tokenCheck", { token: $rootScope.USER.password })
                .then(function (data) {

                    if (data.IsSuccess) {
                        $scope.Logged = true;
                    }
                }).catch(function (err) {
                    app.ToatsError("Token not valid. " + err, );
                });
        }

        $scope.signUp = () => {

            let parameters =
                {
                    uuid: $scope.email,
                    username: $scope.email,
                    password: $scope.password,
                    email: $scope.email,

                }

            CallServiceFactory.post("global/register", parameters)
                .then(function (data) {

                    if (!data.IsSuccess)
                        app.ToatsErrorResponse(data);
                    else {
                        localStorage.setItem("Account", JSON.stringify(data.Data));
                        app.ToatsSuccess("Account registered");
                        $scope.signIn();
                    }

                }).catch(function (err) {
                    app.ToatsError("Account not register. " + err, );
                });
        }

        $scope.signIn = () => {


            let parameters =
                {
                    username: $scope.email,
                    password: $scope.password
                }

            CallServiceFactory.post("global/authenticate", parameters)
                .then(function (data) {

                    if (!data.IsSuccess)
                        app.ToatsErrorResponse(data);
                    else {
                        data.Data.Logged = true;
                        localStorage.setItem("Account", JSON.stringify(data.Data));
                        app.ToatsSuccess("Login succesfuly");
                        $scope.mainPage();
                    }

                }).catch(function (err) {
                    app.ToatsError("Login error. " + err, );
                });
        }

        $scope.signOut = () => {
            $rootScope.USER.password = "";
            $rootScope.USER.Logged = false;
            localStorage.setItem("Account", JSON.stringify($rootScope.USER));
            $scope.Logged = false;
            $scope.ShowSignUpPanel = false;
        }

        $scope.mainPage = () => {
            $window.location.href = '/index.html#webhose';
        }

    }]);

app.factory('CallServiceFactory', function ($http, $q, $rootScope) {

    //GET all blogs
    var get = function (serviceName) {

        let url = $rootScope.ENVIRONMENT.WebServiceURL + serviceName;
        return $http.get(url).then(function (response) {
            return response.data;
        }
        ).catch(function (response) {
            return $q.reject(response.data);
        });
    };

    var getExternal = function (url) {

        return $http.get(url).then(function (response) {
            return response.data;
        }
        ).catch(function (response) {
            return $q.reject(response.data);
        });
    };

    var put = function (serviceName, parameters) {
        let url = $rootScope.ENVIRONMENT.WebServiceURL + serviceName;
        return $http.put(url, JSON.stringify(parameters)).then(function (response) {
            return response.data;
        }
        ).catch(function (response) {
            return $q.reject(response.data);
        });
    };

    var del = function (serviceName, parameters) {
        let url = $rootScope.ENVIRONMENT.WebServiceURL + serviceName;
        return $http.delete(url).then(function (response) {
            return response.data;
        }
        ).catch(function (response) {
            return $q.reject(response.data);
        });
    };

    var post = function (serviceName, parameters) {
        let url = $rootScope.ENVIRONMENT.WebServiceURL + serviceName;
        return $http.post(url, JSON.stringify(parameters)).then(function (response) {
            response.data.Tag = serviceName;
            return response.data;
        }
        ).catch(function (response) {
            response.data.Tag = serviceName;
            return $q.reject(response.data);
        });
    };


    return {
        get: get,
        getExternal: getExternal,
        put: put,
        post: post,
        del: del
    };
});

app.run(function ($rootScope, $window, CallServiceFactory) {
    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
        log("sayfa değişiyor");

        if (next && next.$$route && next.$$route.requireLogin) {

            log("Kimlik Doğrulama yapılıyor");
            CallServiceFactory.post("global/tokenCheck", { token: $rootScope.USER.password })
                .then(function (data) {
                    if (!data.IsSuccess) {
                        log("kullanıcı yok");
                        $window.location.href = '/login.html';
                    }
                    else {
                        log("Kimlik doğrulama Başarılı");
                    }

                }).catch(function (err) {
                    app.ToatsError("Token error. " + err, );
                });


        }
        else {
            log("Kimlik doğrulamaya gerek yok");
        }
    });
});





app.ToatsSuccess = (title) => {
    toastr["success"](title);
}
app.ToatsWarning = (title) => {
    toastr["warning"](title);
}
app.ToatsInfo = (title) => {
    toastr["info"](title);
}
app.ToatsError = (title) => {
    toastr["error"](title);
}

app.ToatsErrorResponse = (response) => {
    let msg;
    try {
        if (response.ErrorMessage !== undefined) {
            msg = response.ErrorCode + " - " + response.ErrorMessage
            if (response.ErrorDetail !== null) {
                msg += " Detail: " + response.ErrorDetail
            }
        }
        else {
            msg = JSON.stringify(response);
        }
    } catch (e) {
        msg = "Bilinmeyen bir hata oluştu";
    }


    toastr["error"](msg);
};


app.ServerErrorParser = (e) => {
    console.log("Errors: " + JSON.stringify(e.xhr.responseJSON));
    let errorDetail = "Hata oluştu";
    try {
        errorDetail += " " + e.xhr.responseJSON !== undefined ? JSON.stringify(e.xhr.responseJSON) : e.xhr.responseText;
    } catch (e) {
        errorDetail += " Status Code:" + e.status + " Detail:" + e.errorThrown
    }
    alert(errorDetail);
};

