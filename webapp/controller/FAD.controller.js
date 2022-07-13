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
                this.oGlobalBusyDialog.open();
                this.getView().getModel().read("/FADBolleConferimentoSet", {
                    success: (oDataFAD1) => {
                        let oJSONTableModel = new sap.ui.model.json.JSONModel(oDataFAD1.results);
                        this.getView().setModel(oJSONTableModel, "FAD1Model");
                        this.oGlobalBusyDialog.close();
                    },
                    error: () => {
                        this.oGlobalBusyDialog.close();
                        sap.m.MessageToast.show("Errore di connessione");
                    }
                });
            },
            onSocieta: function (oEvent) {
                let sCompany = oEvent.getParameter("value"),
                    oBinding = this.byId("idFilterOrgAcquistiFAD1").getContent().getBinding("items"),
                    oFilter = new Filter({
                        path: "Bukrs",
                        operator: FilterOperator.EQ,
                        value1: sCompany
                    });
                oBinding.filter([oFilter]);
            }
        });
    });
