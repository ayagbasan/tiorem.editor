app.controller("categoriesController", ["$scope", "$rootScope", "CallServiceFactory", function ($scope, $rootScope, CallServiceFactory) {


    log("categoriesController loaded");


    $scope.SelectedArticle = null;

    let serviceURL = $rootScope.ENVIRONMENT.WebServiceURL + "category/";
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
                if (operation !== "read" && options) {
                    return options;
                } else {

                    let filter = "";
                    if (options.filter)
                        filter = options.filter;


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
        requestEnd: function (e) {

            if (e.type == "destroy") {
                if (e.response.IsSuccess) {
                    app.ToatsSuccess("Kayıt başarıyla silindi");
                }
                else {
                    app.ToatsError("Kayıt silinemedi. " + e.response.ErrorDetail);

                    $('#grid').data('kendoGrid').dataSource.read();
                    $('#grid').data('kendoGrid').refresh();
                }
            } else if (e.type === "create") {
                $('#grid').data('kendoGrid').dataSource.read();
                $('#grid').data('kendoGrid').refresh();
            }


        },
        schema: {
            data: "Data.docs",
            total: "Data.total",
            model: {
                id: "_id",
                fields: {
                    categoryName: { editable: true, nullable: false, type: "string" },
                    createdAt: { editable: false, type: "date" },
                    updatedAt: { editable: false, type: "date" },
                    active: { editable: true, type: "boolean", defaultValue: true },
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
        toolbar: ["create"],
        columns: [
            {
                field: "categoryName", title: "Kategori Adı"
            },

            { field: "createdAt", title: "Kayıt Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "180px" },
            { field: "updatedAt", title: "Güncelleme Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "180px" },
            { field: "active", title: "Aktif", width: "150px", template: ' #= active ? "Aktif" : "Pasif"  # ' },
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


    $scope.importData = () => {

        var list = $scope.categories.split("\n");
        let reqData = [];

        for (const iterator of list) {

            let item = {
                active: true,
                categoryName: iterator.toLocaleUpperCase("tr-TR").trim(),
                updatedAt: null,
                active: true
            }

            reqData.push(item);
        };



        CallServiceFactory.post("category/import", { token: $rootScope.USER.password, Data: reqData })
            .then(function (data) {

                if (data.IsSuccess) {
                    app.ToatsInfo(data.Data);
                    $scope.categories = "";
                    $('#grid').data('kendoGrid').dataSource.read();
                    $('#grid').data('kendoGrid').refresh();
                    $("#modal_basic").modal('hide');
                }
                else {
                    app.ToatsErrorResponse(data);
                }

            }).catch(function (err) {
                app.ToatsError("Token not valid. " + err, );
            });


    }


}]);