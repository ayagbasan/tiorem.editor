app.controller("googleNewsController", ["$scope", "CallServiceFactory", "$rootScope", function ($scope, CallServiceFactory, $rootScope) {


    $scope.SelectedArticle = null;
    log("googleNewsController loaded.", $rootScope.ENVIRONMENT.WebServiceURL);


    let crudServiceBaseUrl = $rootScope.ENVIRONMENT.WebServiceURL + "googleNews";

    $scope.dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: crudServiceBaseUrl,
                dataType: "json",
                type: "GET"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return options.models[0];
                }
            },
        },
        error: function (e) {
            app.ServerErrorParser(e);
        },
        batch: true,
        pageSize: 20,
        serverPaging: false,
        serverFiltering: false,
        serverSorting: false,
        schema: {
            data: "Data",
            total: "TotalCount",
            model: {
                id: "_id",
                fields: {
                    clusterId: {editable: false},
                    title: {editable: false},
                    link: {editable: false},
                    guid: {editable: false},
                    createdAt: {editable: false, type: "date"},
                    pubDate: {editable: false},
                    isoDate: {editable: false, type: "date"},
                    content: {editable: false},
                    contentSnippet: {editable: false},
                }
            }
        }
    });


    $scope.gridOptions = {
        dataSource: $scope.dataSource,

        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        noRecords: {
            template: 'Kayıt bulunmuyor'
        },
        height: 755,
        filterable: {
            mode: "menu, row"
        },
        sortable: true,
        scrollable: true,
        selectable: false,
        columns: [

            {field: "clusterId", title: "clusterId", width: "280px"},
            {

                field: "isoDate", title: "isoDate", format: "{0:dd.MM.yyyy HH:mm}", width: "180px",
                template: "#=kendo.toString(kendo.parseDate(moment(" + 'isoDate' + ").toDate(), 'yyyy-MM-dd'), '" + 'dd.MM.yyyy HH:mm' + "' )# "


            },
            {field: "title", title: "title", filterable: true},
            {
                field: "content",
                title: "content",
                filterable: true,
                template: "#=content#"
            },
            {
                width: "120px",
                filterable: true,
                field: "title",
                title: "title",
                template: "<a href=\"#=link #\" target='_blank' >Details</a> "

            },
            {field: "guid", title: "Onay Tarihi", width: "300px"},
        ]

    };


}]);