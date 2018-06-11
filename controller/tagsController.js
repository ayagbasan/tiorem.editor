app.controller("tagsController", ["$scope", "CallServiceFactory", "$rootScope", function ($scope, CallServiceFactory, $rootScope) {


    log("tagsController loaded.", $rootScope.ENVIRONMENT.WebServiceURL);


    let crudServiceBaseUrl = $rootScope.ENVIRONMENT.WebServiceURL + "tag/",
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    type: "GET"
                },
                update: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    type: "PUT"
                },
                destroy: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    type: "DELETE"
                },
                create: {
                    url: crudServiceBaseUrl,
                    dataType: "json",
                    type: "POST"
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
                        TagName: {editable: true},
                        ArticleCount: {editable: false, type: "number"},
                        Hits: {editable: false, type: "number"},
                        CreatedUserId: {editable: false},
                        Active: {editable: true, type: "boolean"},
                        UpdatedAt: {editable: false, type: "date"},
                        CreatedAt: {editable: false, type: "date"},

                    }
                }
            }
        });


    $("#grid").kendoGrid({
        dataSource: dataSource,
        autoBind: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        noRecords: {
            template: 'Kayıt bulunmuyor'
        },
        height: 550,
        filterable: {
            mode: "row"
        },
        toolbar: ["create"],

        sortable: true,
        columnMenu: true,
        scrollable: true,
        columns: [

            {
                field: "TagName", title: "Tag", filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {field: "ArticleCount", title: "Haber Sayısı", width: "100px",filterable:false},
            {field: "Hits", title: "Okunma Sayısı", width: "100px",filterable:false},
            {field: "CreatedUserId", title: "Ekleyen User Id", width: "100px"},
            {field: "CreatedAt", title: "Oluşturulma Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "150px"},
            {field: "UpdatedAt", title: "Güncellenme Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "150px",filterable:false},
            {field: "Active", title: "Aktif", width: "120px", template: ' #= Active ? "Aktif" : "Pasif"  # '},
            {
                command: [
                    {
                        name: "edit",
                        click: (e) => {
                            e.preventDefault();
                        }
                    },
                    {
                        name: "destroy",
                        click: (e) => {
                            e.preventDefault();
                        }
                    }], title: "İşlemler", width: "200px"
            }],
        editable: {
            mode: "popup",
        },
        page: (arg) => {
            log("Paging to page index:" + JSON.stringify(arg));
        }
    });


}]);