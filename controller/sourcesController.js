app.controller("sourcesController", ["$scope", "CallServiceFactory","$rootScope", function ($scope, CallServiceFactory,$rootScope) {


    log("sourcesController loaded.", $rootScope.ENVIRONMENT.WebServiceURL);


    let crudServiceBaseUrl = $rootScope.ENVIRONMENT.WebServiceURL + "source/",
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
                        SourceName: {editable: true},
                        Description: {editable: true},
                        SourceId: {editable: false},
                        Active: {editable: true,type: "boolean"},
                        ImageUrl: {editable: true},
                        SourceWebSite: {editable: true},
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
        toolbar: ["create"],
        columns: [
            {field: "SourceId", title: "Id", width: "90px"},
            {field: "ImageUrl", title: "Logo",  width: "70px",template:"<img src='#= ImageUrl #' alt='#= ImageUrl #' width='48px' height='48px'></img>"},
            {field: "SourceName", title: "Adı", width: "200px"},
            {field: "Description", title: "Açıklama"},
            {field: "Active", title: "Aktif", width: "80px", template: ' #= Active ? "Aktif" : "Pasif"  # '},
            {field: "SourceWebSite", title: "Kaynak",width: "100px"},
            {field: "CreatedAt", title: "Oluşturulma Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "180px"},
            {field: "UpdatedAt", title: "Güncelleme Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "180px"},
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



}]);