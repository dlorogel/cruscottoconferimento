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
                    aFilter = [],
                    fMultifilter;
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
                            debugger;
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
                            debugger;
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
            }
        });
    });
