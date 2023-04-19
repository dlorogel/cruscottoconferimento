sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    'sap/m/Token',
    "it/orogel/cruscottoconferimento/model/Constants",
    "it/orogel/cruscottoconferimento/model/CostantiAttributi",
    "../../model/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, FilterOperator, Filter, JSONModel, Fragment, Token, Constants, CostantiAttributi, formatter) {
        "use strict";

        return Controller.extend("it.orogel.cruscottoconferimento.controller.FA.Compensazione", {
            formatter: formatter,
            onInit: function () {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("FA.Compensazione").attachPatternMatched(this._onObjectMatched, this);
                this.oComponent = this.getOwnerComponent();
                var partiteAperteModel = this.getOwnerComponent().setModel(new JSONModel({}), "partiteAperteModel");
                const oAppModel = this.oComponent.getModel("appModel");
                var RowsNoError = oAppModel.getProperty("/rowsNoError");
                oAppModel.setProperty("/EnabledData", false);
                if (!RowsNoError) {
                    this.onNavStart();
                }

            },
            _onObjectMatched: function (oEvent) {
                this._setTableNoError();
            },
            onNavBack: function () {
                const oAppModel = this.oComponent.getModel("appModel");
                oAppModel.setProperty("/EnabledData", false);
                let oHistory = History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("FA", true);
                }
            },
            onNavStart: function () {
                const oAppModel = this.oComponent.getModel("appModel");
                oAppModel.setProperty("/EnabledData", false);
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", true);
            },
            _setTableNoError: function () {
                //set model: concat new batch of data to previous model
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("TableCompensazione");
                var RowsNoError = oAppModel.getProperty("/rowsNoError");
                var RowsCompensazione = [];
                if (RowsNoError) {
                    RowsNoError.forEach(x => {
                        var Imponibile = 0.00,
                            TotaleFattura = 0.00,
                            TotaleAcconti = 0.00,
                            TotaleTrasporto = 0.00,
                            TotaleMaggiorazioni = 0.00,
                            TotaleMerce = 0.00,
                            TotaleIva = 0.00,
                            TotaleDocumento = 0.00;
                        x.STORHEADSet.results.forEach(y => {
                            TotaleMerce = parseFloat(TotaleMerce) + parseFloat(y.Ztoterogparz);
                            TotaleTrasporto = parseFloat(TotaleTrasporto) + parseFloat(y.Zcostraspneg);
                            TotaleMaggiorazioni = parseFloat(TotaleMaggiorazioni) + parseFloat(y.Zmaggioraz);
                        });
                        x.STORRECAPSet.results.forEach(y => {
                            TotaleAcconti = parseFloat(TotaleAcconti) + parseFloat(y.Ztotacconti);
                            TotaleFattura = parseFloat(TotaleFattura) + parseFloat(y.Ztotdoc);
                            Imponibile = parseFloat(Imponibile) + parseFloat(y.Zimponibile);
                            TotaleIva = parseFloat(TotaleIva) + parseFloat(y.Ztotiva);
                            TotaleDocumento = parseFloat(TotaleDocumento) + parseFloat(y.Ztotdoc);
                        });
                        var oCompensazione = {
                            "Bukrs": x.FornitoreFa,
                            "SocietaNome": x.SocietaNome,
                            "Lifnr": x.SocietaFa,
                            "FornitoreNome": x.FornitoreNome,
                            "Zimponibile": Imponibile.toFixed(2),
                            "Ztotiva": TotaleIva.toFixed(2),
                            "TotaleMaggiorazioni": TotaleMaggiorazioni.toFixed(2),
                            "Ztotdoc": TotaleDocumento.toFixed(2),
                            "TotaleAcconti": TotaleAcconti.toFixed(2),
                            "TotaleFattura": TotaleFattura.toFixed(2),
                            "TotaleMerce": TotaleMerce.toFixed(2),
                            "TotaleTrasporto": TotaleTrasporto.toFixed(2)
                        };
                        RowsCompensazione.push(oCompensazione);
                    });
                }
                oAppModel.setProperty("/rowsCompensazione", RowsCompensazione);
                oTable.setModel(oAppModel);
                oTable.bindRows("/rowsCompensazione");
                oTable.sort(oTable.getColumns()[1]);
                oAppModel.refresh(true);
            },

            onOpenRiassuntoPartite: async function () {
                this.oGlobalBusyDialog.open();
                var aFilter = [];
                let oFinalFilter = new Filter({
                    filters: [],
                    and: true
                });
                const oAppModel = this.getView().getModel("appModel");
                const filterModel = this.getView().getModel("filterModel").getData().DataDocumentoFrom;
                var fMultifilter,
                    RowsCompensazione = oAppModel.getProperty("/rowsCompensazione"),
                    sFrom = new Date(oAppModel.getProperty("/ZDATADOCDA")),
                    sTo = new Date(oAppModel.getProperty("/ZDATADOCA")),
                    sFromFornitori = new Date(oAppModel.getProperty("/ZDATADOCDAFORNITORI")),
                    sToFornitori = new Date(oAppModel.getProperty("/ZDATADOCAFORNITORI")),
                    ZClienteCheck = oAppModel.getProperty("/ClienteCheck"),
                    ZFornitoriCheck = oAppModel.getProperty("/FornitoriCheck"),
                    ZCapitaleSocialeCheck = oAppModel.getProperty("/CapitaleSocialeCheck"),
                    DataDocumentoDa = this.getView().getModel("filterModel").getData().DataDocumentoFrom,
                    ZpartSenzaSeme = oAppModel.getProperty("/PartiteSenzaSeme");
                if (!ZClienteCheck) {
                    ZClienteCheck = false;
                }
                if (!ZFornitoriCheck) {
                    ZFornitoriCheck = false;
                }
                if (!ZCapitaleSocialeCheck) {
                    ZCapitaleSocialeCheck = false;
                }
                sFrom.setHours(sFrom.getHours() + sFrom.getTimezoneOffset() / 60);
                sTo.setHours(sTo.getHours() + sTo.getTimezoneOffset() / 60);
                sFromFornitori.setHours(sFromFornitori.getHours() + sFromFornitori.getTimezoneOffset() / 60);
                sToFornitori.setHours(sToFornitori.getHours() + sToFornitori.getTimezoneOffset() / 60);
                //sFromSociale.setHours(sFromSociale.getHours() + sFromSociale.getTimezoneOffset() / 60);
                //sToSociale.setHours(sToSociale.getHours() + sToSociale.getTimezoneOffset() / 60);
                aFilter.push(new Filter("Cliente", sap.ui.model.FilterOperator.EQ, ZClienteCheck));
                oFinalFilter.aFilters.push(new Filter({
                    filters: aFilter,
                    and: false
                }));
                aFilter = [];
                aFilter.push(new Filter("Sociale", sap.ui.model.FilterOperator.EQ, ZCapitaleSocialeCheck));
                oFinalFilter.aFilters.push(new Filter({
                    filters: aFilter,
                    and: false
                }));
                aFilter = [];
                aFilter.push(new Filter("Fornitore", sap.ui.model.FilterOperator.EQ, ZFornitoriCheck));
                oFinalFilter.aFilters.push(new Filter({
                    filters: aFilter,
                    and: false
                }));
                aFilter = [];
                aFilter.push(new Filter("Bldat", sap.ui.model.FilterOperator.EQ, DataDocumentoDa));
                oFinalFilter.aFilters.push(new Filter({
                    filters: aFilter,
                    and: false
                }));
                aFilter = [];
                if (RowsCompensazione.length > 0) {
                    var Company = RowsCompensazione[0].Bukrs;
                    var aUniqueKunnr = [...new Set(RowsCompensazione.map(item => item.Lifnr))];
                }
                if (Company) {
                    aFilter.push(new Filter("Rbukrs", sap.ui.model.FilterOperator.EQ, Company));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: false
                    }));
                }
                aFilter = [];
                if (aUniqueKunnr) {
                    if (aUniqueKunnr.length > 0) {
                        aUniqueKunnr.forEach(x => {
                            aFilter.push(new Filter("Lifnr", sap.ui.model.FilterOperator.EQ, x));
                        });
                        oFinalFilter.aFilters.push(new Filter({
                            filters: aFilter,
                            and: false
                        }));
                    }
                }
                var eliminaspecia = false;
                if (((sFrom && sTo) || !ZClienteCheck) && ((sFromFornitori && sToFornitori) || !ZFornitoriCheck)) {
                    if (ZClienteCheck) {
                        if (ZpartSenzaSeme === "3" && (this.multiFilter("iZZ1SPECIECompensazione", "Specie"))) {
                            eliminaspecia = true;
                        }
                        aFilter = [];
                        aFilter.push(new Filter("Partite", sap.ui.model.FilterOperator.EQ, ZpartSenzaSeme));
                        oFinalFilter.aFilters.push(new Filter({
                            filters: aFilter,
                            and: false
                        }));
                        aFilter = [];
                        fMultifilter = this.multiFilter("iBLARTCompensazione", "Blart");
                        if (fMultifilter) {
                            aFilter.push(fMultifilter);
                            oFinalFilter.aFilters.push(new Filter({
                                filters: aFilter,
                                and: false
                            }));
                        }
                        aFilter = [];
                        fMultifilter = this.multiFilter("iZZ1SPECIECompensazione", "Specie");
                        if (fMultifilter) {
                            aFilter.push(fMultifilter);
                            oFinalFilter.aFilters.push(new Filter({
                                filters: aFilter,
                                and: false
                            }));
                        }
                        aFilter = [];
                        aFilter.push(new Filter("BldatCliente", sap.ui.model.FilterOperator.BT, sFrom, sTo));
                        oFinalFilter.aFilters.push(new Filter({
                            filters: aFilter,
                            and: false
                        }));
                    }
                    if (ZFornitoriCheck) {
                        aFilter = [];
                        if (sFromFornitori && sToFornitori) {
                            aFilter.push(new Filter("BldatFornitore", sap.ui.model.FilterOperator.BT, sFromFornitori, sToFornitori));
                            oFinalFilter.aFilters.push(new Filter({
                                filters: aFilter,
                                and: false
                            }));
                        }
                    }
                    if (eliminaspecia === false) {
                        const oPromiseCompensazione = new Promise((resolve, reject) => {
                            this.getView().getModel().read("/FAD1CompensazioneSet", {
                                filters: [oFinalFilter],
                                success: (aData) => {
                                    const oAppModel = this.getView().getModel("appModel");
                                    oAppModel.setProperty("/rowsDettaglioPartite", aData.results);
                                    resolve(aData.results);
                                },
                                error: (oError) => {
                                    reject();
                                }
                            });
                        });
                        oPromiseCompensazione.then((aResults) => {
                            if (!this.RiassuntoPartiteDialog) {
                                this.RiassuntoPartiteDialog = sap.ui.xmlfragment("it.orogel.cruscottoconferimento.view.FA.Fragments.RiassuntoPartite", this);
                                this.getView().addDependent(this.RiassuntoPartiteDialog);
                            }
                            this._setTableRiassuntoPartite(aResults);
                            this.RiassuntoPartiteDialog.open();
                            this.oGlobalBusyDialog.close();
                        }, oError => {
                            sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.error.compensazione.text"));
                            this.oGlobalBusyDialog.close();
                        });
                    } else {
                        sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.error.eliminafiltrospecie.text"));
                        this.oGlobalBusyDialog.close();
                    }
                } else {
                    sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.error.dateobbligatorie.text"));
                    this.oGlobalBusyDialog.close();
                }
            },
            /*multiFilter: function (idField, sField) {
                if (sap.ui.getCore().byId(idField).getValue() && sap.ui.getCore().byId(idField).getValue().length > 0) {
                    let aFilterMulti = [];
                    sap.ui.getCore().byId(idField).getValue().forEach(x => {
                        aFilterMulti.push(new Filter(sField, FilterOperator.EQ, x));
                    });
                    return (new Filter({
                        filters: aFilterMulti,
                        and: false
                    }));
                } else {
                    return null;
                }
            },*/
            multiFilter: function (idField, sField) {
                if (sap.ui.getCore().byId(idField).getTokens() && sap.ui.getCore().byId(idField).getTokens().length > 0) {
                    let aFilterMulti = [];
                    sap.ui.getCore().byId(idField).getTokens().forEach(x => {
                        aFilterMulti.push(new Filter(sField, FilterOperator.EQ, x.getKey()));
                    });
                    return (new Filter({
                        filters: aFilterMulti,
                        and: false
                    }));
                } else {
                    return null;
                }
            }, _setTableRiassuntoPartite: function (aResults) {
                //set model: concat new batch of data to previous model
                const oAppModel = this.getView().getModel("appModel");
                const oTable = sap.ui.getCore().byId("TableRiassuntoPartite");
                var aRowsDettaglioPartite = oAppModel.getProperty("/rowsDettaglioPartite");
                var aRowsRiassuntoPartite = [];
                aRowsDettaglioPartite.forEach(x => {
                    var Find = aRowsRiassuntoPartite.find(y => y.Rubkrs === x.Rubkrs && (y.Lifnr === x.Lifnr || y.Lifnr === x.Kunnr));
                    if (!Find) {
                        var oJson = {};
                        oJson.Lifnr = x.Lifnr ? x.Lifnr : x.Kunnr;
                        oJson.Rbukrs = x.Rbukrs;
                        oJson.PartiteCliente = 0;
                        oJson.PartiteFornitore = 0;
                        oJson.CapitaleSociale = 0;
                        aRowsRiassuntoPartite.push(oJson);
                        switch (x.Tipo) {
                            case "1":
                                oJson.PartiteCliente = parseFloat(x.Tsl);
                                break;
                            case "2":
                                if (parseFloat(x.Tsl) < 0) {
                                    oJson.PartiteFornitore = -parseFloat(x.Tsl);
                                } else {
                                    oJson.PartiteFornitore = parseFloat(x.Tsl);
                                }
                                break;
                            case "3":
                                oJson.CapitaleSociale = parseFloat(x.Tsl);
                                break;
                        }
                    } else {
                        switch (x.Tipo) {
                            case "1":
                                Find.PartiteCliente = (parseFloat(Find.PartiteCliente) + parseFloat(x.Tsl));
                                break;
                            case "2":
                                if (parseFloat(x.Tsl) < 0) {
                                    Find.PartiteFornitore = (parseFloat(Find.PartiteFornitore) - parseFloat(x.Tsl));
                                } else {
                                    Find.PartiteFornitore = (parseFloat(Find.PartiteFornitore) + parseFloat(x.Tsl));
                                }
                                break;
                            case "3":
                                Find.CapitaleSociale = (parseFloat(Find.CapitaleSociale) + parseFloat(x.Tsl));
                                break;
                        }
                    }
                });
                oAppModel.setProperty("/rowsRiassuntoPartite", aRowsRiassuntoPartite);
                oTable.setModel(oAppModel);
                oTable.bindRows("/rowsRiassuntoPartite");
                oTable.sort(oTable.getColumns()[1]);
                oAppModel.refresh(true);
            },
            onCloseDialogRiassuntoPartite: function () {
                this.RiassuntoPartiteDialog.close();
                this.RiassuntoPartiteDialog.destroy();
                this.RiassuntoPartiteDialog = null;
            },
            onCloseDialogDettaglioPartite: function () {
                const oAppModel = this.getView().getModel("appModel");
                var aRowsDettaglioPartite1 = oAppModel.getProperty("/rowsTabellaDettaglioPartite1"),
                    aRowsDettaglioPartite2 = oAppModel.getProperty("/rowsTabellaDettaglioPartite2"),
                    aRowsDettaglioPartite1Copy = oAppModel.getProperty("/rowsTabellaDettaglioPartiteCopy1"),
                    aRowsDettaglioPartite2Copy = oAppModel.getProperty("/rowsTabellaDettaglioPartiteCopy2"),
                    aRowsRiassuntoPartite = oAppModel.getProperty("/rowsRiassuntoPartite");
                /*aRowsFiltered1.forEach(x => {
                    var Find = aRowsRiassuntoPartite.find(y => y.Kunnr === x.Lifnr && y.Rubkrs === x.Rubkrs);
                    if (Find) {
                        Find.PartiteCliente = (parseFloat(Find.PartiteCliente) - parseFloat(x.Tsl));
                    }
                });*/
                for (var i = 0; i < aRowsDettaglioPartite1.length; i++) {
                    if (aRowsDettaglioPartite1[i].Selezionato !== aRowsDettaglioPartite1Copy[i].Selezionato) {
                        var Find = aRowsRiassuntoPartite.find(y => y.Lifnr === aRowsDettaglioPartite1[i].Kunnr && y.Rubkrs === aRowsDettaglioPartite1[i].Rubkrs);
                        if (Find && aRowsDettaglioPartite1[i].Selezionato) {
                            Find.PartiteCliente = (parseFloat(Find.PartiteCliente) + parseFloat(aRowsDettaglioPartite1[i].Tsl));
                        } else if (Find && !aRowsDettaglioPartite1[i].Selezionato) {
                            Find.PartiteCliente = (parseFloat(Find.PartiteCliente) - parseFloat(aRowsDettaglioPartite1[i].Tsl));
                        }
                    }
                }
                /*aRowsFiltered2.forEach(x => {
                    var Find = aRowsRiassuntoPartite.find(y => y.Lifnr === x.Lifnr && y.Rubkrs === x.Rubkrs);
                    if (Find) {
                        Find.PartiteFornitore = (parseFloat(Find.PartiteFornitore) - parseFloat(x.Tsl));
                    }
                });*/
                for (var i = 0; i < aRowsDettaglioPartite2.length; i++) {
                    if (aRowsDettaglioPartite2[i].Selezionato !== aRowsDettaglioPartite2Copy[i].Selezionato) {
                        var Find = aRowsRiassuntoPartite.find(y => y.Lifnr === aRowsDettaglioPartite2[i].Lifnr && y.Rubkrs === aRowsDettaglioPartite2[i].Rubkrs);
                        if (Find && aRowsDettaglioPartite2[i].Selezionato) {
                            Find.PartiteFornitore = (parseFloat(Find.PartiteFornitore) + parseFloat(aRowsDettaglioPartite2[i].Tsl));
                        } else if (Find && !aRowsDettaglioPartite2[i].Selezionato) {
                            Find.PartiteFornitore = (parseFloat(Find.PartiteFornitore) - parseFloat(aRowsDettaglioPartite2[i].Tsl));
                        }
                    }
                }
                oAppModel.setProperty("/rowsTabellaDettaglioPartiteCopy1", aRowsDettaglioPartite1);
                oAppModel.setProperty("/rowsTabellaDettaglioPartiteCopy2", aRowsDettaglioPartite2);
                oAppModel.refresh(true);
                this.DettaglioPartiteDialog.close();
                this.DettaglioPartiteDialog.destroy();
                this.DettaglioPartiteDialog = null;
            },
            onChangeData: function (oEvent) {
                const oAppModel = this.getView().getModel("appModel");
                var sFrom = oAppModel.getProperty("/ZDATADOCDA");
                var sTo = oAppModel.getProperty("/ZDATADOCA");
                if (sFrom && sTo) {
                    oAppModel.setProperty("/EnabledData", true);
                } else {
                    oAppModel.setProperty("/EnabledData", false);
                }
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
            onValueHelpRequestConferimento: async function (event, field) {// [Gheorghe]
                var oView = this.getView(),
                    arrayRes = [];
                const oAppModel = this.getView().getModel("appModel");
                const filterModel = this.getView().getModel("filterModel");

                var RowsCompensazione = oAppModel.getProperty("/rowsCompensazione"),
                    sFrom = oAppModel.getProperty("/ZDATADOCDA"),
                    sTo = oAppModel.getProperty("/ZDATADOCA");
                if (RowsCompensazione.length > 0) {
                    var Company = RowsCompensazione[0].Bukrs;
                    var aUniqueKunnr = [...new Set(RowsCompensazione.map(item => item.Lifnr))];
                }
                this.oGlobalBusyDialog.open();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "it.orogel.cruscottoconferimento.view.FA.Fragments.DynamicFragPartite",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                if (field === 'ZZ1SPECIE') {
                    var aFilter = [];
                    let oFinalFilter = new Filter({
                        filters: [],
                        and: true
                    });
                    if (Company) {
                        aFilter.push(new Filter("Rbukrs", sap.ui.model.FilterOperator.EQ, Company));
                        oFinalFilter.aFilters.push(new Filter({
                            filters: aFilter,
                            and: true
                        }));
                    }
                    aFilter = [];
                    if (aUniqueKunnr.length > 0) {
                        aUniqueKunnr.forEach(x => {
                            aFilter.push(new Filter("Kunnr", sap.ui.model.FilterOperator.EQ, x));
                        });
                        oFinalFilter.aFilters.push(new Filter({
                            filters: aFilter,
                            and: false
                        }));
                    }
                    aFilter = [];
                    aFilter.push(new Filter("Xopvw", sap.ui.model.FilterOperator.EQ, "X"));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                    aFilter = [];
                    aFilter.push(new Filter("Koart", sap.ui.model.FilterOperator.EQ, "D"));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                    aFilter = [];
                    aFilter.push(new Filter("Umskz", sap.ui.model.FilterOperator.EQ, ""));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                    var aFilter = [];
                    aFilter.push(new Filter("Bldat", sap.ui.model.FilterOperator.BT, sFrom, sTo));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                    //var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/SpecieSet", "ZZ1_Specie_prd", oFinalFilter)
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/SpecieSet", "ZZ1_ZZSPECIE_JEI,Zdescr", oFinalFilter)
                    aResults.forEach(e => {
                        var obj = { key: e.ZZ1_ZZSPECIE_JEI, text: e.Zdescr, type: field }
                        arrayRes.push(obj)
                    });
                    this.getOwnerComponent().getModel("partiteAperteModel").setData(arrayRes);
                    this.byId("_IDGenSelectDialog1FragPartite").setMultiSelect(true)
                } else if (field === 'BLART') {
                    var aFilter = [];
                    let oFinalFilter = new Filter({
                        filters: [],
                        and: true
                    });
                    if (Company) {
                        aFilter.push(new Filter("Rbukrs", sap.ui.model.FilterOperator.EQ, Company));
                        oFinalFilter.aFilters.push(new Filter({
                            filters: aFilter,
                            and: true
                        }));
                    }
                    aFilter = [];
                    if (aUniqueKunnr.length > 0) {
                        aUniqueKunnr.forEach(x => {
                            aFilter.push(new Filter("Kunnr", sap.ui.model.FilterOperator.EQ, x));
                        });
                        oFinalFilter.aFilters.push(new Filter({
                            filters: aFilter,
                            and: false
                        }));
                    }
                    aFilter = [];
                    aFilter.push(new Filter("Xopvw", sap.ui.model.FilterOperator.EQ, "X"));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                    aFilter = [];
                    aFilter.push(new Filter("Koart", sap.ui.model.FilterOperator.EQ, "D"));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                    aFilter = [];
                    aFilter.push(new Filter("Umskz", sap.ui.model.FilterOperator.EQ, ""));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                    var aFilter = [];
                    aFilter.push(new Filter("Bldat", sap.ui.model.FilterOperator.BT, sFrom, sTo));
                    oFinalFilter.aFilters.push(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                    var aResults = await this._APIGet(this.getOwnerComponent().getModel(), "/BlartFilterSet", "Blart,Ltext", oFinalFilter)
                    aResults.forEach(e => {
                        var obj = { key: e.Blart, text: e.Ltext, type: field }
                        arrayRes.push(obj)
                    });
                    this.getOwnerComponent().getModel("partiteAperteModel").setData(arrayRes);
                    this.byId("_IDGenSelectDialog1FragPartite").setMultiSelect(true)
                }
                this.refresh("partiteAperteModel");
                this.oGlobalBusyDialog.close();
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));
            },
            _handleValueHelpClose: function (evt) {// [Gheorghe]
                var aSelectedItems = evt.getParameter("selectedItems");
                if (aSelectedItems) {
                    let kAttributi = CostantiAttributi.ATTRCOMPENSAZIONE
                    var type = this.getOwnerComponent().getModel("partiteAperteModel").getData()[0].type
                    switch (type) {
                        case type:
                            //var oMultiInput = this.byId(kAttributi[type].id);
                            var oMultiInput = sap.ui.getCore().byId(kAttributi[type].id + "Compensazione");
                            break;
                        default:
                            break;
                    }

                    if (aSelectedItems && aSelectedItems.length > 0) {
                        aSelectedItems.forEach(function (oItem) {
                            if (type === 'ZZ1SPECIE' || type === 'BLART') {
                                oMultiInput.addToken(new Token({
                                    key: oItem.getTitle(),
                                    text: oItem.getTitle()
                                }));
                            } else {
                                oMultiInput.setValue(oItem.getTitle());
                            }
                        });
                    }
                }
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
            onChangeRowRiassuntoPartite: function (oEvent) {
                if (!this.DettaglioPartiteDialog) {
                    this.DettaglioPartiteDialog = sap.ui.xmlfragment("it.orogel.cruscottoconferimento.view.FA.Fragments.DettaglioPartite", this);
                    this.getView().addDependent(this.DettaglioPartiteDialog);
                }
                const oAppModel = this.getView().getModel("appModel");
                var aRowsDettaglioPartite = oAppModel.getProperty("/rowsDettaglioPartite"),
                    aRowsRiassuntoPartite = oAppModel.getProperty("/rowsRiassuntoPartite"),
                    oTable = sap.ui.getCore().byId("TableRiassuntoPartite"),
                    IndexSelected = oEvent.getParameters().rowIndex,
                    RowSelected = oTable.getContextByIndex(IndexSelected).getObject(),
                    RowsFiltered1 = aRowsDettaglioPartite.filter(x => x.Kunnr === RowSelected.Lifnr && x.Rbukrs === RowSelected.Rbukrs && x.Tipo === "1"),
                    RowsFiltered2 = aRowsDettaglioPartite.filter(x => x.Lifnr === RowSelected.Lifnr && x.Rbukrs === RowSelected.Rbukrs && x.Tipo === "2"),
                    RowsFiltered3 = aRowsDettaglioPartite.filter(x => x.Lifnr === RowSelected.Lifnr && x.Rbukrs === RowSelected.Rbukrs && x.Tipo === "3");
                this._setTableDettaglioPartite1(RowsFiltered1);
                this._setTableDettaglioPartite2(RowsFiltered2);
                this._setTableDettaglioPartite3(RowsFiltered3);
                this.DettaglioPartiteDialog.open();
            },
            _setTableDettaglioPartite1: function (aResults) {
                //set model: concat new batch of data to previous model
                const oAppModel = this.getView().getModel("appModel"),
                    oTable = sap.ui.getCore().byId("TableDettaglioPartite1");
                oAppModel.setProperty("/rowsTabellaDettaglioPartite1", aResults);
                var aResultsCopy = JSON.parse(JSON.stringify(aResults));
                oAppModel.setProperty("/rowsTabellaDettaglioPartiteCopy1", aResultsCopy);
                oTable.setModel(oAppModel);
                oTable.bindRows("/rowsTabellaDettaglioPartite1");
                oTable.sort(oTable.getColumns()[1]);
                oAppModel.refresh(true);
            },
            _setTableDettaglioPartite2: function (aResults) {
                //set model: concat new batch of data to previous model
                const oAppModel = this.getView().getModel("appModel"),
                    oTable = sap.ui.getCore().byId("TableDettaglioPartite2");
                oAppModel.setProperty("/rowsTabellaDettaglioPartite2", aResults);
                var aResultsCopy = JSON.parse(JSON.stringify(aResults));
                oAppModel.setProperty("/rowsTabellaDettaglioPartiteCopy2", aResultsCopy);
                oTable.setModel(oAppModel);
                oTable.bindRows("/rowsTabellaDettaglioPartite2");
                oTable.sort(oTable.getColumns()[1]);
                oAppModel.refresh(true);
            },
            _setTableDettaglioPartite3: function (aResults) {
                //set model: concat new batch of data to previous model
                const oAppModel = this.getView().getModel("appModel"),
                    oTable = sap.ui.getCore().byId("TableDettaglioPartite3");
                oAppModel.setProperty("/rowsTabellaDettaglioPartite3", aResults);
                oTable.setModel(oAppModel);
                oTable.bindRows("/rowsTabellaDettaglioPartite3");
                oTable.sort(oTable.getColumns()[1]);
                oAppModel.refresh(true);
            },
            onSalvaPartite: function () {
                const oAppModel = this.getView().getModel("appModel");
                var DettaglioDefinitivo = oAppModel.getProperty("/rowsDettaglioPartite"),
                    RiassuntoDefinitivo = oAppModel.getProperty("/rowsRiassuntoPartite");
                oAppModel.setProperty("/rowsDettaglioPartiteDefinitivo", DettaglioDefinitivo);
                oAppModel.setProperty("/rowsRiassuntoPartiteDefinitivo", RiassuntoDefinitivo);
                this.onCloseDialogRiassuntoPartite();
                this.onCloseSelezionarePartite();
            },
            onEliminaRiassuntoPartite: function () {
                const oAppModel = this.getView().getModel("appModel");
                oAppModel.setProperty("/rowsDettaglioPartiteDefinitivo", []);
                oAppModel.setProperty("/rowsRiassuntoPartiteDefinitivo", []);
                this.onCloseDialogRiassuntoPartite();
                this.onCloseSelezionarePartite();
            },

            onConferma: function () {
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel");
                var RowsCompensazione = oAppModel.getProperty("/rowsNoError"),
                    CheckImporto = oAppModel.getProperty("/rowsCompensazione"),
                    //DettaglioDefinitivo = oAppModel.getProperty("/rowsDettaglioPartiteDefinitivo"),
                    RowsStorico = [];
                var aUniqueRbukrs = [...new Set(RowsCompensazione.map(item => item.FornitoreFa))];
                aUniqueRbukrs.forEach(x => {
                    var RowsCompensazioneFiltered = RowsCompensazione.filter(y => y.FornitoreFa === x),
                        aUniqueLifnr = [...new Set(RowsCompensazioneFiltered.map(item => item.SocietaFa))];
                    aUniqueLifnr.forEach(y => {
                        var RowStorico = {
                            "Societa": x,
                            "Fornitore": y,
                            "STORHEADSet": [],
                            "STORPOSSet": [],
                            "STORRECAPSet": [],
                            "ZCONFMAGGIORAZSet": [],
                            "ZCONFACCPREGSet": [],
                            "FA1ToCOMPENSAZNav": []

                        };
                        var CheckErrore = CheckImporto.find(z => z.Lifnr === y && parseFloat(z.Ztotdoc) !== 0);
                        if (CheckErrore) {
                            var Find = RowsCompensazioneFiltered.find(z => z.SocietaFa === y && (z.Errore === "" || z.Errore === "3"));
                            if (Find) {
                                //RowStorico.ZCONFSTORHEAD2Set = Find.ZCONFSTORHEAD2Set.results;
                                Find.STORHEADSet.results.forEach(b => {
                                    if (Find.Errore === "" || (Find.Errore === "3" && parseFloat(b.Ztoterogparz) > 0)) {
                                        if (!b.Zdatadocumento) {
                                            delete b.Zdatadocumento;
                                        } else {
                                            b.Zdatadocumento = new Date(b.Zdatadocumento);
                                        }
                                        RowStorico.STORHEADSet.push(b);
                                    }
                                });

                                Find.STORPOSSet.results.forEach(b => {
                                    if (Find.Errore === "" || (Find.Errore === "3" && parseFloat(b.Ztoterogparz) > 0)) {
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
                                        RowStorico.STORPOSSet.push(b);
                                    }
                                });
                                Find.STORRECAPSet.results.forEach(b => {
                                    if (Find.Errore === "" || (Find.Errore === "3" && parseFloat(b.Ztotdoc) > 0)) {
                                        if (!b.Zdatadocumento) {
                                            delete b.Zdatadocumento;
                                        } else {
                                            b.Zdatadocumento = new Date(b.Zdatadocumento);
                                        }
                                        if (!b.Zdataaccettazionea) {
                                            delete b.Zdataaccettazionea;
                                        } else {
                                            b.Zdataaccettazionea = new Date(b.Zdataaccettazionea);
                                        }
                                        if (!b.Zdataaccettazioneda) {
                                            delete b.Zdataaccettazioneda;
                                        } else {
                                            b.Zdataaccettazioneda = new Date(b.Zdataaccettazioneda);
                                        }
                                        RowStorico.STORRECAPSet.push(b);
                                    }
                                });
                                Find.ZCONFMAGGIORAZSet.results.forEach(b => {
                                    RowStorico.ZCONFMAGGIORAZSet.push(b);
                                });
                                Find.ZCONFACCPREGSet.results.forEach(b => {
                                    RowStorico.ZCONFACCPREGSet.push(b);
                                });
                            }
                            RowsStorico.push(RowStorico);
                            Find = RowsCompensazioneFiltered.find(z => z.SocietaFa === y && z.Errore === "3");
                            if (Find) {
                                var RowStoricoError3 = {
                                    "Societa": x,
                                    "Fornitore": y,
                                    "STORHEADSet": [],
                                    "STORPOSSet": [],
                                    "STORRECAPSet": [],
                                    "ZCONFMAGGIORAZSet": [],
                                    "ZCONFACCPREGSet": [],
                                    //"FAD1ToCOMPENSAZNav": []
                                };
                                Find.STORHEADSet.results.forEach(b => {
                                    if (parseFloat(b.Ztoterogparz) < 0) {
                                        if (!b.Zdatadocumento) {
                                            delete b.Zdatadocumento;
                                        } else {
                                            b.Zdatadocumento = new Date(b.Zdatadocumento);
                                        }
                                        RowStorico.STORHEADSet.push(b);
                                    }
                                });

                                Find.STORPOSSet.results.forEach(b => {
                                    if (parseFloat(b.Ztoterogparz) < 0) {
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
                                        RowStorico.STORPOSSet.push(b);
                                    }
                                });
                                Find.STORRECAPSet.results.forEach(b => {
                                    if (parseFloat(b.Ztotdoc) > 0) {
                                        if (!b.Zdatadocumento) {
                                            delete b.Zdatadocumento;
                                        } else {
                                            b.Zdatadocumento = new Date(b.Zdatadocumento);
                                        }
                                        if (!b.Zdataaccettazionea) {
                                            delete b.Zdataaccettazionea;
                                        } else {
                                            b.Zdataaccettazionea = new Date(b.Zdataaccettazionea);
                                        }
                                        if (!b.Zdataaccettazioneda) {
                                            delete b.Zdataaccettazioneda;
                                        } else {
                                            b.Zdataaccettazioneda = new Date(b.Zdataaccettazioneda);
                                        }
                                        RowStorico.STORRECAPSet.push(b);
                                    }
                                });
                                Find.ZCONFMAGGIORAZSet.results.forEach(b => {
                                    RowStorico.ZCONFMAGGIORAZSet.push(b);
                                });
                                Find.ZCONFACCPREGSet.results.forEach(b => {
                                    RowStorico.ZCONFACCPREGSet.push(b);
                                });
                                RowsStorico.push(RowStoricoError3);
                            }
                        }
                    });
                });
                var batchChanges = [];
                var sServiceUrl = "/sap/opu/odata/sap/ZCRUSCCONFFA_SRV_01/";
                var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
                if (RowsStorico.length === 0) {
                    sap.m.MessageToast.show("Successo");
                    this.oGlobalBusyDialog.close();
                } else {
                    for (var i = 0; i < RowsStorico.length; i++) {
                        batchChanges.push(oDataModel.createBatchOperation("FA1Set", "POST", RowsStorico[i]));
                    }
                    oDataModel.addBatchChangeOperations(batchChanges);
                    const oPromiseBatch = new Promise((resolve, reject) => {
                        oDataModel.submitBatch(function (data, responseProcess) {
                            //sap.m.MessageToast.show("Successo");
                            resolve();
                        }.bind(this),
                            function (err) {
                                //sap.m.MessageToast.show("Errore");
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
                }
            }
        });
    });
