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

        return Controller.extend("it.orogel.cruscottoconferimento.controller.FAD1Detail", {
            onInit: function () {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
            },
            onNavBack: function () {
                let oHistory = History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();
                this.getView().byId("idTableFAD1Detail").setVisible(false);
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
                    oBinding = this.byId("idFAD1DetailText3").getContent().getBinding("items"),
                    aFilter = [new Filter("Codifica", FilterOperator.NE, sValue)];
                oBinding.filter(aFilter);
            },
            onText3: function (oEvent) {
                let sValue = oEvent.getParameter("value"),
                    oBinding = this.byId("idFAD1DetailText2").getContent().getBinding("items"),
                    aFilter = [new Filter("Codifica", FilterOperator.NE, sValue)];
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
                        aOutput = [],
                        aFornitori = [];

                    aModel.forEach(x => {
                        let oFind = aFornitori.find(y => y === x.Fornitore);
                        if (oFind) {

                        } else {
                            aFornitori.push(x.Fornitore);
                            let oRow = {
                                Societa: x.Societa,
                                Fornitore: x.Fornitore,
                                NomeFornitore: x.NomeFornitore,
                                DataDocumento: this.getView().byId("idDataDocumento").getDateValue()
                            }
                            aOutput.push(oRow);
                        }
                    });
                    let oJSONTableModel = new sap.ui.model.json.JSONModel(aOutput);
                    this.getView().setModel(oJSONTableModel, "FAD1DetailModel");
                    this.getView().byId("idTableFAD1Detail").setVisible(true);
                    this.getView().byId("idStampa").setVisible(true);
                }
            }
        });
    });
