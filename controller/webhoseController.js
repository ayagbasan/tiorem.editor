app.controller("webhoseController", ["$scope", "CallServiceFactory", "$rootScope", function ($scope, CallServiceFactory, $rootScope) {


    $scope.SelectedArticle = null;
    log("webhoseController loaded.", $rootScope.ENVIRONMENT.WebServiceURL);

    let serviceURL = $rootScope.ENVIRONMENT.WebServiceURL + "post/";
    let dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: serviceURL,
                dataType: "json",
                type: "GET",
                beforeSend: function (req) {
                    req.setRequestHeader('x-access-token', $rootScope.USER.password);
                }
            },
            update: {
                url: serviceURL,
                dataType: "json",
                type: "PUT",
                beforeSend: function (req) {
                    req.setRequestHeader('x-access-token', $rootScope.USER.password);
                }
            },
            destroy: {
                url: serviceURL,
                dataType: "json",
                type: "DELETE",
                beforeSend: function (req) {
                    req.setRequestHeader('x-access-token', $rootScope.USER.password);
                }
            },
            create: {
                url: serviceURL,
                dataType: "json",
                type: "POST",
                beforeSend: function (req) {
                    req.setRequestHeader('x-access-token', $rootScope.USER.password);
                }
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return options.models[0];
                } else {

                    let filter = "";
                    if (options.filter)
                        filter =  options.filter;
                    

                    var o = options;
                    return {
                        page: options.page,
                        pageSize: options.pageSize,
                        skip: options.skip,
                        take: options.take
                       
                    }
                }
            }


        },

        error: function (e) {
            app.ToatsErrorResponse(e);
        },
        serverPaging: true,
        serverFiltering: true,
        pageSize: 10,
        schema: {
            data: "Data.docs",
            total: "Data.total",
            model: {
                id: "_id",
                fields: {
                    title: { editable: true, nullable: false, type: "string" },
                    published: { editable: false, type: "date" },
                    isProcess: { editable: true, type: "boolean" },
                    uuid: { editable: false, type: "string" },
                    site_full: { editable: false, from: "thread.site_full", type: "string" },
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
            buttonCount: 5,

        },
        noRecords: {
            template: 'Kayıt bulunmuyor'
        },
        height: 750,
        filterable: {
            mode: "row"
        },
        //toolbar: ["create"],
        columns: [
            {
                field: "title", title: "title", filterable: {
                    cell: {
                        showOperators: false
                    }
                }
            },
            { field: "site_full", title: "Kaynak", width: "150px" },
            { field: "isProcess", title: "Eşleşme", width: "150px", template: ' #= isProcess ? "OK" : "Bekleniyor"  # ' },
            { field: "published", title: "Tarih", format: "{0:dd.MM.yyyy HH:mm}", width: "180px" },
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