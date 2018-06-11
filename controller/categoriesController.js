app.controller("categoriesController", ["$scope", "$rootScope", "CallServiceFactory", function ($scope, $rootScope, CallServiceFactory) {


    log("categoriesController loaded");


    let crudServiceBaseUrl = $rootScope.ENVIRONMENT.WebServiceURL + "category/",
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
            schema: {
                data: "Data",
                total: "TotalCount",
                model: {
                    id: "_id",
                    fields: {
                        CategoryName: {editable: true, nullable: true},
                        CreatedAt: {editable: false, type: "date"},
                        Active: {editable: true, type: "boolean"},
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
        toolbar: ["create"],
        columns: [
            {field: "CategoryName", title: "Kategori Adı"},
            {field: "Active", title: "Aktif", width: "150px", template: ' #= Active ? "Aktif" : "Pasif"  # '},
            {field: "CreatedAt", title: "Oluşturulma Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "180px"},
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
    });


    console.log($rootScope.ENVIRONMENT.WebServiceURL);


}]);