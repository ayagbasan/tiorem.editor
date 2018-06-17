app.controller("articlesController", ["$scope", "CallServiceFactory", "$rootScope", function ($scope, CallServiceFactory, $rootScope) {


    $scope.SelectedArticle = null;
    log("articlesController loaded.", $rootScope.ENVIRONMENT.WebServiceURL);


    let crudServiceBaseUrl = $rootScope.ENVIRONMENT.WebServiceURL + "article/";

    $scope.dataSource = new kendo.data.DataSource({
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
        pageSize: 6,
        serverPaging: false,
        serverFiltering: false,
        serverSorting: false,
        schema: {
            data: "Data",
            total: "TotalCount",
            model: {
                id: "_id",
                fields: {

                    ArticleId: {editable: false},
                    ArticleUrl: {editable: false},
                    Title: {editable: false},
                    ApprovedUserId: {editable: false},
                    Approved: {editable: false},
                    ApprovedAt: {editable: false, type: "date"},
                    PubDate: {editable: false, type: "date"},
                    SourceName: {editable: false},
                    SourceImageUrl: {editable: false},
                    SourceWebSite: {editable: false},
                }
            }
        }
    });


    $scope.gridOptions = {
        dataSource: $scope.dataSource,
        autoBind: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        noRecords: {
            template: 'Kayıt bulunmuyor'
        },
        height: 455,
        filterable: {
            mode: "row"
        },
        sortable: true,
        scrollable: true,
        selectable: false,
        dataBound: onDataBound,
        columns: [
            {
                field: "SourceImageUrl",
                title: "Logo",
                width: "70px",
                template: "<img src='#= SourceImageUrl #' alt='#= ImageUrl #' width='48px' height='48px'></img>"
            },
            {field: "SourceName", title: "Kaynak", width: "120px"},
            {field: "PubDate", title: "Haber Tarihi", format: "{0:dd.MM.yyyy HH:mm}", width: "180px",

             template: "#=kendo.toString(kendo.parseDate(moment(" + 'PubDate' + ").toDate(), 'yyyy-MM-dd'), '" + 'dd.MM.yyyy HH:mm' + "' )# "


            },
            {
                filterable: true,
                field: "Title",
                title: "Haber Başlığı",
                template: "<a href=\"javascript:void(0);\" ng-click=\"clickMe('#=_id #')\" >#=Title#</a> ",
                /*
                                template: "<a href='javascript:void(0);' class='link' ng-click='showWindow(dataItem)'>#=Title#</a>"
                */

            },
            {field: "Approved", title: "Onay Durumu", width: "120px"},
            {field: "ApprovedUserId", title: "Onay/Red User", width: "150px"},
            {field: "ApprovedAt", title: "Onay Tarihi", width: "200px"},
        ],
        editable: {
            mode: "popup",
        },
        change: (arg) => {

        }
    };

    function onDataBound() {
        let grid = this;

        grid.element.on('dblclick', 'tbody tr[data-uid]', function (e) {
            $scope.selectedItem = grid.dataItem(grid.select());
        })
    };

    $scope.clickMe = function (id) {
        /* let data = $("#grid").data("kendoGrid").dataSource.data();
         for (let i = 0; i < data.length; i++) {
             if (data[i]._id === id) {
                 $scope.SelectedArticle = data[i];
                 break;
             }
         }*/
        let url = crudServiceBaseUrl + id;
        CallServiceFactory.get(url).then(function (data) {


            if (data.Data) {
                let body = data.Data.Body;
                if (body === "")
                    data.Data.Body = "Haber detayı yok bulunmuyor";
                else {
                    if (body.length > 300)
                        data.Data.Body = body.substring(0, 300) + " ...";
                }


                $scope.SelectedArticle = data.Data;

                console.log(data.Data);
            }

        });

    };


    $("#filterArticle").keyup(function () {
        let selecteditem = $('#filterArticle').val();
        let kgrid = $("#grid").data("kendoGrid");
        let orfilter = {logic: "and", filters: []};
        orfilter.filters.push({field: "Title", operator: "contains", value: selecteditem});
        kgrid.dataSource.filter(orfilter);
    });

    let url = $rootScope.ENVIRONMENT.WebServiceURL + "tag/";
    CallServiceFactory.get(url).then(function (data) {
        if (data.Data) {
            $scope.GuncelTagler = data.Data;
            //console.log(data.Data);
        }
    });

    $scope.AddTagToArticle = (tag) => {

        if ($scope.SelectedArticle) {

            let url = $rootScope.ENVIRONMENT.WebServiceURL + "article/addTag";
            let param =
                {
                    TagId: tag,
                    ArticleId: $scope.SelectedArticle._id
                }

            CallServiceFactory.post(url, param).then(function (data) {
                $scope.SelectedArticle.Tags.push({TagId: tag});
                console.log(data);
                app.ToatsSuccess("Tag habere eklendi");
            }).catch((err) => {
                app.ToatsErrorResponse(err);
            });


        } else {
            app.ToatsError("Tag eklemek için haber seçiniz");
        }
        log(tag);
    };

    $scope.DeleteTagFromArticle = (tag) => {

        console.log(tag);
        if ($scope.SelectedArticle) {

            let url = $rootScope.ENVIRONMENT.WebServiceURL + "article/deleteTag";
            let param =
                {
                    TagId: tag.TagId._id,
                    ArticleId: $scope.SelectedArticle._id
                }

            CallServiceFactory.post(url, param).then(function (data) {
                console.log(data);
                if (data.Data.length > 0) {
                    $.each($scope.SelectedArticle.Tags, function (i) {
                        if ($scope.SelectedArticle.Tags[i].TagId._id !== data.Data[0].TagId) {
                            $scope.SelectedArticle.Tags.splice(i, 1);
                            app.ToatsSuccess("Tag haberden kaldırıldı");
                            return false;
                        }
                    });
                } else {
                    app.ToatsSuccess("Habere ait tag bulunmuyor");
                    $scope.SelectedArticle.Tags = [];
                }


            }).catch((err) => {
                app.ToatsErrorResponse(err);
            });


        } else {
            app.ToatsError("Tag eklemek için haber seçiniz");
        }
        log(tag);
    };


    $scope.AddNewTag = (tagName) => {


        let url = $rootScope.ENVIRONMENT.WebServiceURL + "tag/";
        let param =
            {
                TagName: tagName,
                Active: true
            }

        CallServiceFactory.post(url, param).then(function (data) {
            app.ToatsSuccess("Tag havuza eklendi");
            console.log(data);
            $scope.GuncelTagler.push(data.Data);
            if ($scope.SelectedArticle)
                $scope.AddTagToArticle(data.Data);

            $scope.tagName="";

        }).catch((err) => {
            app.ToatsErrorResponse(err);
        });


    };

    /*$scope.showWindow = (dataItem)=> {
        var window = angular.element(details)
            .kendoWindow({
                title: "Details",
                modal: true,
                visible: false,
                resizable: false,
                width: 900
            }).data("kendoWindow");
       /!* var detailsTemplate = kendo.template(angular.element(detailsTemplate).html());
        window.content(detailsTemplate(dataItem));*!/
       $scope.SelectedArticle=dataItem;
        window.center().open();
    };*/


}]);