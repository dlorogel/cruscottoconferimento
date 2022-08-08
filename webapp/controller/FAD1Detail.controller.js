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
                if (this.getOwnerComponent().getNavigation() === null) {
                    this.onNavBack();
                }
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
                    this.oGlobalBusyDialog.open();
                    this.getView().getModel().read("/PercentualeIVASet('" + this.byId("idCodiceIVA").getValue() + "')", {
                        success: (oDataIVA) => {
                            let aModel = this.getOwnerComponent().getNavigation(),
                                aOutput = [];
                            aModel.forEach(x => {
                                let oFind = aOutput.find(y => y.Fornitore === x.Fornitore);
                                if (oFind) {
                                    oFind.TotaleMerce += x.TotaleMerce;
                                    oFind.Maggiorazione1 += x.Maggiorazione1;
                                    oFind.Maggiorazione2 += x.Maggiorazione2;
                                    oFind.Maggiorazione3 += x.Maggiorazione3;
                                    oFind.Maggiorazione4 += x.Maggiorazione4;
                                    oFind.Maggiorazione5 += x.Maggiorazione5;
                                    oFind.Maggiorazione6 += x.Maggiorazione6;
                                    oFind.Maggiorazione7 += x.Maggiorazione7;
                                    oFind.Maggiorazione8 += x.Maggiorazione8;
                                    oFind.Maggiorazione9 += x.Maggiorazione9;
                                    oFind.Maggiorazione10 += x.Maggiorazione10;
                                    oFind.ImportoTotale += x.ImportoTotale;
                                    oFind.AccontiRegistrati += x.AccontiRegistrati;
                                    oFind.Imponibile = oFind.ImportoTotale - oFind.AccontiRegistrati;
                                    oFind.ImportoIVA = oFind.Imponibile * oDataIVA.Kbetr / 100;
                                    oFind.TotaleDocumento = oFind.Imponibile + oFind.ImportoIVA;
                                } else {
                                    let oRow = {
                                        Societa: x.Societa,
                                        Fornitore: x.Fornitore,
                                        NomeFornitore: x.NomeFornitore,
                                        DataDocumento: this.getView().byId("idDataDocumento").getDateValue(),
                                        TotaleMerce: parseFloat(x.TotaleMerce),
                                        Maggiorazione1: parseFloat(x.Maggiorazione1),
                                        Maggiorazione2: parseFloat(x.Maggiorazione2),
                                        Maggiorazione3: parseFloat(x.Maggiorazione3),
                                        Maggiorazione4: parseFloat(x.Maggiorazione4),
                                        Maggiorazione5: parseFloat(x.Maggiorazione5),
                                        Maggiorazione6: parseFloat(x.Maggiorazione6),
                                        Maggiorazione7: parseFloat(x.Maggiorazione7),
                                        Maggiorazione8: parseFloat(x.Maggiorazione8),
                                        Maggiorazione9: parseFloat(x.Maggiorazione9),
                                        Maggiorazione10: parseFloat(x.Maggiorazione10),
                                        ImportoTotale: parseFloat(x.ImportoTotale),
                                        AccontiRegistrati: parseFloat(x.AccontiRegistrati)
                                    }
                                    oRow.Imponibile = x.ImportoTotale - x.AccontiRegistrati;
                                    oRow.ImportoIVA = oRow.Imponibile * oDataIVA.Kbetr / 100;
                                    oRow.TotaleDocumento = oRow.Imponibile + oRow.ImportoIVA;
                                    aOutput.push(oRow);
                                }
                            });
                            let oJSONTableModel = new sap.ui.model.json.JSONModel(aOutput);
                            this.getView().setModel(oJSONTableModel, "FAD1DetailModel");
                            this.getView().byId("idTableFAD1Detail").setVisible(true);
                            this.getView().byId("idStampa").setVisible(true);
                            this.oGlobalBusyDialog.close();
                        },
                        error: () => {
                            this.oGlobalBusyDialog.close();
                            sap.m.MessageToast.show("Errore di connessione");
                        }
                    });
                }
            }
        });
    });
