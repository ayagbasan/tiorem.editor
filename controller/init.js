const app = angular.module("app", ["kendo.directives","ngRoute"]);
const log = console.log.bind(console);
const ENV =
    {
        DEV:
            {
                WebServiceURL: "http://localhost:3000/api/"
            },
        PROD:
            {
                WebServiceURL: "https://tioremapi.herokuapp.com/api/"
            }
    };

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
        .when("/", {})
        .when("/articles", {
            templateUrl: "pages/articles.html",
            controller: "articlesController"
        })
        .when("/tags", {
            templateUrl: "pages/tags.html",
            controller: "tagsController"
        })
        .when("/categories", {
            templateUrl: "pages/categories.html",
            controller: "categoriesController"
        })
        .when("/sources", {
            templateUrl: "pages/sources.html",
            controller: "sourcesController"
        })
        .otherwise({redirectTo: "/sources"});
    $locationProvider.html5Mode(false);
});


app.controller("appController", ["$scope", "$rootScope", "CallServiceFactory", function ($scope, $rootScope, CallServiceFactory) {

    console.log("appController loaded");

    $rootScope.ENVIRONMENT = ENV.PROD;


}]);


app.factory('CallServiceFactory', function ($http, $q) {

    //GET all blogs
    var get = function (url) {
        return $http.get(url).then(function (response) {
                return response.data;
            }
        ).catch(function (response) {
            return $q.reject(response.data);
        });
    };

    var put = function (url, parameters) {
        return $http.put(url, JSON.stringify(parameters)).then(function (response) {
                return response.data;
            }
        ).catch(function (response) {
            return $q.reject(response.data);
        });
    };

    var post = function (url, parameters) {
        return $http.post(url, JSON.stringify(parameters)).then(function (response) {
                return response.data;
            }
        ).catch(function (response) {
            return $q.reject(response.data);
        });
    };


    return {
        get: get,
        put: put,
        post: post
    };
});

app.ShowLoading = (title) => {
    /* $("#jqxLoader").jqxLoader({ text: title, isModal: true, width: 100, height: 60, imagePosition: 'top' });
     $('#jqxLoader').jqxLoader('open');*/
};

app.CloseLoading = () => {
    // $('#jqxLoader').jqxLoader('close');
};

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
    kendo.alert(errorDetail);
};