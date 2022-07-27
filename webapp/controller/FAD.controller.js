sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, FilterOperator, Filter) {
        "use strict";

        return Controller.extend("it.orogel.cruscottoconferimento.controller.FAD", {
            onInit: function () {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
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
            onSearchFAD1: function (oEvent) {
                let bFiltro = false,
                    sErrore = "",
                    aFilter = [];
                if (!this.byId("idFilterSocietaFAD1").getValue() || this.byId("idFilterSocietaFAD1").getValue() === "") {
                    bFiltro = true;
                    sErrore = "Valorizzare il filtro Società";
                } else {
                    aFilter.push(new Filter("Societa", FilterOperator.EQ, this.byId("idFilterSocietaFAD1").getValue()));
                }
                if (!this.byId("idFilterFornitoreFAD1").getValue() || this.byId("idFilterFornitoreFAD1").getValue().length === 0) {
                    bFiltro = true;
                    sErrore = "Valorizzare il filtro Fornitore";
                } else {
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
                if (!this.byId("idFilterTipoListinoFAD1").getValue() || this.byId("idFilterTipoListinoFAD1").getValue().length === 0) {
                    bFiltro = true;
                    sErrore = "Valorizzare il filtro Tipo Listino";
                } else {
                    let aFilterTipoListino = [];
                    this.byId("idFilterTipoListinoFAD1").getValue().forEach(x => {
                        aFilterTipoListino.push(new Filter("TipoListino", FilterOperator.EQ, x.getKey()));
                    });
                    aFilter.push(new Filter({
                        filters: aFilterTipoListino,
                        and: false
                    }));
                }
                if (!this.byId("idFilterCodicePercentualeFAD1").getValue() || this.byId("idFilterCodicePercentualeFAD1").getValue() === "") {
                    bFiltro = true;
                    sErrore = "Valorizzare il filtro Codice Percentuale";
                } else {
                    aFilter.push(new Filter("CodicePercentualeAcconto", FilterOperator.EQ, this.byId("idFilterCodicePercentualeFAD1").getValue()));
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
                if (!this.byId("idFilterFornitoreFAD2").getValue() || this.byId("idFilterFornitoreFAD2").getValue().length === 0) {
                    bFiltro = true;
                    sErrore = "Valorizzare il filtro Fornitore";
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
            onSimulaFatturaFAD2: function () {
                let aSelected = [],
                    oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                this.byId("idFilterFornitoreFAD2").getValue().forEach(x => {
                    let oRow = {
                        Societa: this.getView().byId("idFilterSocietaFAD2").getValue(),
                        Fornitore: x.getKey().padStart(10, "0")
                    };
                    aSelected.push(oRow);
                });

                this.getOwnerComponent().setNavigation(aSelected);
                oRouter.navTo("FAD2Detail");
            }
        });
    });
