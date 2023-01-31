sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/util/File",
    "sap/ui/core/routing/History",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "../model/formatter",
    'sap/m/Token',
    "it/orogel/cruscottoconferimento/model/Constants",
    "it/orogel/cruscottoconferimento/model/CostantiAttributi",
    "it/orogel/cruscottoconferimento/libs/Download",
    "sap/makit/Row",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        File,
        History,
        FilterOperator,
        Filter,
        JSONModel,
        Fragment,
        MessageBox,
        formatter,
        Token,
        Constants,
        CostantiAttributi,
        Download,
        Row) {
        "use strict";

        return Controller.extend("it.orogel.cruscottoconferimento.controller.FAD", {
            formatter: formatter,
            onInit: function () {
                this.oComponent = this.getOwnerComponent();
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                var fnValidator = function (args) {
                    return new Token({
                        key: args.text,
                        text: args.text
                    });
                };
                this.getView().byId("iLIFNR").addValidator(fnValidator);
                this.getView().byId("iLIFNRM2").addValidator(fnValidator);
                this.getView().byId("iLIFNRM3").addValidator(fnValidator);
                // [Gheorghe]
                this.getOwnerComponent().setModel(new JSONModel({}), "filterModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "filterModel2");
                this.getOwnerComponent().setModel(new JSONModel({}), "filterModel3");
                this.getOwnerComponent().setModel(new JSONModel({}), "dynamicModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "dynamicModel2");
                this.getOwnerComponent().setModel(new JSONModel({}), "dynamicModel3");
                this.getOwnerComponent().setModel(new JSONModel({}), "textModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "statiModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "notaCreditoModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "cambioRegimeFiscaleModel");
                this.getOwnerComponent().setModel(new JSONModel([{ key: "EXW", text: "Franco Fabbrica" }, { key: "FCA", text: "Franco Vettore" }]), "incoterModel");
                this.getOwnerComponent().setModel(new JSONModel([{ key: "01", text: "01" }, { key: "02", text: "02" }, { key: "03", text: "03" }, { key: "04", text: "04" }, { key: "05", text: "05" }, { key: "06", text: "06" }, { key: "07", text: "07" }, { key: "08", text: "08" }, { key: "09", text: "09" }, { key: "10", text: "10" }, { key: "11", text: "11" }, { key: "12", text: "12" }, { key: "13", text: "13" }, { key: "14", text: "14" }, { key: "15", text: "15" }, { key: "16", text: "16" }, { key: "17", text: "17" }, { key: "18", text: "18" }, { key: "19", text: "19" }, { key: "20", text: "20" }]), "codAccModel");
                const oAppModel = this.oComponent.getModel("appModel");
                oAppModel.setProperty("/Table3Visible", false);
                oAppModel.setProperty("/TableStoricoRecapVisible", false);
                oAppModel.setProperty("/TableStoricoPosVisible", false);
                oAppModel.setProperty("/TableFAD2Visible", false);
                // [Gheorghe]
            },
            onNavBack: function () {
                let oHistory = History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain", true);
                }
            },
            onFilterSearchFAD1: function (oEvent) {// [Gheorghe]
                var filterModel = this.getOwnerComponent().getModel("filterModel").getData(),
                    appModel = this.getOwnerComponent().getModel("appModel").getData(),
                    aFilters = [],
                    aTokens = [],
                    that = this,
                    kAttributi = CostantiAttributi.ATTR;

                let bFiltro = false,
                    sErrore = "Valorizzare i seguenti campi:" + "\n";

                if (!this.byId("iBUKRS").getValue() || this.byId("iBUKRS").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Società" + "\n";
                }

                if (!this.byId("iBEDAT").getValue() || this.byId("iBEDAT").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Data accettazione" + "\n";
                }

                if (!this.byId("iZCODACC").getValue() || this.byId("iZCODACC").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Codice Acconto" + "\n";
                }

                if (!this.byId("iDATADOC").getValue() || this.byId("iDATADOC").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Data documento" + "\n";
                }

                if (!this.byId("iZCAUSALE2").getValue() || this.byId("iZCAUSALE2").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Causale" + "\n";
                }

                if (bFiltro) {
                    sap.m.MessageToast.show(sErrore);
                    return;
                }
                const aValues = Object.values(kAttributi);
                delete aValues[0]
                delete aValues[1]
                //delete aValues[38]
                delete aValues[39]
                delete aValues[40]
                delete aValues[41]
                delete aValues[42]
                delete aValues[44]
                delete aValues[45]
                delete aValues[46]
                //Costruisco i vari filtri tramite le Costanti
                aValues.forEach(e => {
                    var key = e['key'],
                        id = e['id'],
                        filterField = e['filterField'],
                        aRow = [];
                    //aRow = that.byId(id).getTokens();
                    if (that.byId(id)) {
                        aRow = that.byId(id).getTokens();
                        aRow.forEach(e => {
                            var obj = { key: key, value: e.getKey(), filterField: filterField }
                            aTokens.push(obj);
                        });
                    }
                });

                var oFinalFilter = new Filter({
                    filters: [],
                    and: true
                });
                var varFilter = "";

                aTokens.forEach(e => {
                    var oOrFilter = new Filter(e['filterField'], FilterOperator.EQ, e['value']);

                    if (e['filterField'] !== varFilter && varFilter !== "") {
                        oFinalFilter.aFilters.push(new Filter({
                            filters: aFilters,
                            and: false
                        }));
                        aFilters = []
                    }
                    varFilter = e['filterField'];
                    aFilters.push(oOrFilter);
                });

                if (aTokens.length > 0) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilters,
                        and: false
                    }));
                }
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("Societa", FilterOperator.EQ, filterModel.BUKRS)],
                    and: false
                }));
                filterModel.DataDocumentoFrom.setHours(filterModel.DataDocumentoFrom.getHours() - filterModel.DataDocumentoFrom.getTimezoneOffset() / 60);
                //filterModel.DataDocumentoTo.setHours(filterModel.DataDocumentoTo.getHours() - filterModel.DataDocumentoTo.getTimezoneOffset() / 60);
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("DataDocumento", FilterOperator.BT, filterModel.DataDocumentoFrom, filterModel.DataDocumentoTo)],
                    and: false
                }));

                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("Causale", FilterOperator.EQ, filterModel.ZCAUSALE2)],
                    and: false
                }));
                /*if (filterModel.hasOwnProperty('ZCAUSALE')) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("CausaleAcconti", FilterOperator.EQ, filterModel.ZCAUSALE)],
                        and: false
                    }));
                }*/
                if (filterModel.hasOwnProperty('DataAccontoFrom') && filterModel.hasOwnProperty('DataAccontoTo')) {
                    filterModel.DataAccontoFrom.setHours(filterModel.DataAccontoFrom.getHours() - filterModel.DataAccontoFrom.getTimezoneOffset() / 60);
                    filterModel.DataAccontoTo.setHours(filterModel.DataAccontoTo.getHours() - filterModel.DataAccontoTo.getTimezoneOffset() / 60);
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("DataAcconto", FilterOperator.BT, filterModel.DataAccontoFrom, filterModel.DataAccontoTo)],
                        and: false
                    }));
                }
                if (filterModel.hasOwnProperty('DataDocumentoI')) {
                    filterModel.DataDocumentoI.setHours(filterModel.DataDocumentoI.getHours() - filterModel.DataDocumentoI.getTimezoneOffset() / 60);
                    oFinalFilter.aFilters.push(new Filter({
                        //filters: [new Filter("DataDocumentoI", FilterOperator.BT, filterModel.DataDocumentoIFrom, filterModel.DataDocumentoITo)],
                        filters: [new Filter("DataDocumentoI", FilterOperator.EQ, filterModel.DataDocumentoI)],
                        and: false
                    }));
                }
                if (filterModel.hasOwnProperty('ZCODACC')) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("CodiceAcconto", FilterOperator.EQ, filterModel.ZCODACC)],
                        and: false
                    }));
                }
                if (appModel.Note1) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo1", FilterOperator.EQ, appModel.Note1)],
                        and: false
                    }));
                } else {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo1", FilterOperator.EQ, "")],
                        and: false
                    }));
                }
                if (appModel.Note2) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo2", FilterOperator.EQ, appModel.Note2)],
                        and: false
                    }));
                } else {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo2", FilterOperator.EQ, "")],
                        and: false
                    }));
                }
                if (appModel.Note3) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo3", FilterOperator.EQ, appModel.Note3)],
                        and: false
                    }));
                } else {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo3", FilterOperator.EQ, "")],
                        and: false
                    }));
                }
                this.oGlobalBusyDialog.open();
                this.getView().getModel().read("/FAD1Set", {
                    urlParameters: {
                        "$expand": "ZCONFSTORHEAD2Set,ZCONFSTORPOS2Set,ZCONFSTORRECAP2Set,ZCONFMAGGIORAZSet,ZCONFACCPREGSet"
                    },
                    filters: [oFinalFilter],
                    success: (oDataFAD1) => {
                        //Success
                        //oDataFAD1.results[0].Errore = "3";
                        var aError1 = oDataFAD1.results.filter(x => x.Errore === "1");
                        var aError2 = oDataFAD1.results.filter(x => x.Errore === "2");
                        var aError3 = oDataFAD1.results.filter(x => x.Errore === "3");
                        var aNoError = oDataFAD1.results.filter(x => x.Errore === "");
                        const oAppModel = this.getView().getModel("appModel");
                        var aNoErrorCopy = [];
                        aNoError.forEach(x => {
                            aNoErrorCopy.push(JSON.parse(JSON.stringify(x)));
                        });
                        oAppModel.setProperty("/rowsNoError", aNoErrorCopy);
                        var sError = "";
                        if (aError1.length > 0) {
                            sError = this.oComponent.i18n().getText("msg.error1.text") + "\n";
                            aError1.forEach(x => {
                                sError = sError + x.Fornitore + "\n";
                            });
                        }
                        if (aError2.length > 0) {
                            sError = sError + this.oComponent.i18n().getText("msg.error2.text") + "\n";
                            aError2.forEach(x => {
                                sError = sError + x.Fornitore + "\n";
                            });
                        }
                        if (sError !== "") {
                            var that = this;
                            MessageBox.warning(sError,
                                {
                                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                    emphasizedAction: MessageBox.Action.OK,
                                    onClose: function (sAction) {
                                        if (sAction == 'OK') {
                                            if (aError3.length > 0) {
                                                oAppModel.setProperty("Table3Visible", true);
                                                that._setTableModel3(aError3);
                                            } else {
                                                if (aNoError.length > 0) {
                                                    let oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                                    oRouter.navTo("Compensazione");
                                                } else {
                                                    sap.m.MessageToast.show(that.oComponent.i18n().getText("msg.noResult.text"));
                                                }
                                            }
                                            that.oGlobalBusyDialog.close();
                                        }
                                    }
                                }
                            );
                            //sap.m.MessageBox.warning(sError);
                        } else {
                            if (aError3.length > 0) {
                                oAppModel.setProperty("Table3Visible", true);
                                this._setTableModel3(aError3);
                            } else {
                                if (aNoError.length > 0) {
                                    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                    oRouter.navTo("Compensazione");
                                } else {
                                    sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.noResult.text"));
                                }
                            }
                            this.oGlobalBusyDialog.close();
                        }
                    },
                    error: () => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Errore di connessione");
                    }
                });

            },
            onFilterSearchFAD3: function () {// [Gheorghe]
                var filterModel = this.getOwnerComponent().getModel("filterModel3").getData(),
                    aFilters = [],
                    aTokens = [],
                    that = this,
                    kAttributi = CostantiAttributi.ATTR;

                let bFiltro = false,
                    sErrore = "Valorizzare i seguenti campi:" + "\n";

                if (!this.byId("iBUKRSM3").getValue() || this.byId("iBUKRSM3").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Società" + "\n";
                }

                if (bFiltro) {
                    sap.m.MessageToast.show(sErrore);
                    return;
                }

                const aValues = Object.values(kAttributi);
                delete aValues[0];
                delete aValues[1];
                delete aValues[38];
                delete aValues[39];
                delete aValues[40];
                delete aValues[41];
                delete aValues[42];
                delete aValues[44];
                delete aValues[45];
                delete aValues[46];
                //Costruisco i vari filtri tramite le Costanti
                aValues.forEach(e => {
                    var key = e['key'],
                        id = e['id'] + "M3",
                        filterField = e['filterField'],
                        aRow = [];
                    //    aRow = that.byId(id).getTokens();
                    if (that.byId(id)) {
                        var aRow = that.byId(id).getTokens();
                        aRow.forEach(e => {
                            var obj = { key: key, value: e.getKey(), filterField: filterField }
                            aTokens.push(obj);
                        });
                    }
                });

                var oFinalFilter = new Filter({
                    filters: [],
                    and: true
                });
                var varFilter = "";

                aTokens.forEach(e => {
                    var oOrFilter = new Filter(e['filterField'], FilterOperator.EQ, e['value']);

                    if (e['filterField'] !== varFilter && varFilter !== "") {
                        oFinalFilter.aFilters.push(new Filter({
                            filters: aFilters,
                            and: false
                        }));
                        aFilters = []
                    }
                    varFilter = e['filterField'];
                    aFilters.push(oOrFilter);
                });

                if (aTokens.length > 0) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilters,
                        and: false
                    }));
                }
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("Societa", FilterOperator.EQ, filterModel.BUKRS)],
                    and: false
                }));

                if (filterModel.hasOwnProperty('DataDocumentoFrom') && filterModel.hasOwnProperty('DataDocumentoTo')) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("DataDocumento", FilterOperator.BT, filterModel.DataDocumentoFrom, filterModel.DataDocumentoTo)],
                        and: false
                    }));
                }

                if (filterModel.hasOwnProperty('DataAccontoFrom') && filterModel.hasOwnProperty('DataAccontoTo')) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("DataAcconto", FilterOperator.BT, filterModel.DataAccontoFrom, filterModel.DataAccontoTo)],
                        and: false
                    }));
                }
                this.oGlobalBusyDialog.open();
                this.getView().getModel().read("/FADStoricoSet", {
                    urlParameters: {
                        "$expand": "FADStoricoToPosizioni,FADStoricoToRecap"
                    },
                    filters: [oFinalFilter],
                    success: (oDataFADStorico) => {
                        const oAppModel = this.getView().getModel("appModel");
                        oAppModel.setProperty("/TableStoricoRecapVisible", true);
                        this._setTableModelStorico(oDataFADStorico.results);
                        oAppModel.setProperty("/FADStorico", oDataFADStorico.results);
                        this.oGlobalBusyDialog.close();
                    },
                    error: () => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Errore di connessione");
                    }
                });

            },
            onFilterSearchFAD2: function (oEvent) {// [Gheorghe]
                var filterModel = this.getOwnerComponent().getModel("filterModel2").getData(),
                    dynamicModel = this.getOwnerComponent().getModel("dynamicModel2").getData(),
                    appModel = this.getOwnerComponent().getModel("appModel").getData(),
                    aFilters = [],
                    aTokens = [],
                    that = this,
                    kAttributi = CostantiAttributi.ATTR;

                let bFiltro = false,
                    sErrore = "Valorizzare i seguenti campi:" + "\n";

                if (!this.byId("iBUKRSM2").getValue() || this.byId("iBUKRSM2").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Società" + "\n";
                }
                if (this.byId("iLIFNRM2").getTokens().length === 0) {
                    bFiltro = true;
                    sErrore += "Fornitore" + "\n";
                }
                if (!this.byId("iSPECIEM2").getValue() || this.byId("iSPECIEM2").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Specie" + "\n";
                }
                if (!this.byId("iSTAGM2").getValue() || this.byId("iSTAGM2").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Stagionalità" + "\n";
                }
                if (!this.byId("iDATADOCM2").getValue() || this.byId("iDATADOCM2").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Data documento" + "\n";
                }
                if (!this.byId("iZCAUSALE2M2").getValue() || this.byId("iZCAUSALE2M2").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Causale" + "\n";
                }
                if (!this.byId("iZIMPONIBILEM2").getValue() || this.byId("iZIMPONIBILEM2").getValue() === "") {
                    bFiltro = true;
                    sErrore += "Imponibile" + "\n";
                }
                if (!this.byId("iZCONFIVAM2").getValue() || this.byId("iZCONFIVAM2").getValue() === "") {
                    bFiltro = true;
                    sErrore += "IVA" + "\n";
                }

                if (bFiltro) {
                    sap.m.MessageToast.show(sErrore);
                    return;
                }
                var oFinalFilter = new Filter({
                    filters: [],
                    and: true
                });
                var aLifnrFilter = [];
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("Societa", FilterOperator.EQ, filterModel.BUKRS)],
                    and: false
                }));
                this.byId("iLIFNRM2").getTokens().forEach(x => {
                    aLifnrFilter.push(new Filter("Fornitore", FilterOperator.EQ, x.getKey()));
                });
                oFinalFilter.aFilters.push(new Filter({
                    filters: aLifnrFilter,
                    and: false
                }));
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("Specie", FilterOperator.EQ, filterModel.SPECIE)],
                    and: false
                }));
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("Stagionalita", FilterOperator.EQ, filterModel.STAG)],
                    and: false
                }));
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("Causale", FilterOperator.EQ, filterModel.ZCAUSALE)],
                    and: false
                }));
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("Imponibile", FilterOperator.EQ, filterModel.ZIMPONIBILE)],
                    and: false
                }));
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("IVA", FilterOperator.EQ, dynamicModel.ZCONFIVAValore)],
                    and: false
                }));
                filterModel.ZDATADOC.setHours(filterModel.ZDATADOC.getHours() - filterModel.ZDATADOC.getTimezoneOffset() / 60);
                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("DataDocumento", FilterOperator.EQ, filterModel.ZDATADOC)],
                    and: false
                }));
                if (appModel.Note1M2) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo1", FilterOperator.EQ, appModel.Note1M2)],
                        and: false
                    }));
                } else {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo1", FilterOperator.EQ, "")],
                        and: false
                    }));
                }
                if (appModel.Note2M2) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo2", FilterOperator.EQ, appModel.Note2M2)],
                        and: false
                    }));
                } else {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo2", FilterOperator.EQ, "")],
                        and: false
                    }));
                }
                if (appModel.Note3M2) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo3", FilterOperator.EQ, appModel.Note3M2)],
                        and: false
                    }));
                } else {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("Testo3", FilterOperator.EQ, "")],
                        and: false
                    }));
                }
                this.oGlobalBusyDialog.open();
                this.getView().getModel().read("/FAD2Set", {
                    urlParameters: {
                        "$expand": "ZCONFSTORHEAD2Set,ZCONFSTORPOS2Set,ZCONFSTORRECAP2Set"
                    },
                    filters: [oFinalFilter],
                    success: (oData) => {
                        const oAppModel = this.getView().getModel("appModel");
                        oAppModel.setProperty("/TableFAD2Visible", true);
                        this._setTableModelFAD2(oData.results);
                        oAppModel.setProperty("/FAD2", oData.results);
                        this.oGlobalBusyDialog.close();
                    },
                    error: () => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Errore di connessione");
                    }
                });

            },
            onSearchFAD1: function (oEvent) {
                let bFiltro = false,
                    sErrore = "",
                    aFilter = [],
                    fMultifilter;
                if (!this.byId("idFilterSocietaFAD1").getValue() || this.byId("idFilterSocietaFAD1").getValue() === "") {
                    bFiltro = true;
                    sErrore = "Valorizzare il filtro Società";
                } else {
                    aFilter.push(new Filter("Societa", FilterOperator.EQ, this.byId("idFilterSocietaFAD1").getValue()));
                }
                if (this.byId("idFilterFornitoreFAD1").getValue() && this.byId("idFilterFornitoreFAD1").getValue().length !== 0) {
                    let aFilterFornitore = [];
                    this.byId("idFilterFornitoreFAD1").getValue().forEach(x => {
                        aFilterFornitore.push(new Filter("Fornitore", FilterOperator.EQ, x.getKey().padStart(10, "0")));
                    });
                    aFilter.push(new Filter({
                        filters: aFilterFornitore,
                        and: false
                    }));
                }
                if (!this.byId("idFilterDataRegistrazioneBollaFAD1").getValue() || this.byId("idFilterDataRegistrazioneBollaFAD1").getValue() === "") {
                    bFiltro = true;
                    sErrore = "Valorizzare il filtro Data Registrazione Bolla";
                } else {
                    let dFirstDate = this.byId("idFilterDataRegistrazioneBollaFAD1").getDateValue(),
                        dSecondDate = this.byId("idFilterDataRegistrazioneBollaFAD1").getSecondDateValue();
                    aFilter.push(new Filter("DataRegistrazioneBolla", FilterOperator.BT, dFirstDate.getFullYear() + String(dFirstDate.getMonth() + 1).padStart(2, "0") + String(dFirstDate.getDate()).padStart(2, "0"), dSecondDate.getFullYear() + String(dSecondDate.getMonth() + 1).padStart(2, "0") + String(dSecondDate.getDate()).padStart(2, "0")));
                }
                if (!this.byId("idFilterCodicePercentualeFAD1").getValue() || this.byId("idFilterCodicePercentualeFAD1").getValue() === "") {
                    bFiltro = true;
                    sErrore = "Valorizzare il filtro Codice Percentuale";
                } else {
                    aFilter.push(new Filter("CodicePercentualeAcconto", FilterOperator.EQ, this.byId("idFilterCodicePercentualeFAD1").getValue()));
                }
                fMultifilter = this.multiFilter("idFilterProduttoreFAD1", "Produttore");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterOrgAcquistiFAD1", "OrgAcquisti");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterNumeroBollaFAD1", "NumeroBolla");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterTipoMaterialeFAD1", "TipoMateriale");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterSpecieFAD1", "Specie");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterStagionalitaFAD1", "Stagionalita");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterVarietaFAD1", "Varieta");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterCertificazioneAziendaleFAD1", "CertificazioneAziendale");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterCertificazioneProdottoFAD1", "CertificazioneProdotto");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterResiduoFAD1", "Residuo");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterCertificazioneCommercialeFAD1", "CertificazioneCommerciale");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterSpecificaFAD1", "Specifica");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterLavorazioneFAD1", "Lavorazione");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterOrigineFAD1", "Origine");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterQualitaFAD1", "Qualita");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterCalibrazioneFAD1", "Calibrazione");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterEventiColtivazioneFAD1", "EventiColtivazione");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterCaratteristicaRaccoltaFAD1", "CaratteristicaRaccolta");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioRaccoltaFAD1", "ServizioRaccolta");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioCaricoFAD1", "ServizioCarico");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioAssistenzaFAD1", "ServizioAssistenza");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioDepositoFAD1", "ServizioDeposito");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioCalibrazioneFAD1", "ServizioCalibrazione");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioExtra1FAD1", "ServizioExtra1");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioExtra2FAD1", "ServizioExtra2");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioExtra3FAD1", "ServizioExtra3");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioExtra4FAD1", "ServizioExtra4");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterServizioExtra5FAD1", "ServizioExtra5");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterRaggruppamentoLiquidazioneFAD1", "RaggruppamentoLiquidazione");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterCampoPoliticheOPFAD1", "CampoPoliticheOP");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterIncotermFAD1", "Incoterm");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterZonaTrasportoFAD1", "ZonaTrasporto");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                fMultifilter = this.multiFilter("idFilterMagazzinoFAD1", "Magazzino");
                if (fMultifilter) {
                    aFilter.push(fMultifilter);
                }
                if (this.byId("idFilterEsercizioCompetenzaFAD1").getValue()) {
                    aFilter.push(new Filter("EsercizioCompetenza", FilterOperator.EQ, this.byId("idFilterEsercizioCompetenzaFAD1").getValue()));
                }

                if (!bFiltro) {
                    this.oGlobalBusyDialog.open();
                    this.getView().getModel().read("/FADBolleConferimentoSet", {
                        filters: aFilter,
                        success: (oDataFAD1) => {
                            let oJSONTableModel = new sap.ui.model.json.JSONModel(oDataFAD1.results);
                            this.getView().setModel(oJSONTableModel, "FAD1Model");
                            let oTable = this.byId("idTableFAD1");
                            oTable.getColumns().map((col, index) => oTable.autoResizeColumn(index));
                            this.oGlobalBusyDialog.close();
                        },
                        error: () => {
                            this.oGlobalBusyDialog.close();
                            sap.m.MessageToast.show("Errore di connessione");
                        }
                    });
                } else {
                    sap.m.MessageToast.show(sErrore);
                }
            },
            onSearchFAD2: function (oEvent) {
                let bFiltro = false,
                    sErrore = "";
                if (!this.byId("idFilterSocietaFAD2").getValue() || this.byId("idFilterSocietaFAD2").getValue() === "") {
                    bFiltro = true;
                    sErrore = "Valorizzare il filtro Società";
                }
                if (!bFiltro) {
                    this.getView().byId("idSimulaFatturaFAD2").setVisible(true);
                } else {
                    this.getView().byId("idSimulaFatturaFAD2").setVisible(false);
                    sap.m.MessageToast.show(sErrore);
                }
            },
            /*onSocieta: function (oEvent) {
                let sCompany = oEvent.getParameter("value"),
                    oBinding = this.byId("idFilterOrgAcquistiFAD1").getContent().getBinding("items"),
                    oFilter = new Filter("Bukrs", FilterOperator.EQ, sCompany);
                oBinding.filter([oFilter]);
            },*/
            onSimulaFatturaFAD1: function () {
                let gettingInternalTable = this.byId("idTableFAD1"),
                    oSelIndices = gettingInternalTable.getSelectedIndices(),
                    aSelected = [],
                    oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if (oSelIndices !== undefined && oSelIndices.length > 0) {
                    for (let i of oSelIndices) {
                        let oRow = gettingInternalTable.getContextByIndex(i).getObject();
                        aSelected.push(oRow);
                    }
                    this.getOwnerComponent().setNavigation(aSelected);
                    oRouter.navTo("FAD1Detail");
                } else {
                    sap.m.MessageToast.show("Selezionare almeno una riga");
                }
            },
            onSalvaFatturaFAD1: function () {
                let gettingInternalTable = this.byId("idTableFAD1"),
                    oSelIndices = gettingInternalTable.getSelectedIndices(),
                    aSelected = [],
                    oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if (this.byId("idEsercizioCompetenza").getValue() && this.byId("idDataDocumento").getValue()) {
                    if (oSelIndices !== undefined && oSelIndices.length > 0) {
                        this.oGlobalBusyDialog.open();
                        for (let i of oSelIndices) {
                            let oRow = gettingInternalTable.getContextByIndex(i).getObject();
                            aSelected.push(oRow);
                        }
                        /*
                        this.getView().getModel().read("/PercentualeIVASet('" + this.byId("idCodiceIVA").getValue() + "')", {
                            success: (oDataIVA) => {
                                let oPromiseNFattura = Promise.resolve();
                                aSelected.forEach(x => {
                                    if (x.Delega) {
                                        let oRow = {
                                            Fornitore: x.Fornitore,
                                            Esercizio: this.byId("idEsercizioCompetenza").getValue(),
                                            TipoMateriale: x.TipoMateriale,
                                            Societa: x.Societa,
                                            NumFattura: ""
                                        };
                                        oPromiseNFattura = oPromiseNFattura.then(() => {
                                            return this.createNFattura(oRow, x);
                                        });
                                    }
                                });
                                Promise.all([oPromiseNFattura]).then(() => {
                                    //this.IVA = oDataIVA.Kbetr;
                                    */
                        let oPromiseStorico = Promise.resolve();
                        aSelected.forEach(x => {
                            let oRow = {
                                CodicePercentualeAcconto: x.CodicePercentualeAcconto,
                                CostoAssistenza: x.CostoAssistenza,
                                CostoCalibrazione: x.CostoCalibrazione,
                                CostoCarico: x.CostoCarico,
                                CostoDeposito: x.CostoDeposito,
                                CostoExtra1: x.CostoExtra1,
                                CostoExtra2: x.CostoExtra2,
                                CostoExtra3: x.CostoExtra3,
                                CostoExtra4: x.CostoExtra4,
                                CostoExtra5: x.CostoExtra5,
                                CostoRaccolta: x.CostoRaccolta,
                                Fornitore: x.Fornitore,
                                Maggiorazione1: x.Maggiorazione1,
                                Maggiorazione10: x.Maggiorazione10,
                                Maggiorazione2: x.Maggiorazione2,
                                Maggiorazione3: x.Maggiorazione3,
                                Maggiorazione4: x.Maggiorazione4,
                                Maggiorazione5: x.Maggiorazione5,
                                Maggiorazione6: x.Maggiorazione6,
                                Maggiorazione7: x.Maggiorazione7,
                                Maggiorazione8: x.Maggiorazione8,
                                Maggiorazione9: x.Maggiorazione9,
                                MarkUp: x.MarkUp,
                                NumeroBolla: x.NumeroBolla,
                                PercentualeAcconto: x.PercentualeAcconto,
                                PosizioneBolla: x.PosizioneBolla,
                                PrezzoBase: x.PrezzoBase,
                                PrezzoLordo: x.PrezzoLordo,
                                PrezzoTrasporto: x.PrezzoTrasporto,
                                Societa: x.Societa,
                                Specie: x.Specie,
                                Stagionalita: x.Stagionalita,
                                TipoListino: x.TipoListino,
                                EsercizioCompetenza: this.byId("idEsercizioCompetenza").getValue(),
                                DataDocumento: this.byId("idDataDocumento").getValue(),
                                IVA: x.IVA
                            };
                            /* if (x.Delega) {
                                 oRow.Zfattura = x.NumFattura;
                             } */
                            oPromiseStorico = oPromiseStorico.then(() => {
                                return this.createStorico(oRow);
                            });
                        });
                        Promise.all([oPromiseStorico]).then(() => {
                            //oRouter.navTo("FAD1Detail");
                            sap.m.MessageToast.show("MESSAGGIO DI SUCCESSO E AZIONE");
                            this.oGlobalBusyDialog.close();
                        }, () => {
                            sap.m.MessageToast.show("Errore nella scrittura nello storico");
                            this.oGlobalBusyDialog.close();
                        });
                        /*
                    }, () => {
                        sap.m.MessageToast.show("Errore nella creazione del numero protocollo");
                        this.oGlobalBusyDialog.close();
                    });
                   
                    },
                    error: () => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Errore di connessione");
                    }
                });
                 */
                    } else {
                        sap.m.MessageToast.show("Selezionare almeno una riga");
                    }
                } else {
                    sap.m.MessageToast.show("Compilare Esercizio Competenza e Data Documento");
                }
            },
            onSimulaFatturaFAD2: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oGlobalBusyDialog.open();
                if (this.byId("idEsercizioCompetenza2").getValue() && this.byId("idDataDocumento2").getValue() && this.byId("idCodiceIVA2").getValue() && this.byId("idImportoAcconto2").getValue()) {
                    let oPromiseStorico = Promise.resolve();
                    if (this.byId("idFilterFornitoreFAD2").getValue().length > 0) {
                        this.byId("idFilterFornitoreFAD2").getValue().forEach(x => {
                            let oRow = {
                                Societa: this.getView().byId("idFilterSocietaFAD2").getValue(),
                                Fornitore: x.getKey().padStart(10, "0"),
                                Specie: this.byId("idFilterSpecieFAD2").getValue(),
                                Stagionalita: this.byId("idFilterStagionalitaFAD2").getValue(),
                                EsercizioCompetenza: this.byId("idEsercizioCompetenza2").getValue(),
                                DataDocumento: this.byId("idDataDocumento2").getDateValue(),
                                ImportoAcconto: this.byId("idImportoAcconto2").getValue(),
                                CodiceIVA: this.byId("idCodiceIVA2").getValue()
                            };
                            oPromiseStorico = oPromiseStorico.then(() => {
                                return this.createStoricoFAD2(oRow);
                            });
                        });
                    } else {
                        let oRow = {
                            Societa: this.getView().byId("idFilterSocietaFAD2").getValue(),
                            Fornitore: "",
                            Specie: this.byId("idFilterSpecieFAD2").getValue(),
                            Stagionalita: this.byId("idFilterStagionalitaFAD2").getValue(),
                            EsercizioCompetenza: this.byId("idEsercizioCompetenza2").getValue(),
                            DataDocumento: this.byId("idDataDocumento2").getDateValue(),
                            ImportoAcconto: this.byId("idImportoAcconto2").getValue(),
                            CodiceIVA: this.byId("idCodiceIVA2").getValue()
                        };
                        oPromiseStorico = oPromiseStorico.then(() => {
                            return this.createStoricoFAD2(oRow);
                        });
                    }

                    Promise.all([oPromiseStorico]).then(() => {
                        //oRouter.navTo("FAD2Detail");
                        sap.m.MessageToast.show("MESSAGGIO DI SUCCESSO E AZIONE");
                        this.oGlobalBusyDialog.close();
                    }, () => {
                        sap.m.MessageToast.show("Errore nella scrittura nello storico");
                        this.oGlobalBusyDialog.close();
                    });
                } else {
                    sap.m.MessageToast.show("Compilare Esercizio Competenza, Data Documento, Importo Acconto e Codice IVA");
                }
            },
            multiFilter: function (idField, sField) {
                if (this.byId(idField).getValue() && this.byId(idField).getValue().length > 0) {
                    let aFilterMulti = [];
                    this.byId(idField).getValue().forEach(x => {
                        aFilterMulti.push(new Filter(sField, FilterOperator.EQ, x));
                    });
                    return (new Filter({
                        filters: aFilterMulti,
                        and: false
                    }));
                } else {
                    return null;
                }
            },
            createNFattura: function (oRow, oSelezionato) {
                var oModel = this.getView().getModel();
                return new Promise((resolve, reject) => {
                    oModel.create("/NumeroFatturaSet", oRow, {
                        success: (oData) => {
                            oSelezionato.NumFattura = oData.NumFattura;
                            resolve();
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    });
                });
            },
            createStorico: function (oRow) {
                var oModel = this.getView().getModel();
                return new Promise((resolve, reject) => {
                    oModel.create("/FADBolleConferimentoSet", oRow, {
                        success: () => {
                            resolve();
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    });
                });
            },
            createStoricoFAD2: function (oRow) {
                return new Promise((resolve, reject) => {
                    this.getView().getModel().create("/FAD2Set", oRow, {
                        success: () => {
                            resolve();
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    });
                });
            },
            _APIGet: function (oModel, sEntitySet, select, filters) {// [Gheorghe]
                var aReturn = {
                    returnStatus: false,
                    data: []
                };
                var that = this;
                return new Promise(function (resolve, reject) {
                    oModel.read(sEntitySet, {
                        urlParameters: {
                            "$format": "json",
                            "$select": select
                        },
                        filters: [filters],
                        success: function (oData) {
                            //
                            aReturn.returnStatus = true;
                            if (oData.results) {
                                aReturn.data = oData.results;
                            } else {
                                aReturn.data = oData;
                            }
                            resolve(aReturn.data);
                        },
                        error: function (e) {

                            that.oGlobalBusyDialog.close();
                            aReturn.returnStatus = false;
                            reject(e);
                        }
                    });
                });
            },
            onValueHelpRequest: async function (dynamicModel, event, field) {// [Gheorghe]
                var oView = this.getView(),
                    arrayRes = [],
                    Modello = "";
                if (dynamicModel === "dynamicModel3") {
                    Modello = "3M";
                } else if (dynamicModel === "dynamicModel2") {
                    Modello = "2M";
                }
                this.oGlobalBusyDialog.open();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "it.orogel.cruscottoconferimento.view.Fragments.DynamicFrag" + Modello,
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                if (field === 'EKORG') {
                    var aFilter = [];
                    let oFinalFilter = new Filter({
                        filters: [],
                        and: true
                    });
                    aFilter.push(new Filter("PurchasingOrganization", sap.ui.model.FilterOperator.NE, "0001"));
                    aFilter.push(new Filter("PurchasingOrganization", sap.ui.model.FilterOperator.NE, "0002"));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                    var results = await this._APIGet(this.getOwnerComponent().getModel("ekorgModel"), "/C_PurchasingOrganizationVHTemp", "PurchasingOrganization,PurchasingOrganizationName", oFinalFilter)
                    results.forEach(e => {
                        var obj = { key: e.PurchasingOrganization, text: e.PurchasingOrganizationName, type: field }
                        arrayRes.push(obj)
                    });
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);

                } else if (field === 'ZCAUSALE2' || field === 'ZCAUSALE3' || field === 'ZCAUSALE4') {

                    var results = await this._APIGet(this.getOwnerComponent().getModel("causaleModel"), "/ZZ1_CONFCAUSALE", "CAUSALE,ZTEXT", new Filter("ACTIVE", FilterOperator.EQ, true))
                    results.forEach(e => {
                        var obj = { key: e.CAUSALE, text: e.ZTEXT, type: field }
                        arrayRes.push(obj)
                    });
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(false)
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);

                } else if (field === 'ZCAUSALE') {
                    var results = await this._APIGet(this.getOwnerComponent().getModel(), "/ConfCausaleStoricoSet", "ZCAUSALE,ZTEXT")
                    results.forEach(e => {
                        var obj = { key: e.ZCAUSALE, text: e.ZTEXT, type: field }
                        arrayRes.push(obj)
                    });
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);

                } else if (field === 'LIFNR') {

                    var results = await this._APIGet(this.getOwnerComponent().getModel("lifnrModel"), "/A_Supplier", "Supplier,SupplierName")
                    results.forEach(e => {
                        var obj = { key: e.Supplier, text: e.SupplierName, type: field }
                        arrayRes.push(obj)
                    });
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);

                } else if (field === 'VARIETA' || field === 'SPECIFICA' || field === 'LAVORAZIONE' || field === 'QUALITA' || field === 'CALIBRAZIONE') {
                    var aMultifilter = this.byId("iSPECIE");
                    if (aMultifilter.getTokens().length > 0) {
                        var aFilter = [];
                        aFilter.push(new Filter("Zattr", sap.ui.model.FilterOperator.EQ, 'SPECIE'));
                        aFilter.push(new Filter("Zname", sap.ui.model.FilterOperator.EQ, field));
                        aMultifilter.getTokens().forEach(e => {
                            aFilter.push(new Filter("Zvalue", sap.ui.model.FilterOperator.EQ, e.mProperties.key));
                        });

                        var aResults = await this._APIGet(this.getOwnerComponent().getModel("atributiModel"), "/ZMM_ATTR_POS1Set", "ZvalueInf,Zdescr", aFilter)
                        aResults.forEach(e => {
                            var obj = { key: e.ZvalueInf, text: e.Zdescr, type: field }
                            arrayRes.push(obj)
                        });
                    }
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);

                } else if (field === 'ZSTATO') {
                    var aFilter = [];
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/StatoSet", "Chiave,Descrizione", aFilter)
                    aResults.forEach(e => {
                        var obj = { key: e.Chiave, text: e.Descrizione, type: field }
                        arrayRes.push(obj)
                    });
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                } else { // Caso singolo di Specie e tutti gli attributi recuperabili nella HEAD
                    var aFilter = [];
                    if (field === 'SPECIE2' || field === 'SPECIEM2') {
                        aFilter.push(new Filter("Zattr", sap.ui.model.FilterOperator.EQ, 'SPECIE'));
                    } else if (field === 'STAGIONALITA2' || field === 'STAGIONALITAM2') {
                        aFilter.push(new Filter("Zattr", sap.ui.model.FilterOperator.EQ, 'STAGIONALITA'));
                    } else {
                        aFilter.push(new Filter("Zattr", sap.ui.model.FilterOperator.EQ, field));
                    }
                    aFilter.push(new Filter("Zdel", sap.ui.model.FilterOperator.NE, "X"));
                    aFilter.push(new Filter("ZdatFrom", FilterOperator.LE, new Date().toJSON().slice(0, 19)));
                    aFilter.push(new Filter("ZdatTo", FilterOperator.GE, new Date().toJSON().slice(0, 19)));
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel("atributiModel"), "/ZMM_ATTR_HEADSet", "Zvalue,Zdescr", aFilter)
                    aResults.forEach(e => {
                        var obj = { key: e.Zvalue, text: e.Zdescr, type: field }
                        arrayRes.push(obj)
                    });
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                }

                this.refresh("dynamicModel");
                this.oGlobalBusyDialog.close();
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));
                //if (field === 'ZCAUSALE' || field === 'ZCAUSALE2' || field === 'ZCAUSALE3' || field === 'ZCAUSALE4') {
                if (field === 'ZCAUSALE2' || field === 'ZCAUSALE3' || field === 'ZCAUSALE4' || field === 'SPECIEM2' || field === 'STAGIONALITAM2') {
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(false)
                } else {
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(true)
                }
            },
            onValueHelpStati: async function (event, TypeField) {
                var oView = this.getView(),
                    Row = {},
                    arrayRes = [],
                    oTable = this.getView().byId("TableStoricoRecap"),
                    oSelIndices = oTable.getSelectedIndices(),
                    aFilter = [];
                const oAppModel = this.getView().getModel("appModel");
                if (TypeField === "StatoRow") {
                    Row = event.getSource().getBindingContext().getObject();
                }
                if (TypeField !== "StatoA" || oAppModel.getProperty("/StatoDa")) {
                    this.oGlobalBusyDialog.open();
                    if (!this._statiValueHelpDialog) {
                        this._statiValueHelpDialog = Fragment.load({
                            id: oView.getId(),
                            name: "it.orogel.cruscottoconferimento.view.Fragments.StatiFrag",
                            controller: this
                        }).then(function (oValueHelpDialog) {
                            oView.addDependent(oValueHelpDialog);
                            return oValueHelpDialog;
                        });
                    }
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/StatoSet", "Chiave,Descrizione", aFilter);

                    var StatCostant = Constants.CAMBIOSTATO;
                    aResults.forEach(e => {
                        var obj = { key: e.Chiave, text: e.Descrizione, type: TypeField }
                        arrayRes.push(obj)
                    });
                    if (TypeField === "StatoDa") {
                        var RowsBefore = oAppModel.getProperty("/rowsStoricoRecap");
                        //arrayRes = arrayRes.filter(y => StatCostant[y.key] && RowsBefore.find(z => z.Zstatus === y.key));
                        arrayRes = arrayRes.filter(y => StatCostant[y.key] && oSelIndices.filter(z => oTable.getContextByIndex(z).getObject().Zstatus === y.key).length > 0);
                    } else if (TypeField === "StatoRow") {
                        var RowsBefore = oAppModel.getProperty("/rowsStoricoRecapBefore"),
                            RowFind = RowsBefore.find(x => x.Zidstorico === Row.Zidstorico &&
                                //x.Zprogsdi === Row.Zprogsdi &&
                                x.Znumprot === Row.Znumprot &&
                                x.Ziva === Row.Ziva);
                        if (RowFind) {
                            arrayRes = arrayRes.filter(y => StatCostant[RowFind.Zstatus].find(z => z === y.key));
                            if (!RowFind.IndirizzoMail && RowFind.Zstatus === "P") {
                                arrayRes = arrayRes.filter(y => StatCostant["P2"].find(z => z === y.key));
                            }
                            oAppModel.setProperty("/RowStateChange", Row);
                        }
                    } else {
                        var StatoDa = oAppModel.getProperty("/StatoDa");
                        arrayRes = arrayRes.filter(y => StatCostant[StatoDa].find(z => z === y.key));
                    }
                    this.getOwnerComponent().getModel("statiModel").setData(arrayRes);
                    this.oGlobalBusyDialog.close();
                    this._statiValueHelpDialog.then(function (oValueHelpDialog) {
                        oValueHelpDialog.open();
                    }.bind(this));
                    this.byId("_IDGenSelectDialog1Stati").setMultiSelect(false);
                } else {
                    sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.SelezionaA.text"));
                }
            },
            _handleValueHelpCloseStati: function (evt) {
                var aSelectedItems = evt.getParameter("selectedItems"),
                    oStato = this.getOwnerComponent().getModel("statiModel").getData()[0];
                if (oStato.type === "StatoRow") {
                    const oAppModel = this.getView().getModel("appModel");
                    var Row = oAppModel.getProperty("/RowStateChange");
                    if (Row) {
                        Row.Zstatus = aSelectedItems[0].getTitle();
                        Row.Zdescrizionestatus = aSelectedItems[0].getDescription();
                    }
                } else {
                    const oAppModel = this.getView().getModel("appModel");
                    oAppModel.setProperty("/" + oStato.type, aSelectedItems[0].getTitle());
                    oAppModel.setProperty("/" + oStato.type + "Description", aSelectedItems[0].getDescription());
                }
                this.getView().getModel("appModel").refresh(true);
            },
            onCloseModificaStato: function () {
                this._ModificaStatoValueHelpDialog.close();
                this._ModificaStatoValueHelpDialog.destroy();
                this._ModificaStatoValueHelpDialog = null;
            },

            onModificaManualeStato: function () {
                const oAppModel = this.getView().getModel("appModel");
                var oTable = this.byId("TableStoricoRecap"),
                    oSelIndices = oTable.getSelectedIndices(),
                    Rows = [];
                oSelIndices.forEach(item => {
                    Rows.push(oTable.getContextByIndex(item).getObject());
                });
                //var Rows = oAppModel.getProperty("/rowsStoricoRecap");
                oAppModel.setProperty("/rowsStoricoRecapBefore", JSON.parse(JSON.stringify(Rows)));
                var StatCostant = Constants.CAMBIOSTATO;
                var RowsFiltered = Rows.filter(y => StatCostant[y.Zstatus]);
                RowsFiltered.forEach(x => {
                    x.Updatable = true;
                });
                var RowsFilteredS = Rows.filter(y => y.Zstatus === "S");
                RowsFilteredS.forEach(x => {
                    x.UpdatableProgsdi = true;
                });
                oAppModel.refresh(true);
                this.onCloseModificaStato();
            },
            onConfermaModificaMassivaStato: function () {
                const oAppModel = this.getView().getModel("appModel");
                //var Rows = oAppModel.getProperty("/rowsStoricoRecap"),
                var oTable = this.byId("TableStoricoRecap"),
                    oSelIndices = oTable.getSelectedIndices(),
                    Rows = [],
                    StatoDa = oAppModel.getProperty("/StatoDa"),
                    StatoA = {
                        "Zstatus": oAppModel.getProperty("/StatoA")
                    },
                    RowsChange = [];
                oSelIndices.forEach(item => {
                    Rows.push(oTable.getContextByIndex(item).getObject());
                });
                var RowsStoricoRecap = oAppModel.getProperty("/rowsStoricoRecap")
                RowsChange = Rows.filter(x => x.Zstatus === StatoDa && (x.Zstatus !== "P" || x.IndirizzoMail || oAppModel.getProperty("/StatoA") !== "S"));
                var RowsChangeRecap = [];
                RowsChange.forEach(y => {
                    var RowFind = RowsStoricoRecap.filter(x => x.Zidstorico === y.Zidstorico &&
                        x.Znumprot === y.Znumprot);
                    if (RowFind.length > 0) {
                        //RowsChangeRecap.push(RowFind);
                        RowsChangeRecap = RowsChangeRecap.concat(RowFind);
                    }
                });
                var batchChanges = [];
                var sServiceUrl = "/sap/opu/odata/sap/ZCRUSCOTTOCONFERIMENTO_SRV/";
                var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
                RowsChangeRecap.forEach(x => {
                    //                    if (!x.IndirizzoMail || StatoA.Zstatus !== "S") {
                    //var ModifyString = "ZCONFSTORRECAPSet(Zidstorico='" + x.Zidstorico + "',Zprogsdi='" + x.Zprogsdi + "',Znumprot='" + x.Znumprot + "',Ziva=" + x.Ziva + "m)";
                    var ModifyString = "ZCONFSTORRECAPSet(Zidstorico='" + x.Zidstorico + "',Znumprot='" + x.Znumprot + "',Ziva=" + x.Ziva + "m)";
                    batchChanges.push(oDataModel.createBatchOperation(encodeURIComponent(ModifyString), "PATCH", StatoA));
                    //                    }
                });
                oDataModel.addBatchChangeOperations(batchChanges);
                if (batchChanges.length === 0) {
                    sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.noCambioStato.text"));
                    this.oGlobalBusyDialog.close();
                    this.onCloseModificaStato();
                } else {
                    const oPromiseBatch = new Promise((resolve, reject) => {
                        oDataModel.submitBatch(function (data, responseProcess) {
                            resolve();
                        }.bind(this),
                            function (err) {
                                reject();
                            });
                    });
                    oPromiseBatch.then(() => {
                        sap.m.MessageToast.show("Successo");
                        this.oGlobalBusyDialog.close();
                        this.onCloseModificaStato();
                        this.onFilterSearchFAD3();
                    }, oError => {
                        sap.m.MessageToast.show("Errore");
                        this.oGlobalBusyDialog.close();
                    });
                }
            },
            onValueHelpText: async function (event, TypeField) {
                var oView = this.getView(),
                    arrayRes = [];
                this.oGlobalBusyDialog.open();
                if (!this._textValueHelpDialog) {
                    this._textValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "it.orogel.cruscottoconferimento.view.Fragments.DynamicTable",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                var results = await this._APIGet(this.getOwnerComponent().getModel("testiModel"), "/ZZ1_CRUSCOTTOCONFTESTI", "Codifica,Testo")
                results.forEach(e => {
                    var obj = { ZID: e.Codifica, ZDESCRID: e.Testo, Type: TypeField }
                    arrayRes.push(obj)
                });
                this.getOwnerComponent().getModel("textModel").setData(arrayRes);
                this.oGlobalBusyDialog.close();
                this._textValueHelpDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));
            },
            onValueHelpTextNotaCredito: async function (event, TypeField) {
                var oView = this.getView(),
                    arrayRes = [];
                this.oGlobalBusyDialog.open();
                if (!this._textValueNotaCreditoHelpDialog) {
                    this._textValueNotaCreditoHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "it.orogel.cruscottoconferimento.view.Fragments.DynamicTableNotaCredito",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                var results = await this._APIGet(this.getOwnerComponent().getModel("testiModel"), "/ZZ1_CRUSCOTTOCONFTESTI", "Codifica,Testo")
                results.forEach(e => {
                    var obj = { ZID: e.Codifica, ZDESCRID: e.Testo, Type: TypeField }
                    arrayRes.push(obj)
                });
                this.getOwnerComponent().getModel("textModel").setData(arrayRes);
                this.oGlobalBusyDialog.close();
                this._textValueNotaCreditoHelpDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));
            },
            onValueHelpTextCambioRegimeFiscale: async function (event, TypeField) {
                var oView = this.getView(),
                    arrayRes = [];
                this.oGlobalBusyDialog.open();
                if (!this._textValueCambioRegimeFiscaleHelpDialog) {
                    this._textValueCambioRegimeFiscaleHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "it.orogel.cruscottoconferimento.view.Fragments.DynamicTableCambioRegimeFiscale",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                var results = await this._APIGet(this.getOwnerComponent().getModel("testiModel"), "/ZZ1_CRUSCOTTOCONFTESTI", "Codifica,Testo")
                results.forEach(e => {
                    var obj = { ZID: e.Codifica, ZDESCRID: e.Testo, Type: TypeField }
                    arrayRes.push(obj)
                });
                this.getOwnerComponent().getModel("textModel").setData(arrayRes);
                this.oGlobalBusyDialog.close();
                this._textValueCambioRegimeFiscaleHelpDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));
            },
            onValueHelpRequestConferimento: async function (dynamicModel, event, field) {// [Gheorghe]
                var oView = this.getView(),
                    arrayRes = [],
                    Modello = "";
                if (dynamicModel === "dynamicModel3") {
                    Modello = "3M";
                } else if (dynamicModel === "dynamicModel2") {
                    Modello = "2M";
                }
                this.oGlobalBusyDialog.open();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "it.orogel.cruscottoconferimento.view.Fragments.DynamicFrag" + Modello,
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                //this.byId("_IDGenSelectDialog1"+Modello).setMultiSelect(true)

                if (field === 'BUKRS' || field === 'BUKRS2') {

                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/SocietaSet", "Bukrs,Butxt")
                    aResults.forEach(e => {
                        var obj = { key: e.Bukrs, text: e.Butxt, type: field }
                        arrayRes.push(obj)
                    });
                    if (arrayRes.length > 0) {
                        this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(false)
                    }
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                } else if (field === 'LIFNR' || field === 'LIFN2' || field === 'LIFNR2') {
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/FornitoreSet", "Lifnr,Name1")

                    aResults.forEach(e => {
                        var obj = { key: e.Lifnr, text: e.Name1, type: field }
                        arrayRes.push(obj)
                    });
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(true)
                } else if (field === 'UNSEZ') {
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/NumeroDDTSet", "Unsez")
                    aResults.forEach(e => {
                        var obj = { key: e.Unsez, text: e.Unsez, type: field }
                        arrayRes.push(obj)
                    });

                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(true)
                } else if (field === 'IHREZ') {
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/NumeroBollaSet", "Ihrez")
                    aResults.forEach(e => {
                        var obj = { key: e.Ihrez, text: e.Ihrez, type: field }
                        arrayRes.push(obj)
                    });

                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(true)
                } else if (field === 'MTART') {
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/TipoMaterialeSet", "Mtart")
                    aResults.forEach(e => {
                        var obj = { key: e.Mtart, text: e.Mtart, type: field }
                        arrayRes.push(obj)
                    });

                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(true)
                } else if (field === 'LGORT') {
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/MagazzinoSet", "Lgort")
                    aResults.forEach(e => {
                        var obj = { key: e.Lgort, text: e.Lgort, type: field }
                        arrayRes.push(obj)
                    });

                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(true)
                } else if (field === 'ZCONFIVA' || field === 'ZCONFIVAM2') {
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/ConfIVASet", "Taxm1,Ziva")
                    aResults.forEach(e => {
                        var obj = { key: e.Taxm1, text: e.Ziva, type: field }
                        arrayRes.push(obj)
                    });
                    if (arrayRes.length > 0) {
                        this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(false)
                    }
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                }

                this.refresh(dynamicModel);
                this.oGlobalBusyDialog.close();
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));


            },
            handleTableClose: function (evt) {
                var aSelectedItems = evt.getParameter("selectedItem").getBindingContext("textModel").getObject();
                if (aSelectedItems) {
                    const oAppModel = this.getView().getModel("appModel");
                    oAppModel.setProperty("/" + aSelectedItems.Type, aSelectedItems.ZID);
                }
            },
            handleTableNotaCreditoClose: function (evt) {
                var aSelectedItems = evt.getParameter("selectedItem").getBindingContext("textModel").getObject();
                if (aSelectedItems) {
                    const oModel = this.getView().getModel("notaCreditoModel");
                    oModel.setProperty("/" + aSelectedItems.Type, aSelectedItems.ZID);
                }
            },
            handleTableCambioRegimeFiscaleClose: function (evt) {
                var aSelectedItems = evt.getParameter("selectedItem").getBindingContext("textModel").getObject();
                if (aSelectedItems) {
                    const oModel = this.getView().getModel("cambioRegimeFiscaleModel");
                    oModel.setProperty("/" + aSelectedItems.Type, aSelectedItems.ZID);
                }
            },
            _handleValueHelpClose: function (dynamicModel, evt) {// [Gheorghe]
                var aSelectedItems = evt.getParameter("selectedItems"),
                    aContexts = evt.getParameter("selectedContexts"),
                    Modello = "",
                    oBinding = evt.getSource().getBinding("items");
                if (dynamicModel === "dynamicModel3") {
                    Modello = "M3";
                } else if (dynamicModel === "dynamicModel2") {
                    Modello = "M2";
                }
                if (aSelectedItems || aContexts) {
                    let kAttributi = CostantiAttributi.ATTR;
                    var type = this.getOwnerComponent().getModel(dynamicModel).getData()[0].type;
                    switch (type) {
                        case type:
                            var oMultiInput = this.byId(kAttributi[type].id + Modello);
                            break;
                        default:
                            break;
                    }
                    var that = this;
                    if (aSelectedItems && aSelectedItems.length > 0) {
                        aSelectedItems.forEach(function (oItem) {
                            //if (type === 'BUKRS' || type === 'BUKRS2' || type === 'ZCAUSALE2' || type === 'ZCAUSALE') {
                            if (type === 'BUKRS' || type === 'BUKRS2' || type === 'ZCAUSALE2' || type === 'SPECIEM2' || type === 'STAGIONALITAM2' || type === 'ZCONFIVAM2') {
                                oMultiInput.setValue(oItem.getTitle())
                                if (type === 'ZCONFIVAM2') {
                                    that.getOwnerComponent().getModel(dynamicModel).setProperty("/ZCONFIVAValore", oItem.getDescription())
                                }
                            } else {
                                oMultiInput.addToken(new Token({
                                    key: oItem.getTitle(),
                                    text: oItem.getDescription()
                                }));
                            }
                        });
                    } else if (aContexts && aContexts.length > 0) {
                        aContexts.map(function (oItem) {
                            oMultiInput.addToken(new Token({
                                key: oItem.getObject().key,
                                text: oItem.getObject().text
                            }));
                        });
                    }
                }
                if (dynamicModel === "dynamicModel3") {
                    Modello = "3M";
                } else if (dynamicModel === "dynamicModel2") {
                    Modello = "2M";
                }
                this.byId("_IDGenSelectDialog1" + Modello).destroy();
                this._pValueHelpDialog = null;
                oBinding.filter([]);
            },
            _handleValueHelpSearch: function (oEvent) {// [Gheorghe]
                var sValue = oEvent.getParameter("value"),
                    oBinding = oEvent.getSource().getBinding("items"),
                    oFinalFilter = new Filter({
                        filters: [],
                        and: false
                    });
                oFinalFilter.aFilters.push(new Filter("text", FilterOperator.Contains, sValue));
                oFinalFilter.aFilters.push(new Filter("key", FilterOperator.Contains, sValue));

                oBinding.filter([oFinalFilter]);
            },
            _handleValueHelpSearch: function (oEvent) {// [Gheorghe]
                var sValue = oEvent.getParameter("value"),
                    oBinding = oEvent.getSource().getBinding("items"),
                    oFinalFilter = new Filter({
                        filters: [],
                        and: false
                    });
                oFinalFilter.aFilters.push(new Filter("text", FilterOperator.Contains, sValue));
                oFinalFilter.aFilters.push(new Filter("key", FilterOperator.Contains, sValue));

                oBinding.filter([oFinalFilter]);
            },
            handleTableSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value"),
                    oBinding = oEvent.getSource().getBinding("items"),
                    oFinalFilter = new Filter({
                        filters: [],
                        and: false
                    });
                oFinalFilter.aFilters.push(new Filter("ZID", FilterOperator.Contains, sValue));
                oFinalFilter.aFilters.push(new Filter("ZDESCRID", FilterOperator.Contains, sValue));

                oBinding.filter([oFinalFilter]);
            },
            refresh: function (modelName) {// [Gheorghe]
                this.getOwnerComponent().getModel(modelName).refresh();
            },
            _setTableModel3: function (aResults) {
                //set model: concat new batch of data to previous model
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("TableError");
                var aError3 = [];
                var aError3Recap = [];
                aResults.forEach(x => {
                    aError3.push(JSON.parse(JSON.stringify(x)));
                    if (x.ZCONFSTORRECAP2Set.results.length > 0) {
                        x.ZCONFSTORRECAP2Set.results.forEach(y => {
                            var oCopy = JSON.parse(JSON.stringify(y));
                            if (oCopy.Zimponibile < 0) {
                                oCopy.Elaborazione = false;
                                oCopy.Enabled = true;
                            } else {
                                oCopy.Elaborazione = true;
                                oCopy.Enabled = false;
                            }
                            aError3Recap.push(oCopy);
                        });
                    }
                });
                oAppModel.setProperty("/rowsError", aError3);
                oAppModel.setProperty("/rowsErrorRecap", aError3Recap);
                oTable.setModel(oAppModel);
                oTable.bindRows("/rowsErrorRecap");
                oTable.sort(oTable.getColumns()[1]);
                oAppModel.refresh(true);
            },
            _setTableModelStorico: function (aResults) {
                //set model: concat new batch of data to previous model
                const oAppModel = this.getView().getModel("appModel");
                const oTableRecap = this.getView().byId("TableStoricoRecap");
                const oTablePos = this.getView().byId("TableStoricoPos");
                var aStoricoRecap = [];
                var aStoricoPos = [];
                aResults.forEach(x => {
                    //concat
                    //if (x.FADStoricoToRecap.results.length > 0) {
                    //x.FADStoricoToRecap.results.forEach(y => {
                    var oCopy = JSON.parse(JSON.stringify(x.FADStoricoToRecap.results));
                    aStoricoRecap = aStoricoRecap.concat(oCopy);
                    //});
                    //}
                    //if (x.FADStoricoToPosizioni.results.length > 0) {
                    //    x.FADStoricoToPosizioni.results.forEach(y => {
                    oCopy = JSON.parse(JSON.stringify(x.FADStoricoToPosizioni.results));
                    aStoricoPos = aStoricoPos.concat(oCopy);
                    //    });
                    //}
                });
                var aStoricoRecapSomme = [];
                let uniqueCombinations = new Set(aStoricoRecap.map(json => `${json.Zidstorico},${json.Znumprot}`));
                uniqueCombinations.forEach(y => {
                    var values = y.split(","),
                        Zidstorico = values[0],
                        Znumprot = values[1],
                        RecapFiltered = aStoricoRecap.filter(x => x.Zidstorico === Zidstorico && x.Znumprot === Znumprot);
                    if (RecapFiltered.length > 0) {
                        RecapFiltered.forEach(y => {
                            var RowFind = aStoricoRecapSomme.find(x => x.Zidstorico === Zidstorico && x.Znumprot === Znumprot);
                            if (RowFind) {
                                RowFind.Ztotacconti = parseFloat(RowFind.Ztotacconti) + parseFloat(y.Ztotacconti);
                                RowFind.Zimponibile = parseFloat(RowFind.Zimponibile) + parseFloat(y.Zimponibile);
                                RowFind.Ztotiva = parseFloat(RowFind.Ztotiva) + parseFloat(y.Ztotiva);
                                RowFind.Ztotdoc = parseFloat(RowFind.Ztotdoc) + parseFloat(y.Ztotdoc);
                            } else {
                                var CopyObject = JSON.parse(JSON.stringify(y));
                                delete CopyObject.Ziva;
                                aStoricoRecapSomme.push(CopyObject);

                            }
                        });
                    }
                });
                oAppModel.setProperty("/rowsStoricoRecap", aStoricoRecap);
                oAppModel.setProperty("/rowsStoricoRecapBefore", []);
                oAppModel.setProperty("/rowsStoricoPosizioni", aStoricoPos);
                oAppModel.setProperty("/rowsStoricoRecapUnique", aStoricoRecapSomme);
                oTableRecap.setModel(oAppModel);
                oTableRecap.bindRows("/rowsStoricoRecapUnique");
                oTableRecap.sort(oTableRecap.getColumns()[0]);
                //oTablePos.setModel(oAppModel);
                //oTablePos.bindRows("/rowsStoricoPosizioni");
                //oTablePos.sort(oTablePos.getColumns()[0]);
                oAppModel.refresh(true);
            },
            _setTableModelStoricoPos: function (aResults) {
                const oAppModel = this.getView().getModel("appModel");
                const oTablePos = this.getView().byId("TableStoricoPos");
                var PosizioniTot = oAppModel.getProperty("/rowsStoricoPosizioni");
                var PosizioniTotFiltered = PosizioniTot.filter(x => aResults.find(y => y.Zidstorico === x.Zidstorico && y.Znumprot === x.Znumprot));
                oAppModel.setProperty("/rowsStoricoPosizioniFiltered", PosizioniTotFiltered);
                oTablePos.setModel(oAppModel);
                oTablePos.bindRows("/rowsStoricoPosizioniFiltered");
                oTablePos.sort(oTablePos.getColumns()[0]);
                oAppModel.refresh(true);
            },
            _setTableModelFAD2: function (aResults) {
                //set model: concat new batch of data to previous model
                const oAppModel = this.getView().getModel("appModel");
                const oTableRecap = this.getView().byId("TableFad2");
                var aRecap = [];
                aResults.forEach(x => {
                    var oCopy = JSON.parse(JSON.stringify(x.ZCONFSTORRECAP2Set.results));
                    aRecap = aRecap.concat(oCopy);
                });
                oAppModel.setProperty("/FAD2Recap", aRecap);
                oTableRecap.setModel(oAppModel);
                oTableRecap.bindRows("/FAD2Recap");
                oTableRecap.sort(oTableRecap.getColumns()[0]);
                oAppModel.refresh(true);
            },
            onVistaDettagliata: function () {
                const oAppModel = this.getView().getModel("appModel");
                oAppModel.setProperty("/TableStoricoRecapVisible", false);
                var oTable = this.byId("TableStoricoRecap"),
                    oSelIndices = oTable.getSelectedIndices(),
                    Rows = [];
                oSelIndices.forEach(item => {
                    Rows.push(oTable.getContextByIndex(item).getObject());
                });
                this._setTableModelStoricoPos(Rows);
                oAppModel.setProperty("/TableStoricoPosVisible", true);
            },
            onVistaRecap: function () {
                const oAppModel = this.getView().getModel("appModel");
                oAppModel.setProperty("/TableStoricoRecapVisible", true);
                oAppModel.setProperty("/TableStoricoPosVisible", false);
            },
            onTabSelect: function () {
                this._pValueHelpDialog = null;
            },
            onEsegui: function () {
                const oAppModel = this.getView().getModel("appModel");
                var RowsErrorRecap = oAppModel.getProperty("/rowsErrorRecap");
                var RowsError = oAppModel.getProperty("/rowsError");
                var RowsNoError = oAppModel.getProperty("/rowsNoError");
                if (RowsError) {
                    RowsError.forEach(x => {
                        for (var i = 0; i < x.ZCONFSTORHEAD2Set.results.length; i++) {
                            var oConfStorHead = x.ZCONFSTORHEAD2Set.results[i];
                            var oFind = RowsErrorRecap.find(y => y.Bukrs === oConfStorHead.Bukrs
                                && y.Lifnr === oConfStorHead.Lifnr
                                && y.Ziva === oConfStorHead.Ziva);
                            if (oFind) {
                                if (oFind.Elaborazione === false) {
                                    x.ZCONFSTORHEAD2Set.results.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                        for (var i = 0; i < x.ZCONFSTORPOS2Set.results.length; i++) {
                            var oConfStorPos = x.ZCONFSTORPOS2Set.results[i];
                            var oFind = RowsErrorRecap.find(y => y.Bukrs === oConfStorPos.Bukrs
                                && y.Lifnr === oConfStorPos.Lifnr
                                && y.Ziva === oConfStorPos.Ziva);
                            if (oFind) {
                                if (oFind.Elaborazione === false) {
                                    x.ZCONFSTORPOS2Set.results.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                        for (var i = 0; i < x.ZCONFSTORRECAP2Set.results.length; i++) {
                            var oConfStorPos = x.ZCONFSTORRECAP2Set.results[i];
                            var oFind = RowsErrorRecap.find(y => y.Bukrs === oConfStorPos.Bukrs
                                && y.Lifnr === oConfStorPos.Lifnr
                                && y.Ziva === oConfStorPos.Ziva);
                            if (oFind) {
                                if (oFind.Elaborazione === false) {
                                    x.ZCONFSTORRECAP2Set.results.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    });
                    RowsError = RowsError.filter(x => x.ZCONFSTORRECAP2Set.results.length > 0);
                    oAppModel.setProperty("/rowsNoError", RowsNoError.concat(RowsError));
                    if (RowsNoError.concat(RowsError).length > 0) {
                        let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("Compensazione");
                    } else {
                        sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.noResult.text"));
                    }
                } else {
                    sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.noResult.text"));
                }
            },
            onEseguiFad2: function () {
                const oAppModel = this.getView().getModel("appModel");
                var Rows = oAppModel.getProperty("/FAD2"),
                    RowsStorico = [],
                    aUniqueRbukrs = [...new Set(Rows.map(item => item.Societa))];
                aUniqueRbukrs.forEach(x => {
                    var RowsFiltered = Rows.filter(y => y.Societa === x),
                        aUniqueLifnr = [...new Set(RowsFiltered.map(item => item.Fornitore))];
                    aUniqueLifnr.forEach(y => {
                        var RowStorico = {
                            "Societa": x,
                            "Fornitore": y,
                            "ZCONFSTORHEAD2Set": [],
                            "ZCONFSTORPOS2Set": [],
                            "ZCONFSTORRECAP2Set": []
                        };
                        var Find = RowsFiltered.find(z => z.Fornitore === y);
                        if (Find) {
                            Find.ZCONFSTORHEAD2Set.results.forEach(b => {
                                if (!b.Zdatadocumento) {
                                    delete b.Zdatadocumento;
                                } else {
                                    b.Zdatadocumento = new Date(b.Zdatadocumento);
                                }
                                RowStorico.ZCONFSTORHEAD2Set.push(b);
                            });

                            Find.ZCONFSTORPOS2Set.results.forEach(b => {
                                if (!b.Bedat) {
                                    delete b.Bedat;
                                } else {
                                    b.Bedat = new Date(b.Bedat);
                                }
                                if (!b.Zdatadocumento) {
                                    delete b.Zdatadocumento;
                                } else {
                                    b.Zdatadocumento = new Date(b.Zdatadocumento);
                                }
                                RowStorico.ZCONFSTORPOS2Set.push(b);
                            });
                            Find.ZCONFSTORRECAP2Set.results.forEach(b => {
                                if (!b.Zdatadocumento) {
                                    delete b.Zdatadocumento;
                                } else {
                                    b.Zdatadocumento = new Date(b.Zdatadocumento);
                                } if (!b.Zdataaccettazionea) {
                                    delete b.Zdataaccettazionea;
                                } else {
                                    b.Zdataaccettazionea = new Date(b.Zdataaccettazionea);
                                }
                                if (!b.Zdataaccettazioneda) {
                                    delete b.Zdataaccettazioneda;
                                } else {
                                    b.Zdataaccettazioneda = new Date(b.Zdataaccettazioneda);
                                }
                                RowStorico.ZCONFSTORRECAP2Set.push(b);
                            });
                        }
                        RowsStorico.push(RowStorico);
                    });
                });
                var batchChanges = [];
                var sServiceUrl = "/sap/opu/odata/sap/ZCRUSCOTTOCONFERIMENTO_SRV/";
                var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
                for (var i = 0; i < RowsStorico.length; i++) {
                    batchChanges.push(oDataModel.createBatchOperation("FAD2Set", "POST", RowsStorico[i]));
                }
                oDataModel.addBatchChangeOperations(batchChanges);
                const oPromiseBatch = new Promise((resolve, reject) => {
                    oDataModel.submitBatch(function (data, responseProcess) {
                        resolve();
                    }.bind(this),
                        function (err) {
                            reject();
                        });
                });
                oPromiseBatch.then(() => {
                    sap.m.MessageToast.show("Successo");
                    this.oGlobalBusyDialog.close();
                }, oError => {
                    sap.m.MessageToast.show("Errore");
                    this.oGlobalBusyDialog.close();
                });

            },
            onModificaStato: function (oEvent) {
                var oView = this.getView(),
                    arrayRes = [];
                this.oGlobalBusyDialog.open();
                if (!this._ModificaStatoValueHelpDialog) {
                    this._ModificaStatoValueHelpDialog = sap.ui.xmlfragment("it.orogel.cruscottoconferimento.view.Fragments.ModificaStato", this);
                    this.getView().addDependent(this._ModificaStatoValueHelpDialog);
                }
                this._ModificaStatoValueHelpDialog.open();
                this.oGlobalBusyDialog.close();
            },
            onSalvaStorico: function (oEvent) {
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel");
                var RowsStoricoRecap = oAppModel.getProperty("/rowsStoricoRecap"),
                    RowsStoricoRecapUnique = oAppModel.getProperty("/rowsStoricoRecapUnique"),
                    rowsStoricoRecapBefore = oAppModel.getProperty("/rowsStoricoRecapBefore"),
                    RowsChange = [];
                rowsStoricoRecapBefore.forEach(x => {
                    var RowFind = RowsStoricoRecapUnique.find(Row => x.Zidstorico === Row.Zidstorico &&
                        x.Znumprot === Row.Znumprot &&
                        (x.Zstatus !== Row.Zstatus || x.Zprogsdi !== Row.Zprogsdi));
                    if (RowFind) {
                        var RowsChangeTable = RowsStoricoRecap.filter(Row => RowFind.Zidstorico === Row.Zidstorico &&
                            RowFind.Znumprot === Row.Znumprot);
                        if (RowsChangeTable.length > 0) {
                            RowsChangeTable.forEach(z => {
                                z.Zstatus = RowFind.Zstatus;
                                z.Zprogsdi = RowFind.Zprogsdi;
                            })
                            //RowsChange.push(RowsChangeTable);
                            RowsChange = RowsChange.concat(RowsChangeTable);
                        }
                    }
                });
                var batchChanges = [];
                var sServiceUrl = "/sap/opu/odata/sap/ZCRUSCOTTOCONFERIMENTO_SRV/";
                var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
                RowsChange.forEach(x => {
                    //var ModifyString = "ZCONFSTORRECAPSet(Zidstorico='" + x.Zidstorico + "',Zprogsdi='" + x.Zprogsdi + "',Znumprot='" + x.Znumprot + "',Ziva=" + x.Ziva + "m)",
                    var ModifyString = "ZCONFSTORRECAPSet(Zidstorico='" + x.Zidstorico + "',Znumprot='" + x.Znumprot + "',Ziva=" + x.Ziva + "m)",
                        StatoA = {
                            "Zstatus": x.Zstatus
                        };
                    if (x.Zstatus === "S") {
                        batchChanges.push(oDataModel.createBatchOperation(encodeURIComponent(ModifyString), "PATCH", { "Zprogsdi": x.Zprogsdi, "Zstatus": x.Zstatus }));
                    } else {
                        batchChanges.push(oDataModel.createBatchOperation(encodeURIComponent(ModifyString), "PATCH", StatoA));
                    }
                });
                oDataModel.addBatchChangeOperations(batchChanges);
                if (RowsChange.length === 0) {
                    sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.noCambioStato.text"));
                    this.oGlobalBusyDialog.close();
                    this.onCloseModificaStato();
                } else {
                    const oPromiseBatch = new Promise((resolve, reject) => {
                        oDataModel.submitBatch(function (data, responseProcess) {
                            resolve();
                        }.bind(this),
                            function (err) {
                                reject();
                            });
                    });
                    oPromiseBatch.then(() => {
                        sap.m.MessageToast.show("Successo");
                        this.oGlobalBusyDialog.close();
                        this.onFilterSearchFAD3();
                    }, oError => {
                        sap.m.MessageToast.show("Errore");
                        this.oGlobalBusyDialog.close();
                    });
                }
            },
            onInvioXML: function (oEvent) {
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel"),
                    oTable = this.getView().byId("TableStoricoRecap");
                var oSelIndices = oTable.getSelectedIndices(),
                    Rows = oAppModel.getProperty("/rowsStoricoRecapUnique");
                const oPromiseRows = oSelIndices.map(item => {
                    let Row = oTable.getContextByIndex(item).getObject(),
                        RowsFiltered = Rows.filter(x => parseFloat(x.Zidrif) !== 0 && Row.Zidrif === x.Zidrif && parseFloat(x.Zidstorico) < parseFloat(Row.Zidstorico));
                    if ((oTable.getContextByIndex(item).getObject().Zstatus !== "F" && oTable.getContextByIndex(item).getObject().Zstatus !== "P") || RowsFiltered.length > 0) {
                        return new Promise((resolve, reject) => {
                            resolve();
                        })
                    } else {
                        return this._callInvioXML(oTable.getContextByIndex(item).getObject());
                    }
                });
                Promise.all(oPromiseRows).then(() => {
                    sap.m.MessageToast.show("Successo");
                    this.onFilterSearchFAD3();
                    this.oGlobalBusyDialog.close();
                }, oError => {
                    sap.m.MessageToast.show("Errore");
                    this.oGlobalBusyDialog.close();
                });
            },
            _callInvioXML: function (Row) {
                return new Promise((resolve, reject) => {
                    const oPromiseXML = new Promise((resolve1, reject1) => {
                        var ModifyString = "XmlSet(ZIDSTORICO='" + Row.Zidstorico + "',ZNUMPROT='" + Row.Znumprot + "')";
                        ModifyString = "/" + encodeURIComponent(ModifyString);
                        this.getView().getModel().read(ModifyString, {
                            success: (oData) => {
                                resolve1(oData);
                            },
                            error: (oError) => {
                                reject1();
                            }
                        });
                    });
                    oPromiseXML.then((aResults) => {
                        var FileXML = aResults.JSON;
                        if (FileXML !== "") {
                            File.save(FileXML, Row.Zidstorico + " / " + Row.Znumprot, "xml", null, null);
                        }
                        resolve();
                    }, oError => {
                        reject();
                    });
                });
            },
            onInvioMail: function (oEvent) {
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel"),
                    oTable = this.getView().byId("TableStoricoRecap");
                var oSelIndices = oTable.getSelectedIndices(),
                    Rows = oAppModel.getProperty("/rowsStoricoRecapUnique");
                this.ErroreMail = "";
                //ErroreMail="I seguenti Soci non hanno mail in anagrafica:\n";
                const oPromiseRows = oSelIndices.map(item => {
                    let Row = oTable.getContextByIndex(item).getObject(),
                        RowsFiltered = Rows.filter(x => parseFloat(x.Zidrif) !== 0 && Row.Zidrif === x.Zidrif && parseFloat(x.Zidstorico) < parseFloat(Row.Zidstorico));
                    //if (oTable.getContextByIndex(item).getObject().Zstatus !== "P") {
                    if (Row.Zstatus !== "P" || RowsFiltered.length > 0) {
                        return new Promise((resolve, reject) => {
                            resolve();
                        })
                    } else {
                        return this._callInvioMail(oTable.getContextByIndex(item).getObject());
                    }
                });
                Promise.all(oPromiseRows).then(() => {
                    if (this.ErroreMail !== "") {
                        sap.m.MessageToast.show(this.ErroreMail);
                    } else {
                        sap.m.MessageToast.show("Successo");
                    }
                    this.onFilterSearchFAD3();
                    this.oGlobalBusyDialog.close();
                }, oError => {
                    sap.m.MessageToast.show("Errore");
                    this.oGlobalBusyDialog.close();
                });
            },
            _callInvioMail: function (Row) {
                return new Promise((resolve, reject) => {
                    const oPromiseFattura = new Promise((resolve1, reject1) => {
                        this.onStampaFatturaMail(Row, resolve1, reject1);
                    });
                    const oPromiseLiquidazione = new Promise((resolve2, reject2) => {
                        this.onEstrattoContoDiLiquidazioneMail(Row, resolve2, reject2);
                    });
                    Promise.all([oPromiseFattura, oPromiseLiquidazione]).then((aResults) => {
                        var Email = {
                            "Allegato1": aResults[0],
                            "Allegato2": aResults[1],
                            "Zidstorico": Row.Zidstorico,
                            "Znumprot": Row.Znumprot
                        };
                        this.getView().getModel().create("/EmailAllegatiSet", Email, {
                            success: (oData) => {
                                if (oData.Errore !== "") {
                                    if (this.ErroreMail === "") {
                                        this.ErroreMail = "I seguenti Soci non hanno mail in anagrafica:\n";
                                    } else {
                                        this.ErroreMail = this.ErroreMail + "\n";
                                    }
                                    this.ErroreMail = this.ErroreMail + oData.Errore;
                                }
                                resolve();
                            },
                            error: (oError) => {
                                reject();
                            }
                        });
                        //resolve();
                    }, oError => {
                        reject();
                    });
                });
            },
            onEstrattoContoDiLiquidazione: function (oEvent) {
                const oAppModel = this.getView().getModel("appModel");
                var Fattura = oEvent.getSource().getBindingContext().getObject();
                let aFilters = [];
                aFilters.push(new Filter("Lifnr", FilterOperator.EQ, Fattura.Lifnr));
                aFilters.push(new Filter("ZidStorico", FilterOperator.EQ, Fattura.Zidstorico));
                aFilters.push(new Filter("Rbukrs", FilterOperator.EQ, Fattura.Bukrs));
                var oFinalFilter = new Filter({
                    filters: aFilters,
                    and: true
                });
                this.oGlobalBusyDialog.open();
                this.getView().getModel().read("/StampaStoricoLiquidazioneSet", {
                    filters: [oFinalFilter],
                    success: (oData) => {
                        let sAllegato1 = Constants.STORICOLIQUIDAZIONE.XML;
                        if (oData.results.length > 0) {
                            let FirstItem = oData.results[0];
                            var somma = Fattura.Ztotdoc;
                            sAllegato1 = sAllegato1.replace("{MemberCode}", FirstItem.Lifnr);
                            sAllegato1 = sAllegato1.replace("{CompanyName}", FirstItem.NomeAzienda);
                            sAllegato1 = sAllegato1.replace("{PartnerName}", FirstItem.NomeFornitore);
                            sAllegato1 = sAllegato1.replace("{Street}", FirstItem.IndirizzoFornitore);
                            sAllegato1 = sAllegato1.replace("{HouseNum}", FirstItem.NumeroFornitore);
                            sAllegato1 = sAllegato1.replace("{PostCode}", FirstItem.PostCodeFornitore);
                            sAllegato1 = sAllegato1.replace("{City}", FirstItem.CittaFornitore);
                            sAllegato1 = sAllegato1.replace("{Region}", FirstItem.ProvinciaFornitore);
                            sAllegato1 = sAllegato1.replace("{VATNumber}", FirstItem.PivaFornitore);
                            sAllegato1 = sAllegato1.replace("{TaxCode}", FirstItem.CFFornitore);
                            sAllegato1 = sAllegato1.replace("{TotalGoods}", parseFloat(Fattura.Ztotdoc).toFixed(2));
                            oData.results.forEach(x => {
                                if (x.Tipo === "S" || x.Tipo === "F" || x.Tipo === "C") {
                                    somma = parseFloat(somma) - parseFloat(x.Importo);
                                    sAllegato1 = sAllegato1.replace("{NewRow}", Constants.STORICOLIQUIDAZIONE.ROW);
                                    sAllegato1 = sAllegato1.replace("{Data}", x.DataDocumento.toLocaleDateString("IT-it"));
                                    if (parseFloat(x.Importo) > 0) {
                                        sAllegato1 = sAllegato1.replace("{Dare}", parseFloat(x.Importo).toFixed(2));
                                        sAllegato1 = sAllegato1.replace("{Avere}", "");
                                    } else {
                                        sAllegato1 = sAllegato1.replace("{Dare}", "");
                                        sAllegato1 = sAllegato1.replace("{Avere}", parseFloat(-x.Importo).toFixed(2));
                                    }
                                    if (x.Tipo === "C") {
                                        sAllegato1 = sAllegato1.replace("{DeductionDescription}", "Fattura vendita " + x.Blart + "/" + x.Belnr);
                                    } else if (x.Tipo === "F") {
                                        sAllegato1 = sAllegato1.replace("{DeductionDescription}", "Interessi Libretto di Deposito");
                                    } else if (x.Tipo === "S") {
                                        sAllegato1 = sAllegato1.replace("{DeductionDescription}", "Quota Capitale sociale");
                                    }
                                }
                            });
                            sAllegato1 = sAllegato1.replace("{NewRow}", "");
                            sAllegato1 = sAllegato1.replace("{Balance}", parseFloat(somma).toFixed(2));
                        }
                        sAllegato1 = sAllegato1.replaceAll("&", "&amp;");
                        var xmlz = (new DOMParser()).parseFromString(sAllegato1, "application/xml"),
                            forms = "ZPRINT_SETTLEMENT_STATEMENT",
                            templates = "ZPRINT_SETTLEMENT_STATEMENT",
                            xmlBase = window.btoa(unescape(unescape(encodeURIComponent((new XMLSerializer()).serializeToString(xmlz))))),
                            mObj = {
                                "Form": forms,
                                "Template": templates,
                                "xmlData": xmlBase,
                                "formType": "Print",
                                "formLocale": "it_IT",
                                "taggedPdf": "0",
                                "embedFont": "0"
                            };
                        var oPDFModel = this.getView().getModel("pdfModel");
                        var filename = "EstrattoContoDiLiquidazione" + ".pdf";
                        oPDFModel.create(Constants.PDF.ENTITY, mObj, {
                            success: (oData) => {
                                download("data:application/pdf;base64," + oData.PDFOut, filename, "application/pdf");
                                this.oGlobalBusyDialog.close();
                            },
                            error: (oError) => {
                                this.oGlobalBusyDialog.close();
                            }
                        });
                    },
                    error: () => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Errore di connessione");
                    }
                });
            },
            onEstrattoContoDiLiquidazioneMail: function (Row, resolve, reject) {
                const oAppModel = this.getView().getModel("appModel");
                var Fattura = Row;
                let aFilters = [];
                aFilters.push(new Filter("Lifnr", FilterOperator.EQ, Fattura.Lifnr));
                aFilters.push(new Filter("ZidStorico", FilterOperator.EQ, Fattura.Zidstorico));
                aFilters.push(new Filter("Rbukrs", FilterOperator.EQ, Fattura.Bukrs));
                var oFinalFilter = new Filter({
                    filters: aFilters,
                    and: true
                });
                this.oGlobalBusyDialog.open();
                this.getView().getModel().read("/StampaStoricoLiquidazioneSet", {
                    filters: [oFinalFilter],
                    success: (oData) => {
                        let sAllegato1 = Constants.STORICOLIQUIDAZIONE.XML;
                        if (oData.results.length > 0) {
                            let FirstItem = oData.results[0];
                            var somma = Fattura.Ztotdoc;
                            sAllegato1 = sAllegato1.replace("{MemberCode}", FirstItem.Lifnr);
                            sAllegato1 = sAllegato1.replace("{CompanyName}", FirstItem.NomeAzienda);
                            sAllegato1 = sAllegato1.replace("{PartnerName}", FirstItem.NomeFornitore);
                            sAllegato1 = sAllegato1.replace("{Street}", FirstItem.IndirizzoFornitore);
                            sAllegato1 = sAllegato1.replace("{HouseNum}", FirstItem.NumeroFornitore);
                            sAllegato1 = sAllegato1.replace("{PostCode}", FirstItem.PostCodeFornitore);
                            sAllegato1 = sAllegato1.replace("{City}", FirstItem.CittaFornitore);
                            sAllegato1 = sAllegato1.replace("{Region}", FirstItem.ProvinciaFornitore);
                            sAllegato1 = sAllegato1.replace("{VATNumber}", FirstItem.PivaFornitore);
                            sAllegato1 = sAllegato1.replace("{TaxCode}", FirstItem.CFFornitore);
                            sAllegato1 = sAllegato1.replace("{TotalGoods}", parseFloat(Fattura.Ztotdoc).toFixed(2));
                            oData.results.forEach(x => {
                                if (x.Tipo === "S" || x.Tipo === "F" || x.Tipo === "C") {
                                    somma = parseFloat(somma) - parseFloat(x.Importo);
                                    sAllegato1 = sAllegato1.replace("{NewRow}", Constants.STORICOLIQUIDAZIONE.ROW);
                                    sAllegato1 = sAllegato1.replace("{Data}", x.DataDocumento.toLocaleDateString("IT-it"));
                                    if (parseFloat(x.Importo) > 0) {
                                        sAllegato1 = sAllegato1.replace("{Dare}", parseFloat(x.Importo).toFixed(2));
                                        sAllegato1 = sAllegato1.replace("{Avere}", "");
                                    } else {
                                        sAllegato1 = sAllegato1.replace("{Dare}", "");
                                        sAllegato1 = sAllegato1.replace("{Avere}", parseFloat(-x.Importo).toFixed(2));
                                    }
                                    if (x.Tipo === "C") {
                                        sAllegato1 = sAllegato1.replace("{DeductionDescription}", "Fattura vendita " + x.Blart + "/" + x.Belnr);
                                    } else if (x.Tipo === "F") {
                                        sAllegato1 = sAllegato1.replace("{DeductionDescription}", "Interessi Libretto di Deposito");
                                    } else if (x.Tipo === "S") {
                                        sAllegato1 = sAllegato1.replace("{DeductionDescription}", "Quota Capitale sociale");
                                    }
                                }
                            });
                            sAllegato1 = sAllegato1.replace("{NewRow}", "");
                            sAllegato1 = sAllegato1.replace("{Balance}", parseFloat(somma).toFixed(2));
                        }
                        sAllegato1 = sAllegato1.replaceAll("&", "&amp;");
                        var xmlz = (new DOMParser()).parseFromString(sAllegato1, "application/xml"),
                            forms = "ZPRINT_SETTLEMENT_STATEMENT",
                            templates = "ZPRINT_SETTLEMENT_STATEMENT",
                            xmlBase = window.btoa(unescape(unescape(encodeURIComponent((new XMLSerializer()).serializeToString(xmlz))))),
                            mObj = {
                                "Form": forms,
                                "Template": templates,
                                "xmlData": xmlBase,
                                "formType": "Print",
                                "formLocale": "it_IT",
                                "taggedPdf": "0",
                                "embedFont": "0"
                            };
                        var oPDFModel = this.getView().getModel("pdfModel");
                        var filename = "EstrattoContoDiLiquidazione" + ".pdf";

                        oPDFModel.create(Constants.PDF.ENTITY, mObj, {
                            success: (oData) => {
                                resolve(oData.PDFOut);
                            },
                            error: (oError) => {
                                reject();
                            }
                        });
                    },
                    error: () => {
                        reject();
                    }
                });
            },
            onStampaFattura: function (oEvent) {
                const oAppModel = this.getView().getModel("appModel");
                var Fattura = oEvent.getSource().getBindingContext().getObject(),
                    PosizioniTot = oAppModel.getProperty("/rowsStoricoPosizioni"),
                    PosizioniTotFind = PosizioniTot.find(x => Fattura.Zidstorico === x.Zidstorico && Fattura.Znumprot === x.Znumprot);
                var Forfettario = false;
                if (PosizioniTotFind) {
                    if (PosizioniTotFind.Ebeln === "") {
                        Forfettario = true;
                    }
                }
                let aFilters = [];
                aFilters.push(new Filter("Lifnr", FilterOperator.EQ, Fattura.Lifnr));
                aFilters.push(new Filter("ZidStorico", FilterOperator.EQ, Fattura.Zidstorico));
                //aFilters.push(new Filter("Zprogsdi", FilterOperator.EQ, Fattura.Zidstorico));
                aFilters.push(new Filter("Znumprot", FilterOperator.EQ, Fattura.Znumprot));
                //aFilters.push(new Filter("Ziva", FilterOperator.EQ, Fattura.Zidstorico));*/
                aFilters.push(new Filter("Rbukrs", FilterOperator.EQ, Fattura.Bukrs));
                var oFinalFilter = new Filter({
                    filters: aFilters,
                    and: true
                });
                this.oGlobalBusyDialog.open();
                const oPromiseDatiStampa = new Promise((resolve, reject) => {
                    this.getView().getModel().read("/StampaFatturaSet", {
                        urlParameters: {
                            "$expand": "StampaFatturaAziendaSet,StampaFatturaFornitoreSet,ZCONFMAGGIORAZSet,ZCONFACCPREGSet"
                        },
                        filters: [oFinalFilter],
                        success: (oData) => {
                            var forms = "ZPRINT_PROXY_INVOICE",
                                templates = "ZPRINT_PROXY_INVOICE";
                            let sAllegato1 = Constants.FATTURA.XML;
                            if (Forfettario) {
                                forms = "ZPRINT_PROXY_INVOICE_F";
                                templates = "ZPRINT_PROXY_INVOICE_F";
                                sAllegato1 = Constants.FATTURAFORFETTARIO.XML;
                            }
                            if (oData.results.length > 0) {
                                let FirstItem = oData.results[0],
                                    FornitoreFattura = FirstItem.StampaFatturaFornitoreSet,
                                    AziendaFattura = FirstItem.StampaFatturaAziendaSet;
                                //SOCIO
                                if (FirstItem.Znumprot !== "") {
                                    sAllegato1 = sAllegato1.replace("{Type_Invoice}", "FATTURA CON DELEGA N. " + FirstItem.Znumprot);
                                } else {
                                    sAllegato1 = sAllegato1.replace("{Type_Invoice}", "BOZZA FATTURA");
                                }
                                sAllegato1 = sAllegato1.replace("{NameC}", FornitoreFattura.Name);
                                sAllegato1 = sAllegato1.replace("{StreetC}", FornitoreFattura.Street);
                                sAllegato1 = sAllegato1.replace("{House_Num1C}", FornitoreFattura.House_Num1);
                                sAllegato1 = sAllegato1.replace("{Post_Code1C}", FornitoreFattura.Post_Code);
                                sAllegato1 = sAllegato1.replace("{City1C}", FornitoreFattura.City1);
                                sAllegato1 = sAllegato1.replace("{RegionC}", FornitoreFattura.Region);
                                sAllegato1 = sAllegato1.replace("{Vat_NumberC}", FornitoreFattura.Vat_Number);
                                sAllegato1 = sAllegato1.replace("{Tax_CodeC}", FornitoreFattura.Tax_Code);
                                //DATA
                                sAllegato1 = sAllegato1.replace("{Doc_Date}", new Date(Fattura.Zdatadocumento).toLocaleDateString("IT-it"));
                                //AZIENDA
                                sAllegato1 = sAllegato1.replace("{NameA}", AziendaFattura.Name);
                                sAllegato1 = sAllegato1.replace("{StreetA}", AziendaFattura.Street);
                                sAllegato1 = sAllegato1.replace("{House_Num1A}", AziendaFattura.House_Num1);
                                sAllegato1 = sAllegato1.replace("{Post_Code1A}", AziendaFattura.Post_Code);
                                sAllegato1 = sAllegato1.replace("{City1A}", AziendaFattura.City1);
                                sAllegato1 = sAllegato1.replace("{RegionA}", AziendaFattura.Region);
                                sAllegato1 = sAllegato1.replace("{Vat_NumberA}", AziendaFattura.Vat_Number);
                                sAllegato1 = sAllegato1.replace("{Tax_CodeA}", AziendaFattura.Tax_Code);
                                //TESTI
                                sAllegato1 = sAllegato1.replace("{Testo1}", Fattura.Testo1);
                                sAllegato1 = sAllegato1.replace("{Testo2}", FirstItem.Testo2);
                                sAllegato1 = sAllegato1.replace("{Testo3}", FirstItem.Testo3);
                                //TABLE1
                                var sommaTotale = 0.00,
                                    sommaQuantita = 0.00,
                                    imponibile = 0.00,
                                    totalemerce = 0.00;
                                if (!Forfettario) {
                                    var fieldArray = ["Specie",
                                        "Stagionalita", "Varieta", "CertificazioneAziendale", "CertificazioneProdotto", "Residuo",
                                        "CertificazioneCommerciale", "Specifica", "Lavorazione", "Origine", "EventiColtivazione",
                                        "CaratteristicaRaccoltaTaglio", "ServizioRaccoltaTaglio", "ServizioCaricoAutomezzi",
                                        "ServizioAssistenzaTecnica", "ServizioDeposito", "ServizioCalibrazione", "ZonaTrasporto",
                                        "Incoterm", "ServizioExtra1", "ServizioExtra2",
                                        "ServizioExtra3", "ServizioExtra4", "ServizioExtra5"],
                                        UniqueCombinations = [];
                                    oData.results.forEach(y => {
                                        if (!UniqueCombinations.find(z => fieldArray.every((val, i) => z[val] === y[val]))) {
                                            var objectKey = {};
                                            fieldArray.forEach(chiave => objectKey[chiave] = y[chiave]);
                                            UniqueCombinations.push(objectKey);
                                        }
                                    });
                                    UniqueCombinations.forEach(y => {
                                        var aFilter = oData.results.filter(z => Object.entries(y).map(([key, value]) => value === z[key]).filter(error => error === false).length === 0);
                                        if (aFilter.length > 0) {
                                            sAllegato1 = sAllegato1.replace("{TABLE2}", Constants.FATTURA.ROW1TABLE1);
                                            var sommaTotaleRiga = 0.00,
                                                sommaQuantitaRiga = 0.00;
                                            sAllegato1 = sAllegato1.replace("{TABLE1}", Constants.FATTURA.TABLE1);
                                            Object.entries(aFilter[0]).map(([key, value]) => {
                                                sAllegato1 = sAllegato1.replace("{" + key + "}", value);
                                            });
                                            sAllegato1 = sAllegato1.replace("{DataInizioValiditaD}", new Date(aFilter[0].Zdataaccettazioneda).toLocaleDateString("IT-it"));
                                            sAllegato1 = sAllegato1.replace("{DataFineValiditaD}", new Date(aFilter[0].Zdataaccettazionea).toLocaleDateString("IT-it"));
                                            //ROW1TABLE1
                                            aFilter.sort(function (a, b) {
                                                return b.Repos - a.Repos;
                                            });
                                            aFilter.forEach(x => {
                                                if (x.Repos) {
                                                    sAllegato1 = sAllegato1.replace("{ROW1TABLE1}", Constants.FATTURA.ROW1TABLE1);
                                                    sAllegato1 = sAllegato1.replace("{ItemCode}", x.Matnr);
                                                    sAllegato1 = sAllegato1.replace("{Quality}", x.DescQualita);
                                                    sAllegato1 = sAllegato1.replace("{Caliber}", x.DescCalibrazione);
                                                    sAllegato1 = sAllegato1.replace("{UM}", x.Meins);
                                                    sAllegato1 = sAllegato1.replace("{Quantity}", x.Menge);
                                                    var ImportoRiga = (parseFloat(x.zprezlordo) * parseFloat(x.zp)),
                                                        ImportoTotaleRiga = parseFloat(ImportoRiga) * parseFloat(x.Menge);
                                                    sAllegato1 = sAllegato1.replace("{Price}", ImportoRiga.toFixed(2));
                                                    sAllegato1 = sAllegato1.replace("{Total}", ImportoTotaleRiga.toFixed(2));
                                                    sommaTotaleRiga = parseFloat(sommaTotaleRiga) + parseFloat(ImportoTotaleRiga);
                                                    sommaQuantitaRiga = parseFloat(sommaQuantitaRiga) + parseFloat(x.Menge);
                                                } else {
                                                    sAllegato1 = sAllegato1.replace("{ROW1TABLE1}", Constants.FATTURA.ROW1TABLE1);
                                                    sAllegato1 = sAllegato1.replace("{ItemCode}", "");
                                                    sAllegato1 = sAllegato1.replace("{Quality}", "Scarto");
                                                    sAllegato1 = sAllegato1.replace("{Caliber}", "");
                                                    sAllegato1 = sAllegato1.replace("{UM}", x.Meins);
                                                    sAllegato1 = sAllegato1.replace("{Quantity}", x.Menge);
                                                    sAllegato1 = sAllegato1.replace("{Price}", "");
                                                    sAllegato1 = sAllegato1.replace("{Total}", "-");
                                                    sommaQuantitaRiga = parseFloat(sommaQuantitaRiga) + parseFloat(x.Menge);
                                                }
                                            });
                                            sAllegato1 = sAllegato1.replace("{U.M}", aFilter[0].Meins);
                                            sAllegato1 = sAllegato1.replace("{SumQuantity}", parseFloat(sommaQuantitaRiga).toFixed(2));
                                            sAllegato1 = sAllegato1.replace("{SumTotal}", parseFloat(sommaTotaleRiga).toFixed(2));
                                            sommaQuantita = parseFloat(sommaQuantita) + parseFloat(sommaQuantitaRiga);
                                            sommaTotale = parseFloat(sommaTotale) + parseFloat(sommaTotaleRiga);
                                            sAllegato1 = sAllegato1.replace("{ROW1TABLE1}", "");
                                        }
                                    });
                                    sAllegato1 = sAllegato1.replace("{SumAllUM}", FirstItem.Meins);
                                    sAllegato1 = sAllegato1.replace("{SumAllQuantity}", parseFloat(sommaQuantita).toFixed(2));
                                    sAllegato1 = sAllegato1.replace("{SumAllTotal}", parseFloat(sommaTotale).toFixed(2));
                                    sAllegato1 = sAllegato1.replace("{TABLE1}", "");
                                    sAllegato1 = sAllegato1.replace("{ROW1TABLE3}", "");
                                    //IMPORTI FATTURA
                                    sAllegato1 = sAllegato1.replace("{VTotaleMerceConferita}", parseFloat(sommaQuantita).toFixed(2));

                                    //MAGGIORAZIONE
                                    FirstItem.ZCONFMAGGIORAZSet.results.forEach(zconf => {
                                        sAllegato1 = sAllegato1.replace("{ROW2MAGGIORAZIONE}", Constants.FATTURA.ROW2MAGGIORAZIONE);
                                        sAllegato1 = sAllegato1.replace("{Maggiorazione}", zconf.Zdescr);
                                        sAllegato1 = sAllegato1.replace("{VMaggiorazione}", parseFloat(zconf.Zcalcmag).toFixed(2));
                                        sommaTotale = parseFloat(sommaTotale) + parseFloat(zconf.Zcalcmag);
                                    });
                                    sAllegato1 = sAllegato1.replace("{ROW2MAGGIORAZIONE}", "");
                                    //ACCONTI
                                    FirstItem.ZCONFACCPREGSet.results.forEach(acc => {
                                        sAllegato1 = sAllegato1.replace("{ROW4ACCONTI}", Constants.FATTURA.ROW4ACCONTI);
                                        sAllegato1 = sAllegato1.replace("{Acconto}", "Acconto " + acc.Zdescr);
                                        sAllegato1 = sAllegato1.replace("{VAcconto}", parseFloat(acc.Zimporto).toFixed(2));
                                        sommaTotale = parseFloat(sommaTotale) + parseFloat(acc.Zimporto);
                                    });
                                    sAllegato1 = sAllegato1.replace("{ROW4ACCONTI}", "");
                                    sAllegato1 = sAllegato1.replace("{Imponibile}", parseFloat(sommaTotale).toFixed(2));
                                    //IVA
                                    var aUniqueZiva = [...new Set(oData.results.map(item => `${item.ziva}%${item.ztotiva}`))];
                                    aUniqueZiva.forEach(iva => {
                                        var values = iva.split("%"),
                                            Percentage = values[0],
                                            ZtotIva = values[1];
                                        sAllegato1 = sAllegato1.replace("{FOOTERROW2}", Constants.FATTURA.FOOTERROW2);

                                        sAllegato1 = sAllegato1.replace("{Percentage}", parseFloat(Percentage).toFixed(2));
                                        sAllegato1 = sAllegato1.replace("{Iva}", parseFloat(ZtotIva).toFixed(2));
                                        sommaTotale = parseFloat(sommaTotale) + parseFloat(ZtotIva);
                                    });
                                    sAllegato1 = sAllegato1.replace("{FOOTERROW2}", "");
                                    sAllegato1 = sAllegato1.replace("{TotaleDocumento}", parseFloat(sommaTotale).toFixed(2));
                                    //DDT
                                    var aUniqueIHREZ = [...new Set(oData.results.map(item => item.ihrez))];
                                    aUniqueIHREZ.forEach(ihrez => {
                                        var FindDDT = oData.results.find(y => y.ihrez === ihrez);
                                        sAllegato1 = sAllegato1.replace("{ROW1DDT}", Constants.FATTURA.ROW1DDT);
                                        sAllegato1 = sAllegato1.replace("{DeliveryNoteNumber}", FindDDT.ihrez);
                                        sAllegato1 = sAllegato1.replace("{Date1}", FindDDT.zz1_dataddt);
                                        sAllegato1 = sAllegato1.replace("{MemberDDTNumber}", FindDDT.unsez);
                                        sAllegato1 = sAllegato1.replace("{Date2}", FindDDT.zz1_dataddt);
                                    });
                                    sAllegato1 = sAllegato1.replace("{ROW1DDT}", "");
                                } else {
                                    sommaTotale = parseFloat(Fattura.Zimponibile);
                                    sAllegato1 = sAllegato1.replace("{Imponibile}", parseFloat(sommaTotale).toFixed(2));
                                    //IVA
                                    var aUniqueZiva = [...new Set(oData.results.map(item => `${item.ziva}%${item.ztotiva}`))];
                                    aUniqueZiva.forEach(iva => {
                                        var values = iva.split("%"),
                                            Percentage = values[0],
                                            ZtotIva = values[1];
                                        sAllegato1 = sAllegato1.replace("{FOOTERROW2}", Constants.FATTURA.FOOTERROW2);

                                        sAllegato1 = sAllegato1.replace("{Percentage}", parseFloat(Percentage).toFixed(2));
                                        sAllegato1 = sAllegato1.replace("{Iva}", parseFloat(ZtotIva).toFixed(2));
                                        sommaTotale = parseFloat(sommaTotale) + parseFloat(ZtotIva);
                                    });
                                    sAllegato1 = sAllegato1.replace("{FOOTERROW2}", "");
                                    sAllegato1 = sAllegato1.replace("{TotaleDocumento}", parseFloat(sommaTotale).toFixed(2));
                                }
                                sAllegato1 = sAllegato1.replaceAll("&", "&amp;");
                                var xmlz = (new DOMParser()).parseFromString(sAllegato1, "application/xml"),
                                    xmlBase = window.btoa(unescape(unescape(encodeURIComponent((new XMLSerializer()).serializeToString(xmlz)))));
                                var mObj = {
                                    "Form": forms,
                                    "Template": templates,
                                    "xmlData": xmlBase,
                                    "formType": "Print",
                                    "formLocale": "it_IT",
                                    "taggedPdf": "0",
                                    "embedFont": "0"
                                };
                                var oPDFModel = this.getView().getModel("pdfModel");
                                var filename = "Fattura" + ".pdf";
                                oPDFModel.create(Constants.PDF.ENTITY, mObj, {
                                    success: (oData) => {
                                        download("data:application/pdf;base64," + oData.PDFOut, filename, "application/pdf");
                                        this.oGlobalBusyDialog.close();
                                    },
                                    error: (oError) => {
                                        this.oGlobalBusyDialog.close();
                                    }
                                });
                            } else {
                                this.oGlobalBusyDialog.close();
                            }
                        },
                        error: (oError) => {
                            sap.m.MessageToast.show("Errore di connessione");
                            this.oGlobalBusyDialog.close();
                        }
                    });
                });
            },
            onStampaFatturaMail: function (Row, resolve, reject) {
                const oAppModel = this.getView().getModel("appModel");
                var Fattura = Row,
                    PosizioniTot = oAppModel.getProperty("/rowsStoricoPosizioni"),
                    PosizioniTotFind = PosizioniTot.find(x => Fattura.Zidstorico === x.Zidstorico && Fattura.Znumprot === x.Znumprot);
                var Forfettario = false;
                if (PosizioniTotFind) {
                    if (PosizioniTotFind.Ebeln === "") {
                        Forfettario = true;
                    }
                }
                let aFilters = [];
                aFilters.push(new Filter("Lifnr", FilterOperator.EQ, Fattura.Lifnr));
                aFilters.push(new Filter("ZidStorico", FilterOperator.EQ, Fattura.Zidstorico));
                aFilters.push(new Filter("Znumprot", FilterOperator.EQ, Fattura.Znumprot));
                aFilters.push(new Filter("Rbukrs", FilterOperator.EQ, Fattura.Bukrs));
                var oFinalFilter = new Filter({
                    filters: aFilters,
                    and: true
                });
                this.oGlobalBusyDialog.open();
                this.getView().getModel().read("/StampaFatturaSet", {
                    urlParameters: {
                        "$expand": "StampaFatturaAziendaSet,StampaFatturaFornitoreSet,ZCONFMAGGIORAZSet,ZCONFACCPREGSet"
                    },
                    filters: [oFinalFilter],
                    success: (oData) => {
                        var forms = "ZPRINT_PROXY_INVOICE",
                            templates = "ZPRINT_PROXY_INVOICE";
                        let sAllegato1 = Constants.FATTURA.XML;
                        if (Forfettario) {
                            forms = "ZPRINT_PROXY_INVOICE_F";
                            templates = "ZPRINT_PROXY_INVOICE_F";
                            sAllegato1 = Constants.FATTURAFORFETTARIO.XML;
                        }
                        if (oData.results.length > 0) {
                            let FirstItem = oData.results[0],
                                FornitoreFattura = FirstItem.StampaFatturaFornitoreSet,
                                AziendaFattura = FirstItem.StampaFatturaAziendaSet;
                            //SOCIO
                            if (FirstItem.Znumprot !== "") {
                                sAllegato1 = sAllegato1.replace("{Type_Invoice}", "FATTURA CON DELEGA N. " + FirstItem.Znumprot);
                            } else {
                                sAllegato1 = sAllegato1.replace("{Type_Invoice}", "BOZZA FATTURA");
                            }
                            sAllegato1 = sAllegato1.replace("{NameC}", FornitoreFattura.Name);
                            sAllegato1 = sAllegato1.replace("{StreetC}", FornitoreFattura.Street);
                            sAllegato1 = sAllegato1.replace("{House_Num1C}", FornitoreFattura.House_Num1);
                            sAllegato1 = sAllegato1.replace("{Post_Code1C}", FornitoreFattura.Post_Code);
                            sAllegato1 = sAllegato1.replace("{City1C}", FornitoreFattura.City1);
                            sAllegato1 = sAllegato1.replace("{RegionC}", FornitoreFattura.Region);
                            sAllegato1 = sAllegato1.replace("{Vat_NumberC}", FornitoreFattura.Vat_Number);
                            sAllegato1 = sAllegato1.replace("{Tax_CodeC}", FornitoreFattura.Tax_Code);
                            //DATA
                            sAllegato1 = sAllegato1.replace("{Doc_Date}", new Date(Fattura.Zdatadocumento).toLocaleDateString("IT-it"));
                            //AZIENDA
                            sAllegato1 = sAllegato1.replace("{NameA}", AziendaFattura.Name);
                            sAllegato1 = sAllegato1.replace("{StreetA}", AziendaFattura.Street);
                            sAllegato1 = sAllegato1.replace("{House_Num1A}", AziendaFattura.House_Num1);
                            sAllegato1 = sAllegato1.replace("{Post_Code1A}", AziendaFattura.Post_Code);
                            sAllegato1 = sAllegato1.replace("{City1A}", AziendaFattura.City1);
                            sAllegato1 = sAllegato1.replace("{RegionA}", AziendaFattura.Region);
                            sAllegato1 = sAllegato1.replace("{Vat_NumberA}", AziendaFattura.Vat_Number);
                            sAllegato1 = sAllegato1.replace("{Tax_CodeA}", AziendaFattura.Tax_Code);
                            //TESTI
                            sAllegato1 = sAllegato1.replace("{Testo1}", Fattura.Testo1);
                            sAllegato1 = sAllegato1.replace("{Testo2}", FirstItem.Testo2);
                            sAllegato1 = sAllegato1.replace("{Testo3}", FirstItem.Testo3);
                            //TABLE1
                            var sommaTotale = 0.00,
                                sommaQuantita = 0.00,
                                imponibile = 0.00,
                                totalemerce = 0.00;
                            if (!Forfettario) {
                                var fieldArray = ["Specie",
                                    "Stagionalita", "Varieta", "CertificazioneAziendale", "CertificazioneProdotto", "Residuo",
                                    "CertificazioneCommerciale", "Specifica", "Lavorazione", "Origine", "EventiColtivazione",
                                    "CaratteristicaRaccoltaTaglio", "ServizioRaccoltaTaglio", "ServizioCaricoAutomezzi",
                                    "ServizioAssistenzaTecnica", "ServizioDeposito", "ServizioCalibrazione", "ZonaTrasporto",
                                    "Incoterm", "ServizioExtra1", "ServizioExtra2",
                                    "ServizioExtra3", "ServizioExtra4", "ServizioExtra5"],
                                    UniqueCombinations = [];
                                oData.results.forEach(y => {
                                    if (!UniqueCombinations.find(z => fieldArray.every((val, i) => z[val] === y[val]))) {
                                        var objectKey = {};
                                        fieldArray.forEach(chiave => objectKey[chiave] = y[chiave]);
                                        UniqueCombinations.push(objectKey);
                                    }
                                });
                                UniqueCombinations.forEach(y => {
                                    var aFilter = oData.results.filter(z => Object.entries(y).map(([key, value]) => value === z[key]).filter(error => error === false).length === 0);
                                    if (aFilter.length > 0) {
                                        sAllegato1 = sAllegato1.replace("{TABLE2}", Constants.FATTURA.ROW1TABLE1);
                                        var sommaTotaleRiga = 0.00,
                                            sommaQuantitaRiga = 0.00;
                                        sAllegato1 = sAllegato1.replace("{TABLE1}", Constants.FATTURA.TABLE1);
                                        Object.entries(aFilter[0]).map(([key, value]) => {
                                            sAllegato1 = sAllegato1.replace("{" + key + "}", value);
                                        });
                                        sAllegato1 = sAllegato1.replace("{DataInizioValiditaD}", new Date(aFilter[0].Zdataaccettazioneda).toLocaleDateString("IT-it"));
                                        sAllegato1 = sAllegato1.replace("{DataFineValiditaD}", new Date(aFilter[0].Zdataaccettazionea).toLocaleDateString("IT-it"));
                                        //ROW1TABLE1
                                        aFilter.sort(function (a, b) {
                                            return b.Repos - a.Repos;
                                        });
                                        aFilter.forEach(x => {
                                            if (x.Repos) {
                                                sAllegato1 = sAllegato1.replace("{ROW1TABLE1}", Constants.FATTURA.ROW1TABLE1);
                                                sAllegato1 = sAllegato1.replace("{ItemCode}", x.Matnr);
                                                sAllegato1 = sAllegato1.replace("{Quality}", x.DescQualita);
                                                sAllegato1 = sAllegato1.replace("{Caliber}", x.DescCalibrazione);
                                                sAllegato1 = sAllegato1.replace("{UM}", x.Meins);
                                                sAllegato1 = sAllegato1.replace("{Quantity}", x.Menge);
                                                var ImportoRiga = (parseFloat(x.zprezlordo) * parseFloat(x.zp)),
                                                    ImportoTotaleRiga = parseFloat(ImportoRiga) * parseFloat(x.Menge);
                                                sAllegato1 = sAllegato1.replace("{Price}", ImportoRiga.toFixed(2));
                                                sAllegato1 = sAllegato1.replace("{Total}", ImportoTotaleRiga.toFixed(2));
                                                sommaTotaleRiga = parseFloat(sommaTotaleRiga) + parseFloat(ImportoTotaleRiga);
                                                sommaQuantitaRiga = parseFloat(sommaQuantitaRiga) + parseFloat(x.Menge);
                                            } else {
                                                sAllegato1 = sAllegato1.replace("{ROW1TABLE1}", Constants.FATTURA.ROW1TABLE1);
                                                sAllegato1 = sAllegato1.replace("{ItemCode}", "");
                                                sAllegato1 = sAllegato1.replace("{Quality}", "Scarto");
                                                sAllegato1 = sAllegato1.replace("{Caliber}", "");
                                                sAllegato1 = sAllegato1.replace("{UM}", x.Meins);
                                                sAllegato1 = sAllegato1.replace("{Quantity}", x.Menge);
                                                sAllegato1 = sAllegato1.replace("{Price}", "");
                                                sAllegato1 = sAllegato1.replace("{Total}", "-");
                                                sommaQuantitaRiga = parseFloat(sommaQuantitaRiga) + parseFloat(x.Menge);
                                            }
                                        });
                                        sAllegato1 = sAllegato1.replace("{U.M}", aFilter[0].Meins);
                                        sAllegato1 = sAllegato1.replace("{SumQuantity}", parseFloat(sommaQuantitaRiga).toFixed(2));
                                        sAllegato1 = sAllegato1.replace("{SumTotal}", parseFloat(sommaTotaleRiga).toFixed(2));
                                        sommaQuantita = parseFloat(sommaQuantita) + parseFloat(sommaQuantitaRiga);
                                        sommaTotale = parseFloat(sommaTotale) + parseFloat(sommaTotaleRiga);
                                        sAllegato1 = sAllegato1.replace("{ROW1TABLE1}", "");
                                    }
                                });
                                sAllegato1 = sAllegato1.replace("{SumAllUM}", FirstItem.Meins);
                                sAllegato1 = sAllegato1.replace("{SumAllQuantity}", parseFloat(sommaQuantita).toFixed(2));
                                sAllegato1 = sAllegato1.replace("{SumAllTotal}", parseFloat(sommaTotale).toFixed(2));
                                sAllegato1 = sAllegato1.replace("{TABLE1}", "");
                                sAllegato1 = sAllegato1.replace("{ROW1TABLE3}", "");
                                //IMPORTI FATTURA
                                sAllegato1 = sAllegato1.replace("{VTotaleMerceConferita}", parseFloat(sommaQuantita).toFixed(2));

                                //MAGGIORAZIONE
                                FirstItem.ZCONFMAGGIORAZSet.results.forEach(zconf => {
                                    sAllegato1 = sAllegato1.replace("{ROW2MAGGIORAZIONE}", Constants.FATTURA.ROW2MAGGIORAZIONE);
                                    sAllegato1 = sAllegato1.replace("{Maggiorazione}", zconf.Zdescr);
                                    sAllegato1 = sAllegato1.replace("{VMaggiorazione}", parseFloat(zconf.Zcalcmag).toFixed(2));
                                    sommaTotale = parseFloat(sommaTotale) + parseFloat(zconf.Zcalcmag);
                                });
                                sAllegato1 = sAllegato1.replace("{ROW2MAGGIORAZIONE}", "");
                                //ACCONTI
                                FirstItem.ZCONFACCPREGSet.results.forEach(acc => {
                                    sAllegato1 = sAllegato1.replace("{ROW4ACCONTI}", Constants.FATTURA.ROW4ACCONTI);
                                    sAllegato1 = sAllegato1.replace("{Acconto}", "Acconto " + acc.Zdescr);
                                    sAllegato1 = sAllegato1.replace("{VAcconto}", parseFloat(acc.Zimporto).toFixed(2));
                                    sommaTotale = parseFloat(sommaTotale) + parseFloat(acc.Zimporto);
                                });
                                sAllegato1 = sAllegato1.replace("{ROW4ACCONTI}", "");
                                sAllegato1 = sAllegato1.replace("{Imponibile}", parseFloat(sommaTotale).toFixed(2));
                                //IVA
                                var aUniqueZiva = [...new Set(oData.results.map(item => `${item.ziva}%${item.ztotiva}`))];
                                aUniqueZiva.forEach(iva => {
                                    var values = iva.split("%"),
                                        Percentage = values[0],
                                        ZtotIva = values[1];
                                    sAllegato1 = sAllegato1.replace("{FOOTERROW2}", Constants.FATTURA.FOOTERROW2);

                                    sAllegato1 = sAllegato1.replace("{Percentage}", parseFloat(Percentage).toFixed(2));
                                    sAllegato1 = sAllegato1.replace("{Iva}", parseFloat(ZtotIva).toFixed(2));
                                    sommaTotale = parseFloat(sommaTotale) + parseFloat(ZtotIva);
                                });
                                sAllegato1 = sAllegato1.replace("{FOOTERROW2}", "");
                                sAllegato1 = sAllegato1.replace("{TotaleDocumento}", parseFloat(sommaTotale).toFixed(2));
                                //DDT
                                var aUniqueIHREZ = [...new Set(oData.results.map(item => item.ihrez))];
                                aUniqueIHREZ.forEach(ihrez => {
                                    var FindDDT = oData.results.find(y => y.ihrez === ihrez);
                                    sAllegato1 = sAllegato1.replace("{ROW1DDT}", Constants.FATTURA.ROW1DDT);
                                    sAllegato1 = sAllegato1.replace("{DeliveryNoteNumber}", FindDDT.ihrez);
                                    sAllegato1 = sAllegato1.replace("{Date1}", FindDDT.zz1_dataddt);
                                    sAllegato1 = sAllegato1.replace("{MemberDDTNumber}", FindDDT.unsez);
                                    sAllegato1 = sAllegato1.replace("{Date2}", FindDDT.zz1_dataddt);
                                });
                                sAllegato1 = sAllegato1.replace("{ROW1DDT}", "");
                            } else {
                                sommaTotale = parseFloat(Fattura.Zimponibile);
                                sAllegato1 = sAllegato1.replace("{Imponibile}", parseFloat(sommaTotale).toFixed(2));
                                //IVA
                                var aUniqueZiva = [...new Set(oData.results.map(item => `${item.ziva}%${item.ztotiva}`))];
                                aUniqueZiva.forEach(iva => {
                                    var values = iva.split("%"),
                                        Percentage = values[0],
                                        ZtotIva = values[1];
                                    sAllegato1 = sAllegato1.replace("{FOOTERROW2}", Constants.FATTURA.FOOTERROW2);

                                    sAllegato1 = sAllegato1.replace("{Percentage}", parseFloat(Percentage).toFixed(2));
                                    sAllegato1 = sAllegato1.replace("{Iva}", parseFloat(ZtotIva).toFixed(2));
                                    sommaTotale = parseFloat(sommaTotale) + parseFloat(ZtotIva);
                                });
                                sAllegato1 = sAllegato1.replace("{FOOTERROW2}", "");
                                sAllegato1 = sAllegato1.replace("{TotaleDocumento}", parseFloat(sommaTotale).toFixed(2));
                            }
                            sAllegato1 = sAllegato1.replaceAll("&", "&amp;");
                            var xmlz = (new DOMParser()).parseFromString(sAllegato1, "application/xml"),
                                xmlBase = window.btoa(unescape(unescape(encodeURIComponent((new XMLSerializer()).serializeToString(xmlz)))));
                            var mObj = {
                                "Form": forms,
                                "Template": templates,
                                "xmlData": xmlBase,
                                "formType": "Print",
                                "formLocale": "it_IT",
                                "taggedPdf": "0",
                                "embedFont": "0"
                            };
                            var oPDFModel = this.getView().getModel("pdfModel");
                            var filename = "Fattura" + ".pdf";
                            oPDFModel.create(Constants.PDF.ENTITY, mObj, {
                                success: (oData) => {
                                    resolve(oData.PDFOut);
                                },
                                error: (oError) => {
                                    reject();
                                }
                            });
                        } else {
                            reject();
                        }
                    },
                    error: (oError) => {
                        reject();
                    }
                });
            },
            onCreaNotaCredito: function (oEvent) {
                const oModel = this.getView().getModel("notaCreditoModel");
                var oTable = this.byId("TableStoricoRecap"),
                    oSelIndices = oTable.getSelectedIndices(),
                    Rows = [];
                oSelIndices.forEach(item => {
                    Rows.push(oTable.getContextByIndex(item).getObject());
                });
                if (Rows.length === 1) {
                    if (Rows[0].ZRilCont && Rows[0].Ztotdoc > 0) {
                        oModel.setProperty("/Row", Rows[0]);
                        if (!this._searchHelpNotaCreditoDialog) {
                            this._searchHelpNotaCreditoDialog = sap.ui.xmlfragment("it.orogel.cruscottoconferimento.view.Fragments.NotaCredito", this);
                            this.getView().addDependent(this._searchHelpNotaCreditoDialog);
                        }
                        this._searchHelpNotaCreditoDialog.open();
                    } else {
                        sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.SelezionaFattura.text"));
                    }
                } else {
                    sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.SelezionaUnaSolaFattura.text"));
                }
            },
            onCloseNotaCredito: function () {
                this._searchHelpNotaCreditoDialog.close();
                this._searchHelpNotaCreditoDialog.destroy();
                this._searchHelpNotaCreditoDialog = null;
            },
            onCreazioneNotaCredito: function () {
                let oModel = this.getView().getModel("notaCreditoModel").getData(),
                    bFiltro = false,
                    sErrore = "";
                if (!oModel.Importo) {
                    bFiltro = true;
                    if (sErrore === "") {
                        sErrore = "Valorizzare i seguenti campi:" + "\n";
                    }
                    sErrore += "Importo" + "\n";
                }
                if (!oModel.DataDocumento) {
                    bFiltro = true;
                    if (sErrore === "") {
                        sErrore = "Valorizzare i seguenti campi:" + "\n";
                    }
                    sErrore += "Data Documento" + "\n";
                }
                if (!parseFloat(oModel.Importo) > parseFloat(oModel.Row.Ztotdoc)) {
                    bFiltro = true;
                    sErrore += "Inserire un importo minore del valore della fattura" + "\n";
                }
                if (bFiltro) {
                    sap.m.MessageToast.show(sErrore);
                    return;
                }
                var NotaCredito = {
                    "Testo1": oModel.Nota1 ? oModel.Nota1 : "",
                    "Testo2": oModel.Nota2 ? oModel.Nota2 : "",
                    "Testo3": oModel.Nota3 ? oModel.Nota3 : "",
                    "Zidstorico": oModel.Row.Zidstorico,
                    "Znumprot": oModel.Row.Znumprot,
                    "Zdatadocumento": oModel.DataDocumento,
                    "Ztotdoc": oModel.Importo,
                };
                this.oGlobalBusyDialog.open();
                this.getView().getModel().create("/NotaCreditoSet", NotaCredito, {
                    success: (oDataFAD1) => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Successo");
                        this.onCloseNotaCredito();
                        this.onFilterSearchFAD3();
                    },
                    error: () => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Errore di connessione");
                        this.onCloseNotaCredito();
                    }
                });
            },
            onCambiaRegimeFiscale: function (oEvent) {
                const oModel = this.getView().getModel("cambioRegimeFiscaleModel");
                var oTable = this.byId("TableStoricoRecap"),
                    oSelIndices = oTable.getSelectedIndices(),
                    Rows = [];
                oSelIndices.forEach(item => {
                    Rows.push(oTable.getContextByIndex(item).getObject());
                });
                if (Rows.length === 1) {
                    if (Rows[0].ZRilCont && Rows[0].Ztotdoc > 0 && Rows[0].Zprogsdi !== "" && Rows[0].Zstatus === "I" && Rows[0].Znumprot !== "") {
                        oModel.setProperty("/Row", Rows[0]);
                        if (!this._searchHelpCambioRegimeFiscaleDialog) {
                            this._searchHelpCambioRegimeFiscaleDialog = sap.ui.xmlfragment("it.orogel.cruscottoconferimento.view.Fragments.CambioRegimeFiscale", this);
                            this.getView().addDependent(this._searchHelpCambioRegimeFiscaleDialog);
                        }
                        this._searchHelpCambioRegimeFiscaleDialog.open();
                    } else {
                        sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.SelezionaFattura.text"));
                    }
                } else {
                    sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.SelezionaUnaSolaFattura.text"));
                }
            },
            onCloseCambioRegimeFiscale: function () {
                this._searchHelpCambioRegimeFiscaleDialog.close();
                this._searchHelpCambioRegimeFiscaleDialog.destroy();
                this._searchHelpCambioRegimeFiscaleDialog = null;
            },
            onCambioRegimeFiscale: function () {
                let oModel = this.getView().getModel("cambioRegimeFiscaleModel").getData(),
                    bFiltro = false,
                    sErrore = "";
                if (!oModel.Importo) {
                    bFiltro = true;
                    if (sErrore === "") {
                        sErrore = "Valorizzare i seguenti campi:" + "\n";
                    }
                    sErrore += "Importo" + "\n";
                }
                if (!oModel.DataDocumento) {
                    bFiltro = true;
                    if (sErrore === "") {
                        sErrore = "Valorizzare i seguenti campi:" + "\n";
                    }
                    sErrore += "Data Documento" + "\n";
                }
                if (!parseFloat(oModel.Importo) > parseFloat(oModel.Row.Ztotdoc)) {
                    bFiltro = true;
                    sErrore += "Inserire un importo minore del valore della fattura" + "\n";
                }
                if (bFiltro) {
                    sap.m.MessageToast.show(sErrore);
                    return;
                }
                var NotaCredito = {
                    "Testo1": oModel.Nota1 ? oModel.Nota1 : "",
                    "Testo2": oModel.Nota2 ? oModel.Nota2 : "",
                    "Testo3": oModel.Nota3 ? oModel.Nota3 : "",
                    "Zidstorico": oModel.Row.Zidstorico,
                    "Znumprot": oModel.Row.Znumprot,
                    "Zdatadocumento": oModel.DataDocumento,
                    "Ztotdoc": oModel.Importo,
                };
                this.oGlobalBusyDialog.open();
                this.getView().getModel().create("/CambioRegimeFiscSet", NotaCredito, {
                    success: (oDataFAD1) => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Successo");
                        this.onCloseCambioRegimeFiscale();
                        this.onFilterSearchFAD3();
                    },
                    error: () => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Errore di connessione");
                        this.onCloseCambioRegimeFiscale();
                    }
                });
            },
        });
    });