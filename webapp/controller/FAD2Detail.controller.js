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

        return Controller.extend("it.orogel.cruscottoconferimento.controller.FAD2Detail", {
            onInit: function () {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
            },
            onNavBack: function () {
                let oHistory = History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();
                this.getView().byId("idTableFAD2Detail").setVisible(false);
                this.getView().byId("idStampa").setVisible(false);
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("FAD", true);
                }
            },
            onText2: function (oEvent) {
                let sValue = oEvent.getParameter("value"),
                    oBinding = this.byId("idFAD2DetailText3").getContent().getBinding("items"),
                    aFilter = [new Filter({
                        path: "Codifica",
                        operator: FilterOperator.NE,
                        value1: sValue
                    })];
                oBinding.filter(aFilter);
            },
            onText3: function (oEvent) {
                let sValue = oEvent.getParameter("value"),
                    oBinding = this.byId("idFAD2DetailText2").getContent().getBinding("items"),
                    aFilter = [new Filter({
                        path: "Codifica",
                        operator: FilterOperator.NE,
                        value1: sValue
                    })];
                oBinding.filter(aFilter);
            },
            onCalcola: function () {
                let oForm = this.getView().byId("idSimpleForm").getContent(),
                    sError = false;
                oForm.forEach(function (Field) {
                    if (typeof Field.getValue === "function") {
                        if (((Field.mProperties.hasOwnProperty("required") && Field.getProperty("required")) || (Field.mProperties.hasOwnProperty("mandatory") && Field.getProperty("mandatory"))) && (!Field.getValue() || Field.getValue().length < 1)) {
                            Field.setValueState("Error");
                            sError = true;
                        } else {
                            Field.setValueState("None");
                        }
                    }
                });
                if (!sError) {
                    let aModel = this.getOwnerComponent().getNavigation(),
                        aOutput = [];

                    aModel.forEach(x => {
                        let oRow = {
                            Societa: x.Societa,
                            Fornitore: x.Fornitore,
                            NomeFornitore: "",
                            DataDocumento: this.getView().byId("idDataDocumento").getDateValue()
                        }
                        aOutput.push(oRow);
                    });
                    let oJSONTableModel = new sap.ui.model.json.JSONModel(aOutput);
                    this.getView().setModel(oJSONTableModel, "FAD2DetailModel");
                    this.getView().byId("idTableFAD2Detail").setVisible(true);
                    this.getView().byId("idStampa").setVisible(true);
                }
            }
        });
    });
