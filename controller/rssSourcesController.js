app.controller("rssSourcesController", ["$scope", "$rootScope", "CallServiceFactory", function ($scope, $rootScope, CallServiceFactory) {


    log("rssSourcesController loaded");


    $scope.SelectedArticle = null;

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
        pageSize: 10,
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

}]);