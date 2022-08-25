sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "it/orogel/cruscottoconferimento/model/Constants",
    "sap/ui/core/routing/History",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Constants, History, FilterOperator, Filter) {
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
            },
            onStampa: function () {
                this.oGlobalBusyDialog.open();
                let gettingInternalTable = this.byId("idTableFAD1Detail"),
                    oSelIndices = gettingInternalTable.getSelectedIndices(),
                    aXML = [],
                    aModel = this.getOwnerComponent().getNavigation();

                if (oSelIndices !== undefined && oSelIndices.length > 0) {
                    for (let i of oSelIndices) {
                        let oRow = gettingInternalTable.getContextByIndex(i).getObject(),
                            aBolle = aModel.filter(x => x.Fornitore === oRow.Fornitore);
                        if (aBolle.length > 0) {
                            let filename = oRow.Fornitore + "_" + new Date().toJSON().slice(0, 10) + ".pdf",
                                sAllegato1 = "",
                                forms = "",
                                templates = "";

                            if (aBolle[0].Delega) {
                                sAllegato1 = this.Allegato1Delega(Constants.XMLD.XML, aBolle);
                                forms = "ZPRINT_INVOICE_SUMMARY";
                                templates = "ZPRINT_INVOICE_SUMMARY";
                            } else {
                                sAllegato1 = this.Allegato1NoDelega(Constants.XMLND.XML, aBolle);
                                forms = "ZPRINT_PROXY_INVOICE";
                                templates = "ZPRINT_PROXY_INVOICE";
                            }

                            debugger;

                            let xmlz = (new DOMParser()).parseFromString(sAllegato1, "application/xml"),
                                xmlBase = window.btoa(unescape(unescape(encodeURIComponent((new XMLSerializer()).serializeToString(xmlz))))),
                                mObj = {
                                    "Form": forms,
                                    "Template": templates,
                                    "xmlData": xmlBase,
                                    "formType": "Print",
                                    "formLocale": "it_IT",
                                    "taggedPdf": "0",
                                    "embedFont": "0"
                                },
                                oFinal = {
                                    Fornitore: oRow.Fornitore,
                                    Delega: aBolle[0].Delega,
                                    Allegato1: mObj
                                };
                            aXML.push(oFinal);
                        }
                    }
                    let oPromisePDF = Promise.resolve();
                    aXML.forEach(x => {
                        oPromisePDF = oPromisePDF.then(() => {
                            return this.createPDF(x.Allegato1);
                        });
                    });
                    Promise.all([oPromisePDF]).then(() => {
                        console.log(aXML);
                        let oPromiseMail = Promise.resolve();
                        aXML.forEach(x => {
                            oPromiseMail = oPromiseMail.then(() => {
                                return this.sendEmail(x);
                            });
                        });
                        Promise.all([oPromiseMail]).then(() => {
                            this.oGlobalBusyDialog.close();
                        }, oError => {
                            sap.m.MessageToast.show("Errore nell'invio della mail'");
                            this.oGlobalBusyDialog.close();
                        });
                    }, oError => {
                        sap.m.MessageToast.show("Errore nella generazione del PDF");
                        this.oGlobalBusyDialog.close();
                    });
                } else {
                    sap.m.MessageToast.show("Selezionare almeno una riga");
                    this.oGlobalBusyDialog.close();
                }
            },
            createPDF: function (oXML) {
                var oPDFModel = this.getView().getModel("pdfModel");
                return new Promise((resolve, reject) => {
                    oPDFModel.create("/PDFSet", oXML, {
                        success: (oData) => {
                            oXML.PDF = "data:application/pdf;base64," + oData.PDFOut;
                            resolve();
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    });
                });
            },
            sendEmail: function (oMail) {
                var oModel = this.getView().getModel(),
                    oRow = {
                        Allegato1: oMail.Allegato1.PDF,
                        Allegato2: oMail.Allegato1.PDF, //TODO: Da modificare
                        CodFornitore: oMail.Fornitore,
                        Delega: oMail.Delega
                    };
                return new Promise((resolve, reject) => {
                    oModel.create("/EmailAllegatiSet", oRow, {
                        success: (oData) => {
                            resolve();
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    });
                });
            },
            Allegato1Delega: function () {

            },
            Allegato1NoDelega: function (xmlClone, aBolle) {
                let aAggregazione = []
                /* Bolle per fornitore */
                aBolle.forEach(x => {
                    let oAggregazione = {
                        DataFine: x.DataFine,
                        DataInizio: x.DataInizio,
                        Specie: x.Specie,
                        Stagionalita: x.Stagionalita,
                        Varieta: x.Varieta,
                        CertificazioneAziendale: x.CertificazioneAziendale,
                        CertificazioneCommerciale: x.CertificazioneCommerciale,
                        CertificazioneProdotto: x.CertificazioneProdotto,
                        Residuo: x.Residuo,
                        Specifica: x.Specifica,
                        Lavorazione: x.Lavorazione,
                        Origine: x.Origine,
                        EventiColtivazione: x.EventiColtivazione,
                        CaratteristicaRaccolta: x.CaratteristicaRaccolta,
                        ServizioRaccolta: x.ServizioRaccolta,
                        ServizioCarico: x.ServizioCarico,
                        ServizioAssistenza: x.ServizioAssistenza,
                        ServizioDeposito: x.ServizioDeposito,
                        ServizioCalibrazione: x.ServizioCalibrazione,
                        ZonaTrasporto: x.ZonaTrasporto,
                        Incoterm: x.Incoterm,
                        ServizioExtra1: x.ServizioExtra1,
                        ServizioExtra2: x.ServizioExtra2,
                        ServizioExtra3: x.ServizioExtra3,
                        ServizioExtra4: x.ServizioExtra4,
                        ServizioExtra5: x.ServizioExtra5,
                        Dettaglio: []
                    },
                        oAggregazioneFound = aAggregazione.find(y => y.DataFine === oAggregazione.DataFine
                            && y.DataInizio === oAggregazione.DataInizio
                            && y.Specie === oAggregazione.Specie
                            && y.Stagionalita === oAggregazione.Stagionalita
                            && y.Varieta === oAggregazione.Varieta
                            && y.CertificazioneAziendale === oAggregazione.CertificazioneAziendale
                            && y.CertificazioneCommerciale === oAggregazione.CertificazioneCommerciale
                            && y.CertificazioneProdotto === oAggregazione.CertificazioneProdotto
                            && y.Residuo === oAggregazione.Residuo
                            && y.Specifica === oAggregazione.Specifica
                            && y.Lavorazione === oAggregazione.Lavorazione
                            && y.Origine === oAggregazione.Origine
                            && y.EventiColtivazione === oAggregazione.EventiColtivazione
                            && y.CaratteristicaRaccolta === oAggregazione.CaratteristicaRaccolta
                            && y.ServizioRaccolta === oAggregazione.ServizioRaccolta
                            && y.ServizioCarico === oAggregazione.ServizioCarico
                            && y.ServizioAssistenza === oAggregazione.ServizioAssistenza
                            && y.ServizioDeposito === oAggregazione.ServizioDeposito
                            && y.ServizioCalibrazione === oAggregazione.ServizioCalibrazione
                            && y.ZonaTrasporto === oAggregazione.ZonaTrasporto
                            && y.Incoterm === oAggregazione.Incoterm
                            && y.ServizioExtra1 === oAggregazione.ServizioExtra1
                            && y.ServizioExtra2 === oAggregazione.ServizioExtra2
                            && y.ServizioExtra3 === oAggregazione.ServizioExtra3
                            && y.ServizioExtra4 === oAggregazione.ServizioExtra4
                            && y.ServizioExtra5 === oAggregazione.ServizioExtra5);
                    if (!oAggregazioneFound) {
                        oAggregazione.Dettaglio.push(x);
                        aAggregazione.push(oAggregazione);
                    } else {
                        oAggregazioneFound.Dettaglio.push(x);
                    }
                });
                xmlClone = xmlClone.replace("{Name}", aBolle[0].NomeFornitore);
                xmlClone = xmlClone.replace("{Street}", aBolle[0].Street);
                xmlClone = xmlClone.replace("{House_Num1}", aBolle[0].House_Num1);
                xmlClone = xmlClone.replace("{Post_Code1}", aBolle[0].Post_Code1);
                xmlClone = xmlClone.replace("{City1}", aBolle[0].City1);
                xmlClone = xmlClone.replace("{Region}", aBolle[0].Region);
                xmlClone = xmlClone.replace("{Vat_Number}", aBolle[0].PartitaIVA);
                xmlClone = xmlClone.replace("{Tax_Code}", aBolle[0].CodiceFiscale);
                xmlClone = xmlClone.replace("{Date}", this.byId("idDataDocumento").getValue());
                xmlClone = xmlClone.replace("{NomeSocieta}", aBolle[0].NomeSocieta);
                xmlClone = xmlClone.replace("{StreetS}", aBolle[0].StreetS);
                xmlClone = xmlClone.replace("{House_Num1S}", aBolle[0].House_Num1S);
                xmlClone = xmlClone.replace("{Post_Code1S}", aBolle[0].Post_Code1S);
                xmlClone = xmlClone.replace("{City1S}", aBolle[0].City1S);
                xmlClone = xmlClone.replace("{RegionS}", aBolle[0].RegionS);
                xmlClone = xmlClone.replace("{PartitaIVASocieta}", aBolle[0].PartitaIVASocieta);
                xmlClone = xmlClone.replace("{CodiceFiscaleSocieta}", aBolle[0].CodiceFiscaleSocieta);
                xmlClone = xmlClone.replace("{Text1}", this.byId("idFAD1DetailText1").getValue());
                xmlClone = xmlClone.replace("{Text2}", this.byId("idFAD1DetailText2").getValue());
                let sUMAll = "",
                    SumAllQuantity = 0,
                    SumAllTotal = 0;
                /* Aggregazione Bolle */
                aAggregazione.forEach(x => {
                    let xmlAggregazione = Constants.XMLND.PositionData;
                    xmlAggregazione = xmlAggregazione.replace("{EffectiveDate}", x.DataInizio);
                    xmlAggregazione = xmlAggregazione.replace("{EndOfDate}", x.DataFine);
                    xmlAggregazione = xmlAggregazione.replace("{Species}", x.Specie);
                    xmlAggregazione = xmlAggregazione.replace("{Seasonality}", x.Stagionalita);
                    xmlAggregazione = xmlAggregazione.replace("{Varieties}", x.Varieta);
                    xmlAggregazione = xmlAggregazione.replace("{CertCorporate}", x.CertificazioneAziendale);
                    xmlAggregazione = xmlAggregazione.replace("{Cert_Product}", x.CertificazioneProdotto);
                    xmlAggregazione = xmlAggregazione.replace("{Residual}", x.Residuo);
                    xmlAggregazione = xmlAggregazione.replace("{CertCommercial}", x.CertificazioneCommerciale);
                    xmlAggregazione = xmlAggregazione.replace("{Specification}", x.Specifica);
                    xmlAggregazione = xmlAggregazione.replace("{Processing}", x.Lavorazione);
                    xmlAggregazione = xmlAggregazione.replace("{Origin}", x.Origine);
                    xmlAggregazione = xmlAggregazione.replace("{CultivationEvents}", x.EventiColtivazione);
                    xmlAggregazione = xmlAggregazione.replace("{CarattCollect}", x.CaratteristicaRaccolta);
                    xmlAggregazione = xmlAggregazione.replace("{Collection}", x.ServizioRaccolta);
                    xmlAggregazione = xmlAggregazione.replace("{Vehicle}", x.ServizioCarico);
                    xmlAggregazione = xmlAggregazione.replace("{TechicalService}", x.ServizioAssistenza);
                    xmlAggregazione = xmlAggregazione.replace("{DespositoService}", x.ServizioDeposito);
                    xmlAggregazione = xmlAggregazione.replace("{CalibrationService}", x.ServizioCalibrazione);
                    xmlAggregazione = xmlAggregazione.replace("{Route}", x.ZonaTrasporto);
                    xmlAggregazione = xmlAggregazione.replace("{Incoterm}", x.Incoterm);
                    xmlAggregazione = xmlAggregazione.replace("{ExtraService1}", x.ServizioExtra1);
                    xmlAggregazione = xmlAggregazione.replace("{ExtraService2}", x.ServizioExtra2);
                    xmlAggregazione = xmlAggregazione.replace("{ExtraService3}", x.ServizioExtra3);
                    xmlAggregazione = xmlAggregazione.replace("{ExtraService4}", x.ServizioExtra4);
                    xmlAggregazione = xmlAggregazione.replace("{ExtraService5}", x.ServizioExtra5);
                    let sUM = "",
                        SumQuantity = 0,
                        SumTotal = 0,
                        xmlPosizioni = "";
                    x.Dettaglio.forEach(y => {
                        sUM = y.UM;
                        SumQuantity += parseFloat(y.Quantita);
                        SumTotal += parseFloat(y.TotaleMerce);
                        let xmlPosizione = Constants.XMLND.RowPositionData;
                        xmlPosizione = xmlPosizione.replace("{ItemCode}", y.Materiale);
                        xmlPosizione = xmlPosizione.replace("{Quality}", y.Qualita);
                        xmlPosizione = xmlPosizione.replace("{Caliber}", y.Calibrazione);
                        xmlPosizione = xmlPosizione.replace("{UM}", y.UM);
                        xmlPosizione = xmlPosizione.replace("{Quantity}", y.Quantita);
                        xmlPosizione = xmlPosizione.replace("{Price}", y.PrezzoBase);
                        xmlPosizione = xmlPosizione.replace("{Total}", y.TotaleMerce);
                        xmlPosizioni += xmlPosizione;
                    });
                    sUMAll = sUM;
                    SumAllQuantity += parseFloat(SumQuantity);
                    SumAllTotal += parseFloat(SumTotal);
                    xmlAggregazione = xmlAggregazione.replace("{UM}", sUM);
                    xmlAggregazione = xmlAggregazione.replace("{SumQuantity}", SumQuantity);
                    xmlAggregazione = xmlAggregazione.replace("{SumTotal}", SumTotal);
                    xmlAggregazione = xmlAggregazione.replace("{Rows}", xmlPosizioni);
                    xmlClone = xmlClone.replace("{PositionData}", xmlAggregazione);
                });
                xmlClone = xmlClone.replace("{UMAll}", sUMAll);
                xmlClone = xmlClone.replace("{SumAllQuantity}", SumAllQuantity);
                xmlClone = xmlClone.replace("{SumAllTotal}", SumAllTotal);

                if (aBolle[0].Societa === "IT04") {
                    /* TODO: Orogel Fresco Constants.XMLND.FrescoOnly */
                }
                return xmlClone;
            },
            Allegato2: function () {

            }
        });
    });
