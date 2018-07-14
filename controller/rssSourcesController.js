app.controller("rssSourcesController", ["$scope", "$rootScope", "CallServiceFactory", function ($scope, $rootScope, CallServiceFactory) {


    log("rssSourcesController loaded");


    $scope.SelectedArticle = null;



    $scope.KaynaklariOku = () => {
        let serviceURL = $rootScope.ENVIRONMENT.WebServiceURL + "rssSource/";
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
            requestEnd: function (e) {

                if (e.type === "create") {
                    $('#grid').data('kendoGrid').dataSource.read();
                    $('#grid').data('kendoGrid').refresh();
                }


            },
            serverPaging: true,
            serverFiltering: true,
            pageSize: 1000,
            schema: {
                data: "Data.docs",
                total: "Data.total",
                model: {
                    id: "_id",
                    fields: {
                        sourceName: { editable: false, type: "string" },

                        //category: { defaultValue: { categoryName: "1234", categoryName: "1234" } },
                        category: { editable: true, nullable: false },
                        url: { editable: true, nullable: false, type: "string" },
                        lastUpdated: { editable: false, type: "date" },
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
                { field: "sourceName", title: "Kaynak", width: "180px" },
                { field: "url", title: "URL" },
                //{ field: "category", title: "Kategori", width: "180px", editor: categoryDropDownEditor, template: "#=category.categoryName#" },
                { field: "category", title: "Category", width: "150px", editor: categoryDropDownEditor, template: "#=category#" },

                { field: "lastUpdated", title: "RSS in Son Güncellenme Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "150px" },
                { field: "createdAt", title: "Kayıt Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "150px" },
                { field: "active", title: "Aktif", width: "100px", template: ' #= active ? "Aktif" : "Pasif"  # ' },
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
                        }], title: "İşlemler", width: "150px"
                }],
            editable: {
                mode: "inline",
            },
        });

        function categoryDropDownEditor(container, options) {
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    dataTextField: "categoryName",
                    dataValueField: "categoryName",
                    dataSource: {
                        type: "jsonp",
                        transport: {
                            read: $rootScope.ENVIRONMENT.WebServiceURL + "category/?page=1&pageSize=1&skip=0&take=1000"
                        },
                        schema: {
                            data: "Data.docs",
                            total: "Data.total"
                        }
                    }
                });
        }
    }

    $scope.KategoriEkle = () => {
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

        $("#gridCategory").kendoGrid({
            dataSource: dataSource,
            autoBind: true,

            pageable: true,
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
                {
                    command: [
                        { name: "edit", text: { edit: "", update: "", cancel: "" } }
                    ],


                    title: "İşlemler"
                }],
            editable: {
                mode: "inline",
            },
        });
    }


    $scope.importData = () => {

        var list = $scope.categories.split("\n");
        let reqData = [];

        for (const iterator of list) {

            let cols = iterator.split("$$");
            if (cols.length > 0) {
                let defCategory = "####"
                if (cols.length == 2)
                    defCategory = cols[1].toLocaleUpperCase("tr-TR");

                let item = {

                    url: cols[0].trim(),
                    category: defCategory.trim(),
                    lastUpdated: null,
                    updatedAt: null,
                    active: true
                }

                reqData.push(item);
            }           
        };



        CallServiceFactory.post("rssSource/import", { token: $rootScope.USER.password, Data: reqData })
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



    $scope.KaynaklariOku();
    $scope.KategoriEkle();



}]);