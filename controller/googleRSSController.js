app.controller("googleRSSController", ["$scope", "CallServiceFactory", "$rootScope", function ($scope, CallServiceFactory, $rootScope) {



    $scope.SelectedArticle = null;
    log("googleRSSController loaded.", $rootScope.ENVIRONMENT.WebServiceURL);


    let serviceURL = $rootScope.ENVIRONMENT.WebServiceURL + "googleRss/";
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
            //destroy: {
            //    url: serviceURL,
            //    dataType: "json",
            //    type: "DELETE",
            //    beforeSend: function (req) {
            //        req.setRequestHeader('x-access-token', $rootScope.USER.password);
            //    }
            //},
            //create: {
            //    url: serviceURL,
            //    dataType: "json",
            //    type: "POST",
            //    beforeSend: function (req) {
            //        req.setRequestHeader('x-access-token', $rootScope.USER.password);
            //    }
            //},
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
        pageSize: 1000,
        requestEnd: function (e) {

            //if (e.type == "destroy") {
            //    if (e.response.IsSuccess) {
            //        app.ToatsSuccess("Kayıt başarıyla silindi");
            //    }
            //    else {
            //        app.ToatsError("Kayıt silinemedi. " + e.response.ErrorDetail);

            //        $('#grid').data('kendoGrid').dataSource.read();
            //        $('#grid').data('kendoGrid').refresh();
            //    }
            //} else if (e.type === "create") {
            //    $('#grid').data('kendoGrid').dataSource.read();
            //    $('#grid').data('kendoGrid').refresh();
            //}


        },
        schema: {
            data: "Data.docs",
            total: "Data.total",
            model: {
                id: "_id",
                fields: {
                    source: { editable: true, nullable: false, type: "string" },
                    clusterId: { editable: false, nullable: false, type: "string" },
                    newsId: { editable: false, nullable: false, type: "string" },
                    relatedId: { editable: false, nullable: false, type: "string" },
                    title: { editable: true, nullable: false, type: "string" },
                    link: { editable: true, nullable: false, type: "string" },
                    guid: { editable: true, nullable: false, type: "string" },
                    category: { editable: true, nullable: false, type: "string" },
                    pubDate: { editable: true, nullable: false, type: "string" },
                    createdAt: { editable: false, type: "date" },

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
            buttonCount: 15,

        },
        noRecords: {
            template: 'Kayıt bulunmuyor'
        },
        sortable: {
            mode: "multiple",
            allowUnsort: true,
            showIndexes: true
        },
        height: 750,
        filterable: {
            mode: "row"
        },
        //toolbar: ["create"],
        columns: [
            { field: "source", title: "Kaynak", width: "180px" },
            { field: "clusterId", title: "Cluster Id", width: "300px" },
            { field: "newsId", title: "News Id", width: "120px" },
            { field: "relatedId", title: "Related Id", width: "120px" },
            { field: "title", title: "Başlık" },
            { field: "link", title: "Url", template: '<a href="#=link#" target="_blank">Haberi aç</a>' },
            { field: "pubDate", title: "Yayın Tarihi", template: "#= kendo.toString(new Date(pubDate), 'yyyy.MM.dd HH:mm') #" },
            { field: "createdAt", title: "Kayıt Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "180px" },
            { field: "updatedAt", title: "Güncelleme Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "180px" }
        ]

    });



}]);