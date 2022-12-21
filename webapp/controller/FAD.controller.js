sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    'sap/m/Token',
    "it/orogel/cruscottoconferimento/model/CostantiAttributi",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, FilterOperator, Filter, JSONModel, Fragment, MessageBox, Token, CostantiAttributi) {
        "use strict";

        return Controller.extend("it.orogel.cruscottoconferimento.controller.FAD", {
            onInit: function () {
                this.oComponent = this.getOwnerComponent();
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                // [Gheorghe]
                this.getOwnerComponent().setModel(new JSONModel({}), "filterModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "filterModelFAD2");
                this.getOwnerComponent().setModel(new JSONModel({}), "filterModel3");
                this.getOwnerComponent().setModel(new JSONModel({}), "dynamicModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "dynamicModel3");
                this.getOwnerComponent().setModel(new JSONModel([{ key: "EXW", text: "Franco Fabbrica" }, { key: "FCA", text: "Franco Vettore" }]), "incoterModel");
                this.getOwnerComponent().setModel(new JSONModel([{ key: "01", text: "01" }, { key: "02", text: "02" }, { key: "03", text: "03" }, { key: "04", text: "04" }, { key: "05", text: "05" }, { key: "06", text: "06" }, { key: "07", text: "07" }, { key: "08", text: "08" }, { key: "09", text: "09" }, { key: "10", text: "10" }, { key: "11", text: "11" }, { key: "12", text: "12" }, { key: "13", text: "13" }, { key: "14", text: "14" }, { key: "15", text: "15" }, { key: "16", text: "16" }, { key: "17", text: "17" }, { key: "18", text: "18" }, { key: "19", text: "19" }, { key: "20", text: "20" }]), "codAccModel");
                const oAppModel = this.oComponent.getModel("appModel");
                oAppModel.setProperty("/Table3Visible", false);
                oAppModel.setProperty("/TableStoricoRecapVisible", false);
                oAppModel.setProperty("/TableStoricoPosVisible", false);
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
                    sErrore += "Data documento acquisto" + "\n";
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
                delete aValues[38]
                delete aValues[39]
                delete aValues[40]
                delete aValues[41]
                delete aValues[42]
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

                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("DataDocumento", FilterOperator.BT, filterModel.DataDocumentoFrom, filterModel.DataDocumentoTo)],
                    and: false
                }));

                oFinalFilter.aFilters.push(new Filter({
                    filters: [new Filter("Causale", FilterOperator.EQ, filterModel.ZCAUSALE2)],
                    and: false
                }));
                if (filterModel.hasOwnProperty('ZCAUSALE')) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("CausaleAcconti", FilterOperator.EQ, filterModel.ZCAUSALE)],
                        and: false
                    }));
                }
                if (filterModel.hasOwnProperty('DataAccontoFrom') && filterModel.hasOwnProperty('DataAccontoTo')) {
                    oFinalFilter.aFilters.push(new Filter({
                        filters: [new Filter("DataAcconto", FilterOperator.BT, filterModel.DataAccontoFrom, filterModel.DataAccontoTo)],
                        and: false
                    }));
                }
                if (filterModel.hasOwnProperty('DataDocumentoI')) {
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
                this.oGlobalBusyDialog.open();
                this.getView().getModel().read("/FAD1Set", {
                    urlParameters: {
                        "$expand": "ZCONFSTORHEAD2Set,ZCONFSTORPOS2Set,ZCONFSTORRECAP2Set"
                    },
                    filters: [oFinalFilter],
                    success: (oDataFAD1) => {
                        //Success
                        //oDataFAD1.results[0].Errore = "3";
                        debugger;
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
                            sap.m.MessageBox.warning(sError);
                        }
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
                    },
                    error: () => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Errore di connessione");
                    }
                });

            },
            onFilterSearchFAD3: function (oEvent) {// [Gheorghe]
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

                } else if (field === 'ZCAUSALE' || field === 'ZCAUSALE3' || field === 'ZCAUSALE4') {

                    var results = await this._APIGet(this.getOwnerComponent().getModel("causaleModel"), "/ZZ1_CONFCAUSALE", "CAUSALE,ZTEXT", new Filter("ACTIVE", FilterOperator.EQ, true))
                    results.forEach(e => {
                        var obj = { key: e.CAUSALE, text: e.ZTEXT, type: field }
                        arrayRes.push(obj)
                    });
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(false)
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
                    if (field === 'SPECIE2') {
                        aFilter.push(new Filter("Zattr", sap.ui.model.FilterOperator.EQ, 'SPECIE'));
                    } else if (field === 'STAGIONALITA2') {
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
                if (field === 'ZCAUSALE' || field === 'ZCAUSALE2' || field === 'ZCAUSALE3' || field === 'ZCAUSALE4') {
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(false)
                } else {
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(true)
                }
            },
            onValueHelpRequestConferimento: async function (dynamicModel, event, field) {// [Gheorghe]
                var oView = this.getView(),
                    arrayRes = [],
                    Modello = "";
                if (dynamicModel === "dynamicModel3") {
                    Modello = "3M";
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
                } else if (field === 'ZCONFIVA') {

                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/ConfIVASet", "Taxm1,Ziva")
                    aResults.forEach(e => {
                        var obj = { key: e.Taxm1, text: e.Ziva, type: field }
                        arrayRes.push(obj)
                    });
                    if (arrayRes.length > 0) {
                        this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(false)
                    }
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);
                } else if (field === 'ZCAUSALE2') {
                    var results = await this._APIGet(this.getOwnerComponent().getModel(""), "/ConfCausaleStoricoSet", "CAUSALE,ZTEXT", new Filter("ACTIVE", FilterOperator.EQ, true))
                    results.forEach(e => {
                        var obj = { key: e.CAUSALE, text: e.ZTEXT, type: field }
                        arrayRes.push(obj)
                    });
                    this.byId("_IDGenSelectDialog1" + Modello).setMultiSelect(false)
                    this.getOwnerComponent().getModel(dynamicModel).setData(arrayRes);

                }

                this.refresh(dynamicModel);
                this.oGlobalBusyDialog.close();
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));


            },
            _handleValueHelpClose: function (dynamicModel, evt) {// [Gheorghe]
                var aSelectedItems = evt.getParameter("selectedItems"),
                    aContexts = evt.getParameter("selectedContexts"),
                    Modello = "",
                    oBinding = evt.getSource().getBinding("items");
                if (dynamicModel === "dynamicModel3") {
                    Modello = "M3";
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

                    if (aSelectedItems && aSelectedItems.length > 0) {
                        aSelectedItems.forEach(function (oItem) {
                            if (type === 'BUKRS' || type === 'BUKRS2' || type === 'ZCAUSALE2' || type === 'ZCAUSALE') {
                                oMultiInput.setValue(oItem.getTitle())
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
                oAppModel.setProperty("/rowsStoricoRecap", aStoricoRecap);
                oAppModel.setProperty("/rowsStoricoPosizioni", aStoricoPos);
                oTableRecap.setModel(oAppModel);
                oTableRecap.bindRows("/rowsStoricoRecap");
                oTableRecap.sort(oTableRecap.getColumns()[0]);
                oTablePos.setModel(oAppModel);
                oTablePos.bindRows("/rowsStoricoPosizioni");
                oTablePos.sort(oTablePos.getColumns()[0]);
                oAppModel.refresh(true);
            },
            onVistaDettagliata: function () {
                const oAppModel = this.getView().getModel("appModel");
                oAppModel.setProperty("/TableStoricoRecapVisible", false);
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
            }
        });
    });
