sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("it.orogel.cruscottoconferimento.controller.Main", {
            onInit: function () {

            },
            onPressFAD: function (oEvent) {
                this.resetModels();
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("FAD.FAD");
            },
            onPressFA: function (oEvent) {
                this.resetModels();
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("FA.FA");
            },
            resetModels: function(){
                // [Gheorghe]
                this.getOwnerComponent().setModel(new JSONModel({}), "filterModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "filterModel2");
                this.getOwnerComponent().setModel(new JSONModel({}), "filterModel3");
                this.getOwnerComponent().setModel(new JSONModel({}), "dynamicModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "dynamicModel2");
                this.getOwnerComponent().setModel(new JSONModel({}), "dynamicModel3");
                this.getOwnerComponent().setModel(new JSONModel({}), "emissioneFatturaModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "textModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "statiModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "notaCreditoModel");
                this.getOwnerComponent().setModel(new JSONModel({}), "cambioRegimeFiscaleModel");
                this.getOwnerComponent().setModel(new JSONModel([{ key: "EXW", text: "Franco Fabbrica" }, { key: "FCA", text: "Franco Vettore" }]), "incoterModel");
                this.getOwnerComponent().setModel(new JSONModel([{ key: "01", text: "01" }, { key: "02", text: "02" }, { key: "03", text: "03" }, { key: "04", text: "04" }, { key: "05", text: "05" }, { key: "06", text: "06" }, { key: "07", text: "07" }, { key: "08", text: "08" }, { key: "09", text: "09" }, { key: "10", text: "10" }, { key: "11", text: "11" }, { key: "12", text: "12" }, { key: "13", text: "13" }, { key: "14", text: "14" }, { key: "15", text: "15" }, { key: "16", text: "16" }, { key: "17", text: "17" }, { key: "18", text: "18" }, { key: "19", text: "19" }, { key: "20", text: "20" }]), "codAccModel");
                /*const oAppModel = this.oComponent.getModel("appModel");
                oAppModel.setProperty("/Table3Visible", false);
                oAppModel.setProperty("/TableStoricoRecapVisible", false);
                oAppModel.setProperty("/TableStoricoPosVisible", false);
                oAppModel.setProperty("/TableFAD2Visible", false);*/
                // [Gheorghe]
            },
        });
    });
